import {apiFollowPeople, apiUnFollowPeople} from 'helper/userHelpers';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SwipeReconizer from 'react-native-swipe-gestures';
import Svg, {Path} from 'react-native-svg';
import {SCREEN_WIDTH} from 'helper/utils';
import {useToast} from 'native-base';

const TaggedPersonCard = ({data, onChat}) => {
  const scrollRef = useRef(null);
  const toast = useToast();
  const [isOpenedSwipe, setIsOpenedSwipe] = useState(false);
  const [isFollowed, setIsFollowed] = useState(data?.isFollowing === 'true');

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
    detectSwipeUp: false,
    detectSwipeDown: false,
  };

  const onLeftSwipe = state => {
    if (isOpenedSwipe) {
      setIsOpenedSwipe(false);
      scrollRef.current?.scrollTo({x: -100, animated: true});
      return;
    }
    setIsOpenedSwipe(true);
    scrollRef.current?.scrollTo({x: 100, animated: true});
  };

  const onRightSwipe = state => {
    if (!isOpenedSwipe) {
      return;
    }
    setIsOpenedSwipe(false);
    scrollRef.current?.scrollTo({x: -100, animated: true});
  };

  const onFollowPeople = async () => {
    const res = await apiFollowPeople(data.id);
    if (res.success) {
      toast.show({
        render: () => {
          return (
            <View style={styles.toast}>
              <Text style={styles.toastTxt}>
                Success following @${data.name}
              </Text>
            </View>
          );
        },
      });
      setIsFollowed(prev => !prev);
    }
  };

  const onUnfollowPeople = async () => {
    const res = await apiUnFollowPeople(data.id);
    if (res.success) {
      toast.show({
        render: () => {
          return (
            <View style={styles.toast}>
              <Text style={styles.toastTxt}>
                Success unfollowing @${data.name}
              </Text>
            </View>
          );
        },
      });
      setIsFollowed(prev => !prev);
    }
  };

  const renderUnfollowButton = () => {
    console.log('--- unfollowing');
    console.log({isFollowed});
    return (
      <TouchableOpacity
        onPress={() => onUnfollowPeople()}
        style={styles.unfollowContainer}>
        <Text style={styles.txtFollow}>{'Unfollow'}</Text>
      </TouchableOpacity>
    );
  };

  const renderFollowButton = () => {
    console.log('-- fowllowing');
    console.log({isFollowed});
    return (
      <TouchableOpacity
        onPress={() => onFollowPeople()}
        style={styles.followContainer}>
        <Text style={styles.txtFollow}>{'Follow'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      scrollEnabled={false}
      scrollEventThrottle={0}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={[styles.container, {width: SCREEN_WIDTH - 40}]}>
        <Image
          source={{
            uri:
              data.image !== ''
                ? data.image
                : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
          }}
          style={styles.image}
        />
        <View style={styles.songInfoContainer}>
          <Text style={styles.txtName}>{data.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.messageContainer}
          onPress={() => onChat(data.id)}>
          <MessageIcon />
        </TouchableOpacity>
        <SwipeReconizer
          config={swipeConfig}
          onSwipeLeft={onLeftSwipe}
          onSwipeRight={onRightSwipe}
          style={[
            styles.swipeIcon,
            !isOpenedSwipe ? {width: 9, paddingHorizontal: 16} : {},
          ]}>
          <SwipeIcon />
        </SwipeReconizer>
      </View>
      {isFollowed ? renderUnfollowButton() : renderFollowButton()}
    </ScrollView>
  );
};

export default TaggedPersonCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedContainer: {
    width: '100%',
    height: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 102, 81, 0.15)',
    borderColor: 'rgba(255, 102, 81, 0.4)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  followContainer: {
    width: 100,
    height: 44,
    backgroundColor: '#009282',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfollowContainer: {
    width: 100,
    height: 44,
    backgroundColor: '#E31855',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 1)',
  },
  messageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 10,
  },
  swipeIcon: {
    width: 46,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastTxt: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 20,
  },
});

export const MessageIcon = props => (
  <Svg width="14" height="14" fill="none" viewBox="0 0 14 14">
    <Path
      fill="rgba(255, 255, 255, 0.4)"
      d="M7.013.333c3.787 0 6.654 3.105 6.654 6.657 0 4.12-3.36 6.677-6.667 6.677-1.093 0-2.307-.294-3.28-.868-.34-.207-.627-.36-.993-.24l-1.347.4c-.34.107-.647-.16-.547-.52l.447-1.496a.699.699 0 00-.047-.601c-.573-1.055-.9-2.21-.9-3.332C.333 3.498 3.14.333 7.013.333zm3.047 5.83a.856.856 0 000 1.71.856.856 0 000-1.71zm-3.073 0a.85.85 0 00-.854.847c0 .474.38.855.854.861a.856.856 0 000-1.709zm-3.074 0a.851.851 0 00-.853.854.86.86 0 00.853.854.86.86 0 00.854-.854.851.851 0 00-.854-.855z"></Path>
  </Svg>
);

export const SwipeIcon = props => (
  <Svg width="9" height="43" fill="none" viewBox="0 0 9 43">
    <Path
      stroke="#fff"
      strokeLinecap="round"
      d="M0.5 18L0.5 25"
      opacity="0.4"></Path>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      d="M4.5 18L4.5 25"
      opacity="0.4"></Path>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      d="M8.5 18L8.5 25"
      opacity="0.4"></Path>
  </Svg>
);

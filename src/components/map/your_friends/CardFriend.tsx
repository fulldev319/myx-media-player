import {getDefaultAvatar} from 'helper/userHelpers';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MarqueeText from 'react-native-marquee';
import Svg, {Path, Rect} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import chatActions from 'redux/chats/actions';
import {RootState} from 'redux/interfaces';

export const CardFriend = ({
  data,
  onCloseModal,
  onGoToLocation,
  navigation,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [parentWidth, setParentWidth] = useState(0);
  const descText = `Listening to 🎵 ${data.track.title}`;

  const isLongText = useMemo(() => {
    const descWidth = descText.length * 14;

    return descWidth > parentWidth;
  }, [parentWidth]);

  const goToProfile = () => {
    onCloseModal();

    setTimeout(() => {
      navigation.navigate('OtherProfilePage', {userId: data.user.id});
    }, 500);
  };

  const goToLocation = () => {
    onGoToLocation(data.location);
  };

  const goToChat = () => {
    onCloseModal();
    dispatch(
      chatActions.setCurrentChat({
        users: {
          userFrom: {userId: user.id},
          userTo: {userId: data.user.id},
        },
      }),
    );
    setTimeout(() => {
      navigation.navigate('ChatRoom');
    }, 500);
  };

  return (
    <TouchableOpacity onPress={goToProfile} style={styles.container}>
      <Image
        source={data.user.image ? {uri: data.user.image} : getDefaultAvatar()}
        style={styles.image}
      />
      <View
        style={styles.userInfo}
        onLayout={e => {
          const {width} = e.nativeEvent.layout;
          setParentWidth(width);
        }}>
        <Text style={styles.userName}>{data.user.name}</Text>
        {isLongText ? (
          <MarqueeText
            style={styles.userDesc}
            speed={0.1}
            marqueeOnStart={true}
            loop={true}
            delay={1000}>
            {descText}
          </MarqueeText>
        ) : (
          <Text style={styles.userDesc}>{descText}</Text>
        )}
      </View>
      <TouchableOpacity onPress={goToLocation}>
        <LocationIcon />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToChat} style={{marginStart: 8}}>
        <ChatIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  userInfo: {
    flex: 1,
    marginStart: 12,
  },
  userName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#010101',
  },
  userDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(1, 1, 1, 0.6)',
  },
});

const LocationIcon = props => (
  <Svg width="36" height="36" fill="none" viewBox="0 0 36 36">
    <Path
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M25.5 16.333c0 5.834-7.5 10.834-7.5 10.834s-7.5-5-7.5-10.834a7.5 7.5 0 0115 0z"></Path>
    <Path
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M18 18.833a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></Path>
    <Rect
      width="35"
      height="35"
      x="0.5"
      y="0.5"
      stroke="#FF6651"
      strokeOpacity="0.4"
      rx="15.5"></Rect>
  </Svg>
);

const ChatIcon = props => (
  <Svg width="36" height="36" fill="none" viewBox="0 0 36 36">
    <Rect width="36" height="36" fill="#FF6651" rx="16"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M25.5 17.583a6.983 6.983 0 01-.75 3.167 7.084 7.084 0 01-6.333 3.917 6.983 6.983 0 01-3.167-.75L10.5 25.5l1.583-4.75a6.984 6.984 0 01-.75-3.167 7.083 7.083 0 013.917-6.333 6.984 6.984 0 013.167-.75h.416a7.067 7.067 0 016.667 6.667v.416z"></Path>
  </Svg>
);

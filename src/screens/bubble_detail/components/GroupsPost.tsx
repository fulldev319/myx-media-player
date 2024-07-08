import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import {ReplyIcon} from 'screens/group/assets';
import BottomPlayIcon from 'screens/group/assets/BottomPlayIcon';
import {getDefaultAvatar} from 'helper/userHelpers';
import {
  generateComponentKey,
  getArrFromString,
  getTimeDifference,
} from 'helper/utils';
import {useNavigation} from '@react-navigation/native';
import {apiGetCountryDetail} from 'helper/mapHelper';
import {LockIcon} from '../assets';
import ReplyEmolikeIcon from '../assets/ReplyEmolikeIcon';
import Emolike from 'components/common/Emolike';
import {ShareIcon} from '../assets/ShareIcon';
import {eventSendMessageGroup} from 'helper/socketHelper';

interface Post {
  comments: number;
  country: number;
  country_name: string;
  creator: number;
  emolikes: number;
  id: number;
  is_private: number;
  is_reply: number;
  keywords: string;
  media_types: string;
  media_urls: string;
  parent: number;
  timestamp: string;
  url: string;
  userImage: string;
  username: string;
}

interface GroupsPostProps {
  data: Post;
  bubbleId: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onAddEmolike: () => void;
}

export const GroupsPost = (props: GroupsPostProps) => {
  const {currentIndex, setCurrentIndex, bubbleId, data, onAddEmolike} = props;

  const navigation = useNavigation();

  const mediaTypes = data.media_types.split(',');
  const mediaUrls = data.media_urls.split(',');

  const onCountryDetail = async () => {
    const res = await apiGetCountryDetail(data.country);
    if (res.success) {
      navigation.navigate('NewWorldPage', {countryDetail: res.data});
    }
  };

  const onViewPost = () => {
    navigation.navigate('ThreadPage', {id: data.parent});
  };

  const onSharePost = () => {
    eventSendMessageGroup({
      bubble: bubbleId,
      creator: data.creator,
      share_id: data.id,
      type: 'post',
    });

    setTimeout(() => {
      navigation.navigate('ChatsScreen', {bubbleId: bubbleId});
    }, 500);
  };

  const renderUserInfo = () => {
    return (
      <View style={styles.topView}>
        <View style={styles.userInfo}>
          <View style={styles.rowItem}>
            <View style={styles.userAvatar}>
              <Image
                source={
                  data.userImage ? {uri: data.userImage} : getDefaultAvatar()
                }
                style={{width: '100%', height: '100%'}}
              />
            </View>
            <Text style={styles.userName}>
              {data.username}
              <Text style={{opacity: 0.5}}> in </Text>
            </Text>
            <TouchableOpacity onPress={onCountryDetail}>
              <Text style={styles.userName}>{data.country_name}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.userTime}>{`${getTimeDifference(
              new Date(),
              new Date(data.timestamp),
            )} • `}</Text>
            {data.is_private && <LockIcon />}
          </View>
        </View>
        {!data.is_reply ? (
          <View style={styles.viewPostWrap}>
            <View style={styles.rowItem}>
              <ReplyIcon />
              <Text style={styles.replyTxt}>
                {'Replying a post at '}
                <Text style={styles.userName}>{data.country_name}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={onViewPost}>
              <Text style={styles.viewPost}>View Post</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  const renderLeftView = () => {
    return (
      <View style={styles.leftViewContainer}>
        <View style={styles.leftView}>
          <TouchableOpacity>
            <ReplyEmolikeIcon />
            <Text style={styles.count}>{data.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 23}} onPress={onAddEmolike}>
            <Emolike />
            <Text style={styles.count}>{data.emolikes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRightView = () => {
    return (
      <View style={styles.rightView}>
        {mediaUrls.map((item, index) => {
          return (
            <TouchableOpacity
              style={[
                styles.thumb,
                index === currentIndex && styles.selectedThumb,
              ]}
              onPress={() => setCurrentIndex(index)}
              key={`${generateComponentKey()}`}>
              <Image
                source={{uri: item}}
                style={[
                  StyleSheet.absoluteFill,
                  {flexWrap: 'wrap', overflow: 'hidden', borderRadius: 4},
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderKeywords = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          marginBottom: 10,
        }}>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
          {getArrFromString(data.keywords, ',').map((item, index) => {
            return (
              <View
                style={styles.keywordContainer}
                key={`${generateComponentKey()}`}>
                <Text style={styles.keywordTxt}>{item}</Text>
              </View>
            );
          })}
        </View>
        <TouchableOpacity onPress={onSharePost}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBottomView = () => {
    return (
      <View style={styles.bottomView}>
        {renderKeywords()}
        <View style={{alignItems: 'center'}}>
          <BottomPlayIcon />
        </View>
      </View>
    );
  };

  const renderBgImage = () => {
    return (
      <View style={[StyleSheet.absoluteFill, styles.bgImage]}>
        {mediaTypes[currentIndex] && (
          <Image
            source={{uri: mediaUrls[currentIndex]}}
            style={[StyleSheet.absoluteFill, styles.bgImage]}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.carouselItem}>
      {renderBgImage()}
      {renderUserInfo()}
      {renderBottomView()}
      {renderLeftView()}
      {renderRightView()}
    </View>
  );
};

const styles = StyleSheet.create({
  topView: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10,
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    color: 'white',
  },
  userTime: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
  },
  leftViewContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  leftView: {
    width: 70,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    padding: 16,
    paddingVertical: 24,
    zIndex: -1,
  },
  country: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: '#00000020',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  bottomLeftView: {
    alignSelf: 'flex-end',
  },
  countryMore: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 19,
    color: 'black',
  },
  rightView: {
    position: 'absolute',
    right: 19,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  selectedThumb: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#ffffff30',
    alignSelf: 'center',
    marginBottom: 8,
    borderWidth: 4,
    borderColor: 'white',
    overflow: 'hidden',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#ffffff30',
    alignSelf: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    left: 18,
    right: 18,
  },
  viewPostWrap: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff20',
    borderRadius: 32,
    height: 32,
    marginTop: 15,
  },
  replyTxt: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 12,
    color: '#ffffff80',
    marginLeft: 10,
  },
  viewPost: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    color: '#ffffff',
  },
  bgImage: {
    borderRadius: 28,
  },
  carouselItem: {
    marginTop: 40,
    height: '80%',
    marginEnd: 30,
    marginLeft: 16,
    padding: 20,
  },
  count: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    color: '#010101',
    marginTop: 8,
    textAlign: 'center',
  },
  keywordContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
    marginEnd: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keywordTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

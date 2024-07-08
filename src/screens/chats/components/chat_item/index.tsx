import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PostPlayIcon} from 'screens/chats/assets/PostPlayIcon';
import {PostWaveIcon} from 'screens/chats/assets/PostWaveIcon';
import GroupChatAudioPlayer from '../chat_audio_player';

import {styles} from './index.styles';

export interface PostData {
  id: number;
  userId: number;
  userImage: string;
  userName: string;
  countryName: string;
  countryId: number;
  keyWords: Array<string>;
  medias: Array<string>;
  mediaTypes: Array<string>;
}

export interface ChatData {
  fromOwner: boolean;
  type: 'media' | 'post' | 'text';
  creatorName: string;
  creatorImage: string;
  mediaUrls: Array<string>;
  mediaTypes: Array<string>;
  message: string;
  hasTags: Array<string>;
  createdDate: number;
  postData: PostData;
}

export interface ChatItemProps {
  data: ChatData;
  onGoToProfile: (userId) => void;
  onGoToCountry: (countryId) => void;
}

const ChatItem = ({data, onGoToCountry, onGoToProfile}: ChatItemProps) => {
  const renderImage = () => {
    return (
      <View style={{}}>
        <TouchableOpacity onPress={() => {}}>
          <Image
            style={styles.photo}
            source={{
              uri: data.mediaUrls[0],
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAudio = () => {
    return (
      <View style={styles.audioWrapper}>
        <View style={styles.audioMsg}>
          <GroupChatAudioPlayer
            video={{
              uri: data.mediaUrls[0],
            }}
          />
        </View>
      </View>
    );
  };

  const renderPost = () => {
    return (
      <View style={styles.postWrapper}>
        <Image
          source={{uri: data.postData.medias[0]}}
          style={[StyleSheet.absoluteFill]}
        />
        <View style={[StyleSheet.absoluteFill]}>
          <View style={styles.postBody}>
            <View style={styles.postImage}>
              <Image
                source={
                  data.postData.userImage === ''
                    ? getDefaultAvatar()
                    : {uri: data.postData.userImage}
                }
                style={[StyleSheet.absoluteFill]}
              />
            </View>
            <Text style={styles.postNameTxt}>
              <Text
                style={styles.postNameTxt}
                onPress={() =>
                  onGoToProfile(data.postData.userId)
                }>{`${data.postData.userName} `}</Text>
              <Text style={styles.postNameSubTxt}>in</Text>
              <Text
                style={styles.postNameTxt}
                onPress={() =>
                  onGoToCountry(data.postData.countryId)
                }>{`${data.postData.countryName}`}</Text>
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <View style={styles.postKeyword}>
              {data.postData.keyWords.map((item, index) => {
                return (
                  <View style={styles.postKeywordItem}>
                    <Text style={styles.postKeywordTxt}>{item}</Text>
                  </View>
                );
              })}
            </View>
            <View>
              <PostWaveIcon />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <PostPlayIcon />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderOwnerChat = () => {
    return (
      <View style={styles.msgOwnerContainer}>
        {data.type === 'media' && data.mediaUrls.length > 0 ? (
          data.mediaTypes[0] === 'image' ? (
            renderImage()
          ) : (
            renderAudio()
          )
        ) : data.type === 'post' ? (
          renderPost()
        ) : (
          <View style={styles.msgOwnerBody}>
            <Text style={styles.msgTxt}>{data.message}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderOtherChat = () => {
    return (
      <View style={styles.msgOtherContainer}>
        <Image
          source={
            data.creatorImage === ''
              ? getDefaultAvatar()
              : {uri: data.creatorImage}
          }
          style={styles.msgUserImage}
        />
        <View style={styles.msgOtherBodyContainer}>
          <View style={styles.msgOtherBody}>
            {data.type === 'media' && data.mediaUrls.length > 0 ? (
              data.mediaTypes[0] === 'image' ? (
                renderImage()
              ) : (
                renderAudio()
              )
            ) : data.type === 'post' ? (
              renderPost()
            ) : (
              <Text style={styles.msgTxt}>{data.message}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {data.fromOwner ? renderOwnerChat() : renderOtherChat()}
    </View>
  );
};

export default React.memo(ChatItem);

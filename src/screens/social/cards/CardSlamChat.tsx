import {SCREEN_WIDTH, timeSince} from 'helper/utils';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import SwipeReconizer from 'react-native-swipe-gestures';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

import WhiteSendIcon from 'assets/svg/white_send';
import WhiteMicIcon from 'assets/svg/white_mic';
import EmojiIcon from 'assets/svg/EmojiIcon';
import CommentSmallIcon from 'assets/svg/CommentSmallIcon';
import {useDebouncedCallback} from 'use-debounce';
import CommentEmojiItem from 'components/cards/FeedDirectCard/CommentEmojiItem';
import {useNavigation} from '@react-navigation/native';
import {useToast} from 'native-base';
import CommentItem from 'components/cards/FeedDirectCard/CommentItem';
import {
  apiGetTopicEmoji,
  apiGetTopicReplies,
  apiTopicReply,
} from 'helper/slambookHelper';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {getDefaultAvatar} from 'helper/userHelpers';
import SlamBookChatAudio from '../components/SlamBookChatAudio';
import {WebView} from 'react-native-webview';

const CardSlamChat = ({data, slambook, topic}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const scrollRef = useRef(null);
  const navigation = useNavigation();
  const agoTime =
    timeSince(data.item.createdAt) === 'now'
      ? timeSince(data.item.createdAt)
      : timeSince(data.item.createdAt) + ' ago';

  const [selectedCommentTab, setSelectedCommentTab] = useState(0); // 0: Emoji, 1: Comment

  const [hasMoreEmoji, setHasMoreEmoji] = useState(true);
  const [loadingEmoji, setLoadingEmoji] = useState(false);
  const [emojiLastId, setEmojiLastId] = useState(null);
  const [arrEmoji, setArrEmoji] = useState([]);

  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState<Boolean>(false);
  const [commentLastId, setCommentLastId] = useState(null);
  const [arrComments, setArrComments] = useState([]);

  const toast = useToast();
  const [commentText, setCommentText] = useState('');
  const [showCommentPlaceholder, setShowCommentPlaceholder] = useState(true);
  const commentActionRef = useRef(null);
  const snapPointsCommentAction = useMemo(() => [480, 480], []);
  const [isOpenedCommentSheet, setIsOpenedCommentSheet] = useState(false);

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
    detectSwipeUp: false,
    detectSwipeDown: false,
  };

  const onLeftSwipe = state => {
    scrollRef.current?.scrollTo({x: 130, animated: true});
  };

  const onRightSwipe = state => {
    scrollRef.current?.scrollTo({x: -130, animated: true});
  };

  useEffect(() => {
    if (isOpenedCommentSheet) {
      loadEmoji(true);
      loadComments();
    }
  }, [isOpenedCommentSheet]);

  const formattedText = useMemo(() => {
    if (data.item.hashTags.length > 0) {
      const newText = [];
      const arrWords = data.item.message.split(' ');

      arrWords.forEach(itemWord => {
        if (data.item.hashTags.indexOf(itemWord) > -1) {
          newText.push(
            <Text style={styles.chatTagText}>{` #${itemWord}`}</Text>,
          );
        } else {
          newText.push(
            <Text style={styles.chatNormalText}>{` ${itemWord}`}</Text>,
          );
        }
      });

      return newText;
    } else {
      return <Text style={styles.chatNormalText}>{data.item.message}</Text>;
    }
  }, []);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleCommentBottomSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedCommentSheet(false);
    } else {
      setIsOpenedCommentSheet(true);
    }
  }, []);

  const loadEmoji = async (shouldReload = false) => {
    if ((!shouldReload && !hasMoreComments) || loadingComments) {
      return;
    }

    try {
      setLoadingEmoji(true);
      const res = await apiGetTopicEmoji(
        slambook,
        topic,
        data.item.id,
        shouldReload ? null : emojiLastId,
      );

      if (res.success) {
        setHasMoreEmoji(res.hasMore);
        setEmojiLastId(res.lastId);
        setArrEmoji(prev => [...prev, ...res.data]);
      }
    } catch (error) {
      console.log('emoji error: ', error);
    } finally {
      setLoadingEmoji(false);
    }
  };
  const debouncedLoadEmoji = useDebouncedCallback(loadEmoji, 100);

  const loadComments = async () => {
    if (!hasMoreComments || loadingComments) {
      return;
    }
    try {
      const params = {
        slambook,
        topic,
        comment: data.item.id,
        lastId: commentLastId,
      };

      setLoadingComments(true);
      const res = await apiGetTopicReplies(params);
      if (res.success) {
        setHasMoreComments(res.hasMore);
        setCommentLastId(res.lastId);
        setArrComments(prev => [...prev, ...res.data]);
      }
    } catch (error) {
      console.log('comments error: ', error);
    } finally {
      setLoadingComments(false);
    }
  };
  const debouncedLoadComments = useDebouncedCallback(loadComments, 100);

  const onAddComment = async () => {
    if (commentText === '') {
      return;
    }

    const params = {
      slambook,
      topic,
      comment: data.item.id,
      message: commentText,
      hashTags: [],
      mediaTypes: [],
      mediaUrls: [],
    };
    const res = await apiTopicReply(params);

    if (res.success) {
      const newComment = {
        from: {
          id: user.id,
          image: user.image,
          name: user.username,
        },
        createdDate: new Date().getTime(),
        message: commentText,
      };
      setCommentText('');
      setArrComments(prev => [...prev, newComment]);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.senderInfo}
          onPress={() => {
            navigation.navigate('OtherProfilePage', {
              userId: data.item.from.id,
            });
          }}>
          <Image
            source={
              data.item.from.image === ''
                ? getDefaultAvatar()
                : {
                    uri: data.item.from.image,
                  }
            }
            style={styles.senderImage}
          />
          <Text style={styles.senderName}>{data.item.from.name}</Text>
        </TouchableOpacity>
        <Text style={styles.agoTxt}>{agoTime}</Text>
      </View>
    );
  };

  const renderText = () => {
    return (
      <View style={styles.textView}>
        <Text>{formattedText}</Text>
      </View>
    );
  };

  const renderAudio = () => {
    return (
      <View style={styles.audioWrapper}>
        <View style={styles.audioMsg}>
          <SlamBookChatAudio
            video={{
              uri: data.item.mediaUrls[0],
            }}
          />
        </View>
      </View>
    );
  };

  const renderVideo = () => {
    return (
      <View>
        <WebView
          style={styles.videoWrapper}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          viewportContent={`width=${
            Dimensions.get('window').width
          }, user-scalable=yes`}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEnabledWithZoomedin={false}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          androidHardwareAccelerationDisabled={false}
          mixedContentMode="always"
          source={{
            uri: data.item.mediaUrls[0],
          }}
        />
      </View>
    );
  };

  const renderMedia = () => {
    return (
      <View>
        <View style={styles.chatMediaView}>
          <View style={{flex: 0.45, height: '100%'}}>
            {data.item.mediaUrls.length > 1 && (
              <Image
                source={{
                  uri: data.item.mediaUrls[1],
                }}
                style={[StyleSheet.absoluteFill, {borderRadius: 12}]}
                resizeMode="cover"
              />
            )}
          </View>
          <View
            style={{
              flex: 0.55,
              height: '100%',
              marginStart: 8,
            }}>
            {data.item.mediaUrls.length > 0 && (
              <Image
                source={{
                  uri: data.item.mediaUrls[0],
                }}
                style={[StyleSheet.absoluteFill, {borderRadius: 12}]}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
        {data.item.mediaUrls.length > 2 && (
          <Text style={styles.seeMoreTxt}>See more</Text>
        )}
      </View>
    );
  };

  const renderCommentTabs = () => {
    return (
      <View style={styles.commentTabContainer}>
        <TouchableOpacity
          style={styles.commentTab}
          onPress={() => setSelectedCommentTab(0)}>
          <View style={styles.commentTabTopView}>
            <EmojiIcon isActive={selectedCommentTab === 0} />
            <Text
              style={[
                styles.commentTabText,
                {
                  color:
                    selectedCommentTab === 0
                      ? '#FF6651'
                      : 'rgba(255, 255, 255, 0.4)',
                },
              ]}>
              Emoji
            </Text>
          </View>
          <View
            style={
              selectedCommentTab === 0
                ? styles.commentTabSelectedtBorder
                : styles.commentTabDefaultBorder
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.commentTab}
          onPress={() => {
            setSelectedCommentTab(1);
          }}>
          <View style={styles.commentTabTopView}>
            <CommentSmallIcon isActive={selectedCommentTab === 1} />
            <Text
              style={[
                styles.commentTabText,
                {
                  color:
                    selectedCommentTab === 1
                      ? '#FF6651'
                      : 'rgba(255, 255, 255, 0.4)',
                },
              ]}>
              Comment
            </Text>
          </View>
          <View
            style={
              selectedCommentTab === 1
                ? styles.commentTabSelectedtBorder
                : styles.commentTabDefaultBorder
            }
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmojiConent = () => {
    return (
      <View style={{flex: 1}}>
        {arrEmoji.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={0}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                debouncedLoadEmoji();
              }
            }}>
            {arrEmoji.map((person, index) => {
              return (
                <CommentEmojiItem
                  data={person}
                  navigation={navigation}
                  onClose={() => {
                    commentActionRef.current?.close();
                  }}
                  onEmojiDetail={emojiData => {
                    // setEmojiDetailIcon(emojiData.emoji);
                    // setEmojiDetailMedia(emojiData.mediaUrl);
                    // setShowEmojiDetail(true);
                  }}
                />
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.empty}>
            <Image
              source={require('./../../../assets/images/no_friends_icon.png')}
            />
            <Text style={styles.emptyText}>
              No emoji yet. {'\n'} Be the first one to add!
            </Text>
          </View>
        )}
        <View style={styles.addEmojiContainer}>
          <TouchableOpacity
            style={styles.addEmojiButton}
            onPress={() => {
              commentActionRef.current?.close();

              setTimeout(() => {
                navigation.navigate('TopicAddEmojiPage', {
                  slambookId: slambook,
                  topicId: topic,
                  commentId: data.item.id,
                });
              }, 300);
            }}>
            <Text style={styles.addEmojiButtonTxt}>Add Emoji</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const newArrComments = useMemo(() => {
    var extraArr = [];

    extraArr = arrComments.map((item, _) => {
      return {
        ...item,
        user: item.from,
        text: item.message,
      };
    });

    return extraArr;
  }, [arrComments]);

  const renderCommentContent = () => {
    return (
      <View style={{flex: 1}}>
        {newArrComments.length > 0 ? (
          <BottomSheetScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                debouncedLoadComments();
              }
            }}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: '400',
                fontSize: 14,
                color: 'white',
              }}>
              Comments
            </Text>
            <View
              style={{
                padding: 8,
                height: '100%',
                marginTop: 8,
                paddingBottom: 48,
              }}>
              {newArrComments.map((item, _) => (
                <CommentItem item={item} />
              ))}
            </View>
          </BottomSheetScrollView>
        ) : (
          <View style={[styles.empty]}>
            <Image
              source={require('./../../../assets/images/no_friends_icon.png')}
            />
            <Text style={[styles.emptyText, {marginBottom: 70}]}>
              No comment yet. {'\n'} Be the first one to comment!
            </Text>
          </View>
        )}

        <View style={styles.bottomContainer}>
          <View style={styles.commentContainer}>
            <TextInput
              value={commentText}
              onChangeText={text => setCommentText(text)}
              placeholder={showCommentPlaceholder ? 'Add comment here...' : ''}
              placeholderTextColor="white"
              onFocus={() => {
                setShowCommentPlaceholder(false);
              }}
              onEndEditing={() => {
                setShowCommentPlaceholder(true);
              }}
              style={styles.commentInput}
            />
            <TouchableOpacity
              onPress={onAddComment}
              style={styles.commentActionBtn}>
              <WhiteSendIcon />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {}}
              style={styles.commentActionBtn}>
              <WhiteMicIcon />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    );
  };

  const renderCommentBottomSheet = () => {
    return (
      <BottomSheetModal
        ref={commentActionRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderTopRightRadius: 45,
          borderTopLeftRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.34)',
          marginTop: 5,
        }}
        snapPoints={snapPointsCommentAction}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleCommentBottomSheetChanges}>
        <View style={{flex: 1, padding: 20, paddingTop: 10}}>
          {renderCommentTabs()}
          {selectedCommentTab == 0
            ? renderEmojiConent()
            : renderCommentContent()}
        </View>
      </BottomSheetModal>
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
      <SwipeReconizer
        config={swipeConfig}
        onSwipeLeft={onLeftSwipe}
        onSwipeRight={onRightSwipe}
        style={[styles.container, {width: SCREEN_WIDTH}]}>
        <TouchableOpacity style={[styles.body]}>
          <View
            style={[
              styles.startDivider,
              user.id === data.item.from.id && {backgroundColor: '#08B883'},
            ]}
          />
          {renderHeader()}
          {data.item.message !== '' && renderText()}
          {data.item.mediaTypes[0] === 'audio' &&
          data.item.mediaUrls.length === 1
            ? renderAudio()
            : data.item.mediaTypes[0] === 'video' &&
              data.item.mediaUrls.length === 1
            ? renderVideo()
            : data.item.mediaUrls &&
              data.item.mediaUrls.length > 0 &&
              renderMedia()}
        </TouchableOpacity>
      </SwipeReconizer>
      <View
        style={{
          marginTop: 12,
          paddingEnd: 24,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedCommentTab(0);
            commentActionRef.current?.present();
          }}>
          <SmileIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 16}}
          onPress={() => {
            setSelectedCommentTab(1);
            commentActionRef.current?.present();
          }}>
          <GoIcon />
        </TouchableOpacity>
      </View>
      {renderCommentBottomSheet()}
    </ScrollView>
  );
};

export default CardSlamChat;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  body: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginTop: 12,
    marginHorizontal: 24,
    padding: 16,
  },
  startDivider: {
    width: 2,
    height: 30,
    position: 'absolute',
    top: 16,
    left: 0,
    backgroundColor: '#FF6651',
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  senderName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginStart: 12,
  },
  agoTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  textView: {
    marginTop: 20,
  },
  chatNormalText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  chatTagText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FF6651',
  },
  chatMediaView: {
    width: '100%',
    height: 120,
    flexDirection: 'row',
    marginTop: 20,
  },
  seeMoreTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'flex-end',
    marginTop: 10,
  },

  // comment dialog
  commentTabContainer: {height: 60, flexDirection: 'row'},
  commentTab: {flex: 1, alignItems: 'center'},
  commentTabTopView: {flexDirection: 'row', alignItems: 'center'},
  commentTabText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    marginStart: 10,
  },
  commentTabDefaultBorder: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 16,
  },
  commentTabSelectedtBorder: {
    width: '100%',
    height: 3,
    backgroundColor: '#FF6651',
    marginTop: 14,
  },
  addEmojiContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEmojiButton: {
    width: 135,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEmojiButtonTxt: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  sideMusicButton: {
    position: 'absolute',
    top: 10,
    right: 0,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#282828',
    borderTopLeftRadius: 64,
    borderBottomLeftRadius: 64,
    padding: 8,
    zIndex: 1,
  },
  sideSmileButton: {
    position: 'absolute',
    top: 74,
    right: 0,
    width: 64,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#282828',
    borderTopLeftRadius: 64,
    borderBottomLeftRadius: 64,
    padding: 8,
    zIndex: 1,
  },
  sidePlusButton: {
    position: 'absolute',
    top: 138,
    right: 0,
    width: 64,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#282828',
    borderTopLeftRadius: 64,
    borderBottomLeftRadius: 64,
    padding: 8,
    zIndex: 1,
  },
  commentActionBtn: {
    padding: 10,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 20,
  },
  commentContainer: {
    width: '100%',
    height: 55,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: 50,
    fontSize: 12,
    fontWeight: '400',
    color: 'white',
    marginStart: 10,
  },
  bottomContainer: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
  },
  audioWrapper: {
    width: 280,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  audioMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoWrapper: {
    width: 145,
    height: 135,
    borderRadius: 20,
    marginTop: 16,
  },
});

const SmileIcon = props => (
  <Svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <Rect width="48" height="48" fill="#FFA51F" rx="16"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M24 34c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z"></Path>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20 26s1.5 2 4 2 4-2 4-2M21 21h.01M27 21h.01"></Path>
  </Svg>
);

const GoIcon = props => (
  <Svg width="48" height="48" fill="none" viewBox="0 0 48 48">
    <Rect width="48" height="48" fill="#FF6651" rx="16"></Rect>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M27 26l5-5-5-5"></Path>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 32v-7a4 4 0 014-4h12"></Path>
  </Svg>
);

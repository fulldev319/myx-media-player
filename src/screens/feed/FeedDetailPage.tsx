/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Video from 'react-native-video';
import {useDebouncedCallback} from 'use-debounce';
import {MemeberGroup} from 'components/memberGroup';
import {MainStackParams} from 'navigators';
import {PlayButton} from 'screens/MusicPlayer/components/PlayButton';
import {SCREEN_WIDTH} from 'helper/utils';
import LinearGradient from 'react-native-linear-gradient';
import SwipeReconizer from 'react-native-swipe-gestures';
import {apiFollowPeople, apiUnFollowPeople} from 'helper/userHelpers';
import {useToast} from 'native-base';
import Carousel from 'react-native-snap-carousel';
import Theme from 'components/common/Theme';
import SmileIcon from 'assets/svg/SmileIcon';
import TagSmallIcon from 'assets/svg/TagSmallIcon';
import RepeatSmallIcon from 'assets/svg/RepeatSmallIcon';
import SendSmallIcon from 'assets/svg/SendSmallIcon';
import BookmarkSmallIcon from 'assets/svg/BookmarkSmallIcon';
import CloseSmallIcon from 'assets/svg/CloseSmallIcon';
import QuestionBigIcon from 'assets/svg/QuestionBigIcon';
import defaultAvatar from 'assets/images/default_avatar.png';
import {ArrowBack} from 'assets/svg';
import EmojiIcon from 'assets/svg/EmojiIcon';
import CommentSmallIcon from 'assets/svg/CommentSmallIcon';
import WhiteSendIcon from 'assets/svg/white_send';
import WhiteMicIcon from 'assets/svg/white_mic';
import PlusIcon from 'assets/svg/PlusIcon';
import {apiGetFeedDetail} from './../../helper/memoryHelpers';
import {useDispatch, useSelector} from 'react-redux';
import {
  apiGetMemoryComments,
  apiCommentMemory,
  apiGetMemoryEmoji,
} from 'helper/memoryHelpers';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CommentEmojiItem from 'components/cards/FeedDirectCard/CommentEmojiItem';
import CommentItem from 'components/cards/FeedDirectCard/CommentItem';
import {RootState} from 'redux/interfaces';
import memoryAction from 'redux/memory/actions';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 20,
  detectSwipeUp: false,
  detectSwipeDown: false,
};

const FeedDetailPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {feedId} = route.params;
  const scrollRef = useRef(null);
  const toast = useToast();
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const {togglePlayer, curTrack, playingStatus, trackProgress, playOneTrack} =
    useTracks();

  const [detail, setDetail] = useState(null);
  const [extraInfoBar, setExtraInfoBar] = useState(false);
  const [rightExtraInfoBar, setRightExtraInfoBar] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [isOpenedCommentSheet, setIsOpenedCommentSheet] = useState(false);
  const [selectedCommentTab, setSelectedCommentTab] = useState(0); // 0: Emoji, 1: Comment
  const [commentText, setCommentText] = useState('');
  const [showCommentPlaceholder, setShowCommentPlaceholder] = useState(true);

  const [hasMoreEmoji, setHasMoreEmoji] = useState(true);
  const [loadingEmoji, setLoadingEmoji] = useState(false);
  const [arrEmoji, setArrEmoji] = useState([]);
  const [emojiLastId, setEmojiLastId] = useState(null);
  const [showEmojiDetail, setShowEmojiDetail] = useState(false);
  const [emojiDetailIcon, setEmojiDetailIcon] = useState('');
  const [emojiDetailMedia, setEmojiDetailMedia] = useState('');

  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState<Boolean>(false);
  const [commentLastId, setCommentLastId] = useState(null);
  const [arrComments, setArrComments] = useState([]);

  const horizontalCarouselRef = useRef([]);
  const commentActionRef = useRef(null);
  const snapPointsCommentAction = useMemo(() => [480, 480], []);

  useEffect(() => {
    if (feedId) {
      loadDetail();
    }
  }, [feedId]);

  useEffect(() => {
    if (isOpenedCommentSheet) {
      loadEmoji();
      loadComments();
    }
  }, [isOpenedCommentSheet]);

  const loadDetail = async () => {
    const params = {memoryId: feedId};
    const res = await apiGetFeedDetail(params);
    if (res.success) {
      setDetail(res.data);
    }
  };

  const onLeftExtraSwipe = state => {
    scrollRef.current?.scrollTo({x: 150, animated: true});
  };

  const onRightExtraSwipe = state => {
    scrollRef.current?.scrollTo({x: -150, animated: true});
  };

  const onUnfollowPeople = async () => {
    setIsLoadingFollow(true);
    const res = await apiUnFollowPeople(detail.creatorInfo.id);
    if (res.success) {
      toast.show({
        render: () => {
          return (
            <View style={styles.toast}>
              <Text style={styles.toastTxt}>
                Success unfollowing @{detail.creatorInfo.name}
              </Text>
            </View>
          );
        },
      });
      setIsFollowed(prev => !prev);
    }
    setIsLoadingFollow(false);
  };

  const onFollowPeople = async () => {
    setIsLoadingFollow(true);
    const res = await apiFollowPeople(detail.creatorInfo.id);

    if (res.success) {
      toast.show({
        render: () => {
          return (
            <View style={styles.toast}>
              <Text style={styles.toastTxt}>
                Success following @{detail.creatorInfo.name}
              </Text>
            </View>
          );
        },
      });
      setIsFollowed(prev => !prev);
    }

    setIsLoadingFollow(false);
  };

  const onAddComment = async () => {
    if (commentText === '') {
      return;
    }

    const params = {
      postId: detail.id,
      text: commentText,
    };
    const res = await apiCommentMemory(params);

    if (res.success) {
      const newComment = {
        posterImage: user.profileImage,
        posterName: user.username,
        createdDate: new Date().getTime(),
        commentText: commentText,
        id: '',
      };

      setCommentText('');
      setArrComments(prev => [newComment, ...prev]);
    }
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const carouselScrollHorizontal = async idx => {
    setCurrentMemoryIndex(idx);
  };

  const handleCommentBottomSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedCommentSheet(false);
    } else {
      setIsOpenedCommentSheet(true);
    }
  }, []);

  const loadEmoji = async () => {
    if (!hasMoreEmoji || loadingEmoji) {
      return;
    }

    try {
      setLoadingEmoji(true);
      const res = await apiGetMemoryEmoji(detail.id, emojiLastId);
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
      const params = {postId: detail.id, lastId: commentLastId};
      setLoadingComments(true);
      const res = await apiGetMemoryComments(params);
      if (res.success) {
        setHasMoreComments(res.data.hasMore);
        setCommentLastId(res.data.lastId);
        setArrComments(prev => [...prev, ...res.data.comments]);
      }
    } catch (error) {
      console.log('comments error: ', error);
    } finally {
      setLoadingComments(false);
    }
  };
  const debouncedLoadComments = useDebouncedCallback(loadComments, 100);

  const handlePlay = () => {
    if (curTrack?.id === detail?.song?.id) {
      togglePlayer();
    } else {
      playOneTrack(
        {
          ...detail?.song,
          url: detail?.song?.previewUrl,
          previewUrl: detail?.song?.previewUrl,
        },
        feedId,
      );
    }
  };

  const renderImageView = () => {
    return (
      <View style={styles.mediaContainer}>
        <Image
          source={{
            uri: detail.mediaUrls[currentMemoryIndex],
          }}
          style={[StyleSheet.absoluteFill, styles.mediaView]}
        />
      </View>
    );
  };

  const renderVideoView = () => {
    return (
      <View style={styles.mediaContainer}>
        <Video
          source={{
            uri: detail.mediaUrls[currentMemoryIndex],
          }}
          resizeMode={'cover'}
          style={[StyleSheet.absoluteFill, {borderRadius: 32}]}
        />
      </View>
    );
  };

  const renderTextView = () => {
    return (
      <View style={styles.textContainer}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            marginTop: -50,
          }}>
          <Text style={[styles.caption, {marginBottom: 40}]}>
            {detail.mediaUrls[currentMemoryIndex]}
          </Text>
        </View>
      </View>
    );
  };

  const renderMusicPlayer = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 8,
          width: '100%',
          zIndex: 1,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 12,
            borderRadius: 18,
          }}>
          <Image
            source={{uri: detail.song.image}}
            style={styles.songImage}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text
              style={styles.songTitle}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {detail.song.title}
            </Text>
            <Text
              style={styles.description}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {detail?.song.artists?.length > 0 ? detail?.song.artists[0] : ''}
            </Text>
          </View>
          <PlayButton
            playingStatus={
              curTrack?.id === detail?.song?.id
                ? playingStatus
                : PlayingStatus.Pause
            }
            onClick={handlePlay}
            progressValue={
              curTrack?.id === detail?.song?.id ? trackProgress : 0
            }
          />
        </View>
      </View>
    );
  };

  const renderBottomView = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          minHeight: 130,
          backgroundColor: 'rgba(120, 120, 120, 0.3)',
          borderRadius: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
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
          <View style={{width: SCREEN_WIDTH - 90, padding: 16}}>
            <View style={styles.ownerDataContainer}>
              <Image
                source={
                  detail.creatorInfo?.image
                    ? {uri: detail.creatorInfo.image}
                    : defaultAvatar
                }
                style={styles.ownerImage}
              />
              <Text style={styles.ownerName}>{detail.creatorInfo.name}</Text>
            </View>
            <Text style={styles.postName}>{detail.text || detail.caption}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {detail &&
                detail?.song &&
                detail?.song?.tagged &&
                detail?.song?.tagged.length > 0 && (
                  <MemeberGroup data={detail.song.tagged} />
                )}
            </View>
            <SwipeReconizer
              config={swipeConfig}
              onSwipeLeft={onLeftExtraSwipe}
              onSwipeRight={onRightExtraSwipe}
              style={[StyleSheet.absoluteFill]}>
              <TouchableOpacity style={[StyleSheet.absoluteFill]} />
            </SwipeReconizer>
            {extraInfoBar && (
              <View
                style={{
                  marginTop: 16,
                  shadowColor: '#f7600a',
                  elevation: 20,
                  shadowOpacity: 1,
                  shadowRadius: 30,
                }}>
                <LinearGradient
                  colors={['#FF3F3F', '#FF701F']}
                  style={{
                    width: 290,
                    height: 40,
                    borderRadius: 32,
                    flexDirection: 'row',
                    padding: 13,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{flexDirection: 'row', marginLeft: 8}}>
                    <TagSmallIcon />
                    <Text style={{color: '#fff', fontSize: 10, marginLeft: 6}}>
                      22
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{flexDirection: 'row'}}>
                    <RepeatSmallIcon />
                    <Text style={{color: '#fff', fontSize: 10, marginLeft: 6}}>
                      2.5k
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{flexDirection: 'row'}}>
                    <SendSmallIcon />
                    <Text style={{color: '#fff', fontSize: 10, marginLeft: 6}}>
                      234
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{flexDirection: 'row'}}>
                    <BookmarkSmallIcon />
                    <Text style={{color: '#fff', fontSize: 10, marginLeft: 6}}>
                      234
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 8,
                      width: 2,
                      backgroundColor: '#ffffff60',
                      marginRight: 2,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setExtraInfoBar(false);
                    }}
                    style={{flexDirection: 'row'}}>
                    <CloseSmallIcon />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {!extraInfoBar && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setExtraInfoBar(true);
                }}>
                <LinearGradient
                  colors={['#FF3F3F', '#FF701F']}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <QuestionBigIcon />
                </LinearGradient>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginLeft: extraInfoBar ? 60 : 16,
              }}
              onPress={() => {
                setRightExtraInfoBar(prev => !prev);
              }}>
              <View
                style={{
                  height: 8,
                  width: 2,
                  backgroundColor: '#ffffff40',
                  marginRight: 2,
                }}
              />
              <View
                style={{
                  height: 8,
                  width: 2,
                  backgroundColor: '#ffffff40',
                  marginRight: 2,
                }}
              />
              <View
                style={{
                  height: 8,
                  width: 2,
                  backgroundColor: '#ffffff40',
                }}
              />
            </TouchableOpacity>
          </View>
          {isLoadingFollow ? (
            <View style={styles.followLoading}>
              <ActivityIndicator color={'white'} />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                isFollowed ? styles.unfollowContainer : styles.followContainer,
                {
                  marginHorizontal: 20,
                },
              ]}
              onPress={() => {
                isFollowed ? onUnfollowPeople() : onFollowPeople();
              }}>
              <Text style={styles.txtFollow}>
                {isFollowed ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderSmileButton = () => {
    return (
      <View style={styles.sideSmileButton}>
        <TouchableOpacity
          onPress={() => {
            setIsOpenedCommentSheet(true);
            commentActionRef.current?.present();
          }}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFA51F',
            borderRadius: 32,
          }}>
          <SmileIcon />
        </TouchableOpacity>
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
          {selectedCommentTab === 0
            ? renderEmojiConent()
            : renderCommentContent()}
        </View>
      </BottomSheetModal>
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
                    setEmojiDetailIcon(emojiData.emoji);
                    setEmojiDetailMedia(emojiData.mediaUrls[0]);
                    setShowEmojiDetail(true);
                  }}
                />
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.empty}>
            <Image source={require('assets/images/no_friends_icon.png')} />
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
                navigation.navigate('AddEmojiScreen', {memoryId: detail.id});
              }, 300);
            }}>
            <Text style={styles.addEmojiButtonTxt}>Add Emoji</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCommentContent = () => {
    return (
      <View style={{flex: 1}}>
        {arrComments.length > 0 ? (
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
              {arrComments.map((item, _) => (
                <CommentItem item={item} />
              ))}
            </View>
          </BottomSheetScrollView>
        ) : (
          <View style={[styles.empty]}>
            <Image source={require('assets/images/no_friends_icon.png')} />
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
            <TouchableOpacity
              onPress={() => {}}
              style={styles.commentActionBtn}>
              <WhiteMicIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPlusButton = () => {
    return (
      <View style={styles.sidePlusButton}>
        <TouchableOpacity
          onPress={() => {
            dispatch(memoryAction.clearMediaData());
            dispatch(memoryAction.clearMediaUrl());
            navigation.navigate('AddMemoryPage', {songId: detail.song.id});
          }}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#08B883',
            borderRadius: 32,
          }}>
          <PlusIcon />
        </TouchableOpacity>
      </View>
    );
  };

  if (!detail) {
    return <View style={styles.root} />;
  } else {
    return (
      <View style={styles.root}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 55,
            left: 24,
            padding: 4,
            zIndex: 1,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowBack />
        </TouchableOpacity>
        <View style={{marginTop: 60, alignItems: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
            Memory
          </Text>
        </View>
        <View style={{marginTop: 20}}>
          <Carousel
            layout={'default'}
            ref={c =>
              (horizontalCarouselRef.current = [
                ...horizontalCarouselRef.current,
                c,
              ])
            }
            data={detail.mediaTypes}
            renderItem={type => {
              return (
                <>
                  {type.item === 'video'
                    ? renderVideoView()
                    : type.item === 'image'
                    ? renderImageView()
                    : renderTextView()}
                </>
              );
            }}
            sliderWidth={Theme.width}
            itemWidth={Theme.width}
            activeSlideAlignment={'center'}
            loop={true}
            onSnapToItem={carouselScrollHorizontal}
          />
          {renderMusicPlayer()}
          {renderSmileButton()}
          {renderPlusButton()}
        </View>
        {renderBottomView()}
        {renderCommentBottomSheet()}
      </View>
    );
  }
};

export default FeedDetailPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  titleText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
    marginStart: 50,
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#9747FF',
    borderRadius: 28,
  },
  mediaView: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    width: '100%',
    height: '100%',
  },
  detail: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    bottom: 0,
  },
  caption: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  action: {
    height: 140,
    borderRadius: 22,
    backgroundColor: 'rgba(1, 1, 1, 0.79)',
    alignItems: 'center',
    marginTop: 10,
  },
  taggedPersonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  songImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  content: {
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  description: {
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  ownerDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 24,
    height: 24,
    borderRadius: 50,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
    marginLeft: 8,
  },
  postName: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 12,
    marginBottom: 12,
    maxWidth: 200,
    maxHeight: 36,
  },
  followLoading: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
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
  toast: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  toastTxt: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 20,
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
  bottomContainer: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
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
  commentActionBtn: {
    padding: 10,
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
});

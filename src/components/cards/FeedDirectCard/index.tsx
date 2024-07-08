/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useMemo, useEffect, useCallback} from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {styles} from './index.styles';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import ScaledImage from 'components/ScaledImage';
import Dialog from 'react-native-dialog';

import defaultAvatar from 'assets/images/default_avatar.png';
import LinearGradient from 'react-native-linear-gradient';
import {
  apiLikeMemory,
  apiDislikeMemory,
  apiSaveMemory,
  apiUnsaveMemory,
  apiGetMemoryComments,
  apiCommentMemory,
  apiGetMemoryTaggedUser,
  apiGetMemoryEmoji,
} from 'helper/memoryHelpers';
import SwipeReconizer from 'react-native-swipe-gestures';
import {PostLayoutType} from 'helper/constants';
import Theme from 'components/common/Theme';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {RootState} from 'redux/interfaces';
import {useDispatch, useSelector} from 'react-redux';
import {useDebouncedCallback} from 'use-debounce';
import TaggedPersonCard from 'screens/feed/TaggedPersonCard';
import chatActions from 'redux/chats/actions';
import {MemeberGroup} from 'components/memberGroup';
import CommentEmojiItem from './CommentEmojiItem';
import MusicIcon from 'assets/svg/MusicIcon';
import CirclePlayIcon from 'assets/svg/CirclePlayIcon';
import RightArrowIcon from 'assets/svg/RightArrowIcon';
import EmojiIcon from 'assets/svg/EmojiIcon';
import CommentSmallIcon from 'assets/svg/CommentSmallIcon';
import SmileIcon from 'assets/svg/SmileIcon';
import PlusIcon from 'assets/svg/PlusIcon';
import QuestionBigIcon from 'assets/svg/QuestionBigIcon';
import TagSmallIcon from 'assets/svg/TagSmallIcon';
import SendSmallIcon from 'assets/svg/SendSmallIcon';
import RepeatSmallIcon from 'assets/svg/RepeatSmallIcon';
import BookmarkSmallIcon from 'assets/svg/BookmarkSmallIcon';
import CloseSmallIcon from 'assets/svg/CloseSmallIcon';
import BookOpenIcon from 'assets/svg/BookOpen';
import PlusCircleIcon from 'assets/svg/PlusCircle';
import FollowersUserIcon from 'assets/svg/FollowersUser';
import CheckIcon from 'assets/svg/CheckIcon';
import RefreshCircleIcon from 'assets/svg/RefreshCircleIcon';
import CommentItem from './CommentItem';
import Slider from 'react-native-slider';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'helper/utils';
import {WhiteCloseIcon} from 'assets/svg';
import {PlayButton} from 'screens/MusicPlayer/components/PlayButton';
import * as Animatable from 'react-native-animatable';
import {convertTimeFormat} from 'helper/utils';
import {apiFollowPeople, apiUnFollowPeople} from 'helper/userHelpers';
import {
  apiGetOwnedSlambook,
  apiAddMemoryToSlambook,
} from 'helper/slambookHelper';
import {useToast} from 'native-base';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';
import memoryAction from 'redux/memory/actions';
import {useAuth} from 'contexts/AuthContext';
import {apiCreateSlamBook} from 'helper/slambookHelper';
import {MemoryInput} from './components/MemoryInput';

const deviceWidth = Theme.width;
const deviceHeight = Theme.height;
const columnSize = (deviceWidth - 85) / 2;

export const mock_image_1 =
  'https://thumbs.dreamstime.com/b/forest-panorama-rays-sunlight-scenic-fresh-green-deciduous-trees-sun-casting-its-light-foliage-53826213.jpg';
export const mock_image_2 =
  'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg';
export const mock_image_3 =
  'https://thumbs.dreamstime.com/b/forest-path-panorama-25795025.jpg';

export const FeedDirectCard = ({
  slideIndex,
  type,
  data,
  songData,
  onClick,
  isPublic,
  onSlideNext,
  onSlidePrev,
}: FeedDirectCardProps) => {
  const navigation = useNavigation();
  const {setCurFeedTab} = useAuth();
  const videoRef = useRef(null);
  const scrollRef = useRef(null);
  const slambookBottomSheetRef = useRef(null);
  const [isStopVideo, setIsStopVideo] = useState(false);

  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);

  const toast = useToast();
  const commentActionRef = useRef(null);
  const snapPointsCommentAction = useMemo(() => [480, 480], []);
  const taggedActionRef = useRef(null);
  const snapPointsTaggedAction = useMemo(() => [480, 480], []);
  const musicAnimationElement = useRef(null);

  const [isLiked, setIsLiked] = useState(data.isLiked || false);
  const [isSaved, setIsSaved] = useState(data.isSaved || false);
  const [isOpenedCommentSheet, setIsOpenedCommentSheet] = useState(false);
  const [isOpenedTaggedSheet, setIsOpenedTaggedSheet] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [extraInfoBar, setExtraInfoBar] = useState(false);
  const [isOpenMusicPlayer, setIsOpenMusicPlayer] = useState(false);
  const [rightExtraInfoBar, setRightExtraInfoBar] = useState(false);
  const [isFollowed, setIsFollowed] = useState(
    data.creatorInfo.isFollowed === 'true',
  );
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState<Boolean>(false);
  const [commentLastId, setCommentLastId] = useState(null);
  const [arrComments, setArrComments] = useState([]);

  const [hasMoreTagged, setHasMoreTagged] = useState(true);
  const [loadingTagged, setLoadingTagged] = useState<Boolean>(false);
  const [arrTagged, setArrTagged] = useState([]);
  const [arrTaggedPerson, setArrTaggedPerson] = useState(data.taggedUsers);
  const [taggedLastId, setTaggedLastId] = useState(null);

  const [hasMoreSlambook, setHasMoreSlambook] = useState(true);
  const [loadingSlambook, setLoadingSlambook] = useState<Boolean>(false);
  const [arrSlambook, setArrSlambook] = useState([]);
  const [slambookLastId, setSlambookLastId] = useState(0);
  const [selectedSlambook, setSelectedSlambook] = useState(null);
  const [isEnabledAddToSlambook, setIsEnabledAddToSlambook] = useState(false);
  const [loadingAddToSlambook, setLoadingAddToSlambook] =
    useState<Boolean>(false);

  const [commentsCount, setCommentsCount] = useState(data.commentsCount || 0);
  const [selectedCommentTab, setSelectedCommentTab] = useState(0); // 0: Emoji, 1: Comment

  const [hasMoreEmoji, setHasMoreEmoji] = useState(true);
  const [loadingEmoji, setLoadingEmoji] = useState(false);
  const [arrEmoji, setArrEmoji] = useState([]);
  const [emojiLastId, setEmojiLastId] = useState(null);
  const [showCommentPlaceholder, setShowCommentPlaceholder] = useState(true);
  const [musicStyle, setMusicStyle] = useState(0);

  const [showEmojiDetail, setShowEmojiDetail] = useState(false);
  const [emojiDetailIcon, setEmojiDetailIcon] = useState('');
  const [emojiDetailMedia, setEmojiDetailMedia] = useState('');

  const [isOpenedBottomSheet, setIsOpenedBottomSheet] = useState(false);
  const snapPointsBottomSheet = useMemo(() => [640, 640], []);

  const createSlamBookSheetRef = useRef<BottomSheetModal>(null);
  const snapPointsCreateSlamBook = useMemo(() => [250, 250], []);
  const [newSlambookTitle, setNewSlambookTitle] = useState('');
  const [showPlaceHolder, setShowPlaceholder] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const {
    curTrack,
    playTrack,
    playOneTrack,
    togglePlayer,
    playingStatus,
    trackDuration,
    trackPosition,
    trackProgress,
    seekTime,
  } = useTracks();

  useEffect(() => {
    if (isOpenedCommentSheet) {
      loadEmoji();
      loadComments();
    }
  }, [isOpenedCommentSheet]);

  useEffect(() => {
    if (isOpenedTaggedSheet) {
      loadTaggedPersons();
    }
  }, [isOpenedTaggedSheet]);

  useEffect(() => {
    if (isOpenedBottomSheet) {
      loadOwnedSlambooks();
    }
  }, [isOpenedBottomSheet]);

  useEffect(() => {
    if (selectedSlambook) {
      setIsEnabledAddToSlambook(true);
    } else {
      setIsEnabledAddToSlambook(false);
    }
  }, [selectedSlambook]);

  useEffect(() => {
    if (isOpenMusicPlayer) {
      if (curTrack?.id === songData?.id) {
        togglePlayer();
      } else {
        playTrack(songData);
      }
    }
  }, [isOpenMusicPlayer]);

  const loadComments = async () => {
    if (!hasMoreComments || loadingComments) {
      return;
    }

    try {
      const params = {postId: data.id, lastId: commentLastId};
      setLoadingComments(true);
      const res = await apiGetMemoryComments(params);

      if (res.success) {
        setHasMoreComments(res.data.hasMore);
        setCommentLastId(res.data.lastId);
        setArrComments(prev => [...prev, ...res.data]);
      }
    } catch (error) {
      console.log('comments error: ', error);
    } finally {
      setLoadingComments(false);
    }
  };
  const debouncedLoadComments = useDebouncedCallback(loadComments, 100);

  const loadEmoji = async () => {
    if (!hasMoreEmoji || loadingEmoji) {
      return;
    }

    try {
      setLoadingEmoji(true);
      const res = await apiGetMemoryEmoji(data.id, emojiLastId);
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

  const loadTaggedPersons = async () => {
    if (!hasMoreTagged || loadingTagged) {
      return;
    }

    try {
      setLoadingTagged(true);

      const res = await apiGetMemoryTaggedUser(data.id, taggedLastId);
      if (res.success) {
        setHasMoreTagged(res.hasMore);
        setCommentLastId(res.lastId);
        setArrTagged(prev => [...prev, ...res.data]);
      }
    } catch (error) {
      console.log('tagged error: ', error);
    } finally {
      setLoadingTagged(false);
    }
  };

  const loadOwnedSlambooks = async () => {
    if (!hasMoreSlambook || loadingSlambook) {
      return;
    }

    try {
      setLoadingSlambook(true);

      const param = {
        offset: slambookLastId,
      };
      const res = await apiGetOwnedSlambook(param);
      if (res.success) {
        setHasMoreSlambook(res.hasMore);
        setSlambookLastId(res.lastId);
        setArrSlambook(prev => [...prev, ...res.data]);
      }
    } catch (error) {
      console.log('slambook error: ', error);
    } finally {
      setLoadingSlambook(false);
    }
  };

  const reLoadOwnedSlambooks = async () => {
    try {
      setLoadingSlambook(true);

      const param = {
        offset: null,
      };
      const res = await apiGetOwnedSlambook(param);
      if (res.success) {
        setHasMoreSlambook(res.hasMore);
        setSlambookLastId(res.lastId);
        setArrSlambook(prev => [...res.data]);
      }
    } catch (error) {
      console.log('slambook error: ', error);
    } finally {
      setLoadingSlambook(false);
    }
  };

  const handleLikeMemory = memoryId => {
    if (!isLiked) {
      apiLikeMemory({postId: memoryId}).then(res => {
        if (res.success) {
          setIsLiked(true);
        }
      });
    } else {
      apiDislikeMemory({postId: memoryId}).then(res => {
        if (res.success) {
          setIsLiked(false);
        }
      });
    }
  };

  const handleSaveMemory = memoryId => {
    if (!isSaved) {
      apiSaveMemory({memoryId: memoryId}).then(res => {
        if (res.success) {
          setIsSaved(true);
        }
      });
    } else {
      apiUnsaveMemory({memoryId: memoryId}).then(res => {
        if (res.success) {
          setIsSaved(false);
        }
      });
    }
  };

  const handleCommentBottomSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedCommentSheet(false);
    } else {
      setIsOpenedCommentSheet(true);
    }
  }, []);

  const handleTaggedBottomSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedTaggedSheet(false);
    } else {
      setIsOpenedTaggedSheet(true);
    }
  }, []);

  const onAddComment = async () => {
    if (commentText === '') {
      return;
    }

    const params = {
      postId: data.id,
      text: commentText,
      mediaUrls: [],
      mediaTypes: [],
    };
    const res = await apiCommentMemory(params);

    if (res.success) {
      const newComment = {
        id: '',
        user: {
          image: user.profileImage,
          name: user.username,
          id: user.id,
        },
        text: commentText,
        createdAt: new Date().getTime(),
      };

      setCommentText('');
      setArrComments(prev => [newComment, ...prev]);
      setCommentsCount(prev => prev + 1);
    }
  };

  const onSendAudioComment = async fileUrl => {
    const params = {
      postId: data.id,
      text: commentText,
      mediaUrls: [fileUrl],
      mediaTypes: ['audio'],
    };

    const res = await apiCommentMemory(params);

    if (res.success) {
      const newComment = {
        user: {
          image: user.profileImage,
          name: user.username,
          id: user.id,
        },
        text: '',
        mediaUrls: [fileUrl],
        mediaTypes: ['audio'],
      };

      setCommentText('');
      setArrComments(prev => [newComment, ...prev]);
      setCommentsCount(prev => prev + 1);
    }
  };

  const onChat = peopleId => {
    setIsOpenedTaggedSheet(false);
    taggedActionRef.current?.close();

    dispatch(
      chatActions.setCurrentChat({
        users: {
          userFrom: {userId: user.id},
          userTo: {userId: peopleId},
        },
      }),
    );

    setTimeout(() => {
      navigation.navigate('ChatRoom');
    }, 300);
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const onFollowPeople = async () => {
    setIsLoadingFollow(true);
    const res = await apiFollowPeople(data.creatorInfo.id);

    if (res.success) {
      toast.show({
        render: () => {
          return (
            <View style={styles.toast}>
              <Text style={styles.toastTxt}>
                Success following @{data.creatorInfo.name}
              </Text>
            </View>
          );
        },
      });
      setIsFollowed(prev => !prev);
    }

    setIsLoadingFollow(false);
  };

  const onUnfollowPeople = async () => {
    setIsLoadingFollow(true);
    const res = await apiUnFollowPeople(data.creatorInfo.id);
    if (res.success) {
      toast.show({
        render: () => {
          return (
            <View style={styles.toast}>
              <Text style={styles.toastTxt}>
                Success unfollowing @{data.creatorInfo.name}
              </Text>
            </View>
          );
        },
      });
      setIsFollowed(prev => !prev);
    }
    setIsLoadingFollow(false);
  };

  const onAddToSlambook = async () => {
    setLoadingAddToSlambook(true);
    const params = {
      slambookId: selectedSlambook.id,
      memoryId: data.id,
      topic: selectedSlambook.title,
    };
    const res = await apiAddMemoryToSlambook(params);
    if (res.success) {
      toast.show({
        render: () => {
          return (
            <View style={styles.toast}>
              <Text style={styles.toastTxt}>Success adding to slambook!</Text>
            </View>
          );
        },
      });
      setSelectedSlambook(null);
      setIsOpenedBottomSheet(false);
      slambookBottomSheetRef.current?.close();
    }
    setLoadingAddToSlambook(false);
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
                navigation.navigate('AddEmojiScreen', {memoryId: data.id});
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
                flex: 1,
                paddingBottom: 48,
                marginTop: 20,
              }}>
              {arrComments.map((item, _) => (
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
          <MemoryInput
            text={commentText}
            onChangeText={val => setCommentText(val)}
            onSend={() => {
              onAddComment();
            }}
            onAudioSend={onSendAudioComment}
          />
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
          {selectedCommentTab === 0
            ? renderEmojiConent()
            : renderCommentContent()}
        </View>
      </BottomSheetModal>
    );
  };

  const renderTaggedSheet = () => {
    return (
      <BottomSheetModal
        ref={taggedActionRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.34)',
          marginTop: 20,
        }}
        snapPoints={snapPointsTaggedAction}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleTaggedBottomSheetChanges}>
        <View style={{padding: 20}}>
          <Text style={{fontSize: 16, color: '#fff', marginBottom: 16}}>
            Tagged Person
          </Text>
          <ScrollView
            scrollEventThrottle={0}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                // debouncedLoadTagged();
              }
            }}>
            {arrTagged &&
              arrTagged.map((person, index) => {
                return <TaggedPersonCard data={person} onChat={onChat} />;
              })}
          </ScrollView>
        </View>
        <View />
      </BottomSheetModal>
    );
  };

  const renderEmojiDetailDlg = () => {
    return (
      <View>
        <Dialog.Container
          visible={showEmojiDetail}
          contentStyle={{
            backgroundColor: 'black',
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            paddingHorizontal: 30,
          }}
          blurStyle={{
            backgroundColor: 'black',
          }}>
          <View style={styles.addEmojiHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowEmojiDetail(false);
              }}>
              <WhiteCloseIcon />
            </TouchableOpacity>
            <Text style={styles.addEmojiTitle} />
          </View>
          <Image
            source={{
              uri: emojiDetailMedia,
            }}
            style={{height: 400, borderRadius: 30, marginTop: 40}}
            resizeMode="cover"
          />
          <View
            style={[
              styles.addEmojiListItem,
              {backgroundColor: 'white', marginTop: 40, alignSelf: 'center'},
            ]}>
            <Text style={{fontSize: 40}}>{emojiDetailIcon}</Text>
          </View>
        </Dialog.Container>
      </View>
    );
  };

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 20,
    detectSwipeUp: false,
    detectSwipeDown: false,
  };

  const onLeftHorizontalSwipe = state => {
    slideIndex !== undefined && onSlideNext(slideIndex);
  };

  const onRightHorizontalSwipe = state => {
    slideIndex !== undefined && onSlidePrev(slideIndex);
  };

  const onLeftExtraSwipe = state => {
    scrollRef.current?.scrollTo({x: 150, animated: true});
  };

  const onRightExtraSwipe = state => {
    scrollRef.current?.scrollTo({x: -150, animated: true});
  };

  const firstAnimationForMusicPlayer = () => {
    setMusicStyle(1);
  };

  const onLeftPlayerSwipe = state => {};

  const onRightPlayerSwipe = state => {
    musicAnimationElement.current.fadeOutRight(500).then(endState => {
      setMusicStyle(2);
    });
  };

  const onLeftSwitchSwipe = state => {
    setCurFeedTab('Music');
    navigation.navigate('Music');
  };

  const onRightSwitchSwipe = state => {};

  const handlePlay = () => {
    if (curTrack?.id === songData?.id) {
      togglePlayer();
    } else {
      playOneTrack(
        {
          ...songData,
          url: songData?.previewUrl,
          previewUrl: songData?.previewUrl,
        },
        data.id,
      );
    }
  };

  const mainContent = (
    <View style={[styles.largetStyleContent]}>
      <LinearGradient
        colors={['#00000090', 'rgba(0, 0, 0, 0.01)']}
        style={{
          position: 'absolute',
          height: 200,
          top: 0,
          left: 0,
          width: deviceWidth,
          opacity: 0.6,
        }}
      />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: -300,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <Text style={styles.textContent}>{data.text}</Text>
      </View>
    </View>
  );

  const renderMusicButton = () => {
    return (
      <>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 4,
            width: '100%',
            zIndex: 1,
            alignItems: 'center',
          }}
          onPress={() => firstAnimationForMusicPlayer()}>
          <Animatable.View
            ref={musicAnimationElement}
            style={{
              flexDirection: 'row',
              width: musicStyle === 0 ? '100%' : 271,
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
              borderRadius: 18,
              backgroundColor: musicStyle === 0 ? 'unset' : '#282828',
            }}>
            <Image
              source={{uri: songData.image}}
              style={styles.songImage}
              resizeMode="cover"
            />
            <SwipeReconizer
              config={swipeConfig}
              onSwipeLeft={onLeftPlayerSwipe}
              onSwipeRight={onRightPlayerSwipe}
              style={[StyleSheet.absoluteFill]}>
              <TouchableOpacity style={[StyleSheet.absoluteFill]} />
            </SwipeReconizer>
            <View style={styles.content}>
              <Text
                style={styles.songTitle}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {songData.title}
              </Text>
              <Text
                style={styles.description}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {songData?.artists?.length > 0 ? songData?.artists[0] : ''}
              </Text>
            </View>
            <PlayButton
              playingStatus={
                curTrack?.id === songData.id
                  ? playingStatus
                  : PlayingStatus.Pause
              }
              onClick={handlePlay}
              progressValue={curTrack?.id === songData.id ? trackProgress : 0}
            />
          </Animatable.View>
        </TouchableOpacity>
        {musicStyle === 2 && (
          <View style={styles.sideMusicButton}>
            {isOpenMusicPlayer ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: 230,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setIsOpenMusicPlayer(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FF6651',
                    padding: 11,
                    borderRadius: 32,
                  }}>
                  <CirclePlayIcon />
                </TouchableOpacity>
                <View style={{height: 40}}>
                  <Text style={{color: '#fff', fontSize: 10}}>
                    {songData.title}
                  </Text>
                  <Slider
                    maximumValue={
                      curTrack?.id === songData.id ? trackDuration : 0
                    }
                    value={curTrack?.id === songData.id ? trackPosition : 0}
                    onSlidingComplete={val => {
                      if (curTrack?.id === songData.id) {
                        seekTime(Math.round(val));
                      }
                    }}
                    minimumValue={0}
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                    thumbTintColor="transparent"
                    // thumbStyle={{width: 0}}
                    style={{
                      width: 130,
                      height: 8,
                      marginBottom: 4,
                      marginTop: 4,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{color: '#ffffff60', fontSize: 10}}>
                      00:00
                      {/* {convertTimeFormat(playbackPosition / 1000)} */}
                    </Text>
                    <Text style={{color: '#ffffff60', fontSize: 10}}>
                      04:20
                      {/* {convertTimeFormat(durations[0] / 1000)} */}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MusicDetails', songData);
                  }}
                  style={{
                    width: 24,
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 32,
                  }}>
                  <RightArrowIcon />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{width: 48}}>
                <TouchableOpacity
                  onPress={() => {
                    setIsOpenMusicPlayer(true);
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FF6651',
                    borderRadius: 32,
                  }}>
                  <MusicIcon />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </>
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

  const renderPlusButton = () => {
    return (
      <View style={styles.sidePlusButton}>
        <TouchableOpacity
          onPress={() => {
            dispatch(memoryAction.clearMediaData());
            dispatch(memoryAction.clearMediaUrl());
            navigation.navigate('AddMemoryPage', {songId: songData.id});
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

  const renderMainMediaView = () => {
    return (
      <View>
        {data.mediaTypes[0] === 'video' ? (
          <View>
            <Video
              ref={videoRef}
              source={{uri: data.mediaUrls[0]}}
              resizeMode={'cover'}
              paused={isStopVideo}
              onReadyForDisplay={() => {
                if (videoRef) {
                  setTimeout(() => {
                    setIsStopVideo(true);
                  }, 1000);
                }
              }}
              style={[
                {
                  width: '100%',
                  height: type === PostLayoutType.Large ? '100%' : 150,
                  borderRadius: type === PostLayoutType.Large ? 16 : 8,
                },
              ]}
            />
            {type === PostLayoutType.Large && mainContent}
          </View>
        ) : data.mediaTypes[0] === 'image' ? (
          <View style={{height: '100%'}}>
            <ScaledImage
              uri={data.mediaUrls[0]}
              width={type === PostLayoutType.Large ? deviceWidth : columnSize}
              minHeight={type === PostLayoutType.Large ? deviceHeight : 300}
              style={{borderRadius: type === PostLayoutType.Large ? 16 : 8}}
            />
            {type === PostLayoutType.Large && mainContent}
            {type === PostLayoutType.Large && (
              <SwipeReconizer
                config={swipeConfig}
                onSwipeLeft={onLeftHorizontalSwipe}
                onSwipeRight={onRightHorizontalSwipe}
                style={[StyleSheet.absoluteFill]}>
                <TouchableOpacity style={[StyleSheet.absoluteFill]} />
              </SwipeReconizer>
            )}
            {type === PostLayoutType.Large && renderMusicButton()}
            {type === PostLayoutType.Large && renderSmileButton()}
            {type === PostLayoutType.Large && renderPlusButton()}
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              minHeight: type === PostLayoutType.Large ? '100%' : 150,
              borderRadius: type === PostLayoutType.Large ? 16 : 8,
              backgroundColor: '#9214F5',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            {type === PostLayoutType.Large ? (
              mainContent
            ) : (
              <Text style={styles.text}>{data.text}</Text>
            )}
            {type === PostLayoutType.Large && (
              <SwipeReconizer
                config={swipeConfig}
                onSwipeLeft={onLeftHorizontalSwipe}
                onSwipeRight={onRightHorizontalSwipe}
                style={[StyleSheet.absoluteFill]}>
                <TouchableOpacity style={[StyleSheet.absoluteFill]} />
              </SwipeReconizer>
            )}

            {type === PostLayoutType.Large && renderMusicButton()}
            {type === PostLayoutType.Large && renderSmileButton()}
            {type === PostLayoutType.Large && renderPlusButton()}
          </View>
        )}
      </View>
    );
  };

  const renderExtraViewBg = () => {
    return (
      <>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.15)', '#000000']}
          style={{
            position: 'absolute',
            height: arrTaggedPerson.length > 0 ? 345 : 345,
            bottom: 0,
            left: 0,
            width: deviceWidth,
            borderRadius: 16,
          }}
        />
      </>
    );
  };

  const renderExtraView = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 196,
          minHeight: 150,
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
                  data.creatorInfo?.image
                    ? {uri: data.creatorInfo.image}
                    : defaultAvatar
                }
                style={styles.ownerImage}
              />
              <Text style={styles.ownerName}>{data.creatorInfo.name}</Text>
            </View>
            <Text style={styles.postName}>{data.text || data.caption}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {arrTaggedPerson.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    taggedActionRef.current?.present();
                    setTimeout(() => {
                      setIsOpenedTaggedSheet(true);
                    }, 200);
                  }}>
                  <MemeberGroup data={arrTaggedPerson} />
                </TouchableOpacity>
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
                      {data?.taggedUsers ? data?.taggedUsers.length : 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{flexDirection: 'row'}}>
                    <RepeatSmallIcon />
                    <Text style={{color: '#fff', fontSize: 10, marginLeft: 6}}>
                      {data?.commentsCount ? data?.commentsCount : 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleLikeMemory(data.id)}
                    style={{flexDirection: 'row'}}>
                    <SendSmallIcon />
                    <Text style={{color: '#fff', fontSize: 10, marginLeft: 6}}>
                      {data?.likes ? data?.likes : 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSaveMemory(data.id)}
                    style={{flexDirection: 'row'}}>
                    <BookmarkSmallIcon />
                    <Text style={{color: '#fff', fontSize: 10, marginLeft: 6}}>
                      {data?.saves ? data?.saves : 0}
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

  const renderCreateSlamBookSheet = () => {
    return (
      <BottomSheetModal
        ref={createSlamBookSheetRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginVertical: 0,
          width: 60,
          height: 2,
        }}
        snapPoints={snapPointsCreateSlamBook}
        keyboardBehavior={'interactive'}
        keyboardBlurBehavior="restore"
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSlambookBottomSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {top: 10, left: 34, right: 34}]}>
          <Text style={styles.createSlambookTxt}>Create Slambook</Text>
          <BottomSheetTextInput
            value={newSlambookTitle}
            onChangeText={text => setNewSlambookTitle(text)}
            maxLength={140}
            multiline={true}
            placeholder={showPlaceHolder ? 'Enter slambook title...' : ''}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={styles.createSlambookInput}
            onFocus={() => {
              setShowPlaceholder(false);
            }}
            onEndEditing={() => {
              setShowPlaceholder(true);
            }}
          />
          {isCreating ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={styles.publishBtn}
              onPress={_createSlamBook}>
              <Text style={styles.publishSlambookTxt}>Publish Slambook</Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetModal>
    );
  };

  const renderAddToSlambook = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 372,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 24,
            paddingVertical: 11,
            paddingHorizontal: 21,
          }}
          onPress={() => {
            setIsOpenedBottomSheet(true);
            slambookBottomSheetRef.current?.present();
          }}>
          <BookOpenIcon />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: '#fff',
              marginLeft: 8,
            }}>
            Add to Slambook
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleSlambookBottomSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedBottomSheet(false);
    } else {
      setIsOpenedBottomSheet(true);
    }
  }, []);

  const _createSlamBook = async () => {
    if (newSlambookTitle === '') return;

    setIsCreating(true);
    const res = await apiCreateSlamBook(newSlambookTitle, null, true);
    if (res.success) {
      setNewSlambookTitle('');
      createSlamBookSheetRef.current.close();
      reLoadOwnedSlambooks();
    }

    setIsCreating(false);
  };

  const renderSlambookBottomSheet = () => {
    return (
      <BottomSheetModal
        ref={slambookBottomSheetRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.34)',
          marginTop: 24,
        }}
        snapPoints={snapPointsBottomSheet}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSlambookBottomSheetChanges}>
        <View style={{paddingHorizontal: 24, flex: 1}}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={{fontSize: 22, fontWeight: '600', color: '#fff'}}>
              Add to Slambook
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#ffffff40',
                marginTop: 4,
              }}>
              Turn memories into laugh with your friends!
            </Text>
          </View>
          <BottomSheetScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                loadOwnedSlambooks();
              }
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 32,
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 160,
                  height: 160,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: '#ffffff40',
                  borderRadius: 16,
                  marginBottom: 32,
                }}
                onPress={() => {
                  createSlamBookSheetRef.current?.present();
                }}>
                {isCreating ? (
                  <ActivityIndicator />
                ) : (
                  <>
                    <PlusCircleIcon />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#ffffff60',
                        marginTop: 19,
                      }}>
                      Create New
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {arrSlambook && arrSlambook.length > 0 ? (
                arrSlambook.map((item, index) => {
                  if (index % 3 === 0) {
                    return (
                      <TouchableOpacity
                        style={{
                          width: 160,
                          height: 160,
                          marginBottom: 32,
                        }}
                        onPress={() =>
                          selectedSlambook && selectedSlambook.id === item.id
                            ? setSelectedSlambook(null)
                            : setSelectedSlambook(item)
                        }>
                        {selectedSlambook && selectedSlambook.id === item.id && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 50,
                              left: 54,
                              zIndex: 3,
                              shadowColor: '#f7600a',
                              elevation: 20,
                              shadowOpacity: 1,
                              shadowRadius: 30,
                            }}>
                            <View
                              style={{
                                backgroundColor: '#FF6651',
                                width: 49,
                                height: 49,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <CheckIcon />
                            </View>
                          </View>
                        )}
                        <View>
                          <Image
                            source={{
                              uri:
                                item?.images.length > 0
                                  ? item?.images[0]
                                  : mock_image_1,
                            }}
                            style={{
                              height: 29,
                              width: '100%',
                              borderRadius: 32,
                            }}
                            resizeMode="cover"
                          />
                          <Image
                            source={{
                              uri:
                                item?.images.length > 1
                                  ? item?.images[1]
                                  : item?.images.length > 0
                                  ? item?.images[0]
                                  : mock_image_2,
                            }}
                            style={{
                              height: 29,
                              width: '100%',
                              borderRadius: 32,
                              marginVertical: 8,
                            }}
                            resizeMode="cover"
                          />
                          <Image
                            source={{
                              uri:
                                item?.images.length > 2
                                  ? item?.images[2]
                                  : item?.images.length > 1
                                  ? item?.images[1]
                                  : item?.images.length > 1
                                  ? item?.images[0]
                                  : mock_image_3,
                            }}
                            style={{
                              height: 29,
                              width: '100%',
                              borderRadius: 32,
                            }}
                            resizeMode="cover"
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: '#fff',
                            marginLeft: 4,
                            marginTop: 16,
                          }}>
                          {item?.title}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 4,
                            marginLeft: 4,
                          }}>
                          <FollowersUserIcon />
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: '400',
                              color: '#ffffff90',
                              marginLeft: 4,
                            }}>
                            {`${item?.members} members`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else if (index % 3 === 1) {
                    return (
                      <TouchableOpacity
                        style={{
                          width: 160,
                          height: 160,
                          marginBottom: 32,
                        }}
                        onPress={() =>
                          selectedSlambook && selectedSlambook.id === item.id
                            ? setSelectedSlambook(null)
                            : setSelectedSlambook(item)
                        }>
                        {selectedSlambook && selectedSlambook.id === item.id && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 50,
                              left: 54,
                              zIndex: 3,
                              shadowColor: '#f7600a',
                              elevation: 20,
                              shadowOpacity: 1,
                              shadowRadius: 30,
                            }}>
                            <View
                              style={{
                                backgroundColor: '#FF6651',
                                width: 49,
                                height: 49,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <CheckIcon />
                            </View>
                          </View>
                        )}
                        <Image
                          source={{
                            uri:
                              item?.images.length > 0
                                ? item?.images[0]
                                : mock_image_1,
                          }}
                          style={{height: 29, width: '100%', borderRadius: 32}}
                          resizeMode="cover"
                        />
                        <View style={{flexDirection: 'row', marginTop: 8}}>
                          <Image
                            source={{
                              uri:
                                item?.images.length > 1
                                  ? item?.images[1]
                                  : item?.images.length > 0
                                  ? item?.images[0]
                                  : mock_image_2,
                            }}
                            style={{
                              height: 66,
                              width: '48%',
                              borderRadius: 32,
                              marginRight: 8,
                            }}
                            resizeMode="cover"
                          />
                          <Image
                            source={{
                              uri:
                                item?.images.length > 2
                                  ? item?.images[2]
                                  : item?.images.length > 1
                                  ? item?.images[1]
                                  : item?.images.length > 1
                                  ? item?.images[0]
                                  : mock_image_3,
                            }}
                            style={{
                              height: 66,
                              width: '48%',
                              borderRadius: 8,
                            }}
                            resizeMode="cover"
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: '#fff',
                            marginLeft: 4,
                            marginTop: 20,
                          }}>
                          {item?.title}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 4,
                            marginLeft: 4,
                          }}>
                          <FollowersUserIcon />
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: '400',
                              color: '#ffffff90',
                              marginLeft: 4,
                            }}>
                            {`${item?.members} members`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <TouchableOpacity
                        style={{
                          width: 160,
                          height: 160,
                          marginBottom: 32,
                        }}
                        onPress={() =>
                          selectedSlambook && selectedSlambook.id === item.id
                            ? setSelectedSlambook(null)
                            : setSelectedSlambook(item)
                        }>
                        {selectedSlambook && selectedSlambook.id === item.id && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 50,
                              left: 54,
                              zIndex: 3,
                              shadowColor: '#f7600a',
                              elevation: 20,
                              shadowOpacity: 1,
                              shadowRadius: 30,
                            }}>
                            <View
                              style={{
                                backgroundColor: '#FF6651',
                                width: 49,
                                height: 49,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <CheckIcon />
                            </View>
                          </View>
                        )}
                        <View style={{flexDirection: 'row'}}>
                          <View>
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 0
                                    ? item?.images[0]
                                    : mock_image_1,
                              }}
                              style={{
                                height: 66,
                                width: 66,
                                borderRadius: 32,
                                marginRight: 8,
                              }}
                              resizeMode="cover"
                            />
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 1
                                    ? item?.images[1]
                                    : item?.images.length > 0
                                    ? item?.images[0]
                                    : mock_image_2,
                              }}
                              style={{
                                height: 29,
                                width: 66,
                                borderRadius: 32,
                                marginTop: 8,
                              }}
                              resizeMode="cover"
                            />
                          </View>
                          <View style={{marginLeft: 8}}>
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 2
                                    ? item?.images[2]
                                    : item?.images.length > 1
                                    ? item?.images[1]
                                    : item?.images.length > 1
                                    ? item?.images[0]
                                    : mock_image_3,
                              }}
                              style={{
                                height: 29,
                                width: 66,
                                borderRadius: 32,
                              }}
                              resizeMode="cover"
                            />
                            <Image
                              source={{
                                uri:
                                  item?.images.length > 0
                                    ? item?.images[0]
                                    : mock_image_1,
                              }}
                              style={{
                                height: 66,
                                width: 66,
                                borderRadius: 8,
                                marginTop: 8,
                              }}
                              resizeMode="cover"
                            />
                          </View>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: '#fff',
                            marginLeft: 4,
                            marginTop: 20,
                          }}>
                          {item?.title}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 4,
                            marginLeft: 4,
                          }}>
                          <FollowersUserIcon />
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: '400',
                              color: '#ffffff90',
                              marginLeft: 4,
                            }}>
                            {`${item?.members} members`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })
              ) : loadingSlambook ? (
                <View
                  style={{width: '100%', alignItems: 'center', marginTop: 32}}>
                  <ActivityIndicator size="large" color="#777777" />
                </View>
              ) : (
                <></>
              )}
            </View>
          </BottomSheetScrollView>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 110,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1F1F1F',
            zIndex: 1,
          }}>
          <TouchableOpacity
            style={{
              height: 48,
              width: 320,
              backgroundColor: isEnabledAddToSlambook
                ? '#FF6651'
                : 'rgba(255, 255, 255, 0.1)',
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={!selectedSlambook}
            onPress={onAddToSlambook}>
            {loadingAddToSlambook ? (
              <View
                style={{width: '100%', alignItems: 'center', marginTop: 10}}>
                <ActivityIndicator size="large" color="#777777" />
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isEnabledAddToSlambook ? '#fff' : '#ffffff30',
                }}>
                Add to Slambook
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  };

  const renderSwitchToHome = () => {
    return (
      <View style={{position: 'absolute', top: 300, right: -4}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#010101',
            padding: 10,
            borderTopLeftRadius: 32,
            borderBottomLeftRadius: 32,
          }}
          onPress={() => {
            setCurFeedTab('Music');
            navigation.navigate('Music');
          }}>
          <SwipeReconizer
            config={swipeConfig}
            onSwipeLeft={onLeftSwitchSwipe}
            onSwipeRight={onRightSwitchSwipe}
            style={[StyleSheet.absoluteFill]}>
            <TouchableOpacity style={[StyleSheet.absoluteFill]} />
          </SwipeReconizer>
          <RefreshCircleIcon />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        padding: type === PostLayoutType.Large ? 0 : 5,
        width: '100%',
      }}>
      {renderMainMediaView()}
      {type === PostLayoutType.Large && renderSwitchToHome()}
      {type === PostLayoutType.Large && renderAddToSlambook()}
      {type === PostLayoutType.Large && renderExtraViewBg()}
      {type === PostLayoutType.Large && renderExtraView()}
      {type === PostLayoutType.Large && renderTaggedSheet()}
      {type === PostLayoutType.Large && renderCommentBottomSheet()}
      {type === PostLayoutType.Large && renderEmojiDetailDlg()}
      {type === PostLayoutType.Large && renderSlambookBottomSheet()}
      {type === PostLayoutType.Large && renderCreateSlamBookSheet()}
    </View>
  );
};

type FeedDirectCardProps = {
  slideIndex?: any;
  data: any;
  songData?: any;
  isPublic: Boolean;
  type: PostLayoutType;
  onClick?: Function;
  onSlideNext?: Function;
  onSlidePrev?: Function;
};

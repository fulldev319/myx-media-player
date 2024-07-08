import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'helper/utils';
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';

import {ArrowBack, SearchIcon} from 'assets/svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CardUser} from './cards/CardUser';
import CardSlamChat from './cards/CardSlamChat';
import {SlamBookInput} from './components/SlamBookChatInput';
import {apiGetTopicMember} from 'helper/slambookHelper';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {apiGetTopicComments} from 'helper/slambookHelper';
import {CommonSkeleton} from 'components/common/Skeleton';
import {socket} from 'screens/Auth';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {compressMedia} from 'helper/utils';

const SlamBookChatPage = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = useMemo(() => (user ? user.id : null), [user]);
  const scrollViewRef = React.useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [attachedMedia, setAttachedMedia] = useState([]);

  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [arrComments, setArrComments] = useState([]);

  const [arrMember, setArrMember] = useState([]);
  const [memberCount, setMemberCount] = useState(null);
  const [totalMemberCount, setTotalMemberCount] = useState(0);

  useEffect(() => {
    _loadMember();
    _loadComments();
  }, []);

  useEffect(() => {
    if (socket) {
      const newCommentTopicHandler = comment => {
        _loadLastComments(comment);
      };

      socket.on('new-comment-topic', newCommentTopicHandler);
      return () => {
        socket.removeListener('new-comment-topic', newCommentTopicHandler);
      };
    }
  }, [socket]);

  const onGoBack = () => {
    navigation.goBack();
  };

  const onSearch = () => {
    navigation.navigate('TopicSearchPage', {
      slambook: params.slambook,
      topic: params.topic,
    });
  };

  const onGoMemoryMedia = () => {
    navigation.navigate('TopicMemoryMediaPage', {
      slambook: params.slambook,
      topic: params.topic,
      title: params.title,
      memberCount: memberCount,
      bgColor1: params.bgColor1,
      bgColor2: params.bgColor2,
    });
  };

  const onAttachMedia = async (filePath, fileType) => {
    setIsLoading(true);
    let base64String;
    base64String = await compressMedia(fileType, filePath);
    base64String = await getBase64String(base64String);
    const fileMeta = await uploadFileToIPFS(base64String, fileType);
    if (!fileMeta) {
      return;
    }

    setIsLoading(false);

    const formatedMediaData = {
      type: fileType,
      url: fileMeta,
    };

    setAttachedMedia(prev => [...prev, ...[formatedMediaData]]);
  };

  const _loadMember = async () => {
    const res = await apiGetTopicMember(params.slambook, params.topic, null);

    if (res.success) {
      setArrMember(res.data);
      setMemberCount(res.topicMembers);
      setTotalMemberCount(res.slambookMembers);
    }
  };

  const _loadComments = async () => {
    if (!isLoadingComment && hasMore) {
      setIsLoadingComment(true);

      const res = await apiGetTopicComments(
        params.slambook,
        params.topic,
        4,
        lastId,
      );

      if (res.success) {
        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setArrComments(prev => [...res.data, ...prev]);
      }
      setIsLoadingComment(false);
    }
  };

  const _loadLastComments = comment => {
    console.log('log arrComments', arrComments);
    setArrComments(prev => [comment, ...prev]);
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToIndex({index: 0});
      }, 1000);
    }
  };

  const _sendComment = async (tags, planText) => {
    const arrMediaUrl = [];
    const arrMediaType = [];

    attachedMedia.forEach(media => {
      arrMediaUrl.push(media.url);
      arrMediaType.push(media.type);
    });

    setCommentText('');
    setAttachedMedia([]);

    if (socket && userId) {
      socket.emit('comment-topic', {
        userId: userId,
        slambook: params.slambook,
        topic: params.topic,
        message: planText,
        hashTags: tags,
        mediaTypes: arrMediaType,
        mediaUrls: arrMediaUrl,
        shareId: '',
        shareType: '',
      });

      _loadLastComments({
        from: {
          id: user.id,
          name: user.username,
          image: user.profileImage,
          handle: user.handle,
        },
        slambook: params.slambook,
        topic: params.topic,
        message: planText,
        hashTags: tags,
        mediaTypes: arrMediaType,
        mediaUrls: arrMediaUrl,
        shareId: '',
        shareType: '',
        createdAt: Date.now(),
      });
    }
  };

  const _sendAudioComment = fileUrl => {
    if (socket && userId) {
      socket.emit('comment-topic', {
        userId: userId,
        slambook: params.slambook,
        topic: params.topic,
        message: '',
        hashTags: [],
        mediaTypes: ['audio'],
        mediaUrls: [fileUrl],
        shareId: '',
        shareType: '',
      });

      _loadLastComments({
        from: {
          id: user.id,
          name: user.username,
          image: user.profileImage,
          handle: user.handle,
        },
        slambook: params.slambook,
        topic: params.topic,
        message: '',
        hashTags: '',
        mediaTypes: ['audio'],
        mediaUrls: [fileUrl],
        shareId: '',
        shareType: '',
        createdAt: Date.now(),
      });
    }
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.top} onPress={onGoMemoryMedia}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack}>
            <ArrowBack />
          </TouchableOpacity>
          <Text style={styles.headerTxt}>{params.title}</Text>
          <TouchableOpacity onPress={onSearch}>
            <SearchIcon isActive={false} isWhite={true} />
          </TouchableOpacity>
        </View>
        <Text style={styles.joinedTxt}>
          {memberCount ?? 0} of {totalMemberCount} joined
        </Text>
        {renderPeople()}
      </TouchableOpacity>
    );
  };

  const renderPeople = () => {
    return (
      <ScrollView
        horizontal
        style={styles.users}
        showsHorizontalScrollIndicator={false}>
        {arrMember.map((item, index) => (
          <CardUser
            user={item}
            isAction={false}
            key={index}
            onPress={() => {}}
            style={{marginStart: 8}}
          />
        ))}
      </ScrollView>
    );
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleScroll = e => {
    if (!isLoadingComment && isCloseToBottom(e.nativeEvent)) {
      _loadComments();
    }
  };

  const renderChatBody = () => {
    return (
      <View style={styles.chatBody}>
        {isLoadingComment && memberCount !== null && (
          <View style={{paddingBottom: 10}}>
            <CommonSkeleton />
          </View>
        )}
        <FlatList
          inverted
          data={arrComments}
          ref={scrollViewRef}
          renderItem={item => (
            <CardSlamChat
              data={item}
              slambook={params.slambook}
              topic={params.topic}
              key={`slam_chat_${item.id}`}
            />
          )}
          onScroll={handleScroll}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
        />
        <SlamBookInput
          text={commentText}
          attachedMedias={attachedMedia}
          onChangeText={setCommentText}
          onAttachMedia={onAttachMedia}
          onSend={_sendComment}
          onAudioSend={_sendAudioComment}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[params.bgColor1, params.bgColor2]}
        useAngle={true}
        angle={120}
        style={styles.topBackground}
      />
      {renderHeader()}
      {renderChatBody()}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Progress.Circle
            size={80}
            indeterminate={true}
            borderWidth={5}
            color={'rgba(255, 102, 81, 1)'}
            thickness={20}
          />
        </View>
      )}
    </View>
  );
};

export default SlamBookChatPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 60,
  },
  topBackground: {
    width: '100%',
    height: 200,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'red',
    borderBottomLeftRadius: SCREEN_WIDTH / 2,
    borderBottomRightRadius: SCREEN_WIDTH / 2,
    transform: [{scaleX: 5}],
  },
  header: {
    width: '100%',
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  top: {
    alignItems: 'center',
  },
  headerTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: 'white',
  },
  joinedTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
    marginTop: 10,
  },
  users: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  chatBody: {
    flex: 1,
    marginTop: 30,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const dummyMessages = [
  {
    id: 1,
    image:
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
    name: 'Edwin Adenike',
    created: '2 mins ago',
    text: 'Lorem ipsum dolor sit amet. Bestie Forever YoungAge',
    tags: ['Bestie', 'Forever', 'YoungAge'],
  },
  {
    id: 2,
    image:
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
    name: 'Edwin Adenike',
    created: '2 mins ago',
    text: 'Lorem ipsum dolor sit amet. Bestie Forever YoungAge',
    tags: ['Bestie', 'Forever', 'YoungAge'],
  },
];

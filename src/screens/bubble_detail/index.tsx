import {SCREEN_WIDTH, secondsToHms} from 'helper/utils';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {styles} from './index.styles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiGetGroupsBubble, apiGetGroupsPost} from 'helper/groupHelper';
import {BackIcon} from 'assets/svg';
import {CommentIcon} from 'screens/group_bubble/assets/CommentIcon';
import CreateNewPostsIcon from 'screens/group_bubble/assets/CreateNewPostsIcon';
import {CreateNewPostModal} from './components/CreateNewPostModal';
import {GroupsPost} from './components/GroupsPost';

const BubbleDetailPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {bubbleId, audioId} = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);

  const [bubble, setBubble] = useState(route.params?.bubble);
  const [groupPost, setGroupPost] = useState();

  useEffect(() => {
    loadGroupBubble();
  }, []);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      loadGroupsPost();
    });
    return focusHandler;
  }, [navigation]);

  const loadGroupBubble = async () => {
    const res = await apiGetGroupsBubble({bubble: bubbleId});
    if (res.success) {
      setBubble(res.data);
    }
  };

  const loadGroupsPost = async () => {
    const res = await apiGetGroupsPost({bubble: bubbleId, audio_id: audioId});
    if (res.success) {
      setGroupPost(res.data);
    }
  };

  const carouselScrollHorizontal = async idx => {
    setCurrentIndex(idx);
  };

  const onBack = () => {
    navigation.goBack();
  };

  const onChats = () => {
    navigation.navigate('ChatsScreen', {bubbleId: bubbleId});
  };

  const onAddEmolike = () => {
    navigation.navigate('EmolikePage', {debateId: audioId});
  };

  const renderTopHeader = () => {
    return (
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.titleTxt}>{bubble?.name}</Text>
        <TouchableOpacity onPress={onChats}>
          <CommentIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCreateNewPostBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => setVisibleModal(true)}
        style={styles.createBtn}>
        <CreateNewPostsIcon />
      </TouchableOpacity>
    );
  };

  const renderCreateNewPostModal = () => {
    if (!visibleModal) return;
    return (
      <CreateNewPostModal
        bubble={bubble}
        visible={visibleModal}
        hideModal={() => setVisibleModal(false)}
      />
    );
  };

  const renderDuration = () => {
    return (
      <Text style={styles.timeTitleTxt}>
        {bubble?.duration ? secondsToHms(bubble.duration) : ''}
      </Text>
    );
  };

  const renderCarousel = () => {
    if (!groupPost) return;
    const mediaTypes = groupPost?.media_types.split(',');
    return (
      <Carousel
        layout={'default'}
        data={mediaTypes}
        renderItem={(item, index) => (
          <GroupsPost
            bubbleId={bubbleId}
            data={groupPost}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            onAddEmolike={onAddEmolike}
          />
        )}
        sliderWidth={SCREEN_WIDTH}
        itemWidth={SCREEN_WIDTH}
        activeSlideAlignment={'center'}
        loop={true}
        onSnapToItem={carouselScrollHorizontal}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderTopHeader()}
      {renderDuration()}
      {renderCarousel()}
      {renderCreateNewPostBtn()}
      {renderCreateNewPostModal()}
    </View>
  );
};

export default BubbleDetailPage;

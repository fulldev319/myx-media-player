/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {StackScreenProps} from '@react-navigation/stack';
import {
  ArrowDownIcon,
  ArrwoUpIcon,
  DefaultRadioIcon,
  PlusWithoutBorderIcon,
  RoundCloseIcon,
  SelectedRadioIcon,
} from 'assets/svg';
import Video from 'react-native-video';
import {convertTimeFormat} from 'helper/utils';
import {MainStackParams} from 'navigators';
import React, {useRef, useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from 'react-native-animated-progress';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import FriendCard from './FriendCard';
import memoryAction from 'redux/memory/actions';
import appActions from 'redux/app/actions';
import {apiSubmitMemory} from 'helper/memoryHelpers';
import Collapsible from 'react-native-collapsible';
import {apiTrackGet} from 'helper/trackHelpers';
import {PlayButton} from 'screens/MusicPlayer/components/PlayButton';
import RedPlusIcon from 'assets/svg/RedPlusIcon';
import RedDustBinIcon from 'assets/svg/RedDustBinIcon';
import Carousel from 'react-native-snap-carousel';
import Theme from 'components/common/Theme';
import {PlayingStatus, useTracks} from 'contexts/TrackContext';

const MemorySubmitPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const memoryData = route.params!;
  const {songId, location} = memoryData[0];

  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {tagFriends} = useSelector((state: RootState) => state.memory);
  const {mediaData, mediaUrls} = useSelector(
    (state: RootState) => state.memory,
  );

  const {curTrack, playOneTrack, togglePlayer, playingStatus, trackProgress} =
    useTracks();

  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [arrLabel, setArrLabel] = useState([]);
  // const [showSubmitBtn, setShowSubmitBtn] = useState(true);
  const [songData, setSongData] = useState(null);

  const carouselRef = useRef(null);

  const [isShowPrivacy, setIsShowPrivacy] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState(0); // 0: Public, 1: Only for follower, 2: Only for mutual

  useEffect(() => {
    // add medias of memory to redux store
    memoryData.forEach(item => {
      const media = {
        id: Date.now(),
        ...item,
      };
      dispatch(memoryAction.addMediaData(media));
    });
  }, []);

  useEffect(() => {
    if (songId) {
      // get details of track
      getTrackData();
    }
  }, [songId]);

  const onClose = () => {
    navigation.pop();
  };

  const onAddTagFriends = () => {
    navigation.navigate('TagFriendsPage');
  };

  const onRemove = data => {
    dispatch(memoryAction.removeTagFriend(data));
  };

  const onSubmitMemory = async () => {
    setIsLoading(true);

    const labelArr = arrLabel;
    const arrTaggedId = tagFriends.map((item, _) => item.id);

    const mediaTypes = mediaUrls.map(item => item.mediaType);
    const mediaUris = mediaUrls.map(item => item.ipfsURL);
    const durations = mediaUrls.map(item =>
      item.mediaType === 'video' ? item.videoDuration : 0,
    );
    const formats = mediaUrls.map(item =>
      item.mediaType === 'video' ? 'mp4' : 'jpg',
    );

    const res = await apiSubmitMemory(
      selectedVisibility === 0
        ? 'public'
        : selectedVisibility === 1
        ? 'followers'
        : 'mutual',
      mediaTypes,
      mediaUris,
      durations,
      formats,
      labelArr,
      songId,
      user,
      caption,
      arrTaggedId,
      location,
    );

    if (res.success) {
      navigation.navigate('Feed');
      dispatch(appActions.setSnakeSuccessMessage('Memory upload successful!'));
      dispatch(memoryAction.clearMediaData());
      dispatch(memoryAction.clearMediaUrl());
    }

    setIsLoading(false);
  };

  const getTrackData = async () => {
    apiTrackGet(songId).then(res => {
      if (res.success) {
        setSongData(res.data);
      }
    });
  };

  const removeMediaOnMemory = media => {
    dispatch(memoryAction.removeMediaData(media));
  };

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
        songId,
      );
    }
  };

  const renderPrivacyVisibility = () => {
    return (
      <View style={styles.visiblilityView}>
        <View style={{paddingHorizontal: 8}}>
          <TouchableOpacity
            style={styles.visiblilityHeader}
            onPress={() => setIsShowPrivacy(!isShowPrivacy)}>
            <Text style={styles.visiblilityText}>Privacy visibility</Text>
            {!isShowPrivacy ? <ArrwoUpIcon /> : <ArrowDownIcon />}
          </TouchableOpacity>
        </View>

        <Collapsible collapsed={isShowPrivacy}>
          <View style={styles.visiblilityBody}>
            <TouchableOpacity
              style={
                selectedVisibility === 0
                  ? styles.selectedRadioContainer
                  : styles.defaultRadioContainer
              }
              onPress={() => setSelectedVisibility(0)}>
              <Text
                style={
                  selectedVisibility === 0
                    ? styles.selectedRadioText
                    : styles.defaultRadioText
                }>
                Public
              </Text>
              {selectedVisibility === 0 ? (
                <SelectedRadioIcon />
              ) : (
                <DefaultRadioIcon />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedVisibility === 1
                  ? styles.selectedRadioContainer
                  : styles.defaultRadioContainer
              }
              onPress={() => setSelectedVisibility(1)}>
              <Text
                style={
                  selectedVisibility === 1
                    ? styles.selectedRadioText
                    : styles.defaultRadioText
                }>
                Only for follower
              </Text>
              {selectedVisibility === 1 ? (
                <SelectedRadioIcon />
              ) : (
                <DefaultRadioIcon />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedVisibility === 2
                  ? styles.selectedRadioContainer
                  : styles.defaultRadioContainer
              }
              onPress={() => setSelectedVisibility(2)}>
              <Text
                style={
                  selectedVisibility === 2
                    ? styles.selectedRadioText
                    : styles.defaultRadioText
                }>
                Only for mutual
              </Text>
              {selectedVisibility === 2 ? (
                <SelectedRadioIcon />
              ) : (
                <DefaultRadioIcon />
              )}
            </TouchableOpacity>
          </View>
        </Collapsible>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <RoundCloseIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Add Memory</Text>
      </View>
      <View style={{paddingHorizontal: 24, marginTop: 32}}>
        <View style={styles.miniPlayer}>
          <Image
            source={{uri: songData && songData?.image ? songData?.image : ''}}
            style={styles.songImage}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text
              style={styles.songTitle}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {songData && songData.title ? songData.title : ''}
            </Text>
            <Text
              style={styles.description}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {songData && songData.artists ? songData.artists[0] : ''}
            </Text>
          </View>
          <PlayButton
            playingStatus={
              curTrack?.id === songData?.id
                ? playingStatus
                : PlayingStatus.Pause
            }
            onClick={handlePlay}
            progressValue={curTrack?.id === songData?.id ? trackProgress : 0}
          />
        </View>
      </View>
      <ScrollView style={styles.body}>
        <Carousel
          layout={'default'}
          ref={carouselRef}
          data={mediaData}
          renderItem={({item, index}) => (
            <View style={styles.editContainer} key={index}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  backgroundColor: 'rgba(1, 1, 1, 0.56)',
                  padding: 14,
                  zIndex: 1,
                  borderRadius: 32,
                }}
                onPress={() => removeMediaOnMemory(item)}>
                <RedDustBinIcon />
              </TouchableOpacity>
              {item.mediaType === 'video' && (
                <Video
                  source={{uri: item.videoUri}}
                  resizeMode={'cover'}
                  style={[StyleSheet.absoluteFill, {borderRadius: 37}]}
                />
              )}
              {item.mediaType === 'video' && (
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {convertTimeFormat(item.videoDuration)}
                  </Text>
                </View>
              )}
              {item.mediaType === 'image' && (
                <ImageBackground
                  source={{uri: item.videoUri}}
                  resizeMode="cover"
                  style={[StyleSheet.absoluteFill]}
                  borderRadius={37}
                />
              )}
              {item.mediaType === 'text' && (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: '#9747FF',
                      borderRadius: 37,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={styles.inputText}>{item.videoUri}</Text>
                </View>
              )}
              {item.mediaType === 'text' && (
                <View
                  style={{
                    position: 'absolute',
                    marginTop: 20,
                    marginStart: 20,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={{
                        uri:
                          user.image !== '' && user.image !== undefined
                            ? user.image
                            : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
                      }}
                      style={{width: 24, height: 24, borderRadius: 12}}
                    />
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        marginStart: 10,
                        maxWidth: 200,
                        color: 'white',
                      }}>
                      {user.username}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          sliderWidth={Theme.width}
          itemWidth={Theme.width - 50}
          loop={false}
          activeSlideAlignment={'center'}
          inactiveSlideScale={1}
          inactiveSlideShift={0}
          onSnapToItem={() => {}}
        />
        <TouchableOpacity
          style={{
            marginTop: 30,
            paddingHorizontal: 30,
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: 40,
              borderStyle: 'dashed',
              borderColor: '#FF6651',
              borderWidth: 1,
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onClose}>
            <RedPlusIcon />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.captionContainer}>
          <Text style={styles.captionTitle}>Caption</Text>
          <TextInput
            style={styles.captionContent}
            value={caption}
            maxLength={32}
            onChangeText={text => setCaption(text)}
            // onFocus={() => {
            //   setShowSubmitBtn(false);
            // }}
            // onEndEditing={() => {
            //   setShowSubmitBtn(true);
            // }}
            placeholder="Add caption here..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
          />
        </View>
        <View style={styles.tagFriendsContainer}>
          <View style={styles.tagFriendsHeader}>
            <Text style={styles.taggedFriendsText}>Tagged Friends</Text>
            <TouchableOpacity
              style={styles.taggedFriendAdd}
              onPress={onAddTagFriends}>
              <PlusWithoutBorderIcon />
              <Text style={styles.taggedFriendAddText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tagFriendList}>
          {tagFriends &&
            tagFriends.map((item, index) => {
              return (
                <FriendCard
                  data={item}
                  isDeletable={true}
                  onAdd={() => {}}
                  onRemove={data => {
                    onRemove(data);
                  }}
                  isSelected={tagFriends.includes(index)}
                />
              );
            })}
        </View>
        {renderPrivacyVisibility()}
      </ScrollView>
      <View style={styles.btnContainer}>
        {mediaData.length === mediaUrls.length ? (
          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={onSubmitMemory}
            disabled={mediaData.length !== mediaUrls.length}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#ff3f3f', '#ff701f']}
              style={[
                StyleSheet.absoluteFill,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 27,
                },
              ]}>
              <Text style={styles.buttonText}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={{marginTop: 0}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.waitText}>Please Wait...</Text>
          <View style={{width: '80%', marginTop: 20}}>
            <ProgressBar
              height={3}
              indeterminate
              backgroundColor="rgba(255, 255, 255, 1)"
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default MemorySubmitPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    marginTop: 36,
    marginHorizontal: 26,
  },
  title: {
    position: 'absolute',
    left: 50,
    right: 50,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  body: {
    flex: 1,
    marginTop: 24,
  },
  editContainer: {
    width: '90%',
    height: 272,
    marginStart: '5%',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btnSubmit: {
    width: '100%',
    height: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 27,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },

  inputText: {
    fontSize: 21,
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    textAlign: 'center',
  },
  timeContainer: {
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(1, 1, 1, 0.56)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  timeText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1, 1, 1, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  captionContainer: {
    marginHorizontal: 30,
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  captionTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  captionContent: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  tagFriendsContainer: {
    marginHorizontal: 30,
    marginTop: 30,
  },
  tagFriendsHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  taggedFriendsText: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  taggedFriendAdd: {
    width: 100,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#060606',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taggedFriendAddText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
    marginStart: 10,
  },
  tagFriendList: {
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  visiblilityView: {
    marginHorizontal: 20,
    marginBottom: 100,
  },
  visiblilityHeader: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  visiblilityText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    color: '#FFFFFF',
  },
  visiblilityBody: {
    width: '100%',
    backgroundColor: '#060606',
    borderRadius: 8,
    padding: 10,
  },
  defaultRadioContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  selectedRadioContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 102, 81, 0.15)',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(255, 102, 81, 0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  defaultRadioText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
  },
  selectedRadioText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    color: '#FF6651',
  },
  miniPlayer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  content: {
    paddingHorizontal: 12,
    flex: 1,
  },
  songTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
  },
  description: {
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
});

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {BackIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';
import LinearGradient from 'react-native-linear-gradient';
import {getDefaultAvatar} from 'helper/userHelpers';
import {MemeberGroup} from 'components/memberGroup';
import {BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {
  PlusWithoutBorderIcon,
  SmallGrayMusicIcon,
  WhiteMicIcon,
} from 'assets/svg';
import TileIcon from 'assets/svg/TileIcon';
import ListIcon from 'assets/svg/ListIcon';

import {useRoute} from '@react-navigation/native';
import {
  apiCreateTopic,
  apiGetTopics,
  apiGetSlamBookDetail,
  apiGetSlambookMemory,
  apiUpdateSlamBookTopic,
  apiCreateRoom,
} from 'helper/slambookHelper';
import {MemoryCard} from 'components/cards/MemoryCard';
import {PostLayoutType} from 'helper/constants';
import Topics from './Topics';
import {SCREEN_WIDTH} from 'helper/utils';
import {StartVocieRoom} from 'components/voice_room/start_voice_room';
import {VoiceRoom} from 'components/voice_room/voice_room';
import {ScheduleVoiceRoom} from 'components/voice_room/schedule_voice_room';
import {SuccessSchedule} from 'components/voice_room/success_schedule_room';
import Svg, {Path, Rect} from 'react-native-svg';

const colors = [
  ['#FFB185', '#A52412'],
  ['#EDD8FD', '#9214F5'],
  ['#FFCCE5', '#FF67B2'],
  ['#62F9CB', '#08B883'],
];

enum ViewType {
  Tile,
  List,
}

const SlamBookDetailPage = ({route, navigation}) => {
  const {params} = useRoute<any>();

  const [title, setTitle] = useState('');
  const [creatorImage, setCreatorImage] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [createdMedia, setCreatedMedia] = useState([]);
  const [arrMember, setArrMember] = useState([]);

  const [text, setText] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [arrTopic, setArrTopic] = useState([]);

  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const createNewTopicRef = useRef<BottomSheetModal>(null);
  const snapPointsAddTopic = useMemo(() => [350, 350], []);
  const [showPlaceHolder, setShowPlaceholder] = useState(true);

  const [memoryList, setMemoryList] = useState([]);
  const [lastIdMemory, setLastIdMemory] = useState(undefined);
  const [hasMoreMemory, setHasMoreMemory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState(ViewType.Tile);

  const [topicMaxPosX, setTopicMaxPosX] = useState(0);
  const [topicMaxPosY, setTopicMaxPosY] = useState(0);

  const [showStartVoiceRoom, setShowStartVoiceRoom] = useState(false);
  const [showVoiceRoom, setShowVoiceRoom] = useState(false);
  const [showScheduleRoom, setShowScheduleRoom] = useState(false);
  const [showSuccessSchedule, setShowSuccessSchedule] = useState(false);

  const [roomName, setRoomName] = useState('');
  const [roomToken, setRoomToken] = useState('');
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    loadDetail();
    loadTopicData();
    loadMemoryData();
  }, []);

  const loadDetail = async () => {
    const res = await apiGetSlamBookDetail(params.id);

    if (res.success) {
      setTitle(res.data.title);
      setCreatorImage(res.data.creator.image);
      setCreatorName(res.data.creator.name);
      setCreatedMedia(res.data.images);
      setRoomData(res.data.room);
      setArrMember(res.data.memberInfo);
    }
  };

  const initTopicData = async () => {
    setTimeout(async () => {
      const res = await apiGetTopics(params.id, null);
      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrTopic(res.data);
      }
    }, 1000);
  };

  const loadTopicData = async () => {
    if (!isLoading && hasMore) {
      const res = await apiGetTopics(params.id, lastId);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrTopic(prev => [...prev, ...res.data]);
      }
    }
  };

  const loadMemoryData = async () => {
    if (!isLoading && hasMoreMemory) {
      const res = await apiGetSlambookMemory(params.id, lastIdMemory);
      if (res.success) {
        setHasMoreMemory(res.hasMore);
        setLastIdMemory(res.lastId);
        setMemoryList(prev => [...prev, ...res.data]);
      }
    }
  };

  const handleSheetChanges = useCallback((index: number) => {}, []);

  const _closeSheet = () => {
    createNewTopicRef.current?.close();
  };

  const _createTopic = async () => {
    if (text === '') return;

    const newPosX = SCREEN_WIDTH / 2 - 25;
    const newPosY = topicMaxPosY + 50;

    setIsCreating(true);
    const res = await apiCreateTopic(
      text,
      params.id,
      newPosX < 50 ? 100 : newPosX,
      newPosY < 50 ? 100 : newPosY,
    );
    if (res.success) {
      setText('');
      setShowPlaceholder(true);
      initTopicData();
      _closeSheet();
    }

    setIsCreating(false);
  };

  const _updateTopicData = async newTopicData => {
    let toId = 0;
    const updatedPositions = newTopicData.map((topic, _) => {
      toId = topic.ranking;
      const position1 = topic.position
        ? topic.position[0]
        : topic.coordinates[0];
      const position2 = topic.position
        ? topic.position[1]
        : topic.coordinates[1];
      return {
        id: topic.id,
        title: topic.title,
        coordinates: [position1, position2],
        radius: topic.radius,
        ranking: topic.ranking,
        image: topic.image || '',
      };
    });
    const data = {
      slambook: params.id,
      from: 0,
      to: toId,
      positions: updatedPositions,
    };

    await apiUpdateSlamBookTopic(data);
    await initTopicData();
  };

  const getMainImage = () => {
    if (createdMedia.length == 0) {
      return 'https://thumbs.dreamstime.com/b/forest-panorama-rays-sunlight-scenic-fresh-green-deciduous-trees-sun-casting-its-light-foliage-53826213.jpg';
    } else {
      return createdMedia[0];
    }
  };

  const getExtraImage1 = () => {
    if (createdMedia.length == 0) {
      return 'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg';
    } else if (createdMedia.length == 1) {
      return createdMedia[0];
    } else {
      return createdMedia[1];
    }
  };

  const getExtraImage2 = () => {
    if (createdMedia.length == 0) {
      return 'https://thumbs.dreamstime.com/b/forest-path-panorama-25795025.jpg';
    } else if (createdMedia.length == 1) {
      return createdMedia[0];
    } else if (createdMedia.length == 2) {
      return createdMedia[1];
    } else {
      return createdMedia[2];
    }
  };

  const getExtraImage3 = () => {
    if (createdMedia.length == 0) {
      return 'https://thumbs.dreamstime.com/b/summer-sunny-forest-trees-green-grass-nature-wood-sunlight-background-instant-toned-image-53353502.jpg';
    } else if (createdMedia.length == 1) {
      return createdMedia[0];
    } else if (createdMedia.length == 2) {
      return createdMedia[1];
    } else if (createdMedia.length == 3) {
      return createdMedia[2];
    } else {
      return createdMedia[3];
    }
  };

  const getExtraImage4 = () => {
    if (createdMedia.length == 0) {
      return 'https://thumbs.dreamstime.com/b/panoramic-autumn-landscape-forest-stream-fall-nature-backg-sunny-day-background-79856609.jpg';
    } else if (createdMedia.length == 1) {
      return createdMedia[0];
    } else if (createdMedia.length == 2) {
      return createdMedia[1];
    } else if (createdMedia.length == 3) {
      return createdMedia[2];
    } else if (createdMedia.length == 4) {
      return createdMedia[3];
    } else {
      return createdMedia[4];
    }
  };

  const onAddNewTopic = () => {
    createNewTopicRef.current?.present();
  };

  const onBack = () => {
    navigation.goBack();
  };

  const onAddTagFriends = () => {
    navigation.navigate('SlamBookMembersPage', {slambook: params.id});
  };

  const onGoToStartConversation = (topicId, topicTitle, bgColor1, bgColor2) => {
    navigation.navigate('SlamBookChatPage', {
      slambook: params.id,
      topic: topicId,
      title: topicTitle,
      bgColor1,
      bgColor2,
    });
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <BackIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewMemoryBtn}
          onPress={() => setShowStartVoiceRoom(true)}>
          <WhiteMicIcon />
          <Text style={styles.viewMemoryTxt}>Start Voice Room</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTopMediaView = () => {
    return (
      <View style={styles.mediaView}>
        <View style={styles.mainMediaView}>
          <Image
            source={{
              uri: getMainImage(),
            }}
            resizeMode={'cover'}
            style={[StyleSheet.absoluteFill, {borderTopLeftRadius: 12}]}
          />
        </View>
        <View style={styles.extraMediaView}>
          <View style={styles.extraRow}>
            <View style={styles.extraColumn}>
              <Image
                source={{
                  uri: getExtraImage1(),
                }}
                resizeMode={'cover'}
                style={[StyleSheet.absoluteFill]}
              />
            </View>
            <View style={styles.extraColumn}>
              <Image
                source={{
                  uri: getExtraImage2(),
                }}
                resizeMode={'cover'}
                style={[StyleSheet.absoluteFill, {borderTopRightRadius: 12}]}
              />
            </View>
          </View>
          <View style={styles.extraRow}>
            <View style={styles.extraColumn}>
              <Image
                source={{
                  uri: getExtraImage3(),
                }}
                resizeMode={'cover'}
                style={[StyleSheet.absoluteFill]}
              />
            </View>
            <View style={styles.extraColumn}>
              <Image
                source={{
                  uri: getExtraImage4(),
                }}
                resizeMode={'cover'}
                style={[StyleSheet.absoluteFill]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderMaskView = () => {
    return (
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0,1)']}
        style={styles.bgMask}
      />
    );
  };

  const renderInfoView = () => {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{title}</Text>
        <View style={styles.infoDetail}>
          <Image
            source={
              creatorImage === '' ? getDefaultAvatar() : {uri: creatorImage}
            }
            style={styles.infoCreatorImage}
          />
          <Text style={styles.infoCreatorName}>{creatorName}</Text>
          <Text style={styles.infoPlus} onPress={onAddTagFriends}>
            +
          </Text>
          {arrMember.length > 0 && (
            <TouchableOpacity onPress={onAddTagFriends}>
              <MemeberGroup data={arrMember} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.musicInfo}>
          <SmallGrayMusicIcon />
          <Text style={styles.musicName}>Bad Habit - Ed Sheeran</Text>
        </View>
        {roomData && renderVoiceRoomInfo()}
      </View>
    );
  };

  const renderEmptyView = () => {
    return (
      <View style={styles.emptyView}>
        <Image source={require('assets/images/disabled_topic.png')} />
        <Text style={styles.emptyText}>
          No topic yet. Add new{'\n'}topic now!
        </Text>
      </View>
    );
  };

  const renderAddNewButton = () => {
    return (
      <TouchableOpacity
        style={styles.plusButtonContainer}
        onPress={onAddNewTopic}>
        <LinearGradient
          colors={['#FF3F3F', '#FF701F']}
          useAngle={true}
          angle={120}
          style={styles.plusButton}>
          <PlusWithoutBorderIcon />
          <Text style={styles.plusButtonTxt}>Add new Topic</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    return (
      <View style={StyleSheet.absoluteFill}>
        {renderHeader()}
        {renderInfoView()}
        {renderTab()}
        {selectedTab == 0 && (
          <Topics
            id={params.id}
            arrTopic={arrTopic}
            onUpdate={_updateTopicData}
            onUpdateMaxPosX={setTopicMaxPosX}
            onUpdateMaxPosY={setTopicMaxPosY}
          />
        )}
        {selectedTab == 1 && renderMemories()}
      </View>
    );
  };

  const renderAddTopicSheet = () => {
    return (
      <BottomSheetModal
        ref={createNewTopicRef}
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
        snapPoints={snapPointsAddTopic}
        keyboardBehavior={'interactive'}
        keyboardBlurBehavior="restore"
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {top: 10, left: 34, right: 34}]}>
          <Text style={styles.addNewTopicTxt}>Add New Topic</Text>
          <BottomSheetTextInput
            value={text}
            onChangeText={text => setText(text)}
            maxLength={140}
            multiline={true}
            placeholder={showPlaceHolder ? 'Enter topic title here...' : ''}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={styles.addTopicInput}
            onFocus={() => {
              setShowPlaceholder(false);
            }}
            onEndEditing={() => {
              setShowPlaceholder(true);
            }}
          />
          <View style={styles.tipContainer}>
            <Text style={styles.tipsTitle}>💡 Tips on writing topics</Text>
            <View style={styles.tipsItemRow}>
              <View style={styles.tipsItemNumber}>
                <Text style={styles.tipsItemNumberTxt}>1</Text>
              </View>
              <Text style={styles.tipsItemTxt}>
                Et nibh lacus hendrerit porttitor eu orci.
              </Text>
            </View>
            <View style={styles.tipsItemRow}>
              <View style={styles.tipsItemNumber}>
                <Text style={styles.tipsItemNumberTxt}>2</Text>
              </View>
              <Text style={styles.tipsItemTxt}>
                Ultrices turpis magnis pellentesque.
              </Text>
            </View>
            <View style={styles.tipsItemRow}>
              <View style={styles.tipsItemNumber}>
                <Text style={styles.tipsItemNumberTxt}>3</Text>
              </View>
              <Text style={styles.tipsItemTxt}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque felis mus.
              </Text>
            </View>
          </View>
          {isCreating ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity style={styles.addTopicBtn} onPress={_createTopic}>
              <Text style={styles.addTopicTxt}>Add Topic</Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetModal>
    );
  };

  const renderTab = () => {
    return (
      <View style={styles.tabView}>
        <TouchableOpacity
          style={styles.tabViewItem}
          onPress={() => setSelectedTab(0)}>
          <Text
            style={
              selectedTab == 0
                ? styles.selectedTabViewItemText
                : styles.defaultTabViewItemText
            }>
            Topics
          </Text>
          {selectedTab == 0 && <View style={styles.tabViewIndicator}></View>}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabViewItem}
          onPress={() => setSelectedTab(1)}>
          <Text
            style={
              selectedTab == 1
                ? styles.selectedTabViewItemText
                : styles.defaultTabViewItemText
            }>
            Memories
          </Text>
          {selectedTab == 1 && <View style={styles.tabViewIndicator}></View>}
        </TouchableOpacity>
      </View>
    );
  };

  const getColors = index => {
    return colors[index % colors.length];
  };

  const firstCol = useMemo(
    () => arrTopic.filter((feed, index) => index % 2 === 0),
    [arrTopic],
  );

  const renderTopics = () => {
    return (
      <View style={{paddingBottom: 100}}>
        {firstCol.map((item, index) => {
          const newIndex1 = index * 2;
          const newIndex2 = index * 2 + 1;

          const color1 = getColors(newIndex1);
          const color2 = getColors(newIndex2);
          return (
            <View style={styles.topicRow} key={`topic-row-${index}`}>
              <View
                style={[
                  styles.topicColumn,
                  {paddingStart: 30, paddingEnd: 15},
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    onGoToStartConversation(
                      item.id,
                      item.title,
                      color1[1],
                      color1[0],
                    );
                  }}
                  style={{width: '100%'}}>
                  <LinearGradient
                    colors={[color1[1], color1[0]]}
                    useAngle={true}
                    angle={120}
                    style={styles.topicBubble}>
                    <Text style={styles.topicBubbleText}>{item.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              {arrTopic[newIndex2] ? (
                <View
                  style={[
                    styles.topicColumn,
                    {paddingStart: 15, paddingEnd: 30},
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      onGoToStartConversation(
                        arrTopic[newIndex2].id,
                        arrTopic[newIndex2].title,
                        color2[1],
                        color2[0],
                      );
                    }}
                    style={{
                      width: '100%',
                    }}>
                    <LinearGradient
                      colors={[color2[1], color2[0]]}
                      start={{x: 0.3, y: 0.3}}
                      useAngle={true}
                      angle={120}
                      style={styles.topicBubble}>
                      <Text style={styles.topicBubbleText}>
                        {arrTopic[newIndex2].title}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.topicColumn} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const firstColMemory = useMemo(
    () => memoryList.filter((memory, index) => index % 2 === 0),
    [memoryList],
  );
  const secondColMemory = useMemo(
    () => memoryList.filter((memory, index) => index % 2 === 1),
    [memoryList],
  );

  const onDetail = itemData => {
    navigation.navigate('FeedDetailPage', {feedId: itemData.id});
  };

  const onCreateRoom = async roomName => {
    const nowTime = new Date();
    const data = {
      title: roomName,
      slambook: params.id,
      startTime: nowTime.getTime(),
    };

    console.log(data);
    return;
    const res = await apiCreateRoom(data);

    if (res.success) {
      setShowStartVoiceRoom(false);
      setRoomName(roomName);
      setRoomToken(res.rtcToken);

      setTimeout(() => {
        setShowVoiceRoom(true);
      }, 500);
    }
  };

  const onScheduleRoom = async (roomName, time) => {
    const data = {
      title: roomName,
      slambook: params.id,
      startTime: time,
    };

    const res = await apiCreateRoom(data);
    if (res.success) {
      setShowScheduleRoom(false);

      setTimeout(() => {
        setShowSuccessSchedule(true);
      }, 500);
    }
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleScroll = e => {
    if (!loading && isCloseToBottom(e.nativeEvent)) {
      // getCreatedMemories();
    }
  };

  const renderMemories = () => {
    return (
      <View style={styles.memoyContainer}>
        <View style={styles.memoryHeading}>
          <Text style={styles.memoryCaption}>{memoryList.length} memories</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => setViewType(ViewType.Tile)}
              style={{marginRight: 8}}>
              <TileIcon clicked={viewType === ViewType.Tile} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewType(ViewType.List)}>
              <ListIcon clicked={viewType === ViewType.List} />
            </TouchableOpacity>
          </View>
        </View>
        {viewType === ViewType.Tile ? (
          <View style={styles.postLayoutSecond}>
            <View style={{flex: 1, marginRight: 16}}>
              {firstColMemory.map(item => (
                <MemoryCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                  onClicked={() => onDetail(item)}
                />
              ))}
            </View>
            <View style={{flex: 1}}>
              {secondColMemory.map(item => (
                <MemoryCard
                  type={PostLayoutType.Small}
                  data={item}
                  key={item.id}
                  onClicked={() => onDetail(item)}
                />
              ))}
            </View>
          </View>
        ) : (
          <View>
            {memoryList.map(item => (
              <MemoryCard
                type={PostLayoutType.Large}
                data={item}
                key={item.id}
                onClicked={() => onDetail(item)}
              />
            ))}
          </View>
        )}
        {loading && (
          <View style={{marginTop: 16}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </View>
    );
  };

  const renderStartVoiceRoomSheet = () => {
    return (
      <StartVocieRoom
        show={showStartVoiceRoom}
        slambookId={params.id}
        onCreate={roomName => onCreateRoom(roomName)}
        onSchedule={() => {
          setShowStartVoiceRoom(false);

          setTimeout(() => {
            setShowScheduleRoom(true);
          }, 500);
        }}
        onClose={() => setShowStartVoiceRoom(false)}
      />
    );
  };

  const renderVoiceRoomSheet = () => {
    return (
      <VoiceRoom
        show={showVoiceRoom}
        slambookId={params.id}
        roomName={roomName}
        roomToken={roomToken}
        onClose={() => setShowVoiceRoom(false)}
      />
    );
  };

  const renderSuccessScheduleSheet = () => {
    return (
      <SuccessSchedule
        show={showSuccessSchedule}
        onClose={() => setShowSuccessSchedule(false)}
      />
    );
  };

  const renderScheduleRoomSheet = () => {
    return (
      <ScheduleVoiceRoom
        show={showScheduleRoom}
        onCreate={(roomName, time) => {
          onScheduleRoom(roomName, time);
        }}
        onClose={() => setShowScheduleRoom(false)}
      />
    );
  };

  const renderVoiceRoomInfo = () => {
    return (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 24,
          marginTop: 22,
        }}>
        <LinearGradient
          colors={['rgba(255, 63, 63, 0.8)', 'rgba(255, 112, 31, 0.76)']}
          useAngle={true}
          angle={108}
          style={styles.voiceRoomInfoContainer}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <RadioIcon />
            <View style={{marginStart: 10}}>
              <Text style={styles.txtRoomTitle}>{roomData.title}</Text>
              <Text style={styles.txtRoomTime}>
                {`${new Date(roomData.startTime).toDateString()}, ${new Date(
                  roomData.startTime,
                ).toLocaleTimeString()}`}
              </Text>
            </View>
          </View>
          <Text style={styles.txtJoinRSVP}>Join RSVP</Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderTopMediaView()}
      {renderMaskView()}
      {renderBody()}
      {firstCol.length === 0 && renderEmptyView()}
      {selectedTab == 0 && renderAddNewButton()}
      {renderAddTopicSheet()}
      {renderStartVoiceRoomSheet()}
      {renderVoiceRoomSheet()}
      {renderScheduleRoomSheet()}
      {renderSuccessScheduleSheet()}
    </View>
  );
};

export default SlamBookDetailPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  body: {},
  voiceRoomInfoContainer: {
    width: '100%',
    height: 50,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  txtRoomTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    color: 'white',
  },
  txtRoomTime: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'white',
  },
  txtJoinRSVP: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 10,
    color: 'white',
    marginEnd: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 70,
    paddingHorizontal: 24,
  },
  viewMemoryBtn: {
    height: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMemoryTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'white',
    marginStart: 6,
  },
  mediaView: {
    width: '100%',
    height: 230,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  mainMediaView: {
    flex: 0.45,
  },
  extraMediaView: {
    flex: 0.55,
  },
  extraRow: {
    flex: 1,
    height: '50%',
    flexDirection: 'row',
  },
  extraColumn: {
    flex: 1,
    height: '100%',
  },
  bgMask: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 230,
  },
  infoContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  infoTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 28,
    color: '#FFFFFF',
  },
  infoDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoCreatorImage: {
    width: 22,
    height: 22,
    borderRadius: 22,
  },
  infoCreatorName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    marginStart: 8,
  },
  infoPlus: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 8,
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  musicName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    marginStart: 8,
  },
  emptyView: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
  plusButtonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 170,
    height: 48,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  plusButtonTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    marginStart: 10,
  },
  addNewTopicTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
  addTopicInput: {
    width: '100%',
    height: 50,
    fontSize: 20,
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  addTopicBtn: {
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTopicTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  tipContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    marginBottom: 24,
  },
  tipsTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  tipsItemRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  tipsItemNumber: {
    width: 16,
    height: 16,
    backgroundColor: '#FF6651',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsItemNumberTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 8,
    fontWeight: '500',
    color: 'white',
  },
  tipsItemTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginStart: 8,
  },
  tabView: {
    width: '100%',
    height: 35,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 20,
  },
  tabViewItem: {
    flex: 1,
    alignItems: 'center',
  },
  defaultTabViewItemText: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  selectedTabViewItemText: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  tabViewIndicator: {
    width: '80%',
    height: 3,
    backgroundColor: '#FF6651',
    marginBottom: -2,
  },
  topicRow: {width: '100%', flexDirection: 'row', marginTop: 20},
  topicColumn: {
    flex: 1,
    alignItems: 'center',
  },
  topicBubble: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicBubbleText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  memoryRoot: {
    paddingHorizontal: 28,
  },
  memoyContainer: {
    display: 'flex',
    paddingHorizontal: 28,
    marginBottom: 100,
  },
  postLayoutFirst: {
    flexDirection: 'row',
  },
  postLayoutSecond: {
    flexDirection: 'row',
  },
  memoryHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  memoryCaption: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

const RadioIcon = props => (
  <Svg width="32" height="33" fill="none" viewBox="0 0 32 33">
    <Rect
      width="32"
      height="32"
      y="0.5"
      fill="#fff"
      fillOpacity="0.2"
      rx="16"></Rect>
    <Path
      fill="#fff"
      d="M16 18.501a2.667 2.667 0 002.667-2.666v-4a2.667 2.667 0 10-5.334 0v4A2.667 2.667 0 0016 18.5zm-1.333-6.666a1.333 1.333 0 012.666 0v4a1.333 1.333 0 11-2.666 0v-4zm6.666 4a.667.667 0 10-1.333 0 4 4 0 01-8 0 .667.667 0 00-1.333 0 5.333 5.333 0 004.666 5.286v1.38H14a.666.666 0 100 1.334h4a.667.667 0 000-1.334h-1.333v-1.38a5.334 5.334 0 004.666-5.286z"></Path>
  </Svg>
);

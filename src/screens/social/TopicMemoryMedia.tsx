import {useNavigation, useRoute} from '@react-navigation/native';
import {BoldDetailVerticalIcon} from 'assets/svg';
import {SCREEN_WIDTH} from 'helper/utils';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {BackIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';
import TileIcon from 'assets/svg/TileIcon';
import ListIcon from 'assets/svg/ListIcon';
import {MemoryCard} from 'components/cards/MemoryCard';
import {CardTopicMedia} from './cards/CardTopicMedia';
import {PostLayoutType} from 'helper/constants';
import {apiGetTopicMedia, apiGetTopicMemory} from 'helper/slambookHelper';
import {CommonSkeleton} from 'components/common/Skeleton';

enum ViewType {
  Tile,
  List,
}

const TopicMemoryMediaPage = () => {
  const navigation = useNavigation();
  const {params} = useRoute();

  const [selectedTab, setSelectedTab] = useState(0);
  const [viewType, setViewType] = useState(ViewType.Tile);

  const [memoryList, setMemoryList] = useState([]);
  const [lastIdMemory, setLastIdMemory] = useState(undefined);
  const [hasMoreMemory, setHasMoreMemory] = useState(true);
  const [isLoadingMemory, setIsLoadingMemory] = useState(false);

  const [arrMedia, setArrMedia] = useState([]);
  const [lastIdMedia, setLastIdMedia] = useState(undefined);
  const [hasMoreMedia, setHasMoreMedia] = useState(true);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  useEffect(() => {
    loadMemories();
    loadMedias();
  }, []);

  const loadMemories = async () => {
    if (!isLoadingMemory && hasMoreMemory) {
      setIsLoadingMemory(true);

      const res = await apiGetTopicMemory(
        params.slambook,
        params.topic,
        lastIdMemory,
      );

      if (res.success) {
        setLastIdMemory(res.lastId);
        setHasMoreMemory(res.hasMore);
        setMemoryList(prev => [...prev, ...res.data]);
      }

      setIsLoadingMemory(false);
    }
  };

  const loadMedias = async () => {
    if (!isLoadingMedia && hasMoreMedia) {
      setIsLoadingMedia(true);

      const res = await apiGetTopicMedia(
        params.slambook,
        params.topic,
        lastIdMedia,
      );

      if (res.success) {
        setLastIdMedia(res.lastId);
        setHasMoreMedia(res.hasMore);
        setArrMedia(prev => [...prev, ...res.data]);
      }

      setIsLoadingMedia(false);
    }
  };

  const onBack = () => {
    navigation.goBack();
  };

  const onDetail = itemData => {
    navigation.navigate('FeedDetailPage', {feedId: itemData.id});
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <BackIcon />
        </TouchableOpacity>
        <TouchableOpacity>
          <BoldDetailVerticalIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderInfo = () => {
    return (
      <View>
        <Text style={styles.infoTitle}>{params.title}</Text>
        <Text style={styles.infoMember}>{params.memberCount} members</Text>
      </View>
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
            Memories
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
            Media
          </Text>
          {selectedTab == 1 && <View style={styles.tabViewIndicator}></View>}
        </TouchableOpacity>
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

  const renderMemoriesBody = () => {
    return (
      <ScrollView
        style={styles.memoyContainer}
        contentContainerStyle={{paddingBottom: 100}}>
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
        {isLoadingMemory && <CommonSkeleton />}
      </ScrollView>
    );
  };

  const firstColMedia = useMemo(
    () => arrMedia.filter((_, index) => index % 2 === 0),
    [arrMedia],
  );
  const secondColMedia = useMemo(
    () => arrMedia.filter((_, index) => index % 2 === 1),
    [arrMedia],
  );

  const renderMediaBody = () => {
    return (
      <ScrollView
        style={styles.memoyContainer}
        contentContainerStyle={{paddingBottom: 100}}>
        <View style={styles.postLayoutSecond}>
          <View style={{flex: 1, marginRight: 16}}>
            {firstColMedia.map(item => (
              <CardTopicMedia
                type={PostLayoutType.Small}
                data={item}
                key={item.id}
                onClicked={() => onDetail(item)}
              />
            ))}
          </View>
          <View style={{flex: 1}}>
            {secondColMedia.map(item => (
              <CardTopicMedia
                type={PostLayoutType.Small}
                data={item}
                key={item.id}
                onClicked={() => onDetail(item)}
              />
            ))}
          </View>
        </View>
        {isLoadingMedia && <CommonSkeleton />}
      </ScrollView>
    );
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[params.bgColor1, params.bgColor2]}
        useAngle={true}
        angle={120}
        style={{
          width: '100%',
          height: 270,
          position: 'absolute',
          top: 0,
          left: 0,
          transform: [{scaleX: 5}],
        }}
      />
      <View style={[styles.topView]}>
        {renderHeader()}
        {renderInfo()}
        {renderTab()}
      </View>
      <View style={styles.body}>
        {selectedTab === 0 ? renderMemoriesBody() : renderMediaBody()}
      </View>
    </View>
  );
};

export default TopicMemoryMediaPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topView: {
    height: 270,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
  },
  infoMember: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
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
    color: 'rgba(255, 255, 255, 0.6)',
  },
  selectedTabViewItemText: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  tabViewIndicator: {
    width: SCREEN_WIDTH / 2 - 26,
    height: 3,
    backgroundColor: '#FFFFFF',
    marginBottom: -2,
  },
  body: {
    flex: 1,
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
  memoyContainer: {
    display: 'flex',
    paddingHorizontal: 28,
    marginTop: 20,
  },
  postLayoutFirst: {
    flexDirection: 'row',
  },
  postLayoutSecond: {
    flexDirection: 'row',
  },
});

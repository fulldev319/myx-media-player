import {useNavigation} from '@react-navigation/native';
import {MemoryCard} from 'components/cards/MemoryCard';
import {SubPageHeader} from 'components/header/SubPageHeader';
import {PostLayoutType} from 'helper/constants';
import {apiGetCreatedMemories, getDefaultAvatar} from 'helper/userHelpers';
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {DetailMusicCard} from './cards/DetailMusicCard';

const ChatPersonDetail = ({route}) => {
  const navigation = useNavigation();
  const userData = route.params;

  const [selectedTab, setSelectedTab] = useState(0); // 0: Musics, 1: Media
  const [arrMusic, setArrMusic] = useState(dummyMusicData);
  const [arrMedia, setArrMedia] = useState([]);

  const [lastId, setLastId] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCreatedMemories();
  }, []);

  const getCreatedMemories = () => {
    if (!hasMore || loading) {
      return;
    }
    setLoading(true);
    apiGetCreatedMemories({
      userId: userData.userData.id,
      lastId: lastId,
      mediaType: 'all',
    })
      .then(res => {
        if (res.success) {
          setArrMedia(prev => [...prev, ...res.data]);
          setHasMore(res.hasMore);
          setLastId(res.lastId);
        } else {
          setHasMore(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderTab = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab(0)}>
          <View style={styles.tabTopView}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === 0 ? '#FF6651' : 'rgba(255, 255, 255, 0.4)',
                },
              ]}>
              Musics
            </Text>
          </View>
          <View
            style={
              selectedTab === 0
                ? styles.tabSelectedtBorder
                : styles.tabDefaultBorder
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(1);
          }}>
          <View style={styles.tabTopView}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === 1 ? '#FF6651' : 'rgba(255, 255, 255, 0.4)',
                },
              ]}>
              Media
            </Text>
          </View>
          <View
            style={
              selectedTab === 1
                ? styles.tabSelectedtBorder
                : styles.tabDefaultBorder
            }></View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMusicContent = () => {
    return (
      <View style={styles.tabContentContainer}>
        {arrMusic.map((item, index) => {
          return (
            <View style={styles.musicItem}>
              <Text style={styles.musicDayTxt}>{item.day}</Text>
              <FlatList
                data={item.data}
                renderItem={itemData => {
                  return (
                    <DetailMusicCard
                      data={itemData}
                      togglePlay={() => {}}
                      key={`all_track_${itemData.index}`}
                    />
                  );
                }}
                keyExtractor={(item, index) =>
                  `recentRelease-${item?.id}-${index}`
                }
              />
            </View>
          );
        })}
      </View>
    );
  };

  const firstCol = useMemo(
    () => arrMedia.filter((memory, index) => index % 2 === 0),
    [arrMedia],
  );
  const secondCol = useMemo(
    () => arrMedia.filter((memory, index) => index % 2 === 1),
    [arrMedia],
  );

  const renderMediaContent = () => {
    return (
      <View style={styles.tabContentContainer}>
        <View style={styles.postLayoutSecond}>
          <View style={{flex: 1, marginRight: 16}}>
            {firstCol.map(item => (
              <MemoryCard
                type={PostLayoutType.Small}
                data={item}
                key={item.id}
              />
            ))}
          </View>
          <View style={{flex: 1}}>
            {secondCol.map(item => (
              <MemoryCard
                type={PostLayoutType.Small}
                data={item}
                key={item.id}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, paddingTop: 60}}>
          <Image
            source={require('./../../assets/images/bg_top_chat.png')}
            style={styles.backgroundImage}
            resizeMode={'stretch'}
          />
          <SubPageHeader label="" navigation={navigation} />
          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Image
                source={
                  userData.userData.image !== ''
                    ? {uri: userData.userData.image}
                    : getDefaultAvatar()
                }
                style={styles.avatar}
                resizeMode="cover"
              />
              <View style={styles.detail}>
                <Text
                  style={styles.name}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {userData.userData.name}
                </Text>
                <View style={styles.status}>
                  <Text style={styles.activeTxt}>Active Now</Text>
                </View>
              </View>
            </View>
            <Text
              style={styles.viewProfileTxt}
              onPress={() =>
                navigation.navigate('OtherProfilePage', {
                  userId: userData.userData.id,
                })
              }>
              View Profile
            </Text>
          </View>
          <View style={styles.content}>
            {renderTab()}
            {selectedTab == 0 ? renderMusicContent() : renderMediaContent()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChatPersonDetail;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 500,
  },
  infoContainer: {
    flexDirection: 'row',
    marginHorizontal: 30,
    marginTop: 30,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginEnd: 16,
  },
  detail: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  status: {
    marginTop: 2,
  },
  activeTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#1D8662',
  },
  inactiveTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  viewProfileTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FF6651',
  },
  content: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 35,
  },
  tabContainer: {height: 60, flexDirection: 'row'},
  tab: {flex: 1, alignItems: 'center'},
  tabTopView: {flexDirection: 'row', alignItems: 'center'},
  tabText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    marginStart: 10,
  },
  tabDefaultBorder: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 16,
  },
  tabSelectedtBorder: {
    width: '100%',
    height: 3,
    backgroundColor: '#FF6651',
    marginTop: 14,
  },
  tabContentContainer: {
    flex: 1,
  },
  musicDayTxt: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 16,
  },
  musicItem: {
    marginBottom: 30,
  },
  postLayoutSecond: {
    flexDirection: 'row',
  },
});

const dummyMusicData = [
  {
    day: '19 May 2021',
    data: [
      {
        artists: [Array],
        duration: 239.232,
        id: '0B5NFyHi0F9SPyd1A0En9m',
        image:
          'https://i.scdn.co/image/ab67616d0000b27375f06af1addcdc9b3ab42d4e',
        title: 'Mamisonga',
      },
      {
        artists: [Array],
        duration: 197.615,
        id: '0TCBdNuZ1E4kJ8Pjiz1HYh',
        image:
          'https://i.scdn.co/image/ab67616d0000b27323fbb38c7d1445ee80345e83',
        title: '1,2,3',
      },
      {
        artists: [Array],
        duration: 297.826,
        id: '0gSC8xShIhRliLUxOFNLoU',
        image:
          'https://i.scdn.co/image/ab67616d0000b273cc4efd795964f48015b53e38',
        title: 'Una Semana (feat. Guelo Star)',
      },
      {
        artists: [Array],
        duration: 276.104,
        id: '0me2m6elK3NLTZ33Wxp9uu',
        image:
          'https://i.scdn.co/image/ab67616d0000b2737bdf5a1b72549ba0a4562819',
        title: 'La pared 720',
      },
    ],
  },
  {
    day: '18 May 2021',
    data: [
      {
        artists: [Array],
        duration: 239.232,
        id: '0B5NFyHi0F9SPyd1A0En9m',
        image:
          'https://i.scdn.co/image/ab67616d0000b27375f06af1addcdc9b3ab42d4e',
        title: 'Mamisonga',
      },
      {
        artists: [Array],
        duration: 197.615,
        id: '0TCBdNuZ1E4kJ8Pjiz1HYh',
        image:
          'https://i.scdn.co/image/ab67616d0000b27323fbb38c7d1445ee80345e83',
        title: '1,2,3',
      },
      {
        artists: [Array],
        duration: 297.826,
        id: '0gSC8xShIhRliLUxOFNLoU',
        image:
          'https://i.scdn.co/image/ab67616d0000b273cc4efd795964f48015b53e38',
        title: 'Una Semana (feat. Guelo Star)',
      },
      {
        artists: [Array],
        duration: 276.104,
        id: '0me2m6elK3NLTZ33Wxp9uu',
        image:
          'https://i.scdn.co/image/ab67616d0000b2737bdf5a1b72549ba0a4562819',
        title: 'La pared 720',
      },
    ],
  },
];

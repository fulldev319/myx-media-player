import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';
import {DarkBorderBackIcon, SearchIcon} from 'assets/svg';
import {MusicCard} from 'components/cards/MusicCard';
import Svg, {Path} from 'react-native-svg';
import {AddToPlayList} from 'screens/MusicPlayer/components/AddToPlayList';
import {useTracks} from 'contexts/TrackContext';
import {MiniMusicPlayer} from 'screens/MusicPlayer/MiniMusicPlayer';

export const MagicMatchPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const [arrMusic, setArrMusic] = useState([]);
  const [showAddToPlayList, setShowAddToPlayList] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [playListId, setPlayListId] = useState('');

  const {curTrack, showPlayer} = useTracks();

  useEffect(() => {
    if (route.params?.tracks) {
      setArrMusic(route.params?.tracks);
    }
  }, [route.params]);

  if (arrMusic.length < 1) {
    return null;
  }

  const onAddMemory = () => {
    navigation.navigate('AddMemoryPage', {songId: arrMusic[0].id});
  };

  const renderPlayList = () => {
    return (
      <AddToPlayList
        isOpenedSheet={showAddToPlayList}
        onCloseSheet={() => {
          setShowAddToPlayList(false);
        }}
        onSuccess={_playListId => {
          setShowMessage(true);
          setPlayListId(_playListId);
        }}
      />
    );
  };

  return (
    <View style={styles.root}>
      <Image
        source={require('./../../assets/images/trending_bg.png')}
        style={styles.backgroundImage}
        resizeMode={'stretch'}
      />
      <Image
        source={require('./../../assets/images/trending_light_bg.png')}
        style={styles.backgroundLight}
        resizeMode={'stretch'}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <DarkBorderBackIcon />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Top Match</Text>
      <View style={styles.topMatch}>
        <MusicCard data={{item: arrMusic[0]}} />
        <View style={styles.divider} />
        <View style={styles.actions}>
          <TouchableOpacity onPress={onAddMemory}>
            <View style={styles.actionContainer}>
              <PlusIcon />
              <Text style={styles.action}>Add Memory</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowAddToPlayList(true);
            }}>
            <View style={styles.actionContainer}>
              <PlusIcon />
              <Text style={styles.action}>Save for later</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subTitle}>Other Match Music</Text>
      {arrMusic.length > 1 && (
        <ScrollView style={styles.musicList}>
          <FlatList
            data={arrMusic.slice(1)}
            renderItem={itemData => {
              return <MusicCard data={itemData} key={itemData.index} />;
            }}
            keyExtractor={(item, index) => `music-${item?.id}-${index}`}
          />
        </ScrollView>
      )}
      <TouchableOpacity
        style={{marginVertical: 32}}
        onPress={() => navigation.goBack()}>
        <View style={styles.actionContainer}>
          <SearchIcon isActive={false} />
          <Text style={styles.action}>
            Didnt find any match? Search Manually
          </Text>
        </View>
      </TouchableOpacity>
      {renderPlayList()}
      {curTrack && showPlayer && (
        <View style={styles.miniPlayer}>
          <MiniMusicPlayer />
        </View>
      )}
    </View>
  );
};

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
    height: 450,
  },
  backgroundLight: {position: 'absolute', top: 0, right: 0, height: 450},
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
    padding: 8,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 16,
  },
  musicList: {
    padding: 24,
    flex: 1,
  },
  topMatch: {
    backgroundColor: '#FF6651',
    padding: 24,
    marginVertical: 16,
    marginHorizontal: 24,
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'column',
  },
  action: {
    fontSize: 12,
    marginLeft: 4,
    color: '#FFFFFF',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: -10,
    width: '100%',
  },
});

const PlusIcon = props => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.7087 8.54858C14.1917 8.54858 14.5837 8.94058 14.5837 9.42358V12.8217L17.9862 12.822C18.4692 12.822 18.8612 13.214 18.8612 13.697C18.8612 14.18 18.4692 14.572 17.9862 14.572L14.5837 14.5717V17.9718C14.5837 18.4548 14.1917 18.8467 13.7087 18.8467C13.2257 18.8467 12.8337 18.4548 12.8337 17.9718V14.5717L9.43107 14.572C8.94691 14.572 8.55607 14.18 8.55607 13.697C8.55607 13.214 8.94691 12.822 9.43107 12.822L12.8337 12.8217V9.42358C12.8337 8.94058 13.2257 8.54858 13.7087 8.54858Z"
      fill="white"
    />
  </Svg>
);

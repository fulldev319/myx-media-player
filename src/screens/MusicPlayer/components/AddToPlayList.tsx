import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {PlaylistCard} from 'components/cards/PlaylistCard';
import {useTracks} from 'contexts/TrackContext';
import {apiAddTrackToPlayList, apiGetOwnedPlayList} from 'helper/trackHelpers';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

export const AddToPlayList = ({isOpenedSheet, onCloseSheet, onSuccess}) => {
  const {user} = useSelector((state: RootState) => state.auth);

  const [playList, setPlayList] = useState([]);
  const [lastId, setLastId] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const {curTrack} = useTracks();

  const getOwnPlaylists = (refresh = false) => {
    if (!refresh && (!hasMore || loading)) {
      return;
    }
    setLoading(true);

    apiGetOwnedPlayList(user.id, refresh ? undefined : lastId)
      .then(res => {
        if (res.success) {
          if (refresh) {
            setPlayList(res.data);
          } else {
            setPlayList(prev => [...prev, ...res.data]);
          }
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

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleScroll = e => {
    if (!loading && isCloseToBottom(e.nativeEvent)) {
      getOwnPlaylists();
    }
  };

  useEffect(() => {
    getOwnPlaylists(true);
  }, []);

  const sheetRef = useRef<BottomSheetModal>();

  const onChange = (index: number) => {
    if (index === -1) {
      onCloseSheet();
    }
  };

  const addToPlaylist = playListId => {
    apiAddTrackToPlayList(curTrack?.id, playListId).then(res => {
      if (res.success) {
        onSuccess(playListId);
        onCloseSheet();
      }
    });
  };

  useEffect(() => {
    if (isOpenedSheet) {
      sheetRef.current.present();
    } else {
      sheetRef.current.close();
    }
  }, [isOpenedSheet]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
      snapPoints={[500]}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      onChange={onChange}>
      <View style={styles.container}>
        <Text style={styles.title}>Add to Playlist</Text>
        <View style={styles.scrollContainer}>
          <ScrollView onScroll={handleScroll} scrollEventThrottle={400}>
            {playList.length > 0 &&
              playList.map((item, index) => (
                <TouchableOpacity
                  key={`playlist-${item.id}`}
                  style={{marginVertical: 12}}
                  onPress={() => {
                    addToPlaylist(item.id);
                  }}>
                  <PlaylistCard key={index} item={item} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
        {loading && (
          <View style={{paddingVertical: 20}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#1F1F1F',
    borderRadius: 45,
    marginHorizontal: 0,
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    marginTop: 40,
    width: 48,
  },
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
});

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {PlayListItem} from './PlayListItem';
import appAction from 'redux/app/actions';
import {apiGetOwnedPlayList, apiRemovePlayList} from 'helper/trackHelpers';
import {useIsFocused} from '@react-navigation/native';

export const PlayListTab = ({isSelf, onAddPlaylist = null, userInfo}) => {
  const isFocused = useIsFocused();
  const [playList, setPlayList] = useState([]);
  const [lastId, setLastId] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const showAddPlayListDialog = () => {
    dispatch(appAction.showAddPlayListDialog());
  };

  const showEditPlayListDialog = playlist => {
    dispatch(appAction.showEditPlayListDialog(playlist));
  };

  const getOwnPlaylists = (refresh = false) => {
    if (!refresh && (!hasMore || loading)) {
      return;
    }
    setLoading(true);

    apiGetOwnedPlayList(userInfo.id, refresh ? undefined : lastId)
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

  useEffect(() => {
    getOwnPlaylists(true);
  }, [isFocused]);

  const onDelete = playlistId => {
    apiRemovePlayList(playlistId).then(res => {
      if (res.success) {
        const _playList = playList.filter(p => p.id !== playlistId);
        setPlayList(_playList);
      }
    });
  };

  const onEdit = playlist => {
    showEditPlayListDialog(playlist);
  };

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {!isSelf ? `${userInfo.username}'s` : 'My'} Playlists
        </Text>
        {isSelf && (
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => {
              onAddPlaylist && onAddPlaylist();
            }}>
            <Text style={styles.createBtnTxt}>+ Create</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView onScroll={handleScroll} scrollEventThrottle={400}>
        <View style={styles.container}>
          {playList.length > 0 &&
            playList.map((item, index) => (
              <PlayListItem
                key={index}
                item={item}
                onDelete={() => onDelete(item.id)}
                onEdit={() => onEdit(item)}
              />
            ))}
        </View>
        {loading && (
          <View style={{paddingVertical: 20}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: 20,
  },
  container: {
    display: 'flex',
    paddingBottom: 20,
  },
  titleContainer: {
    height: 34,
    paddingHorizontal: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 20,
    color: '#FFFFFF',
  },
  createBtn: {
    paddingHorizontal: 16,
    height: 34,
    backgroundColor: '#FFFFFF',
    borderRadius: 53,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#010101',
  },
});

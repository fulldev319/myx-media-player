import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';

import HttpClient from './../../../../helper/apiClient';
import {styles} from './index.styles';
import {RootState} from 'redux/interfaces';
import {getURLfromCID, processSongUrl} from 'helper/utils';
import {SongItem} from 'components/cards/SongItem';

import shareActions from 'redux/share/actions';
import addToPlaylistActions from 'redux/addplaylist/actions';
import {getLikedSongsLocal, saveLikedSongsLocal} from 'helper/userHelpers';

export const LikedSongPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const {width} = Dimensions.get('window');
  const size = (width - 60) / 2;

  const {user} = useSelector((state: RootState) => state.auth);

  const [likedSongs, setLikedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLocalSongs();
  }, []);

  useEffect(() => {
    saveToLocal();
  }, [likedSongs]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLocalSongs();
    });
    return unsubscribe;
  }, [navigation]);

  const loadLocalSongs = async () => {
    const savedSongs = await getLikedSongsLocal();

    if (savedSongs) {
      setLikedSongs(savedSongs);
    }

    await getSongList();
  };

  const saveToLocal = async () => {
    if (likedSongs.length > 0) {
      await saveLikedSongsLocal(likedSongs);
    }
  };

  const getSongList = async () => {
    setIsLoading(true);

    const response = await HttpClient.getWithToken(
      `/musicDao/getPlayerLikedSongs`,
      {
        userId: user.id,
      },
    );

    const shareResponse = await HttpClient.getWithToken(
      `/musicDao/getSharedItems`,
      {userId: user.id},
    );

    if (response.data.success) {
      let a = response.data.data;

      if (a.songs && a.songs.length > 0) {
        let d = 0;
        let duration = '';
        for (let i = 0; i < a.songs?.length; i++) {
          const s = a.songs[i];
          if (s?.AnimationUrl || s.AnimationURL || s.AnimationUrl)
            a.songs[i].url = processSongUrl(s);
          else if (s?.newFileCID && s?.metadata?.properties?.name)
            a.songs[i].url = `${getURLfromCID(s.newFileCID)}/${
              s.metadata.properties.name
            }`;
          else a.songs[i].url = '';

          if (s?.Duration || s?.duration) {
            s.mediaDuration = s?.Duration ?? Number(s?.duration);
            a.songs[i].mediaDuration = s?.Duration ?? Number(s?.duration);
          } else if (s?.metadata?.properties?.duration) {
            s.mediaDuration = s?.metadata?.properties?.duration;
            a.songs[i].mediaDuration = s?.metadata?.properties?.duration;
          } else {
            s.mediaDuration = 0;
            a.songs[i].mediaDuration = 0;
          }

          a.songs[i].ImageUrl = a.songs[i].Image;
          if (s.mediaDuration) {
            d = d + s.mediaDuration;
          }
        }
        if (d > 0) {
          let hrs = Math.floor(d / 3600);
          let min = Math.floor((d % 3600) / 60);
          let seg = Math.floor(d % 60);
          duration = `${hrs && hrs > 0 ? `${hrs} hrs ` : ''}${min ?? 0} min ${
            seg ? seg.toFixed(0) : 0
          } seg`;
        } else {
          duration = `0 hrs 0 min 0 seg`;
        }
      }
      setLikedSongs(a.songs);
    }

    if (shareResponse.data.success) {
      let a = shareResponse.data.data;

      if (a.songs && a.songs.length > 0) {
        let d = 0;
        let duration = '';
        for (let i = 0; i < a.songs?.length; i++) {
          const s = a.songs[i];
          if (s?.AnimationUrl || s.AnimationURL || s.AnimationUrl)
            a.songs[i].url = processSongUrl(s);
          else if (s?.newFileCID && s?.metadata?.properties?.name)
            a.songs[i].url = `${getURLfromCID(s.newFileCID)}/${
              s.metadata.properties.name
            }`;
          else a.songs[i].url = '';

          if (s?.Duration || s?.duration) {
            s.mediaDuration = s?.Duration ?? Number(s?.duration);
            a.songs[i].mediaDuration = s?.Duration ?? Number(s?.duration);
          } else if (s?.metadata?.properties?.duration) {
            s.mediaDuration = s?.metadata?.properties?.duration;
            a.songs[i].mediaDuration = s?.metadata?.properties?.duration;
          } else {
            s.mediaDuration = 0;
            a.songs[i].mediaDuration = 0;
          }

          a.songs[i].ImageUrl = a.songs[i].Image;
          if (s.mediaDuration) {
            d = d + s.mediaDuration;
          }
        }
        if (d > 0) {
          let hrs = Math.floor(d / 3600);
          let min = Math.floor((d % 3600) / 60);
          let seg = Math.floor(d % 60);
          duration = `${hrs && hrs > 0 ? `${hrs} hrs ` : ''}${min ?? 0} min ${
            seg ? seg.toFixed(0) : 0
          } seg`;
        } else {
          duration = `0 hrs 0 min 0 seg`;
        }

        setLikedSongs(prev => [...prev, ...a.songs]);
      }
    }

    setIsLoading(false);
  };

  const onShareSong = itemData => {
    dispatch(
      shareActions.showShareDialog({
        type: 'song',
        id: itemData.id || itemData.songId || itemData.Id,
        name:
          itemData.Title || itemData.title || itemData.name || itemData.Name,
      }),
    );
  };

  const onAddToPlaylistSong = itemData => {
    dispatch(addToPlaylistActions.showDialog(itemData));
  };

  return (
    <View style={styles.root}>
      <ScrollView>
        <View style={styles.subContainer}>
          {likedSongs.map((itemData, index) => (
            <SongItem
              key={index}
              data={itemData}
              playEvent={() => {}}
              onShare={onShareSong}
              onAddToPlaylist={onAddToPlaylistSong}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

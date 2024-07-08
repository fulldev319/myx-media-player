import {useNavigation} from '@react-navigation/native';
import {
  MUSIC_BRANCH,
  PlayingStatus,
  Track,
  TrackRepeatMode,
  useTracks,
} from 'contexts/TrackContext';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import MyChatItem from './MyChatItem';
import OtherChatItem from './OtherChatItem';

const ChatItem = ({item, otherUser, navigation}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    playOneTrack,
    playSharedTrack,
    stopSharedTrack,
    clearTracks,
    curTrack,
    playingStatus,
  } = useTracks();

  const onPlayTrack = async (trackInfo: Track, method) => {
    clearTracks();
    if (
      playingStatus === PlayingStatus.Playing &&
      curTrack.id === `${item.track.id}-${item.id}`
    ) {
      stopSharedTrack();
    } else {
      if (method === 'normal') {
        // play track without mini player
        playOneTrack(trackInfo, item.id);
      } else {
        // play track with full player
        playOneTrack(trackInfo, item.id);
        navigation.navigate('FullMusicPlayer');
      }
    }
  };

  return (
    <>
      {item.from === user.id ? (
        <MyChatItem
          item={item}
          onPlayTrack={onPlayTrack}
          key={`chat-item-my-${item?.created}-${item?.from}`}
        />
      ) : (
        <OtherChatItem
          item={item}
          onPlayTrack={onPlayTrack}
          otherUser={otherUser}
          key={`chat-item-other-${item?.created}-${item?.from}`}
        />
      )}
    </>
  );
};

export default React.memo(ChatItem);

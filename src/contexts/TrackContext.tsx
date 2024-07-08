import {useToast} from 'native-base';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
// import Sound from 'react-native-sound';
import {socket} from 'screens/Auth';
import {useAuth} from './AuthContext';
import TrackPlayer, {
  Event,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  State as PlayerState,
  RepeatMode as PlayerRepeatMode,
} from 'react-native-track-player';
import uuid from 'react-native-uuid';
import {SetupService} from 'service/TrackPlayerSerivce';
import {Platform} from 'react-native';
import {useSpotifyContext} from './SpotifyContext';
import {RepeatMode as SpotifyRepeatMode} from 'react-native-spotify-remote';
import {eventStopTrackListen, eventTrackListening} from 'helper/socketHelper';

export enum MUSIC_BRANCH {
  TRENED_MUSIC = 'trend_music',
  RECENT_RELEASE = 'recent_release',
  TOP_TRACKS = 'top_tracks',
  SEARCH_TRACKS = 'search_tracks',
  SELECT_TRACK = 'select_track',
  SAVED_TRACK = 'saved_track',
  MAP_RADIO_TRACK = 'map_radio_track',
  SHARED_TRACK = 'shared_track',
}

type TracksContextType = {
  playTrackList: (
    tracks: Track[],
    startTrackId?: string,
    playlistId?: string,
    showPlayer?: boolean,
  ) => void;
  playlistId: string;
  playTrack: (track: Track, showPlayer?: boolean) => void;
  playOneTrack: (track: Track, chatId, showPlayer?: boolean) => void;
  playSharedTrack: () => void;
  stopSharedTrack: () => void;
  clearTracks: () => void;
  showPlayer: boolean;

  setPlayerTheme: (newTheme: PlayerTheme) => void;
  theme: PlayerTheme;

  curTrack: PlayerTrack;
  trackProgress: number;

  repeatMode: TrackRepeatMode;
  setRepeatMode: (mode: TrackRepeatMode) => void;

  playingStatus: PlayingStatus;

  trackBufferd: number;
  trackDuration: number;
  trackPosition: number;

  togglePlayer: () => void;
  seekTime: (time: number) => void;

  playNextTrack: () => void;
  playPrevTrack: () => void;

  playNextSecs: () => void;
  playPrevSecs: () => void;

  screenHeight: number;
  setScreenHeight: (height: number) => void;
  getArtistsStr: (artists: string[]) => string;
};

const TracksContext = createContext<TracksContextType | null>(null);

type TracksContextProviderProps = {
  children: any;
};

export type Track = {
  id: string;
  image: string;
  title: string;
  artists: string[];
  description?: string;
  url?: string;
  previewUrl?: string;
};

export type PlayerTrack = {
  uuid: string;
  id: string;
  artwork: string;
  title: string;
  artist: string;
  url: string;
  description?: string;
};

export type PlayList = {
  id?: string;
  uuid?: string;
  startTrackId?: string;
  tracks: Track[];
};

export enum PlayingStatus {
  None = 'none',
  Pause = 'pause',
  Playing = 'playing',
  Loading = 'loading',
  Stop = 'stop',
}

export enum TrackRepeatMode {
  Repeat,
  OneRepeat,
  Shuffle,
  None,
}

export enum PlayerTheme {
  Light,
  Dark,
}

export const TracksContextProvider: React.FunctionComponent<
  TracksContextProviderProps
> = ({children}) => {
  // global
  const {user} = useAuth();
  const {
    remote,
    isPremium,
    trackIsPaused,
    trackDuration: spotifyDuration,
    trackPlayPosition: spotifyPosition,
  } = useSpotifyContext();
  const [screenHeight, setScreenHeight] = useState(0);
  const toast = useToast();
  const isPlayerLoadingRef = useRef(true);
  const isTrackListLoadingRef = useRef(true);
  const isTrackLoading = useRef(false);
  // track player
  const playbackState = usePlaybackState();
  const progress = useProgress();
  // playlist
  const [playList, setPlayList] = useState<PlayList>({tracks: []});
  const [playListId, setPlayListId] = useState('');
  const trackList = useRef<PlayerTrack[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [theme, setTheme] = useState(PlayerTheme.Dark);

  // track
  const [curTrack, setCurTrack] = useState<PlayerTrack>(undefined);
  const [curTrackIndex, setCurTrackIndex] = useState<number>(-1);
  const [prevTrackIndex, setPrevTrackIndex] = useState<number>(-1);
  const [nextTrackIndex, setNextTrackIndex] = useState<number>(-1);
  const readyTrackIndexRef = useRef(-1);
  const curTrackIndexRef = useRef(-1);
  const prevTrackIndexRef = useRef(-1);
  const nextTrackIndexRef = useRef(-1);
  // repeat mode
  const [repeatMode, setRepeatMode] = useState<TrackRepeatMode>(
    TrackRepeatMode.Repeat,
  );
  const repeatModeRef = useRef(TrackRepeatMode.Repeat);

  const playlistId = useMemo(() => {
    return playList?.id;
  }, [playList]);

  const getRandomTrackId = () => {
    const index = Math.floor(Math.random() * (trackList.current.length - 1));
    return index;
  };

  const readyNextTrack = (trackIndex: number) => {
    if (trackList.current && trackList.current.length > 0 && trackIndex >= 0) {
      if (repeatModeRef.current === TrackRepeatMode.Shuffle) {
        setNextTrackIndex(getRandomTrackId());
        return;
      } else {
        const nextIndex = (trackIndex + 1) % trackList.current.length;
        setNextTrackIndex(nextIndex);
        return;
      }
    }
    setNextTrackIndex(-1);
  };

  const readyPrevTrack = trackIndex => {
    if (trackList.current && trackList.current.length > 0 && trackIndex >= 0) {
      if (repeatModeRef.current === TrackRepeatMode.Shuffle) {
        setPrevTrackIndex(getRandomTrackId());
        return;
      } else {
        const prevIndex =
          (trackList.current.length + trackIndex - 1) %
          trackList.current.length;
        setPrevTrackIndex(prevIndex);
        return;
      }
    }
    setPrevTrackIndex(-1);
  };

  const startTrackPlay = async (trackIndex: number) => {
    if (
      trackIndex === curTrackIndexRef.current &&
      (playingStatus === PlayingStatus.Loading ||
        playingStatus === PlayingStatus.Playing)
    ) {
      return;
    }
    // if (isTrackLoading.current) {
    //   return;
    // }
    if (isPremium) {
      //remote.pause();
    } else {
      await TrackPlayer.pause();
    }

    const track = getTrack(trackIndex);
    if (!track) {
      return;
    }

    // send listening track data
    eventTrackListening(track.id, user.id);
    setPlayingStatus(PlayingStatus.Loading);
    readyTrackIndexRef.current = trackIndex;

    if (isPremium) {
      const _curTrack = getTrack(trackIndex);
      setCurTrackIndex(trackIndex);
      setCurTrack(_curTrack);
      await remote.playUri(`spotify:track:${track.id}`);
      setPlayingStatus(PlayingStatus.Playing);
    } else {
      if (readyTrackIndexRef.current !== curTrackIndexRef.current) {
        TrackPlayer.skip(readyTrackIndexRef.current);
      } else {
        TrackPlayer.play();
        setPlayingStatus(PlayingStatus.Playing);
      }
    }
  };

  const getTrack = (trackIndex: number) => {
    if (
      trackIndex >= 0 &&
      trackList.current &&
      trackList.current.length > trackIndex
    ) {
      return trackList.current[trackIndex];
    }
    return undefined;
  };

  const [playingStatus, setPlayingStatus] = useState(PlayingStatus.None);
  const [trackBufferd, setTrackBuffered] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackPosition, setTrackPosition] = useState(0);

  useEffect(() => {
    if (isPlayerLoadingRef.current) {
      return;
    }
    try {
      setTrackBuffered(progress.buffered);
      setTrackDuration(progress.duration);
      setTrackPosition(progress.position);
    } catch (ex) {
      console.log('log ex useEffect progress err', ex);
    }
  }, [progress]);

  const playNextTrack = async () => {
    if (nextTrackIndexRef.current >= 0) {
      startTrackPlay(nextTrackIndexRef.current);
    }
  };

  const playPrevTrack = async () => {
    if (prevTrackIndexRef.current >= 0) {
      startTrackPlay(prevTrackIndexRef.current);
    }
  };

  // track player
  // init player
  const playTrack = (track: Track, _showPlayer = true) => {
    setShowPlayer(_showPlayer);
    if (trackList.current && trackList.current.length > 0) {
      const trackIndex = trackList.current.findIndex(
        _track => _track.id === track.id,
      );

      if (trackIndex >= 0) {
        startTrackPlay(trackIndex);
        return;
      }
    }

    isTrackListLoadingRef.current = true;
    setPlayList({tracks: [track]});
    eventTrackListening(track.id, user.id);
  };

  const playOneTrack = async (track: Track, chatId, _showPlayer = true) => {
    setShowPlayer(_showPlayer);
    if (trackList.current && trackList.current.length > 0) {
      const trackIndex = trackList.current.findIndex(
        _track => _track.id === track.id,
      );

      if (trackIndex >= 0) {
        startTrackPlay(trackIndex);
        return;
      }
    }

    const playUuid = uuid.v4().toString();
    const playTrack: PlayerTrack = {
      uuid: playUuid,
      artist: getArtistsStr(track.artists),
      id: `${track.id}-${chatId}`,
      url: track.previewUrl || track.url,
      title: track.title,
      description: track.description ? track.description : '',
      artwork: track.image,
    };

    trackList.current = [playTrack];
    await TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.reset();
    await TrackPlayer.add([playTrack]);

    isTrackListLoadingRef.current = true;
    setPlayList({tracks: [track]});
    eventTrackListening(track.id, user.id);
  };

  const playSharedTrack = async () => {
    await TrackPlayer.play();
  };

  const stopSharedTrack = async () => {
    await TrackPlayer.pause();
  };

  const clearTracks = async () => {
    trackList.current = [];
    await TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.reset();
  };

  const updatePlayerTrackList = async (
    puid: string,
    _trackList: Track[],
    reset = true,
  ) => {
    try {
      if (reset) {
        if (!isPremium) {
          try {
            if (Platform.OS === 'android') {
              await TrackPlayer.reset();
            } else {
              await TrackPlayer.removeUpcomingTracks();
            }
          } catch (ex) {
            console.log('log ex reset trackplayer ex', ex);
          }
        }
        trackList.current = [];
      }

      const insertTrackIndex = trackList.current.length;
      const playerTrackList: PlayerTrack[] = _trackList.map(_track => ({
        uuid: puid,
        id: _track.id,
        url: _track.url
          ? _track.url
          : _track.previewUrl
          ? _track.previewUrl
          : 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_e4e7943871.mp3',
        title: _track.title,
        artwork: _track.image,
        artist: getArtistsStr(_track.artists),
      }));
      console.log('----- playerTrackList', playerTrackList);
      trackList.current = [...trackList.current, ...playerTrackList];

      if (!isPremium) {
        await TrackPlayer.add(playerTrackList, insertTrackIndex);
      }
    } catch (ex) {
      toast.show({description: 'playlist update error' + ex.toString()});
      console.log('log ex updatePlayerTrackList error', ex);
    }
  };

  const playTrackList = async (
    _tracks: Track[],
    _startTrackId?: string,
    _playlistId?: string,
    _showPlayer = true,
  ) => {
    setShowPlayer(_showPlayer);
    // console.log('log ------------- 00014');
    if (isPlayerLoadingRef.current) {
      isPlayerLoadingRef.current = await SetupService();
    }
    // console.log('log ------------- 000141');

    const playlist_uuid = uuid.v4().toString();

    if (playList && _playlistId && _playlistId === playList.id) {
      const addedTracks = _tracks.filter(
        t => !trackList.current.some(tc => tc.id === t.id),
      );

      await updatePlayerTrackList(playlist_uuid, addedTracks, false);
      if (curTrackIndexRef.current >= 0) {
        readyNextTrack(curTrackIndexRef.current);
        readyPrevTrack(curTrackIndexRef.current);
      }
    } else {
      isTrackListLoadingRef.current = true;

      setPlayList({
        id: _playlistId,
        uuid: playlist_uuid,
        startTrackId: _startTrackId,
        tracks: _tracks,
      });
    }

    if (_startTrackId) {
      const playingTrack = _tracks.filter(t => t.id === _startTrackId);
      playingTrack.length > 0 &&
        eventTrackListening(playingTrack[0].id, user.id);
    } else {
      _tracks.length > 0 && eventTrackListening(_tracks[0].id, user.id);
    }
  };

  const setPlayerTheme = (newTheme: PlayerTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    if (isPlayerLoadingRef.current) {
      return;
    }
    if (isPremium) {
      //remote.pause();
    } else {
      eventStopTrackListen(user.id);
      TrackPlayer.pause();
    }

    setPlayingStatus(PlayingStatus.Stop);
    // console.log('log ------------- 00015');
    setTimeout(async () => {
      if (isPlayerLoadingRef.current) {
        isTrackListLoadingRef.current = false;
        return;
      }

      setPlayListId(playList.uuid);

      // console.log('log ------------- 00015', playList);
      readyTrackIndexRef.current = 0;
      if (playList?.tracks && playList?.tracks.length > 0) {
        if (playList?.startTrackId) {
          const startIndex = playList?.tracks.findIndex(
            t => t.id === playList?.startTrackId,
          );
          if (startIndex > 0) {
            readyTrackIndexRef.current = startIndex;
          }
        }
        await updatePlayerTrackList(playList.uuid, playList?.tracks);
        startTrackPlay(readyTrackIndexRef.current);
      } else {
        setPlayingStatus(PlayingStatus.None);
        startTrackPlay(-1);
      }
      isTrackListLoadingRef.current = false;
    });
  }, [playList]);

  const playerPause = async () => {
    // if (isTrackLoading.current) {
    //   return;
    // }
    if (isPremium) {
      await remote.pause();
    } else {
      eventStopTrackListen(user.id);
      await TrackPlayer.pause();
    }
  };

  const playerPlay = async (callback = () => {}) => {
    // if (isTrackLoading.current) {
    //   console.log('player is not ready');
    //   return;
    // }

    if (isPremium) {
      await remote.resume();
    } else {
      await TrackPlayer.play();
    }
    try {
      callback();
    } catch (ex) {
      console.log('log ex play callback error', ex);
    }
  };

  const seekTime = async time => {
    // console.log('log ------------- 00018');
    try {
      if (playingStatus === PlayingStatus.Loading) {
        return;
      }
      if (isPremium) {
        await remote.seek(time * 1000);
      } else {
        await TrackPlayer.seekTo(time);
      }
    } catch (ex) {
      console.log('log ex seekTime ex', ex);
    }
  };

  const togglePlayer = async () => {
    // console.log('log ------------- 00019');
    try {
      if (playingStatus === PlayingStatus.Loading) {
        return;
      }

      if (playingStatus === PlayingStatus.Playing) {
        playerPause();
      } else {
        playerPlay();
      }
    } catch (ex) {
      console.log('log ex togglePlayer ex', ex);
    }
  };

  const playNextSecs = () => {
    // console.log('log ------------- 00020');
    const nextSec = Math.floor(Math.min(trackPosition + 10, trackDuration - 1));
    seekTime(nextSec);
  };

  const playPrevSecs = () => {
    // console.log('log ------------- 00021');
    const nextSec = Math.floor(Math.max(trackPosition - 10, 0));
    seekTime(nextSec);
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    isTrackLoading.current = false;
    console.log(event);
    try {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== null &&
        event.nextTrack !== undefined &&
        event.nextTrack >= 0
      ) {
        if (readyTrackIndexRef.current < 0) {
          //   // TrackPlayer.pause();
          //   // const _curTrack = getTrack(event.nextTrack);
          // setCurTrackIndex(event.nextTrack);
          //   // setCurTrack(_curTrack);
          //   return;
        }

        const _curTrack = getTrack(event.nextTrack);
        setCurTrackIndex(event.nextTrack);
        setCurTrack(_curTrack);

        if (playbackState === PlayerState.Playing) {
          if (repeatModeRef.current === TrackRepeatMode.None) {
            if (isPremium) {
              await remote.pause();
              await remote.seek(0);
            } else {
              eventStopTrackListen(user.id);
              await TrackPlayer.pause();
              await TrackPlayer.seekTo(0);
            }
            return;
          } else if (repeatModeRef.current === TrackRepeatMode.OneRepeat) {
            return;
          } else if (event.nextTrack !== readyTrackIndexRef.current) {
            playNextTrack();
            return;
          }
        } else {
          if (event.nextTrack !== readyTrackIndexRef.current) {
            startTrackPlay(readyTrackIndexRef.current);
            return;
          }
        }

        socket.emit('listeningMusic', {
          id: _curTrack.id,
          image: _curTrack.artwork,
          user: user.id,
          timestamp: Date.now(),
        });
        if (!_curTrack.url) {
          eventStopTrackListen(user.id);
          TrackPlayer.pause();
        }
      }
    } catch (ex) {
      console.log('log ex useTrackPlayerEvents err', ex);
    }
  });

  useTrackPlayerEvents(
    [
      Event.RemotePlay,
      Event.RemotePause,
      Event.RemotePrevious,
      Event.RemoteNext,
    ],
    async event => {
      try {
        if (event.type === Event.RemotePlay) {
          if (playbackState === PlayerState.Paused) {
            playerPlay();
          }
        }
        if (event.type === Event.RemotePause) {
          if (playbackState === PlayerState.Playing) {
            playerPause();
          }
        }
        if (event.type === Event.RemotePrevious) {
          playPrevTrack();
        }
        if (event.type === Event.RemoteNext) {
          playNextTrack();
        }
      } catch (ex) {
        console.log('log ex useTrackPlayerEvents err', ex);
      }
    },
  );

  useEffect(() => {
    setTimeout(async () => {
      if (isPlayerLoadingRef.current) {
        isPlayerLoadingRef.current = await SetupService();
      }
    });
  }, []);

  useEffect(() => {
    // console.log('log curTrack', curTrack);
  }, [curTrack]);

  useEffect(() => {
    if (isPlayerLoadingRef.current) {
      return;
    }
    prevTrackIndexRef.current = prevTrackIndex;
  }, [prevTrackIndex, playListId]);

  useEffect(() => {
    if (isPlayerLoadingRef.current) {
      return;
    }
    nextTrackIndexRef.current = nextTrackIndex;
  }, [nextTrackIndex, playListId]);

  useEffect(() => {
    curTrackIndexRef.current = curTrackIndex;
    if (isPlayerLoadingRef.current) {
      return;
    }
    // console.log('log ------------- 00025');
    try {
      readyNextTrack(curTrackIndex);
      readyPrevTrack(curTrackIndex);
    } catch (ex) {
      console.log('log ex useEffect curTrackIndex, repeatMode err', ex);
    }
  }, [curTrackIndex, repeatMode, playListId]);

  useEffect(() => {
    if (isPlayerLoadingRef.current) {
      return;
    }
    setTimeout(async () => {
      try {
        repeatModeRef.current = repeatMode;
        switch (repeatMode) {
          case TrackRepeatMode.OneRepeat:
            if (isPremium) {
              await remote.setRepeatMode(SpotifyRepeatMode.Track);
            } else {
              await TrackPlayer.setRepeatMode(PlayerRepeatMode.Track);
            }
            break;
          case TrackRepeatMode.None:
          case TrackRepeatMode.Repeat:
          case TrackRepeatMode.Shuffle:
            if (isPremium) {
              await remote.setRepeatMode(SpotifyRepeatMode.Off);
            } else {
              await TrackPlayer.setRepeatMode(PlayerRepeatMode.Off);
            }
        }
      } catch (ex) {
        console.log('log ex useEffect repeatMode err', ex);
      }
    });
  }, [repeatMode]);

  const playBackStatusStr = _playbackState => {
    switch (_playbackState) {
      case PlayerState.Playing:
        return 'Playing';
      case PlayerState.Paused:
        return 'Paused';
      case PlayerState.Buffering:
        return 'Buffering';
      case PlayerState.None:
        return 'None';
      case PlayerState.Ready:
        return 'Ready';
      case PlayerState.Connecting:
        return 'Connecting';
      case PlayerState.Stopped:
        return 'Stopped';
      default:
        return 'Unkonwn';
    }
  };

  useEffect(() => {
    if (!isPremium) {
      return;
    }

    if (trackIsPaused) {
      setPlayingStatus(PlayingStatus.Pause);
    } else {
      setPlayingStatus(PlayingStatus.Playing);
    }
  }, [playbackState]);

  useEffect(() => {
    if (isPlayerLoadingRef.current && isPremium) {
      return;
    }

    try {
      // console.log('log playbackState: ' + playBackStatusStr(playbackState));
      switch (playbackState) {
        case PlayerState.Connecting:
          // TrackPlayer.play();
          break;
        case PlayerState.Playing:
          setPlayingStatus(PlayingStatus.Playing);
          break;
        case PlayerState.Paused:
          if (playingStatus !== PlayingStatus.Loading) {
            setPlayingStatus(PlayingStatus.Pause);
          }
          break;
        case PlayerState.Buffering:
          TrackPlayer.play();
          setPlayingStatus(PlayingStatus.Playing);
          break;
        case PlayerState.Ready:
          playerPlay();
          break;
        case PlayerState.None:
          // setTimeout(async () => {
          //   const curPlayerTrackIndex = await TrackPlayer.getCurrentTrack();
          //   const curPlayerTrack = await TrackPlayer.getTrack(
          //     curPlayerTrackIndex,
          //   );
          //   console.log(
          //     'log track info PlayerState.None:',
          //     curPlayerTrackIndex,
          //     curPlayerTrack.url,
          //   );
          // });
          break;
      }
    } catch (ex) {
      console.log('log ex useEffect playbackState err', ex);
    }
  }, [playbackState]);

  const getArtistsStr = arr => {
    let ret = '';
    let after = '';
    if (arr && arr.length > 0) {
      ret = arr[0];
      for (let i = 1; i < arr.length; i++) {
        after += arr[i] + ', ';
      }
    }
    if (after) {
      ret = ret + ' ft ' + after.substring(0, after.length - 2);
    }
    return ret;
  };

  const trackProgress = useMemo(() => {
    if (isPremium) {
      if (spotifyDuration > 0 && spotifyDuration >= trackPosition) {
        return (100 * spotifyPosition) / spotifyDuration;
      }
    } else {
      if (trackDuration > 0 && trackDuration >= trackPosition) {
        return (100 * trackPosition) / trackDuration;
      }
    }
    return 0;
  }, [
    isPremium,
    spotifyDuration,
    trackPosition,
    spotifyPosition,
    trackDuration,
  ]);

  const context = {
    // trackList,
    playTrackList,
    playlistId,
    playTrack,
    playOneTrack,
    playSharedTrack,
    stopSharedTrack,
    clearTracks,
    showPlayer,

    setPlayerTheme,
    theme,

    curTrack,
    trackProgress,

    repeatMode,
    setRepeatMode,

    playingStatus,

    trackBufferd,
    trackDuration: isPremium ? spotifyDuration : trackDuration,
    trackPosition: isPremium ? spotifyPosition : trackPosition,

    togglePlayer,
    seekTime,

    playNextTrack,
    playPrevTrack,

    playNextSecs,
    playPrevSecs,

    screenHeight,
    setScreenHeight,
    getArtistsStr,
  };

  return (
    <TracksContext.Provider value={context}>{children}</TracksContext.Provider>
  );
};

export const useTracks = () => {
  const context = useContext(TracksContext);

  if (!context) {
    throw new Error('useTracks hook must be used inside TracksContextProvider');
  }

  return context;
};

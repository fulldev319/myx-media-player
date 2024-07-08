import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Config from 'react-native-config';
import {
  auth,
  remote,
  ApiConfig,
  ApiScope,
  SpotifyRemoteApi,
  PlayerState,
  PlayerContext,
  RepeatMode,
  SpotifyAuth,
} from 'react-native-spotify-remote';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import {useTracks} from './TrackContext';

interface AuthOptions {
  playURI?: string;
  showDialog?: boolean;
  autoConnect?: boolean;
  authType?: ApiConfig['authType'];
}

interface SpotifyContextState {
  error?: Error & {code?: any};
  playerState?: PlayerState;
  playerContext?: PlayerContext;
  token?: string;
  isPremium?: boolean;
  isConnected?: boolean;
  trackId: string;
  trackPlayPosition: number;
  trackDuration: number;
  trackIsPaused: boolean;
  trackProgress: number;
}

export interface SpotifyContextProps extends SpotifyContextState {
  onError: (err: Error) => void;
  authenticate: (options?: AuthOptions) => Promise<void>;
  clearError: () => void;
  endSession: () => void;
  remote: SpotifyRemoteApi;
  auth: SpotifyAuth;
  togglePlaySingleTrack: (track?: any) => void;
}

const noop = () => {};
const DefaultContext: SpotifyContextProps = {
  onError: noop,
  authenticate: (): Promise<void> => {
    return;
  },
  clearError: noop,
  endSession: noop,
  remote,
  auth,
  togglePlaySingleTrack: noop,
  trackId: '',
  trackPlayPosition: 0,
  trackDuration: 0,
  trackIsPaused: false,
  trackProgress: 0,
};

const SpotifyContext = createContext<SpotifyContextProps>(DefaultContext);

type SpotifyContextProviderProps = {
  children: any;
};

const SpotifyContextProvider: React.FunctionComponent<
  SpotifyContextProviderProps
> = ({children}) => {
  const {user, isLoggedIn} = useSelector((state: RootState) => state.auth);

  const [error, setError] = useState<Error>(undefined);
  const [token, setToken] = useState<string>(undefined);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [playerState, setPlayerState] = useState<PlayerState>(undefined);
  const [playerContext, setPlayerContext] = useState<PlayerContext>(undefined);

  const playerStateTimer = useRef(null);
  const [trackPlayPosition, setTrackPlayPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackId, setTrackId] = useState('');
  const [trackIsPaused, setTrackIsPaused] = useState(false);

  const onError = (err: Error) => {
    setError(err);
  };

  const clearError = () => {
    setError(undefined);
  };

  const endSession = () => {
    auth.endSession().then(() => {
      remote.disconnect().then(() => {
        setIsConnected(false);
        setToken(undefined);
      });
    });
  };

  const authenticate = async ({
    // playURI,
    // showDialog = false,
    // authType,
    autoConnect = false,
  }: AuthOptions = {}): Promise<void> => {
    try {
      const config: ApiConfig = {
        clientID: Config.SPOTIFY_CLIENT_ID,
        redirectURL: Config.SPOTIFY_REDIRECT_URL,
        // tokenRefreshURL: Config.SPOTIFY_TOKEN_REFRESH_URL,
        // tokenSwapURL: Config.SPOTIFY_TOKEN_SWAP_URL,
        scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserReadPrivateScope], //ApiScope.StreamingScope, ApiScope.UserReadPlaybackStateScope, ApiScope.UserReadPlaybackPosition, ApiScope.UserModifyPlaybackStateScope, ApiScope.UserReadCurrentlyPlayingScope],
        playURI: '',
        // showDialog,
        // authType,
      };
      // Go and check if things are connected
      const _isConnected = await remote.isConnectedAsync();
      setIsConnected(_isConnected);

      // Initialize the session
      const {accessToken} = await auth.authorize(config);
      console.log('Spotify token: ', accessToken);

      setToken(accessToken);
      if (autoConnect) {
        if (user?.product && user.product === 'premium') {
          await remote
            .connect(accessToken)
            .then(() => setIsConnected(true))
            .catch(onError);
        }
      }
    } catch (err) {
      console.log('No autoConnect', err);
      onError(err);
    }
  };

  const stopTimer = () => {
    if (playerStateTimer.current != null) {
      clearInterval(playerStateTimer.current);
      playerStateTimer.current = null;
    }
  };

  const startTimer = () => {
    try {
      remote.setRepeatMode(RepeatMode.Off);
    } catch (ex) {}
    stopTimer();
    playerStateTimer.current = setInterval(async () => {
      try {
        const _isConnected = await remote.isConnectedAsync();
        setIsConnected(_isConnected);
        if (_isConnected) {
          const _playerState = await remote.getPlayerState();
          // console.log('log playerState', _playerState);
          setPlayerState(_playerState);
        } else {
          stopTimer();
        }
      } catch (ex) {
        console.log('timer issue', ex);
        stopTimer();
      }
    }, 1000);
  };

  const connectSpotify = async () => {
    if (!isConnected) {
      try {
        await remote
          .connect(token)
          .then(() => setIsConnected(true))
          .catch(onError);
      } catch (ex) {
        console.log('Error authenticate 001');
        await authenticate({
          showDialog: false,
          playURI: '',
          authType: 'TOKEN',
          autoConnect: true,
        });
      }
    }
  };

  const togglePlaySingleTrack = async track => {
    if (isConnected && track?.id) {
      const uri = `spotify:track:${track.id}`;

      try {
        if (track.id === trackId) {
          if (trackIsPaused) {
            console.log('Error resume track', uri);
            await remote.resume();
          } else {
            console.log('Error pause track', uri);
            await remote.pause();
          }
        } else {
          console.log('Error ready to play track', uri);
          setTrackId(track.id);
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  };

  /*const _onConnected = () => {
     console.log('log----- _onConnected');
     setIsConnected(true);
   };*/
  // const _onDisconnected = () => {
  //   console.log('log----- _onDisconnected');
  //   setIsConnected(false);
  // };
  /*const _onPlayerStateChanged = state => {
     console.log('log----- _onPlayerStateChanged', state);
     setPlayerState(state);
   };
  const _onPlayerContextChanged = context => {
   console.log('log----- _onPlayerContextChanged', context);
   setPlayerContext(context);
 };*/

  const trackProgress = useMemo(() => {
    if (trackDuration > 0 && trackDuration >= trackPlayPosition) {
      return (100 * trackPlayPosition) / trackDuration;
    }
    return 0;
  }, [trackPlayPosition, trackDuration]);

  useEffect(() => {
    if (trackId) {
      console.log('Error ready to play track', trackId);
      remote.playUri(trackId);
    }
  }, [trackId]);

  useEffect(() => {
    // remote.on('remoteConnected', _onConnected);
    // remote.on('remoteDisconnected', _onDisconnected);
    // remote.on('playerStateChanged', _onPlayerStateChanged);
    // remote.on('playerContextChanged', _onPlayerContextChanged);

    if (isLoggedIn && user) {
      setIsPremium(user?.product && user.product === 'premium');
      auth.getSession().then(session => {
        if (session && session?.accessToken) {
          setToken(session?.accessToken);

          if (user?.product && user.product === 'premium') {
            remote
              .connect(session?.accessToken)
              .then(() => setIsConnected(true))
              .catch(onError);
          }
        } else {
          setTimeout(async () => {
            await authenticate({
              showDialog: false,
              playURI: '',
              authType: 'TOKEN',
              autoConnect: user?.product && user.product === 'premium',
            });
          });
        }
      });
    }
    // return remote.removeAllListeners();
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (isLoggedIn) {
      if (isConnected) {
        startTimer();
      } else {
        stopTimer();
        if (user?.product && user.product === 'premium') {
          connectSpotify();
        }
      }
    }
  }, [isConnected, isLoggedIn]);

  useEffect(() => {
    setTrackPlayPosition(playerState?.playbackPosition ?? 0);
    setTrackDuration(playerState?.track?.duration ?? 0);
    // setTrackUri(playerState?.track?.uri ?? '');
    setTrackIsPaused(playerState?.isPaused ?? false);
  }, [playerState]);

  return (
    <SpotifyContext.Provider
      value={{
        ...DefaultContext,
        error,
        token,
        isPremium,
        isConnected,
        playerState,
        playerContext,
        trackId,
        trackDuration,
        trackPlayPosition,
        trackIsPaused,
        trackProgress,
        onError,
        authenticate,
        clearError,
        endSession,
        togglePlaySingleTrack,
      }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export default SpotifyContext;
export {SpotifyContextProvider};

export const useSpotifyContext = () => {
  const context = useContext(SpotifyContext);

  if (!context) {
    throw new Error(
      'useSpotifyContext hook must be used inside SpotifyContextProvider',
    );
  }

  return context;
};

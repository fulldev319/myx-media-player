import React, {createContext, useContext, useRef, useState} from 'react';
import {PlayingStatus} from './TrackContext';

const Sound = require('react-native-sound');

type AudioContextType = {
  audioId: string;
  audioUrl: string;
  playingStatus: PlayingStatus;

  playAudioWithoutProgress: (audioId, audioUrl) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

type TracksContextProviderProps = {
  children: any;
};

export const AudioContextProvider: React.FunctionComponent<
  TracksContextProviderProps
> = ({children}) => {
  const [audioId, setAudioId] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [playingStatus, setPlayingStatus] = useState(PlayingStatus.None);

  const currentSound = useRef(null);

  const playAudioWithoutProgress = (audioId, audioUrl) => {
    setAudioId(audioId);
    setAudioUrl(audioUrl);
    setPlayingStatus(PlayingStatus.Loading);

    if (currentSound.current) {
      currentSound.current?.release();
    }

    var whoosh = new Sound(audioUrl, '', error => {
      if (error) {
        setPlayingStatus(PlayingStatus.None);
        return;
      }

      setPlayingStatus(PlayingStatus.Playing);

      whoosh.setVolume(10);
      whoosh.play(success => {
        if (success) {
          // if playing is finished
          setPlayingStatus(PlayingStatus.None);
        } else {
          // if playing is failed in middle
          setPlayingStatus(PlayingStatus.None);
        }

        // release player after finished
        whoosh.release();
      });
    });

    currentSound.current = whoosh;
  };

  const context = {
    audioId,
    audioUrl,
    playingStatus,
    playAudioWithoutProgress,
  };

  return (
    <AudioContext.Provider value={context}>{children}</AudioContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error(
      'useAudioPlayer hook must be used inside AudioContextProvider',
    );
  }

  return context;
};

import TrackPlayer, {Capability, Event} from 'react-native-track-player';

export async function PlaybackService() {
  // TrackPlayer.addEventListener(Event.RemotePause, () => {
  //   // TrackPlayer.pause();
  // });
  // TrackPlayer.addEventListener(Event.RemotePlay, () => {
  //   // TrackPlayer.play();
  // });
}

export const SetupService = async (): Promise<boolean> => {
  let isNotSetup = true;
  try {
    // this method will only reject if player has not been setup yet
    await TrackPlayer.getCurrentTrack();
    isNotSetup = false;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
    isNotSetup = false;
  } finally {
    return isNotSetup;
  }
};

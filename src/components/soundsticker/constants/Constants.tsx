import {Platform} from 'react-native';
import {wp} from '../global';
import RNFS from 'react-native-fs';

const Constants = {
  MAPBOX_ACCESS_TOKEN:
    'sk.eyJ1Ijoic2FhZGd1bCIsImEiOiJjbDZlMTg2dmEwM3Y1M2Rtcmc4bGZkNXN5In0.zW20bBNEF9qofPKJG9GtdA',
  APP_NAME: 'Cilo',
  FONTFAMILY_MARGINBOTTOM: Platform.OS === 'android' ? wp(-0.9) : 0,
  RECORDING_PATH: `${RNFS.DownloadDirectoryPath}/audio.acc`,
  RECORDING_PATH_IOS: `${RNFS.DocumentDirectoryPath}/audio.acc`,
  STICKER_TEMP_IMAGE_PATH: `${RNFS.DownloadDirectoryPath}/SoundStickers/image.png`,
  STICKER_TEMP_IMAGE_PATH_IOS: `${RNFS.DocumentDirectoryPath}/SoundStickers/image.png`,
  SOUND_STICKER_DIR: `${
    Platform.OS === 'android'
      ? RNFS.DownloadDirectoryPath
      : RNFS.DocumentDirectoryPath
  }/SoundStickers`,
  SOUND_STICKER_DIR_IOS: `${RNFS.DocumentDirectoryPath}/SoundStickers`,
};

export default Constants;

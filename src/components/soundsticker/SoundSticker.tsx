import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {hp, wp} from './global';
import {Colors, Fonts} from './res';
import {Constants} from './constants';
import {launchImageLibrary} from 'react-native-image-picker';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {EmojiSelector, RecordModal} from '.';
import {DownloadServices, FileManagerServices} from './services';
import CameraRoll from '@react-native-community/cameraroll';

const SoundSticker = () => {
  const [imageData, setImageData] = useState<any>('');
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<any>('');
  const [selectedRecording, setSelectedRecording] = useState('');
  const [loading, setLoading] = useState(false);

  const imagePicker = () => {
    const options: any = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, async (res: any) => {
      if (res && !res.didCancel) {
        setImageData(res.assets[0]);
      }
    });
  };

  const createSticker = () => {
    setLoading(true);
    var directory = '';
    if (Platform.OS === 'android') {
      directory = Constants.SOUND_STICKER_DIR;
    } else {
      directory = Constants.SOUND_STICKER_DIR_IOS;
    }
    FileManagerServices.makeDirectory(directory)
      .then(() => {
        const emojiCode = selectedEmoji.lib.unified;
        var imagePath = '';
        var audioPath = '';
        var stickerPath = '';
        const date = new Date();
        const stickerName = `sticker_${Math.floor(
          date.getTime() + date.getSeconds() / 2,
        )}.mp4`;
        if (Platform.OS === 'android') {
          imagePath = Constants.STICKER_TEMP_IMAGE_PATH;
          audioPath = Constants.RECORDING_PATH;
          stickerPath = Constants.SOUND_STICKER_DIR + '/' + stickerName;
        } else {
          imagePath = Constants.STICKER_TEMP_IMAGE_PATH_IOS;
          audioPath = Constants.RECORDING_PATH_IOS;
          stickerPath = Constants.SOUND_STICKER_DIR_IOS + '/' + stickerName;
        }

        DownloadServices.downloadEmoji(emojiCode).then((res: any) => {
          FFmpegKit.execute(
            `-i ${imageData.uri}  -i ${res.data} -y -filter_complex "[1]scale=iw/2:-1[b];[0:v][b] overlay=W-w:0" ${imagePath}`,
          ).then(async session => {
            const returnCode = await session.getReturnCode();
            if (ReturnCode.isSuccess(returnCode)) {
              FFmpegKit.execute(
                `-i ${imagePath}  -i ${audioPath} -c:v libx264   -pix_fmt yuv420p   -y -vf scale=480:480 ${stickerPath}`,
              )
                .then(async session => {
                  const returnCode = await session.getReturnCode();
                  if (ReturnCode.isSuccess(returnCode)) {
                    FileManagerServices.deleteFile(imagePath)
                      .then(() => {
                        FileManagerServices.deleteFile(audioPath)
                          .then(() => {
                            if (Platform.OS === 'ios') {
                              CameraRoll.save(stickerPath, {
                                type: 'video',
                                album: 'SoundSticker',
                              });
                            }
                            Alert.alert('Sticker Generated in download folder');
                            setLoading(false);
                          })
                          .catch(() => setLoading(false));
                      })
                      .catch(() => setLoading(false));
                  } else if (ReturnCode.isCancel(returnCode)) {
                    setLoading(false);
                  } else {
                    setLoading(false);
                  }
                })
                .catch(() => setLoading(false));
            } else if (ReturnCode.isCancel(returnCode)) {
              setLoading(false);
            } else {
              setLoading(false);
            }
          });
        });
      })
      .catch(() => {
        setLoading(false);
      });

    // const emojiCode = selectedEmoji.lib.unified
    // DownloadServices.downloadEmoji(emojiCode)
    //     .then((res: any) => {
    //         FFmpegKit.execute(`-i ${imageData.uri}  -i ${res.data} -filter_complex "[1]scale=iw/2:-1[b];[0:v][b] overlay=W-w:0" /storage/emulated/0/Download/imqoa.png`).then(async (session) => {
    //             const returnCode = await session.getReturnCode();
    //             if(ReturnCode.isSuccess(returnCode)) {
    //                 console.log('isSuccess')
    //             } else if(ReturnCode.isCancel(returnCode)) {
    //                 console.log('isCancel')
    //             } else {
    //                 console.log('Error')
    //             }
    //         })
    //     })

    //Image rotate with audio merge
    // FFmpegKit.execute(`-i ${imageData.uri}  -i ${AudioUtils.DownloadsDirectoryPath + '/test1.aac'} -c:v libx264   -pix_fmt yuv420p   -vf "transpose=0, scale=1080:1920" /storage/emulated/0/Download/fin38.mp4`).then((data) => {
    //     console.log(data)
    // })

    // FFmpegKit.execute(`-i ${imageData.uri}  -i ${AudioUtils.DownloadsDirectoryPath + '/test1.aac'} -c:v libx264   -pix_fmt yuv420p   -vf scale=480:480 /storage/emulated/0/Download/video1.mp4`).then((data) => {
    //     Alert.alert('Sticker generated')
    // })

    //Image Overlay
    // FFmpegKit.execute(`-i ${imageData.uri}  -i ${AudioUtils.DownloadsDirectoryPath + '/image.png'} -filter_complex "[1]scale=iw/2:-1[b];[0:v][b] overlay=W-w:0" /storage/emulated/0/Download/imageMerge9.png`).then((data) => {
    //     console.log(data)
    // })
  };

  const onSelectEmojiPress = () => setShowEmojiSelector(true);
  const onCloseEmoji = () => setShowEmojiSelector(false);
  const onEmojiSelected = (emoji: any) => {
    setSelectedEmoji(emoji);
    setShowEmojiSelector(false);
  };

  const onCloseRecordModal = () => setShowRecordModal(false);
  const onRecordAudioPress = () => setShowRecordModal(true);
  const onRecordingSelect = () => {
    setShowRecordModal(false);
    setSelectedRecording(Constants.RECORDING_PATH);
  };

  return (
    <View style={Style.container}>
      <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      {imageData.length !== 0 && (
        <View style={Style.imageCon}>
          <Image
            source={{uri: imageData.uri}}
            resizeMode="contain"
            style={Style.image}
          />
          {selectedEmoji.length !== 0 && selectedEmoji.char && (
            <Text style={Style.imageEmoji}>{selectedEmoji.char}</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={Style.btn} onPress={imagePicker}>
        <Text style={Style.btnTxt}>Select Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Style.btn} onPress={onSelectEmojiPress}>
        <Text style={Style.btnTxt}>Select Emoji</Text>
      </TouchableOpacity>

      <EmojiSelector
        visible={showEmojiSelector}
        onClose={onCloseEmoji}
        onEmojiSelected={onEmojiSelected}
      />
      <RecordModal
        visible={showRecordModal}
        onClose={onCloseRecordModal}
        onSelect={onRecordingSelect}
      />

      <TouchableOpacity style={Style.btn} onPress={onRecordAudioPress}>
        <Text style={Style.btnTxt}>Record Audio</Text>
      </TouchableOpacity>

      {
        <TouchableOpacity
          style={{
            ...Style.btn,
            backgroundColor:
              imageData.length !== 0 &&
              selectedEmoji.length !== 0 &&
              selectedRecording.length !== 0
                ? Colors.theme
                : Colors.color,
          }}
          onPress={createSticker}
          disabled={
            imageData.length !== 0 &&
            selectedEmoji.length !== 0 &&
            selectedRecording.length !== 0
              ? false
              : true
          }>
          {loading ? (
            <ActivityIndicator color={Colors.white} size={'small'} />
          ) : (
            <Text style={Style.btnTxt}>Create Sticker</Text>
          )}
        </TouchableOpacity>
      }
    </View>
  );
};

export default SoundSticker;

const Style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingTop: hp(4),
  },
  btn: {
    minWidth: wp(50),
    maxWidth: wp(80),
    height: hp(7),
    paddingHorizontal: wp(3),
    borderRadius: 8,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  btnTxt: {
    color: Colors.white,
    fontFamily: Fonts.APPFONT_SB,
    fontSize: wp(4),
    marginBottom: Constants.FONTFAMILY_MARGINBOTTOM,
  },
  image: {
    width: wp(50),
    height: hp(25),
  },
  imageEmoji: {
    fontSize: wp(12),
    position: 'absolute',
    color: Colors.black,
    top: 0,
    right: 0,
  },
  imageCon: {
    width: wp(50),
    height: hp(25),
    marginBottom: hp(3),
  },
});

import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import VideoPlayer from 'react-native-video-player';
import SoundRecorder from 'react-native-sound-recorder';
import RNFS from 'react-native-fs';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {useToast} from 'native-base';

import {ArrowLeftIcon} from 'assets/svg';
import {PrimaryModal} from 'components/common/PrimaryModal';
import {MicIcon, PhotoIcon, PlayIcon, VideoIcon} from '../assets';
import {
  MediaTrashIcon,
  PauseIcon,
  TrashIcon,
} from 'components/feed/ios/assets/svgs';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {compressMedia} from 'helper/utils';
import {apiPostCreateDebate} from 'helper/debateHelper';
import {CustomToast} from 'components/common';
import ChatAudioPlayer from 'screens/chat/ChatAudioPlayer';
import {useNavigation} from '@react-navigation/native';

interface CreateNewPostModalProps {
  bubble: any;
  visible: boolean;
  hideModal: () => void;
  onSuccess?: () => void;
}

export const CreateNewPostModal = (props: CreateNewPostModalProps) => {
  const {bubble, visible, hideModal, onSuccess} = props;
  const toast = useToast();
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]);
  const [duration, setDuration] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const checkPermission = async () => {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    let result;
    try {
      result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'access to your microphone so you can chat with voice.',
          buttonPositive: 'Confirm',
        },
      );
    } catch (error) {
      console.error('failed getting permission, result:', error);
    }
    return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const onPickImage = type => {
    const config =
      type === 'image'
        ? {
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
          }
        : {
            includeBase64: true,
            mediaType: 'video',
          };

    ImagePicker.openPicker(config).then(async image => {
      setSelectedImages(prev => [
        ...prev,
        {type, mime: image.mime, url: image.path},
      ]);
    });
  };

  const onDeleteImage = data => {
    const filteredMedia = selectedImages.filter(item => item.url !== data.url);
    setSelectedImages(filteredMedia);
  };

  const startRecorder = () => {
    try {
      SoundRecorder.start(
        SoundRecorder.PATH_CACHE + `/recording${Date.now()}.mp4`,
      )
        .then(() => {
          setIsRecording(true);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const stopRecorder = () => {
    try {
      SoundRecorder.stop()
        .then(res => {
          setAudioUrls(prev => [...prev, res.path]);
          setIsRecording(false);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onPressIn = async () => {
    const permission = await checkPermission();
    if (permission) {
      startRecorder();
    }
  };

  const onPressOut = async () => {
    const permission = await checkPermission();
    if (permission) {
      stopRecorder();
    }
  };

  const onUploadMedia = async image => {
    const base64String = await getBase64String(image.url);
    const mediaData = base64String;
    const thumNailImageUrl = await uploadFileToIPFS(mediaData, image.mime);
    image.url = thumNailImageUrl;
    return image;
  };

  const onDeleteAudio = async item => {
    const filteredAudios = audioUrls.filter(audio => audio !== item);
    setAudioUrls(filteredAudios);
  };

  const onPublish = async () => {
    if (audioUrls.length > 0) {
      setIsLoading(true);

      // mix audios using ffmpeg
      // final audio path
      const convertedFileUrl = `${RNFS.DocumentDirectoryPath}/clio_mixed_tmp.mp4`;
      let inputStr = '';
      audioUrls.forEach((url, index) => {
        inputStr = inputStr + '-i ' + url + ' ';
      });
      const convertCmdStr = `${inputStr} -filter_complex "[0:a]concat=n=${audioUrls.length}:v=0:a=1" -y ${convertedFileUrl}`;
      console.log({convertCmdStr});
      FFmpegKit.execute(convertCmdStr).then(async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          const mediaUrls = [];
          const mediaTypes = [];

          if (selectedImages.length) {
            const arrayMedais = await Promise.all(
              selectedImages.map(onUploadMedia),
            );
            arrayMedais.forEach(media => {
              mediaUrls.push(media.url);
              mediaTypes.push(media.type);
            });
          }

          let base64String;
          base64String = await compressMedia('audio', convertedFileUrl);
          base64String = await getBase64String(base64String);
          const createdAudioUrl = await uploadFileToIPFS(base64String, 'audio');

          //create waveform
          const samplesFileUrl = `${RNFS.DocumentDirectoryPath}/graph.txt`;
          FFmpegKit.execute(
            `-i ${convertedFileUrl} -ac 1 -filter:a aresample=4000 -map 0:a -c:a pcm_u8 -y -f data ${samplesFileUrl} `,
          ).then(async session => {
            const binaryData = await RNFS.readFile(samplesFileUrl, 'base64');
            const byteArray = new Buffer(
              binaryData.replace(/^[\w\d;:\/]+base64\,/g, ''),
              'base64',
            );
            var normalized = [];
            var j = 0;
            for (let i = 0; i < byteArray.length; i += 400) {
              var temp = byteArray.slice(i - 400, i);
              var max = Math.max(...temp);
              if (max > 90) {
                normalized[j] = Math.max(...temp) - 90;
              } else {
                normalized[j] = 0;
              }
              j++;
            }
            const waveformData = {
              width: normalized.length,
              height: 165,
              samples: normalized,
            }; //waveformData is the JSON object to be uploaded to the BE

            const params = {
              url: createdAudioUrl,
              length: duration,
              keywords: ['string'],
              isModulated: false,
              country: 1,
              description: '',
              tags: ['string'],
              transcripition: 'string',
              waveformData,
              mediaUrls,
              mediaTypes,
              bubble: bubble?.id,
            };

            const res = await apiPostCreateDebate(params);

            if (res.success) {
              onSuccess();
              hideModal();
              toast.show({
                render: () => (
                  <CustomToast
                    title="Success publish a new post"
                    color="#08b883"
                    onRightPress={() =>
                      navigation.navigate('BubbleDetailPage', {
                        bubbleId: bubble?.id,
                        bubble: bubble,
                        audioId: res.debate,
                      })
                    }
                  />
                ),
                placement: 'top',
              });
              setIsLoading(false);
            } else {
              alert(JSON.stringify(res.error));
              setIsLoading(false);
            }
          });
        } else {
          setIsLoading(false);
        }
      });
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeftIcon color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Post</Text>
      </View>
    );
  };

  const memoriableAudios = useMemo(() => {
    return audioUrls.reverse().map((item, index) => {
      return (
        <View key={index} style={styles.recordItem}>
          {/* <ListIcon /> */}
          <View style={styles.recordPlayIcon}>
            <ChatAudioPlayer
              key={index}
              setDuration={data => setDuration(duration + data)}
              color="#9214F5"
              customStyles={{
                durationText: {color: '#00000050'},
                playControl: {marginRight: 10},
              }}
              icons={[<PlayIcon />, <PauseIcon />]}
              video={{uri: item}}
            />
            <TouchableOpacity onPress={() => onDeleteAudio(item)}>
              <TrashIcon />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }, [audioUrls]);

  const renderRecordList = () => {
    return <View style={styles.recordList}>{memoriableAudios}</View>;
  };

  const renderRecorder = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.recorder}>
        <MicIcon />
        <Text style={styles.recorderTitle}>
          {!isRecording ? 'Hold to start recording' : 'Recording...'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAttachment = () => {
    return (
      <>
        {selectedImages.length ? (
          <Text style={styles.uploadedMedia}>Uploaded Media</Text>
        ) : null}
        <View style={styles.editImagePreviewContianer}>
          {selectedImages.map((item, index) => {
            return (
              <View key={index} style={styles.editImage}>
                {item.type === 'image' ? (
                  <Image
                    source={{uri: item.url}}
                    style={styles.editImageSelected}
                  />
                ) : (
                  <VideoPlayer
                    video={{
                      uri: item.url,
                    }}
                    videoWidth={72}
                    videoHeight={72}
                  />
                )}
                <TouchableOpacity
                  onPress={() => onDeleteImage(item)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                  }}>
                  <MediaTrashIcon />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </>
    );
  };

  const renderTools = () => {
    return (
      <View style={styles.toolContainer}>
        <View style={styles.rowItem}>
          <TouchableOpacity
            onPress={() => onPickImage('image')}
            style={styles.button}>
            <PhotoIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPickImage('video')}
            style={styles.button}>
            <VideoIcon />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onPublish} style={styles.submitBtn}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitTxt}>Publish Post</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <PrimaryModal visible={visible} hideModal={hideModal}>
      <View style={styles.container}>
        {renderHeader()}
        {renderRecorder()}
        {renderRecordList()}
        {renderAttachment()}
        {renderTools()}
      </View>
    </PrimaryModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 16,
    color: 'black',
    marginLeft: 16,
  },
  recorder: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00000010',
    paddingHorizontal: 14,
  },
  recorderTitle: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 10,
    color: '#00000040',
    marginLeft: 16,
  },
  toolContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 16,
  },
  submitBtn: {
    width: 120,
    height: 36,
    backgroundColor: '#9214F5',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitTxt: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 14,
    color: 'white',
  },

  editImagePreviewContianer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  editImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    margin: 8,
    marginLeft: 0,
    backgroundColor: 'grey',
    overflow: 'hidden',
  },
  editImageSelected: {
    width: '100%',
    height: '100%',
  },
  countryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  countryCard: {
    borderWidth: 2,
    borderColor: '#ff6651',
    borderRadius: 16,
  },
  toast: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastTxt: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 20,
  },
  recordList: {
    marginTop: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordPlayIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#00000010',
    justifyContent: 'space-around',
  },
  uploadedMedia: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: 'grey',
    marginTop: 12,
  },
});

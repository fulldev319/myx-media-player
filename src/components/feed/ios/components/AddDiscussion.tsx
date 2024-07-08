import {CustomToast, PrimaryButton} from 'components/common';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import {Camera} from 'react-native-vision-camera';
import ImagePicker from 'react-native-image-crop-picker';
import VideoPlayer from 'react-native-video-player';
import {useToast} from 'native-base';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {Picker} from 'react-native-wheel-pick';
import FileManagerServices from 'service/FileManagerServices';

import ChatAudioPlayer from 'screens/chat/ChatAudioPlayer';
import {WaveProgress} from 'screens/MusicPlayer/components/musicPlayerIcons';
import {CustomBadge} from 'screens/thread/components/CustomBadge';
import {
  AddImageIcon,
  AddVideoIcon,
  LargeMicIcon,
  ListIcon,
  MediaTrashIcon,
  PauseIcon,
  PlayIcon,
  RecordingIcon,
  SpinnerIcon,
  TrashIcon,
} from '../assets/svgs';
import {RotatingView} from 'components/common/RotatingView';
import {apiPostCreateDebate} from 'helper/debateHelper';
import {apiGetMyCountries} from 'helper/mapHelper';
import {CardCountry} from 'screens/map/new_world/components/common/CardCountry';
import {compressMedia} from 'helper/utils';

const AddDiscussion = ({onHide, description, onDetail}) => {
  const arrDescription = description.split('\n') || [];
  const [selectedDescription, setSelectedDescription] = useState(
    arrDescription[0] || '',
  );
  const [progress, setProgress] = useState(100);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordMode, setIsRecordMode] = useState(true);
  const [audioUrls, setAudioUrls] = useState([]);
  const [duration, setDuration] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState();

  const [selectedImages, setSelectedImages] = useState([]);

  const [arrCountries, setArrCountries] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        setProgress(500 * Math.random());
      }, 300);
    }
  }, [progress, isRecording]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isSearch = false, isRefresh = false) => {
    if (isRefresh) {
      if (!isLoading) {
        const res = await apiGetMyCountries(10, null);

        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setArrCountries(res.data);
      }
    } else {
      if (hasMore && !isLoading) {
        const res = await apiGetMyCountries(10, lastId);

        setLastId(res.lastId);
        setHasMore(res.hasMore);
        setArrCountries(prev => [...prev, ...res.data]);
      }
    }
  };

  const checkCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission !== 'authorized') {
      const newCameraPermission = await Camera.requestCameraPermission();
      // if (newCameraPermission !== 'authorized') {
      //   onClose();
      // }
    }
  };

  const onUploadMedia = async image => {
    const base64String = await getBase64String(image.url);
    const mediaData = base64String;
    const thumNailImageUrl = await uploadFileToIPFS(mediaData, image.mime);
    image.url = thumNailImageUrl;
    return image;
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
    setSelectedImages(prev => [...prev, filteredMedia]);
  };

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

  const onUpload = async path => {
    let base64String;
    base64String = await getBase64String(
      Platform.OS === 'android' ? 'file://' : '' + path,
    );
    const fileMeta = await uploadFileToIPFS(base64String, 'audio/acc');
    if (!fileMeta) {
      return;
    }
    return fileMeta;
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
          setIsRecordMode(false);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onRecord = async () => {
    const permission = await checkPermission();
    if (permission) {
      if (isRecording) {
        stopRecorder();
      } else {
        startRecorder();
      }
    }
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
              country: selectedCountry,
              isModulated: false,
              description: description || '',
              tags: ['string'],
              transcripition: 'string',
              waveformData,
              mediaUrls,
              mediaTypes,
            };

            const res = await apiPostCreateDebate(params);
            if (res.success) {
              onHide();
              toast.show({
                render: () => (
                  <CustomToast
                    title="Success publish a new post"
                    color="#08b883"
                    onRightPress={() => onDetail(res.debate)}
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
          /*How to use waveformData to present bar chart:
          import { BarChart} from "react-native-gifted-charts";
          var barData =[ ];
          for (let i=0; i < normalized.length; i++){ //just to show in barchart component
                  barData[i] = {value: normalized[i]};
          }
          <BarChart
            data = {barData}
            height={50}
            yAxisThickness={0}
            xAxisThickness={0}
            spacing={1}
            hideYAxisText
            barWidth={3}
            initialSpacing={0}
            hideRules
            frontColor={"red"}
            disableScroll
            scrollToEnd
          />
          */
        } else {
          setIsLoading(false);
        }
      });
    }
  };

  const memoriableAudios = useMemo(() => {
    return audioUrls.reverse().map((item, index) => {
      return (
        <View key={index} style={styles.recordItem}>
          <ListIcon />
          <View style={styles.recordPlayIcon}>
            <ChatAudioPlayer
              key={index}
              setDuration={data => setDuration(duration + data)}
              color="#ff6651"
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

  return (
    <View>
      {isRecordMode && (
        <>
          {!isRecording ? (
            <>
              <Text style={styles.line1}>
                Hit record when you ready. Will show your text here Your first
                line is:
              </Text>
              <Text style={styles.line2}>{arrDescription[0]}</Text>
            </>
          ) : (
            arrDescription.length && (
              <Picker
                selectedValue={selectedDescription}
                pickerData={arrDescription}
                onValueChange={value => setSelectedDescription(value)}
                style={{backgroundColor: 'transparent', height: 200}}
                textSize={10}
                selectBackgroundColor={'red'}
              />
            )
          )}

          <View style={styles.waveProgress}>
            {isRecording ? (
              <WaveProgress progress={progress} size={500} color={'#d9d9d9'} />
            ) : (
              <View style={styles.noWave} />
            )}
          </View>

          <Text style={styles.line3}>Record Your Notes</Text>
          <Text style={styles.line4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut dictum.
          </Text>
          <TouchableOpacity onPress={onRecord} style={styles.recordBtn}>
            {isRecording ? (
              <>
                <RotatingView>
                  <SpinnerIcon />
                </RotatingView>
                <View style={{position: 'absolute', top: 0}}>
                  <RecordingIcon />
                </View>
              </>
            ) : (
              <LargeMicIcon />
            )}
          </TouchableOpacity>
        </>
      )}
      {!isRecordMode && (
        <>
          {/* <Text style={styles.mainKey}>Main Keywords</Text>
          <View style={styles.keywords}>
            <CustomBadge
              label="Wedding"
              color="#f3f4f5"
              labelStyle={styles.winLabel}
              containerStyle={styles.winBadge}
            />
            <CustomBadge
              label="Love"
              color="#f3f4f5"
              labelStyle={styles.winLabel}
              containerStyle={styles.winBadge}
            />
            <CustomBadge
              label="Marrage"
              color="#f3f4f5"
              labelStyle={styles.winLabel}
              containerStyle={styles.winBadge}
            />
          </View> */}

          <View style={styles.recordList}>{memoriableAudios}</View>
          <TouchableOpacity onPress={() => setIsRecordMode(true)}>
            <Text style={styles.addMoreBtn}>Add More Audio</Text>
          </TouchableOpacity>

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

          <Text style={styles.mainKey}>Select Country</Text>
          <View style={styles.countryContainer}>
            {arrCountries.map(item => {
              return (
                <TouchableOpacity
                  style={[
                    selectedCountry === item.country && styles.countryCard,
                    {marginBottom: 6, marginRight: 6},
                  ]}
                  key={item.country}
                  onPress={() => setSelectedCountry(item.country)}>
                  <CardCountry data={item} containerStyle={{marginBottom: 0}} />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.media}>
            <TouchableOpacity
              onPress={() => onPickImage('image')}
              style={styles.mediaBtn}>
              <AddImageIcon />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPickImage('video')}
              style={styles.mediaBtn}>
              <AddVideoIcon />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <PrimaryButton
                width={'100%'}
                label="Publish"
                onPress={onPublish}
                isLoading={isLoading}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default AddDiscussion;

const styles = StyleSheet.create({
  line1: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 19.2,
    color: 'black',
    textAlign: 'center',
    opacity: 0.4,
    marginTop: 50,
  },
  line2: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19.2,
    color: 'black',
    textAlign: 'center',
    marginTop: 8,
  },
  line3: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: 'black',
    textAlign: 'center',
  },
  line4: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    color: 'black',
    opacity: 0.4,
    textAlign: 'center',
    marginTop: 16,
  },
  recordBtn: {
    alignItems: 'center',
    marginTop: 32,
  },
  waveProgress: {
    marginVertical: 30,
  },
  noWave: {
    height: 1,
    width: '100%',
    backgroundColor: '#d9d9d9',
  },
  mainKey: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: 'black',
    opacity: 0.4,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  winBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 32,
    marginRight: 8,
  },
  winLabel: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19.2,
    color: '#000000',
  },
  recordList: {
    marginVertical: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordPlayIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#00000010',
    marginLeft: 10,
    justifyContent: 'space-around',
  },
  recordDuration: {
    color: '#00000040',
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 14,
  },
  addMoreBtn: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
    color: '#ff6651',
    marginBottom: 16,
  },
  media: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaBtn: {
    paddingHorizontal: 16,
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
});

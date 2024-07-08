/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-catch-shadow */
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import SoundRecorder from 'react-native-sound-recorder';
import {RootState} from 'redux/interfaces';
import {
  RecordExitIcon,
  PictureInputIcon,
  SendIcon,
  VoiceInputIcon,
  RecordProcessIcon,
  RecordDoneIcon,
  RecordCancelIcon,
  RecordSendIcon,
  RecordFinishedIcon,
} from 'assets/svg/chatIcons';
import {convertTimeFormat} from 'helper/utils';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {dummyImages} from 'helper/constants';
import {compressMedia} from 'helper/utils';

export const SlamBookInput = ({
  text = '',
  attachedMedias = [],
  onAttachMedia = null,
  onChangeText = null,
  onSend = null,
  onAudioSend = null,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    uploadFile: {data: uploadFileData},
  } = useSelector((state: RootState) => state.chats);
  const [recording, setRecording] = React.useState(false);
  const [recordingFinished, setRecordingFinished] = React.useState(false);
  const [recordingStarted, setRecordingStarted] = React.useState(false);
  const [recordingPath, setRecordingPath] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [error, setError] = React.useState(false);

  const recordTimer = React.useRef(null);
  const [recordDuration, setRecordDuration] = React.useState(0);
  const [tagList, setTagList] = React.useState([]);

  const onFileAttach = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });
      if (file.type.startsWith('image')) {
        onAttachMedia && onAttachMedia(file.uri, 'image');
      } else {
        onAttachMedia && onAttachMedia(file.uri, 'video');
      }
    } catch (err) {
      console.log('File attach-err---', err);
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const onMicrophone = async () => {
    const permission = await checkPermission();
    if (permission) {
      setRecording(true);
      recordStart();
      startRecordTimer();
    }
  };

  const startRecordTimer = () => {
    if (recordTimer.current) {
      clearInterval(recordTimer.current);
      recordTimer.current = null;
    }

    setRecordDuration(0);
    recordTimer.current = setInterval(() => {
      setRecordDuration(prev => prev + 1);
    }, 1000);
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

  const sendMessage = () => {
    if (text === '') return;

    const arrTags = getTagList(text);
    const planText = getNormalText(text);

    onSend && onSend(arrTags, planText);
  };

  const getTagList = text => {
    const arrWords = text.split(' ');
    const arrTag = [];
    arrWords.forEach(itemText => {
      if (itemText[0] === '#') {
        arrTag.push(itemText.replaceAll('#', ''));
      }
    });

    return arrTag;
  };

  const getNormalText = text => {
    return text.replaceAll('#', '');
  };

  const cancelRecordAudio = () => {
    recordStop();
    setRecording(false);
    setRecordingFinished(false);
  };

  const recordStart = () => {
    try {
      SoundRecorder.start(
        SoundRecorder.PATH_CACHE + `/recording${Date.now()}.mp4`,
      )
        .then(() => {
          setRecordingStarted(true);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const recordStop = () => {
    try {
      SoundRecorder.stop()
        .then(res => {
          setRecordingFinished(true);
          setRecordingStarted(false);
          setRecordingPath(res.path);
          stopRecordTimer();
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const stopRecordTimer = () => {
    if (recordTimer.current) {
      clearInterval(recordTimer.current);
      recordTimer.current = null;
    }
  };

  const sendRecordAudio = () => {
    setRecording(false);
    setRecordingFinished(false);
    uploadFile(
      'audio',
      {
        uri: Platform.OS === 'ios' ? recordingPath : 'file://' + recordingPath,
        type: 'audio/mp4',
        name: `recording-${new Date().getTime()}.mp4`,
      },
      'sendAudio',
    );
  };

  const uploadFile = async (type, file, endpointName) => {
    if (!file) {
      return;
    }
    let base64String;
    base64String = await compressMedia('audio', file.uri);
    base64String = await getBase64String(base64String);
    const fileMeta = await uploadFileToIPFS(base64String, file.type);
    if (!fileMeta) {
      return;
    }

    onAudioSend && onAudioSend(fileMeta);
  };

  const renderAttachedMedia = () => {
    return (
      <View>
        <View
          style={{
            width: 80,
            height: 3,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            alignSelf: 'center',
            marginBottom: 10,
          }}
        />
        <View
          style={{
            maxWidth: '100%',
            marginBottom: 10,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {attachedMedias.map((item, index) => {
            return (
              <View key={`media_index_${index}`}>
                <Image
                  source={{uri: item.url}}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    marginEnd: 10,
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {!recording ? (
        <View style={styles.root}>
          {attachedMedias.length > 0 && renderAttachedMedia()}
          <View
            style={[
              styles.conatiner,
              text && {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            ]}>
            <TextInput
              style={styles.inputText}
              onChangeText={onChangeText}
              value={text}
              placeholder={'Type your message...'}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <View style={styles.actions}>
              <TouchableOpacity onPress={onFileAttach}>
                <PictureInputIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <VoiceInputIcon onPress={onMicrophone} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendMessage()}>
                <SendIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.recordControl}>
          {recordingStarted ? (
            <View style={styles.control}>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={cancelRecordAudio}>
                <RecordExitIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn}>
                <RecordProcessIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={recordStop}
                disabled={!recordingStarted}>
                <RecordDoneIcon />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.control}>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={cancelRecordAudio}>
                <RecordCancelIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <RecordFinishedIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={sendRecordAudio}
                style={styles.controlBtn}
                disabled={!recordingFinished}>
                <RecordSendIcon />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={[
              styles.duration,
              {
                backgroundColor: recordingStarted ? 'transparent' : '#FF6651',
                opacity: recordingStarted ? 0.5 : 1,
              },
            ]}>
            <Text style={styles.durationTxt}>
              {convertTimeFormat(recordDuration)}
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: 9,
    paddingHorizontal: 26,
    paddingBottom: 26,
  },
  conatiner: {
    padding: 9,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 84,
    flexDirection: 'row',
  },
  inputText: {
    fontFamily: 'Poppins',
    flex: 1,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    paddingHorizontal: 18,
    textAlignVertical: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
  },
  recordControl: {
    paddingTop: 26,
    paddingHorizontal: 26,
    alignItems: 'center',
  },
  control: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  controlBtn: {
    width: 67,
    height: 67,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration: {
    marginTop: 5,
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6651',
  },
  durationTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
  },
});

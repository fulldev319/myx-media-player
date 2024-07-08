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
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import SoundRecorder from 'react-native-sound-recorder';
import chatActions from 'redux/chats/actions';
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
  EmojiInputIcon,
} from 'assets/svg/chatIcons';
import {convertTimeFormat} from 'helper/utils';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {compressMedia} from 'helper/utils';

export const ChatInput = ({
  disabled,
  chat,
  socket,
  addMessage,
  loading,
  onInputFocus,
  onInputBlur,
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
  const [inputText, setInputText] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [error, setError] = React.useState(false);

  const recordTimer = React.useRef(null);
  const [recordDuration, setRecordDuration] = React.useState(0);

  React.useEffect(() => {
    if (uploadFileData) {
      const msg = uploadFileData;
      msg.noAddMessage = true;
      socket.emit('add-message', msg);
      addMessage(msg);
      dispatch(chatActions.uploadChatFileClean());
    }
  }, [uploadFileData]);

  const onChangeText = text => {
    setInputText(text);
  };

  const onCameraPress = () => {
    ImagePicker.openCamera({cropping: false})
      .then(image => {
        const file = {
          uri: image.path,
          type: image.mime,
          name: image.filename || 'Image.jpeg',
        };
        uploadFile('image', file, 'sendPhoto');
      })
      .catch(err => {
        let errorMessage = err.message;
        if (err && err.code === 'E_NO_CAMERA_PERMISSION') {
          errorMessage =
            'You can enable camera access in the system settings to take a photo for Artwork app.';
        }
        setError(errorMessage);
        setShowModal(true);
      });
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

  const onMicrophone = async () => {
    const permission = await checkPermission();
    if (permission) {
      setRecording(true);
      recordStart();
      startRecordTimer();
    }
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

  const cancelRecordAudio = () => {
    recordStop();
    setRecording(false);
    setRecordingFinished(false);
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
    const from = user.id;
    const to =
      user.id === chat.users.userFrom.userId
        ? chat.users.userTo.userId
        : chat.users.userFrom.userId;

    dispatch(
      chatActions.uploadChatFileRequest({
        endpointName,
        room: chat.room,
        from,
        to,
        formData: fileMeta,
      }),
    );
  };

  const onPhoto = () => {
    try {
      ImagePicker.openPicker({cropping: false})
        .then(image => {
          const file = {
            uri: image.path,
            type: image.mime,
            name: image.filename || 'Image.jpeg',
          };
          uploadFile('image', file, 'sendPhoto');
        })
        .catch(err => {
          let errorMessage = err.message;
          if (err && err.code === 'E_NO_LIBRARY_PERMISSION') {
            errorMessage =
              'You can enable library access in the system settings to take a photo for Artwork app.';
          }
          setError(errorMessage);
          setShowModal(true);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onFileAttach = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      if (file.type.startsWith('image')) {
        uploadFile('image', file, 'sendPhoto');
      } else if (file.type.startsWith('video')) {
        uploadFile('video', file, 'addMessageVideo');
      } else if (file.type.startsWith('audio')) {
        uploadFile('audio', file, 'sendAudio');
      } else {
        uploadFile('file', file, 'sendFile');
      }
    } catch (err) {
      console.log('File attach-err---', err);
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const sendMessage = () => {
    if (inputText) {
      const newMessage = {
        room: chat.room,
        message: inputText,
        from: user.id,
        to:
          user.id === chat.users.userFrom.userId
            ? chat.users.userTo.userId
            : chat.users.userFrom.userId,
        created: Date.now(),
        seen: false,
        type: 'text',
        id: Date.now(),
      };
      socket.emit('add-message', newMessage);
      addMessage(newMessage);
      setInputText('');
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

  const stopRecordTimer = () => {
    if (recordTimer.current) {
      clearInterval(recordTimer.current);
      recordTimer.current = null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      pointerEvents={loading || !chat ? 'none' : 'auto'}>
      {!recording ? (
        <View style={styles.root}>
          <View
            style={[
              styles.conatiner,
              inputText && {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            ]}>
            <TouchableOpacity
              disabled={disabled}
              onPress={() => {}}
              style={styles.emojiInput}>
              <EmojiInputIcon disabled={disabled} />
            </TouchableOpacity>
            <TextInput
              editable={!disabled}
              style={styles.inputText}
              onChangeText={onChangeText}
              value={inputText}
              placeholder={'Type your message...'}
              placeholderTextColor={
                disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'
              }
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
            <View style={styles.actions}>
              <TouchableOpacity disabled={disabled} onPress={onFileAttach}>
                <PictureInputIcon disabled={disabled} />
              </TouchableOpacity>
              <TouchableOpacity disabled={disabled} onPress={onMicrophone}>
                <VoiceInputIcon disabled={disabled} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => sendMessage()}>
                <SendIcon disabled={disabled} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  inputText: {
    fontFamily: 'Poppins',
    flex: 1,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    paddingLeft: 10,
    paddingRight: 18,
  },
  emojiInput: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
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

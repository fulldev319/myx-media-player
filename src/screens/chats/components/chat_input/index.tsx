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
import ImagePicker from 'react-native-image-crop-picker';
import SoundRecorder from 'react-native-sound-recorder';
import chatActions from 'redux/chats/actions';
import {RootState} from 'redux/interfaces';
import {
  RecordExitIcon,
  PictureInputIcon,
  VoiceInputIcon,
  RecordProcessIcon,
  RecordDoneIcon,
  RecordCancelIcon,
  RecordSendIcon,
  RecordFinishedIcon,
  EmojiInputIcon,
} from 'assets/svg/chatIcons';
import {SendIcon} from './../../assets/SendIcon';

import {convertTimeFormat} from 'helper/utils';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {compressMedia} from 'helper/utils';
import {styles} from './index.styles';

export const ChatInput = ({
  userId,
  bubbleId,
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

  const [sendingFile, setSendingFile] = React.useState(false);

  const recordTimer = React.useRef(null);
  const [recordDuration, setRecordDuration] = React.useState(0);

  const onChangeText = text => {
    setInputText(text);
  };

  const sendImage = imageUrl => {
    const newMessage = {
      bubble: bubbleId,
      message: '',
      creator: userId,
      hashtags: '',
      media_urls: imageUrl,
      media_types: 'image',
    };

    socket.emit('send-message-to-bubble', newMessage);
    addMessage(newMessage);
  };

  const sendAudio = audioUrl => {
    const newMessage = {
      bubble: bubbleId,
      message: '',
      creator: userId,
      hashtags: '',
      media_urls: audioUrl,
      media_types: 'audio',
    };

    socket.emit('send-message-to-bubble', newMessage);
    addMessage(newMessage);
  };

  const sendMessage = () => {
    if (inputText) {
      const newMessage = {
        bubble: bubbleId,
        message: inputText,
        creator: userId,
        hashtags: '',
        media_urls: '',
        media_types: '',
      };

      socket.emit('send-message-to-bubble', newMessage);
      addMessage(newMessage);
      setInputText('');
    }
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

    sendAudio(fileMeta);
  };

  const onFileAttach = async () => {
    ImagePicker.openPicker({
      title: 'Select image to upload',
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then(async image => {
      setSendingFile(true);

      const imageUrl = await uploadFileToIPFS(image.data, image.mime);
      if (imageUrl) {
        sendImage(imageUrl);
      } else {
        console.log('failed02');
      }

      setSendingFile(false);
    });
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
      //   pointerEvents={loading || !chat ? 'none' : 'auto'}
    >
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
                disabled={disabled || sendingFile}
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

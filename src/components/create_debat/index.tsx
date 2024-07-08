import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {compressMedia} from 'helper/utils';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
} from 'react-native';
import RtcEngine, {
  AudioProfile,
  AudioScenario,
  ChannelProfile,
  ClientRole,
  RtcEngineContext,
} from 'react-native-agora';
import Config from 'react-native-config';
import RNFS from 'react-native-fs';
import {launchImageLibrary} from 'react-native-image-picker';
import {apiCreateDebate} from 'helper/mapHelper';
import {useNavigation} from '@react-navigation/native';
import {RoundCloseIcon} from 'assets/svg';

const RECORDING_PATH = `${RNFS.DocumentDirectoryPath}/audio.acc`;

export const CreateDebatPage = () => {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordPath, setRecordPath] = useState('');
  const [desc, setDesc] = useState('');
  const [arrMedia, setArrMedia] = useState([]);

  const durationRef = useRef(0);
  const _engineRef = useRef(null);

  useEffect(() => {
    _initEngine();

    return () => {
      _engineRef?.current.destroy();
    };
  }, []);

  const _initEngine = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request('android.permission.RECORD_AUDIO');
      await PermissionsAndroid.request(
        'android.permission.READ_EXTERNAL_STORAGE',
      );
      await PermissionsAndroid.request(
        'android.permission.WRITE_EXTERNAL_STORAGE',
      );
    }

    _engineRef.current = await RtcEngine.createWithContext(
      new RtcEngineContext(Config.AGORA_APP_ID),
    );

    _addListeners();

    await _engineRef.current.setAudioProfile(
      AudioProfile.MusicHighQualityStereo,
      AudioScenario.GameStreaming,
    );
    await _engineRef.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await _engineRef.current?.setClientRole(ClientRole.Broadcaster);
    await _engineRef.current?.disableVideo();
    await _engineRef.current.setDefaultAudioRoutetoSpeakerphone(true);
  };

  const _addListeners = () => {
    _engineRef.current?.addListener('Warning', warningCode => {
      console.info('Warning', warningCode);
    });
    _engineRef.current?.addListener('Error', errorCode => {
      console.info('Error', errorCode);
    });
    _engineRef.current?.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.info('JoinChannelSuccess', channel, uid, elapsed);
        setIsRecording(true);
      },
    );
    _engineRef.current?.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      durationRef.current = stats.duration;
      setIsRecording(false);
    });
  };

  const startRecorder = async () => {
    setIsRecording(true);
    setRecordPath('');

    await _engineRef.current
      ?.joinChannel(
        '007eJxTYCjcaufiMKtiX0vo+/uRU39p9xlK/7M3XCJpwM0103r2AwEFBuPkRMu0VEODtORUQ5M0y5SkpNRUg2RDoIilgaWlgXnQFsHkS6zCyfIm95kYGSAQxOdkCEpNzi9KycxLZ2AAAKMRIJo=',
        'Recording',
        null,
        0,
      )
      .then(async () => {
        const path = RECORDING_PATH;
        _engineRef.current
          ?.startAudioRecordingWithConfig({
            filePath: path,
            recordingQuality: 2,
          })
          .then(() => {})
          .catch(err => console.log('error while starting recording =>', err));
      })
      .catch(err => {
        console.log('error while joining channel =>', err);
        setIsRecording(false);
      });
  };

  const stopRecorder = async () => {
    await _engineRef.current
      ?.leaveChannel()
      .then(() => {
        setIsRecording(false);
        setRecordPath(RECORDING_PATH);
      })
      .catch(() => {
        setIsRecording(false);
      });
  };

  const onUpload = async () => {
    let base64String;
    base64String = await getBase64String(
      Platform.OS === 'android' ? 'file://' : '' + RECORDING_PATH,
    );
    const fileMeta = await uploadFileToIPFS(base64String, 'audio/acc');
    if (!fileMeta) {
      return;
    }

    const dummyUrl =
      'https://ipfs.filebase.io/ipfs/QmU9rKYsZadZsAnceBc7pppbEDtFhsmWQJQjkkYg3QDxZ1';
    const mediaUrls = await Promise.all(arrMedia.map(uploadFile));
    const mediaTypes = arrMedia.map((item, _) => {
      return item.type;
    });

    const res = await apiCreateDebate(
      fileMeta,
      durationRef.current,
      [],
      '2',
      desc,
      [],
      '',
      mediaUrls,
      mediaTypes,
    );

    if (res.success) {
      console.log('--- success', res);
      setArrMedia([]);
      setDesc('');
      durationRef.current = 0;
    } else {
      console.log(res);
    }

    setIsRecording(false);
    setRecordPath('');
  };

  const uploadFile = async (item, index) => {
    let base64String;
    base64String = await compressMedia(item.type, item.uri);
    base64String = await getBase64String(base64String);

    const mediaUrl = await uploadFileToIPFS(
      base64String,
      item.type === 'video' ? 'video/mp4' : 'image/jpeg',
    );

    return mediaUrl;
  };

  const onAddMedia = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 0,
    });

    const newMedias = result.assets.map((media, index) => {
      if (media.type.includes('image')) {
        return {
          type: 'image',
          uri: media.uri,
        };
      } else {
        return {
          type: 'video',
          uri: media.uri,
        };
      }
    });

    setArrMedia(prev => [...prev, ...newMedias]);
  };

  const onClose = () => {
    navigation.goBack();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <RoundCloseIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Create Debate</Text>
      </View>
    );
  };

  const renderMedias = () => {
    return (
      <View
        style={{
          width: '100%',
          flexGrow: 1,
          flexDirection: 'row',
          marginTop: 50,
        }}>
        {arrMedia.map((item, index) => {
          if (item.type === 'image') {
            return (
              <Image
                source={{uri: item.uri}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  backgroundColor: 'blue',
                  borderWidth: 1,
                  borderColor: 'white',
                  marginEnd: 20,
                }}
              />
            );
          } else {
            return (
              <Image
                source={{uri: item.uri}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  backgroundColor: 'blue',
                  borderWidth: 1,
                  borderColor: 'white',
                  marginEnd: 20,
                }}
              />
            );
          }
        })}
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <View>
        <TextInput
          value={desc}
          placeholder="Description"
          placeholderTextColor="gray"
          onChangeText={text => setDesc(text)}
          style={{
            width: 250,
            height: 45,
            backgroundColor: 'transparent',
            borderRadius: 10,
            borderColor: 'white',
            borderWidth: 1,
            paddingHorizontal: 20,
            color: 'white',
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderHeader()}
      {renderMedias()}
      {renderDescription()}
      <TouchableOpacity
        style={styles.btnBtn}
        onPress={() => {
          onAddMedia();
        }}>
        <Text style={styles.txtBtn}>{'Add Medias'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnBtn}
        onPress={() => {
          if (isRecording) {
            stopRecorder();
          } else {
            startRecorder();
          }
        }}>
        <Text style={styles.txtBtn}>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
      {recordPath !== '' && (
        <TouchableOpacity style={styles.btnBtn} onPress={onUpload}>
          <Text style={styles.txtBtn}>Upload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBtn: {
    width: 250,
    height: 45,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtn: {
    color: 'black',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 36,
    marginHorizontal: 26,
  },
  title: {
    position: 'absolute',
    left: 50,
    right: 50,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {Component, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Constants} from '../constants';
import {Colors, Fonts} from '../res';

import {Picker} from '@react-native-picker/picker';
import RtcEngine, {
  AudioEffectPreset,
  AudioEqualizationBandFrequency,
  AudioProfile,
  AudioReverbType,
  AudioScenario,
  ChannelProfile,
  ClientRole,
  RtcEngineContext,
  VoiceBeautifierPreset,
} from 'react-native-agora';

import {hp, wp} from '../global';
import Sound from 'react-native-sound';
const config = require('../config/agora.config.json');

export default class VoiceChanger extends Component<any> {
  _engine?: RtcEngine;
  _audioEffectPreset: AudioEffectPreset = 0;

  state: {
    recording: any;
    recordingPath: any;
    play: any;
    pause: any;
    loading: any;
    sound: any;
  } = {
    recording: false,
    recordingPath: '',
    play: false,
    pause: true,
    loading: false,
    sound: '',
  };

  _initEngine = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request('android.permission.RECORD_AUDIO');
      await PermissionsAndroid.request(
        'android.permission.READ_EXTERNAL_STORAGE',
      );
      await PermissionsAndroid.request(
        'android.permission.WRITE_EXTERNAL_STORAGE',
      );
    }

    this._engine = await RtcEngine.createWithContext(
      new RtcEngineContext(config.appId),
    );
    this._addListeners();

    await this._engine.setAudioProfile(
      AudioProfile.MusicHighQualityStereo,
      AudioScenario.GameStreaming,
    );
    await this._engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await this._engine?.setClientRole(ClientRole.Broadcaster);
    await this._engine?.disableVideo();
    await this._engine.setDefaultAudioRoutetoSpeakerphone(true);
  };

  _addListeners = () => {
    this._engine?.addListener('Warning', warningCode => {
      console.info('Warning', warningCode);
    });
    this._engine?.addListener('Error', errorCode => {
      console.info('Error', errorCode);
    });
    this._engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.info('JoinChannelSuccess', channel, uid, elapsed);
      this.setState({recording: true});
    });
    this._engine?.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      this.setState({recording: false});
    });
  };

  UNSAFE_componentWillMount() {
    this._initEngine();
  }

  componentWillUnmount() {
    this._engine?.destroy();
  }

  startRecorder = async () => {
    this.setState({recording: true, loading: true, recordingPath: ''});
    await this._engine
      ?.joinChannel(
        '007eJxTYCjcaufiMKtiX0vo+/uRU39p9xlK/7M3XCJpwM0103r2AwEFBuPkRMu0VEODtORUQ5M0y5SkpNRUg2RDoIilgaWlgXnQFsHkS6zCyfIm95kYGSAQxOdkCEpNzi9KycxLZ2AAAKMRIJo=',
        'Recording',
        null,
        0,
      )
      .then(async () => {
        this.setState({loading: false});
        var path;
        if (Platform.OS === 'android') {
          path = Constants.RECORDING_PATH;
        } else {
          path = Constants.RECORDING_PATH_IOS;
        }
        this._engine
          ?.startAudioRecordingWithConfig({
            filePath: path,
          })
          .then(() => {})
          .catch(err => console.log('error while starting recording =>', err));
      })
      .catch(err => {
        console.log('error while joining channel =>', err);
        this.setState({loading: false, recording: false});
      });
  };

  stopRecorder = async () => {
    this.setState({loading: true});
    var path;
    if (Platform.OS === 'android') {
      path = Constants.RECORDING_PATH;
    } else {
      path = Constants.RECORDING_PATH_IOS;
    }
    await this._engine
      ?.leaveChannel()
      .then(() => {
        this.setState({
          loading: false,
          recording: false,
          recordingPath: path,
        });
      })
      .catch(() => {
        this.setState({loading: false, recording: false});
      });
  };

  playSound = () => {
    this.setState({pause: false, play: true});
    //@ts-ignore
    var whoosh = new Sound(`${this.state.recordingPath}`, '', error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
      whoosh.play(success => {
        if (success) {
          this.pauseSound();
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
    this.setState({sound: whoosh});
  };

  pauseSound = () => {
    const {sound} = this.state;
    if (sound.length !== 0) {
      // sound.pause()
      sound.stop();
      this.setState({pause: true, play: false});
    }
  };

  render() {
    const {recording, loading, play, pause, recordingPath} = this.state;
    return (
      <SafeAreaView style={Style.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
        {recording && !loading && (
          <Text style={Style.recordingTxt}>Recording...</Text>
        )}
        <TouchableOpacity
          style={Style.recordBtn}
          onPress={recording ? this.stopRecorder : this.startRecorder}>
          {loading ? (
            <ActivityIndicator color={Colors.white} size={wp(5)} />
          ) : (
            <Text style={Style.recordTxt}>
              {recording ? 'Stop Recorder' : 'Start Recorder'}
            </Text>
          )}
        </TouchableOpacity>
        <PickerView
          type={AudioEffectPreset}
          onPress={(value: AudioEffectPreset) => {
            this._audioEffectPreset = value;
            this._engine?.setAudioEffectPreset(this._audioEffectPreset);
          }}
        />
        {play && <Text style={Style.recordingTxt}>Playing...</Text>}
        {recordingPath.length !== 0 && (
          <TouchableOpacity
            style={Style.recordBtn}
            onPress={pause ? this.playSound : this.pauseSound}>
            {loading ? (
              <ActivityIndicator color={Colors.white} size={wp(5)} />
            ) : (
              <Text style={Style.recordTxt}>{pause ? 'Play' : 'Stop'}</Text>
            )}
          </TouchableOpacity>
        )}
        {recordingPath.length !== 0 && (
          <TouchableOpacity
            style={{...Style.recordBtn, backgroundColor: Colors.color10}}
            onPress={this.props.onSelect}>
            <Text style={Style.recordTxt}>Use</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }
}

const PickerView = ({type, onPress}: {type: any; onPress: Function}) => {
  const items = Object.values(type);
  const keys = items.filter(v => typeof v === 'string') as string[];
  const values = items.filter(v => typeof v === 'number') as number[];
  const [value, setValue] = useState(values[0]);
  return (
    <View
      style={{
        width: wp(50),
        marginBottom: hp(5),
        paddingVertical: hp(0.4),
        borderWidth: 1,
        borderRadius: 8,
      }}>
      <Picker
        selectedValue={value}
        onValueChange={itemValue => {
          setValue(itemValue);
          onPress(itemValue);
        }}
        dropdownIconColor={Colors.black}>
        {keys.map((v, i) => (
          <Picker.Item
            key={i}
            label={v}
            value={values[i]}
            color={Colors.black}
          />
        ))}
      </Picker>
    </View>
  );
};

const Style = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  recordBtn: {
    width: wp(50),
    paddingVertical: wp(4),
    borderRadius: 8,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(5),
  },
  recordTxt: {
    color: Colors.white,
    fontFamily: Fonts.APPFONT_SB,
    fontSize: wp(4),
    marginBottom: Constants.FONTFAMILY_MARGINBOTTOM,
  },
  recordingTxt: {
    color: Colors.black,
    fontSize: wp(4),
    fontFamily: Fonts.APPFONT_R,
    marginBottom: hp(1),
  },
});

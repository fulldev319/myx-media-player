import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Svg, {Circle, Path} from 'react-native-svg';
import {useDispatch} from 'react-redux';
import SoundRecorder from 'react-native-sound-recorder';
import appAction from 'redux/app/actions';
import LinearGradient from 'react-native-linear-gradient';
import Config from 'react-native-config';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

enum SearchStep {
  Start,
  Listening,
  Searching,
  Expanding,
  Tought,
  NoResult,
}

const checkMicrophonePermission = async () => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }

  let result;
  try {
    result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message:
          'Enter the Gunbook needs access to your microphone so you can search with voice.',
        buttonPositive: '',
      },
    );
  } catch (error) {
    console.error('failed getting permission, result:', result);
  }
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const AnimatedWaveIcon = () => {
  const animValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      {iterations: 1000},
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wave,
        {
          transform: [
            {
              scale: animValue,
            },
          ],
        },
      ]}>
      <RedWaveIcon />
    </Animated.View>
  );
};

export const MagicSearchPage = () => {
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const closePage = () => {
    dispatch(appAction.dismissMagicSearchDialog());
  };
  const counterRecordingRef = useRef<number>();
  const counterApiRef = useRef<number>();
  const [step, setStep] = useState<SearchStep>(SearchStep.Start);

  const startListening = async () => {
    try {
      if (!(await checkMicrophonePermission())) {
        return;
      }
      counterRecordingRef.current = 4;
      counterApiRef.current = 4;
      setStep(SearchStep.Listening);
      startRecording();
    } catch (err) {
      console.log(err);
    }
  };

  const startRecording = async () => {
    try {
      await SoundRecorder.start(
        SoundRecorder.PATH_CACHE + `/recording${Date.now()}.mp4`,
      );
      setTimeout(async () => {
        await stopRecording();
        if (counterRecordingRef.current > 1) {
          counterRecordingRef.current -= 1;
          startRecording();
        }
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const stopRecording = async () => {
    try {
      const res = await SoundRecorder.stop();
      if (!res.path) {
        return;
      }
      processRecord(res.path);
    } catch (err) {
      console.log(err);
    }
  };

  const processRecord = async (path: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: 'file://' + path,
        type: 'audio/mpeg',
        name: 'recording.mp3',
      });

      const response = await fetch(Config.SHAZAM_RECOGNIZER_API ?? '', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const json = await response.json();
      console.log(`Shazam Fingerprint(${counterApiRef.current})`, json);
      if (Number(json.hits ?? '0') > 0) {
        navigate('MagicMatchPage', {
          tracks: json.tracks,
        });
        closePage();
        counterRecordingRef.current = 1;
      }
    } catch (err) {
      console.log(err);
    } finally {
      if (counterApiRef.current === 1) {
        setStep(SearchStep.NoResult);
      } else if (counterApiRef.current === 2) {
        setStep(SearchStep.Tought);
      } else if (counterApiRef.current > 2) {
        setStep(SearchStep.Expanding);
      }
      counterApiRef.current -= 1;
    }
  };

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [400, 400], []);

  const sheetChanges = useCallback((index: number) => {
    if (index === -1) {
      dispatch(appAction.dismissMagicSearchDialog());
    }
  }, []);

  useEffect(() => {
    sheetRef.current.present();
  }, []);

  return (
    <View style={[styles.root]}>
      <BottomSheetModal
        ref={sheetRef}
        index={1}
        backgroundStyle={{
          marginTop: -30,
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={styles.closeBtn}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={sheetChanges}>
        <View style={styles.container}>
          <View style={{flex: 1}} />
          <View style={styles.mainContainer}>
            <View style={styles.actionContainer}>
              {step === SearchStep.Start && (
                <>
                  <View style={styles.wave}>
                    <WaveIcon size={100} />
                  </View>
                  <View style={styles.action}>
                    <Text style={styles.typo01}>Magic Search</Text>
                    <Text style={styles.typo02}>
                      Find a song by listening to your surroundings
                    </Text>
                    <LinearGradient
                      colors={['#FF3F3F', '#FF701F']}
                      style={{borderRadius: 32, height: 45}}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={startListening}>
                        <Text style={styles.typo03}>Start Listening</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </>
              )}
              {step === SearchStep.Listening && (
                <>
                  <AnimatedWaveIcon />
                  <View style={styles.action}>
                    <Text style={styles.typo01}>Listening for music</Text>
                    <Text style={styles.typo02}>
                      Make sure your device can hear the song clearly
                    </Text>
                  </View>
                </>
              )}
              {step === SearchStep.Searching && (
                <>
                  <AnimatedWaveIcon />
                  <View style={styles.action}>
                    <Text style={styles.typo01}>Searching for a match</Text>
                    <Text style={styles.typo02}>please wait</Text>
                  </View>
                </>
              )}
              {step === SearchStep.Expanding && (
                <>
                  <AnimatedWaveIcon />
                  <View style={styles.action}>
                    <Text style={styles.typo01}>Expanding search</Text>
                    <Text style={styles.typo02}>Hang tight</Text>
                  </View>
                </>
              )}
              {step === SearchStep.Tought && (
                <>
                  <AnimatedWaveIcon />
                  <View style={styles.action}>
                    <Text style={styles.typo01}>This is tought</Text>
                    <Text style={styles.typo02}>Last try</Text>
                  </View>
                </>
              )}
              {step === SearchStep.NoResult && (
                <>
                  <View style={styles.wave}>
                    <Text style={styles.cryIcon}>😢</Text>
                    <Text style={styles.typo04}>No Result</Text>
                  </View>
                  <View style={styles.action}>
                    <LinearGradient
                      colors={['#FF3F3F', '#FF701F']}
                      style={{borderRadius: 32, height: 45}}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={startListening}>
                        <Text style={styles.typo03}>Try Again</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000CC',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContainer: {
    height: 372,
    backgroundColor: '#1F1F1F',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
  },
  clseContainer: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    width: 56,
    height: 4,
    borderRadius: 4,
  },
  actionContainer: {
    flex: 1,
    alignItems: 'center',
  },
  wave: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  action: {
    alignItems: 'center',
    paddingBottom: 31,
  },
  typo01: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 13,
  },
  typo02: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
    marginBottom: 45,
  },
  cryIcon: {
    fontSize: 50,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  actionBtn: {
    height: 45,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 267,
    marginBottom: 31,
  },
  typo03: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  typo04: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    opacity: 0.6,
    marginTop: 7,
  },
});

const WaveIcon = ({size}) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Circle cx={50} cy={50} r={50} fill="white" fillOpacity={0.2} />
    <Circle cx={50} cy={49.9999} r={34.4444} fill="white" fillOpacity={0.2} />
    <Circle cx={50} cy={50.0001} r={23.3333} fill="white" fillOpacity={0.2} />
    <Path
      d="M50.9259 40.7407L41.6667 51.8518H50L49.0741 59.2592L58.3333 48.1481H50L50.9259 40.7407Z"
      stroke="white"
      strokeWidth={1.11111}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const RedWaveIcon = ({size = 142}: {size?: number | string}) => (
  <Svg width={size} height={size} viewBox="0 0 142 142" fill="none">
    <Circle cx="71" cy="71" r="71" fill="#FF6651" fillOpacity="0.2" />
    <Circle cx="71" cy="71" r="48.9111" fill="#FF6651" fillOpacity="0.2" />
    <Circle cx="71" cy="70.9995" r="33.1333" fill="#FF6651" fillOpacity="0.2" />
    <Path
      d="M72.3148 57.8525L59.1667 73.6303H71L69.6852 84.1488L82.8334 68.3711H71L72.3148 57.8525Z"
      stroke="#FF6651"
      strokeWidth="1.57778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

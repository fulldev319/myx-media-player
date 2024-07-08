/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import SwitchToggle from 'react-native-switch-toggle';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';

import {styles} from './index.styles';
import {SCREEN_HEIGHT} from 'helper/utils';
import {getDefaultAvatar} from 'helper/userHelpers';
import {
  // apiGetRadioData,
  apiGetRadioQueue,
  apiSendAudioRequest,
  apiGetAudioRequests,
  apiGetListeners,
} from 'helper/radioHelpers';
import {
  ArrowDownIcon,
  ArrwoUpIcon,
  RedCloseSmallIcon,
  RedGraphSmallIcon,
  RedVolumnSmallIcon,
  WhiteMicIcon,
} from 'assets/svg';
import MenuIcon from 'assets/svg/MenuIcon';
import moment from 'moment';
import {useToast} from 'native-base';
// import {eventEnterRadio, eventExitRadio} from 'helper/socketHelper';
// import {useSelector} from 'react-redux';
// import {RootState} from 'redux/interfaces';
import CloseGrayIcon from 'assets/svg/CloseGrayIcon';
import SoundRecorder from 'react-native-sound-recorder';
import {
  RecordExitIcon,
  RecordDoneIcon,
  RecordSendIcon,
  RecordFinishedIcon,
  RecordProcessWhiteIcon,
  RecordCancelWhiteIcon,
} from 'assets/svg/chatIcons';
import {convertTimeFormat} from 'helper/utils';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {compressMedia} from 'helper/utils';
// import {socket} from 'screens/Auth';
// import {PlayingStatus, useTracks} from 'contexts/TrackContext';

export const MapLiveRadio = ({show, onClose, radio}) => {
  const toast = useToast();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [SCREEN_HEIGHT - 40, SCREEN_HEIGHT - 40],
    [],
  );
  // const {user} = useSelector((state: RootState) => state.auth);
  // const {curTrack, playTrack, togglePlayer, playOneTrack} = useTracks();

  const [liveRadioData, setLiveRadioData] = useState(null);
  const [loadingSendingAudioRequest, setLoadingSendingAudioRequest] =
    useState(false);

  const [isOpenedListner, setIsOpenedListner] = useState(false);
  const [arrListenerData, setArrListenerData] = useState([]);
  const [hasMoreListener, setHasMoreListener] = useState(true);
  const [loadingListener, setLoadingListener] = useState(false);
  const [listenerLastId, setListenerLastId] = useState(0);

  const [isOpenedLiveRadioQueue, setIsOpenedLiveRadioQueue] = useState(false);
  const [arrLiveQueueData, setArrLiveQueueData] = useState([]);
  const [hasMoreQueue, setHasMoreQueue] = useState(true);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [queueLastId, setQueueLastId] = useState(0);

  const [isOpenedAudioRequest, setIsOpenedAudioRequest] = useState(false);
  const [arrAudioRequestData, setArrAudioRequestData] = useState([]);
  const [hasMoreAudioRequest, setHasMoreAudioRequest] = useState(true);
  const [loadingAudioRequest, setLoadingAudioRequest] = useState(false);
  const [audioRequestLastId, setAudioRequestLastId] = useState(0);

  const [recording, setRecording] = React.useState(false);
  const [recordingFinished, setRecordingFinished] = React.useState(false);
  const [recordingStarted, setRecordingStarted] = React.useState(false);
  const [recordingPath, setRecordingPath] = React.useState('');
  const recordTimer = React.useRef(null);
  const [recordDuration, setRecordDuration] = React.useState(0);

  // const [currentRadioSong, setCurrentRadioSong] = React.useState(undefined);

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
      // eventEnterRadio(user.id, radio);
      // socket.on('radio', data => {
      //   if (data) {
      //     const currentSong = {
      //       id: data?.actual_song_data?.song_id,
      //       image: data?.actual_song_data?.song_image_url,
      //       title: data?.actual_song_data?.song_title,
      //       artists: [data?.actual_song_data?.artist_1],
      //       description: '',
      //       url: data?.actual_song_data?.song_url,
      //       previewUrl: data?.actual_song_data?.song_url,
      //     };
      //     setCurrentRadioSong(currentSong);
      //   }
      // });
    } else {
      sheetRef.current?.close();
      // eventExitRadio(user.id, radio);
    }
  }, [show]);

  // useEffect(() => {
  //   if (currentRadioSong && currentRadioSong.id) {
  //     if (curTrack?.id === currentRadioSong.id) {
  //       togglePlayer();
  //     } else {
  //       playOneTrack(currentRadioSong, radio, true);
  //     }
  //   }
  // }, [currentRadioSong]);

  // useEffect(() => {
  //   apiGetRadioData(radio).then(res => {
  //     if (res.sucess) {
  //       setLiveRadioData(res.data);
  //       if (!currentRadioSong) {
  //         playOneTrack(res?.data?.playingTrack, radio, true);
  //       }
  //     }
  //   });
  // }, [radio]);

  useEffect(() => {
    if (isOpenedLiveRadioQueue) {
      loadQueue();
    }
  }, [isOpenedLiveRadioQueue]);

  useEffect(() => {
    if (isOpenedAudioRequest) {
      loadAudioRequests();
    }
  }, [isOpenedAudioRequest]);

  useEffect(() => {
    if (isOpenedListner) {
      loadListeners();
    }
  }, [isOpenedListner]);

  const loadQueue = async () => {
    if (!hasMoreQueue || loadingQueue) {
      return;
    }

    try {
      setLoadingQueue(true);
      const res = await apiGetRadioQueue(radio, queueLastId);
      if (res.success) {
        setHasMoreQueue(res.hasMore);
        setQueueLastId(res.lastId);
        if (res.data && res.data.length > 0) {
          setArrLiveQueueData(prev => [...prev, ...res.data]);
        }
      }
    } catch (error) {
      console.log('queue error: ', error);
    } finally {
      setLoadingQueue(false);
    }
  };

  const loadAudioRequests = async () => {
    if (!hasMoreAudioRequest || loadingAudioRequest) {
      return;
    }

    try {
      setLoadingAudioRequest(true);
      const res = await apiGetAudioRequests(radio, audioRequestLastId);
      if (res.success) {
        setHasMoreAudioRequest(res.hasMore);
        setAudioRequestLastId(res.lastId);
        if (res.data && res.data.length > 0) {
          setArrAudioRequestData(prev => [...prev, ...res.data]);
        }
      }
    } catch (error) {
      console.log('audio request error: ', error);
    } finally {
      setLoadingAudioRequest(false);
    }
  };

  const loadListeners = async () => {
    if (!hasMoreListener || loadingListener) {
      return;
    }

    try {
      setLoadingListener(true);
      const res = await apiGetListeners(radio, listenerLastId);
      if (res.success) {
        setHasMoreListener(res.hasMore);
        setListenerLastId(res.lastId);
        if (res.data && res.data.length > 0) {
          setArrListenerData(prev => [...prev, ...res.data]);
        }
      }
    } catch (error) {
      console.log('listener error: ', error);
    } finally {
      setLoadingListener(false);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    } else {
    }
  }, []);

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

  const onMicrophone = async () => {
    const permission = await checkPermission();
    if (permission) {
      setRecording(true);
      recordStart();
      startRecordTimer();
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

  const cancelRecordAudio = () => {
    recordStop();
    setRecording(false);
    setRecordingFinished(false);
  };

  const stopRecordTimer = () => {
    if (recordTimer.current) {
      clearInterval(recordTimer.current);
      recordTimer.current = null;
    }
  };

  const sendRecordAudio = async () => {
    if (loadingSendingAudioRequest) {
      return;
    }

    try {
      setLoadingSendingAudioRequest(true);

      const file = {
        uri: Platform.OS === 'ios' ? recordingPath : 'file://' + recordingPath,
        type: 'audio/mp4',
      };
      let base64String;
      base64String = await compressMedia('audio', file.uri);
      base64String = await getBase64String(base64String);
      const fileMeta = await uploadFileToIPFS(base64String, file.type);

      const res = await apiSendAudioRequest(radio, fileMeta, recordDuration);
      if (res.success) {
        toast.show({
          render: () => {
            return (
              <View style={styles.toast}>
                <Text style={styles.toastTxt}>
                  Send audio requests successfully!
                </Text>
              </View>
            );
          },
        });
      }
    } catch (error) {
      console.log('sending audio request error: ', error);
    } finally {
      setLoadingSendingAudioRequest(false);
      setRecording(false);
      setRecordingFinished(false);
    }
  };

  const getDurationTime = duration => {
    const padTimeValueString = value => value.toString().padStart(2, '0');

    if (!Number.isFinite(duration)) {
      return '';
    }
    let seconds = Math.floor(duration % 60),
      minutes = Math.floor((duration / 60) % 60),
      hours = Math.floor((duration / (60 * 60)) % 24);

    const isHrsZero = hours === 0;
    hours = isHrsZero ? 0 : padTimeValueString(hours);
    minutes = padTimeValueString(minutes);
    seconds = padTimeValueString(seconds);

    if (isHrsZero) {
      return minutes + ':' + seconds;
    }

    return hours + ':' + minutes + ':' + seconds;
  };

  // const renderPlayerControls = () => {
  //   // const {customStyles, showDuration} = this.props;
  //   return (
  //     <View
  //       style={{
  //         height: 48,
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //         width: '100%',
  //       }}>
  //       <TouchableOpacity
  //         onPress={() => {}}
  //         style={{color: '#fff', padding: 8}}>
  //         <Icon
  //           style={{color: '#fff', padding: 8}}
  //           name={true ? 'pause' : 'play-arrow'}
  //           size={20}
  //         />
  //       </TouchableOpacity>
  //       <SmallWaveProgress progress={100} />
  //       {true && (
  //         <>
  //           <Text style={{fontSize: 10, fontWeight: '400', color: '#010101'}}>
  //             {getDurationTime(0)}
  //           </Text>
  //         </>
  //       )}
  //     </View>
  //   );
  // };

  const renderPersonsView = () => {
    return (
      <View style={styles.personViewContainer}>
        <View style={styles.sideImageContainer}>
          <Image
            source={
              liveRadioData &&
              liveRadioData.cohosts &&
              liveRadioData.cohosts[0] &&
              liveRadioData.cohosts[0].image
                ? {uri: liveRadioData.cohosts[0].image}
                : getDefaultAvatar()
            }
            style={styles.personImage}
          />
        </View>
        <View style={styles.centerImageContainer}>
          <View style={styles.centerImageContainer2}>
            <View style={styles.centerImageContainer3}>
              <Image
                source={
                  liveRadioData?.image
                    ? {uri: liveRadioData.image}
                    : getDefaultAvatar()
                }
                style={styles.personImage}
              />
            </View>
          </View>
        </View>
        <View style={styles.sideImageContainer}>
          <Image
            source={
              liveRadioData &&
              liveRadioData.cohosts &&
              liveRadioData.cohosts[1] &&
              liveRadioData.cohosts[1].image
                ? {uri: liveRadioData.cohosts[1].image}
                : getDefaultAvatar()
            }
            style={styles.personImage}
          />
        </View>
      </View>
    );
  };

  const renderInfoView = () => {
    return (
      <View style={styles.infoView}>
        <Text style={styles.infoTitle}>Midnight Jams</Text>
        <Text style={styles.infoDesc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui urna odio
          feugiat risus.
        </Text>
      </View>
    );
  };

  const renderPlayerView = () => {
    return (
      <View style={styles.playerView}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['rgba(255, 102, 81, 0.15)', 'rgba(255, 102, 81, 0)']}
          style={[
            StyleSheet.absoluteFill,
            {
              padding: 12,
              borderRadius: 10,
            },
          ]}>
          <View style={styles.trackView}>
            <Image
              source={{
                uri:
                  liveRadioData?.playingTrack &&
                  liveRadioData?.playingTrack.image
                    ? liveRadioData.playingTrack.image
                    : 'https://thumbs.dreamstime.com/b/forest-panorama-rays-sunlight-scenic-fresh-green-deciduous-trees-sun-casting-its-light-foliage-53826213.jpg',
              }}
              style={styles.trackImage}
            />
            <View style={styles.trackInfo}>
              <Text style={styles.txtNowPlaying}>Now Playing</Text>
              <Text style={styles.txtTrackTitle}>
                {liveRadioData?.playingTrack?.title}
              </Text>
              <Text style={styles.txtTrackArtist}>
                {liveRadioData?.playingTrack?.artists[0]}
              </Text>
            </View>
            <RedGraphSmallIcon />
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderOnQueue = () => {
    return (
      <View style={{marginTop: -50, marginHorizontal: 16}}>
        <TouchableOpacity
          style={styles.onQueueMainContainer}
          onPress={() => setIsOpenedLiveRadioQueue(prev => !prev)}>
          <Text style={styles.txtOnQueue}>{`On Queue (${
            liveRadioData?.queueNumber - 1
          })`}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#010101',
                marginRight: 16,
              }}>
              {moment
                .utc(liveRadioData?.playingTrack?.duration * 1000)
                .format('HH:mm:ss')}
            </Text>
            {!isOpenedLiveRadioQueue ? (
              <ArrowDownIcon color={'#FF6651'} />
            ) : (
              <ArrwoUpIcon color={'#FF6651'} />
            )}
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={!isOpenedLiveRadioQueue}>
          <View>
            {arrLiveQueueData && arrLiveQueueData.length > 0 ? (
              arrLiveQueueData.map((item, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 24,
                  }}>
                  <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        color: '#00000060',
                      }}>
                      {index}
                    </Text>
                    <Image
                      source={
                        item?.image ? {uri: item?.image} : getDefaultAvatar()
                      }
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 6,
                        marginHorizontal: 12,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#010101',
                        }}>
                        {item?.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '400',
                          color: '#01010160',
                        }}>
                        {item?.artists ? item?.artists[0] : ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        color: '#01010160',
                        marginRight: 12,
                      }}>
                      {moment.utc(item?.duration * 1000).format('HH:mm:ss')}
                    </Text>
                    <TouchableOpacity>
                      <MenuIcon />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : loadingQueue ? (
              <View
                style={{width: '100%', alignItems: 'center', marginTop: 32}}>
                <ActivityIndicator size="large" color="#777777" />
              </View>
            ) : (
              <View style={{width: '100%', alignItems: 'center', marginTop: 8}}>
                <Text
                  style={{fontSize: 12, fontWeight: '500', color: '#010101'}}>
                  No Data
                </Text>
              </View>
            )}
          </View>
        </Collapsible>
      </View>
    );
  };

  const renderOpenAudioRequest = () => {
    return (
      <View style={styles.openAudioRequestContainer}>
        <Text style={styles.txtOpenAUdioRequest}>Open for Audio Request</Text>
        <SwitchToggle
          switchOn={liveRadioData?.openRequests}
          onPress={() => {}}
          containerStyle={styles.switchContianer}
          circleStyle={styles.switchCircle}
          circleColorOn="white"
          circleColorOff="white"
          backgroundColorOn="#FF3F3F"
          backgroundColorOff="rgba(0, 0, 0, 0.15)"
        />
      </View>
    );
  };

  const renderListeners = () => {
    return (
      <View style={styles.listenerContainer}>
        <View>
          <TouchableOpacity
            style={styles.onQueueMainContainer}
            onPress={() => setIsOpenedListner(prev => !prev)}>
            <Text
              style={
                styles.txtOnQueue
              }>{`Listeners (${liveRadioData?.listeners})`}</Text>
            {isOpenedListner ? (
              <ArrwoUpIcon color="#000000" />
            ) : (
              <ArrowDownIcon color="#000000" />
            )}
          </TouchableOpacity>
        </View>
        <Collapsible collapsed={!isOpenedListner}>
          <View>
            {arrListenerData && arrListenerData.length > 0 ? (
              arrListenerData.map((item, _) => (
                <View style={styles.listenerMainContainer}>
                  <View style={styles.listenerImageContainer}>
                    <Image
                      source={
                        item?.image ? {uri: item?.image[0]} : getDefaultAvatar()
                      }
                      style={styles.listenerImage}
                    />
                    <View>
                      <Text style={styles.listenerType1}>{item?.name}</Text>
                      <Text style={styles.listenerType2}>{item?.handle}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.listenerChatButton}>
                    <Text style={styles.listenerType4}>Chat</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : loadingListener ? (
              <View style={styles.listenerIndicator}>
                <ActivityIndicator size="large" color="#777777" />
              </View>
            ) : (
              <View style={styles.listenerNoDataContainer}>
                <Text style={styles.listenerType3}>No Data</Text>
              </View>
            )}
          </View>
        </Collapsible>
      </View>
    );
  };

  const renderAudioRequest = () => {
    return (
      <View style={{marginTop: 24}}>
        <View>
          <TouchableOpacity
            style={styles.onQueueMainContainer}
            onPress={() => setIsOpenedAudioRequest(prev => !prev)}>
            <Text
              style={
                styles.txtOnQueue
              }>{`Audio Requests (${liveRadioData?.audioRequestNumber})`}</Text>
            {isOpenedAudioRequest ? (
              <ArrwoUpIcon color="#000000" />
            ) : (
              <ArrowDownIcon color="#000000" />
            )}
          </TouchableOpacity>
        </View>
        <Collapsible collapsed={!isOpenedAudioRequest}>
          <View>
            {arrAudioRequestData && arrAudioRequestData.length > 0 ? (
              arrAudioRequestData.map((item, index) => (
                <View
                  style={{
                    marginTop: 12,
                    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                    borderBottomWidth: 1,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 7,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={
                          item?.user && item?.user?.image
                            ? {uri: item?.user?.image}
                            : getDefaultAvatar()
                        }
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 40,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: '#010101',
                          marginLeft: 8,
                        }}>
                        {item?.user?.name}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#FF6651',
                          borderRadius: 16,
                          width: 68,
                          height: 31,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 12,
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '600',
                            color: '#fff',
                          }}>
                          Approve
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {}}>
                        <CloseGrayIcon />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* {renderPlayerControls()} */}
                </View>
              ))
            ) : loadingAudioRequest ? (
              <View
                style={{width: '100%', alignItems: 'center', marginTop: 32}}>
                <ActivityIndicator size="large" color="#777777" />
              </View>
            ) : (
              <View style={{width: '100%', alignItems: 'center', marginTop: 8}}>
                <Text
                  style={{fontSize: 12, fontWeight: '500', color: '#010101'}}>
                  No Data
                </Text>
              </View>
            )}
          </View>
        </Collapsible>
      </View>
    );
  };

  const renderActionBottom = () => {
    return (
      <View style={{marginTop: 190}}>
        {!recording ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity style={[styles.actionBtnContainer, {width: 106}]}>
              <RedVolumnSmallIcon />
              <Text style={styles.actionBtnTxt}>Speaker</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onMicrophone}>
              <LinearGradient
                colors={['#FF3F3F', '#FF701F']}
                useAngle={true}
                angle={120}
                style={styles.recordContainer}>
                <WhiteMicIcon />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtnContainer, {width: 106}]}>
              <RedCloseSmallIcon />
              <Text style={styles.actionBtnTxt}>End Radio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recordControl}>
            {recordingStarted ? (
              <View style={styles.control}>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={cancelRecordAudio}>
                  <LinearGradient
                    colors={['#FF3F3F', '#FF701F']}
                    useAngle={true}
                    angle={120}
                    style={styles.recordContainer}>
                    <RecordExitIcon />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlBtn}>
                  <LinearGradient
                    colors={['#FF3F3F', '#FF701F']}
                    useAngle={true}
                    angle={120}
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 56,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <RecordProcessWhiteIcon />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={recordStop}
                  disabled={!recordingStarted}>
                  <LinearGradient
                    colors={['#FF3F3F', '#FF701F']}
                    useAngle={true}
                    angle={120}
                    style={styles.recordContainer}>
                    <RecordDoneIcon />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.control}>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={cancelRecordAudio}>
                  <LinearGradient
                    colors={['#FF3F3F', '#FF701F']}
                    useAngle={true}
                    angle={120}
                    style={styles.recordContainer}>
                    <RecordCancelWhiteIcon />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={onMicrophone}>
                  <LinearGradient
                    colors={['#FF3F3F', '#FF701F']}
                    useAngle={true}
                    angle={120}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 56,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <RecordFinishedIcon />
                  </LinearGradient>
                </TouchableOpacity>
                {loadingSendingAudioRequest ? (
                  <View style={{width: 67}}>
                    <ActivityIndicator size="large" color="#777777" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={sendRecordAudio}
                    style={styles.controlBtn}
                    disabled={!recordingFinished}>
                    <LinearGradient
                      colors={['#FF3F3F', '#FF701F']}
                      useAngle={true}
                      angle={120}
                      style={styles.recordContainer}>
                      <RecordSendIcon />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View
              style={[
                styles.duration,
                {
                  backgroundColor: '#FF6651',
                  opacity: recordingStarted ? 0.7 : 1,
                },
              ]}>
              <Text style={styles.durationTxt}>
                {convertTimeFormat(recordDuration)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={styles.indicator}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      onChange={handleSheetChanges}>
      <View style={[StyleSheet.absoluteFill, {top: 16, left: 16, right: 16}]}>
        <BottomSheetScrollView style={{height: '100%'}}>
          <View style={{height: '100%'}}>
            {renderPersonsView()}
            {renderInfoView()}
            {renderPlayerView()}
            {renderOnQueue()}
            {renderOpenAudioRequest()}
            {renderAudioRequest()}
            {renderListeners()}
            {renderActionBottom()}
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
};

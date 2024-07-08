/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {SaveAudioToLibrary} from 'components/feed/ios/components/SaveAudioToLibrary';
import {CreateEmolikeSheet} from 'components/feed/ios/create_emolike_flow/CreateEmolike';
import {SelectAudioSheet} from 'components/feed/ios/create_emolike_flow/SelectAudio';
import RNFS from 'react-native-fs';
import {
  apiGetDebate,
  apiGetDebateThreads,
  apiGetEmolikes,
  apiPostHideContent,
  apiPostVote,
} from 'helper/debateHelper';
import {
  apiDownloadedAudio,
  apiSaveDebate,
  apiUnSaveDebate,
} from 'helper/fictionHelper';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import {Slider} from '@miblanchard/react-native-slider';
import Svg, {G, Rect} from 'react-native-svg';
import {Loader} from 'screens/map/components';
import RNBackgroundDownloader from 'react-native-background-downloader';

// import {WaveProgress} from 'screens/MusicPlayer/components/musicPlayerIcons';
import {
  AgreeIcon,
  BookMarkIcon,
  DisagreeIcon,
  DownloadIcon,
  EmojiLikeIcon,
  LeftBackIcon,
  WinIcon,
  MicIcon,
  AudioPauseIcon,
  AudioPlayIcon,
  CutIcon,
  DownloadedIcon,
  DownloadingIcon,
  HideIcon,
  PauseIcon,
  PlayIcon,
  SavedIcon,
  StatusDownloadIcon,
} from './assets/svgs';
import Video from 'react-native-video';
import {CustomBadge} from './components/CustomBadge';
import {EmolikeSheet} from './components/EmolikeSheet';
import {RightAddEmolike} from './components/RightAddEmolike';
import {ThreadCard} from './components/ThreadCard';

import {styles} from './index.styles';
import SUCCESS_THREAD_BG from 'assets/images/emolikes_succes_bg.png';
import {SCREEN_HEIGHT, SCREEN_WIDTH, formatBytes} from 'helper/utils';

import {AddEmolikeToPostSheet} from 'components/feed/ios/create_emolike_flow/AddEmolikeToPost';
import {VideoPlayer} from './components/VideoPlayer';
import {useToast} from 'native-base';
import {CustomToast, SavedLibarayToast} from 'components/common';
import {useTracks, PlayingStatus} from 'contexts/TrackContext';
import {CreateNewPostModal} from 'components/feed/ios/components';
// import {eventListenDebate} from 'helper/socketHelper';
// import {useSelector} from 'react-redux';
// import {RootState} from 'redux/interfaces';
import {BarChart} from 'react-native-gifted-charts';

const {width} = Dimensions.get('window');

const StaticData = {
  width: 45,
  height: 165,
  samples: [
    0, 25, 45, 58, 12, 43, 43, 16, 42, 41, 18, 40, 40, 40, 40, 40, 39, 40, 40,
    40, 39, 12, 39, 40, 40, 25, 41, 12, 41, 40, 38, 40, 40, 8, 41, 41, 4, 40,
    42, 42, 28, 42, 41, 30, 12,
  ],
};

interface Debate {
  keywords: string;
  creator: {
    id: string;
    handle: string;
    name: string;
    image: string;
  };
  tags: string;
  description: string;
  emlikes: number;
  yes: number;
  no: number;
  isModuulelated: number;
  isDownloaded: number;
  debate: number;
  duration: number;
  url: string;
  mediaUrls: string;
  mediaTypes: string;
  id: number;
  waveform: string;
  transcription: string;
}
interface Emolike {
  id: number;
  url: string;
  debate: number;
  user: number;
  emoji_id: number;
  timestamp: string;
  comment: number;
}
interface DebateThread {
  id: number;
  keywords: string;
  creator: {
    id: string;
    handle: string;
    name: string;
    image: string;
  };
  description: string;
  threads: number;
  duration: number;
  emolikes: Emolike[];
  url: string;
}

const ThreadPage = props => {
  const navigation = useNavigation();
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const toast = useToast();
  const {id} = props.route.params;
  // const {user} = useSelector((state: RootState) => state.auth);

  const {togglePlayer, curTrack, playingStatus, playOneTrack, trackPosition} =
    useTracks();

  const [isLoading, setIsLoading] = useState(true);
  const [isThreadLoading, setIsThreadLoading] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [isVisibleCaption, setIsVisibleCaption] = useState(true);

  const [showAddEmolikeToPost, setShowAddEmolikeToPost] = useState(false);
  const [emolikes, setEmolikes] = useState<Emolike[]>([]);
  const [showEmolikeSheet, setShowEmolikeSheet] = useState(false);
  const [showSnipAudio, setShowSnipAudio] = useState(false);
  const [showSelectAudio, setShowSelectAudio] = useState(false);
  const [showCreateEmoji, setShowCreateEmoji] = useState(false);
  const [showSuccessCreatedView, setShowSuccessCreatedView] = useState(false);
  const [showEmolikeDetailView, setShowEmolikeDetailView] = useState(false);
  const [emolikeDetailVideoUrl, setEmolikeDetailVideoUrl] = useState(false);

  const [isAgreeTab, setIsAgreeTab] = useState(true);
  const [isVotedAgree, setIsVotedAgree] = useState(false);
  const [isVotedDisagree, setIsVotedDisagree] = useState(false);

  const [lastId, setLastId] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const [debate, setDebate] = useState<Debate>();
  const [debateThreads, setDebateThreads] = useState<DebateThread[]>([]);
  const [debateThreadsCount, setDebateThreadsCount] = useState(0);

  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioPaused, setAudioPaused] = useState(true);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [successEmolikeUrl, setSuccessEmolikeUrl] = useState('');
  const [successEmojiUrl, setSuccessEmojiUrl] = useState('');
  const [successViewFadeAnim] = useState(new Animated.Value(0));

  const [showDownloadView, setShowDownloadView] = useState(false);
  const [isDownloadedAudio, setIsDownloadedAudio] = useState(false);
  const [downloadingAudio, setDownloadingAudio] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [totalAudioSize, setTotalAudioSize] = useState(0);

  const [isAudioSaved, setIsAudioSaved] = useState(false);
  const [createNewPostVisible, setCreateNewPostVisible] = useState(false);
  const [prevTrackPosition, setPrevTrackPosition] = useState(0);
  const [wavefromData, setWaveformData] = useState({});
  const [waveData, setWaveData] = useState([]);

  useEffect(() => {
    getDebate();
  }, []);

  useEffect(() => {
    getDebateThreads();
  }, [isAgreeTab]);

  useEffect(() => {
    if (playingStatus === PlayingStatus.Playing) {
      const interval = setInterval(() => {
        setWaveData(prev => [
          prev[prev.length - 1],
          ...prev.slice(0, prev.length - 1),
        ]);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [playingStatus]);

  // useEffect(() => {
  //   if (playingStatus === 'playing' && trackPosition - prevTrackPosition > 5) {
  //     setPrevTrackPosition(trackPosition);
  //     eventListenDebate({
  //       comment: curTrack.id,
  //       user: user.id,
  //       time: trackPosition,
  //     });
  //   }
  // }, [trackPosition]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getEmolikes();
    });
    return focusHandler;
  }, [navigation]);

  const getEmolikes = async () => {
    let emolikeLastId = 0;
    const res = await apiGetEmolikes(id, false, 10, emolikeLastId);
    if (res.success) {
      setEmolikes(res.data);
    }
  };

  const getDebate = async () => {
    setIsLoading(true);

    const res = await apiGetDebate(id);
    if (res.success) {
      const {vote, isDownloaded, isSaved} = res.data;

      if (vote === 'yes') setIsVotedAgree(true);
      if (vote === 'no') setIsVotedDisagree(true);

      if (isDownloaded === 0) {
        setIsDownloadedAudio(false);
      } else {
        setIsDownloadedAudio(true);
      }

      if (isSaved === 0) {
        setIsAudioSaved(false);
      } else {
        setIsAudioSaved(true);
      }
      setDebate(res.data);

      //get waveform data
      // const barformdata = res.data.waveform
      //   ? JSON.parse(res.data.waveform)
      //   : {};
      const barformdata = StaticData;
      setWaveformData(barformdata);
      //just to show in barchart component
      let barData = [];
      for (let i = 0; i < barformdata.samples.length; i++) {
        barData[i] = {
          value: barformdata.samples[i],
          barMarginBottom: -Math.floor(barformdata.samples[i] / 2 + 30),
        };
      }
      setWaveData(barData);
    }
    setIsLoading(false);
  };

  const getDebateThreads = async () => {
    setIsThreadLoading(true);
    const res = await apiGetDebateThreads(id, isAgreeTab ? 'yes' : 'no');
    if (res.success) {
      setDebateThreads(res.data);
      setDebateThreadsCount(res.threads);
    }
    setIsThreadLoading(false);
  };

  if (isLoading) {
    return <Loader color="white" bgColor="black" />;
  }

  const onShowMore = async () => {
    setIsMoreLoading(true);
    do {
      const res = await apiGetDebateThreads(
        id,
        isAgreeTab ? 'yes' : 'no',
        3,
        lastId,
      );
      if (res.success) {
        setDebateThreads(prev => [...prev, ...res.data]);
        setHasMore(res.hasMore);
        setLastId(res.lastId);
      }
    } while (hasMore);
    setIsMoreLoading(false);
  };

  const onHideThread = async (idx: string) => {
    const res = await apiPostHideContent(idx);
    if (res.success) {
      const newThreads = debateThreads.filter(
        thread => thread.creator.id === idx,
      );
      setDebateThreadsCount(newThreads.length);
      setDebateThreads(newThreads);
    }
  };

  const onPlaySuccessEmolike = () => {
    setAudioPaused(false);
  };

  const onShowSuccessEmolike = () => {
    Animated.timing(successViewFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setShowSuccessCreatedView(true);
  };

  const onDownloadAudio = async () => {
    if (!isDownloadedAudio && !downloadingAudio) {
      setShowDownloadView(true);
      setDownloadingAudio(true);

      const now = new Date();
      const downloadPath = `${
        RNFS.DocumentDirectoryPath
      }/SoundStickers/downloaad_${now.getTime()}.wav`;
      RNBackgroundDownloader.download({
        id: now.getTime(),
        url: debate?.url,
        destination: downloadPath,
      })
        .begin(expectedBytes => {
          setTotalAudioSize(expectedBytes);
        })
        .progress(percent => {
          setDownloadProgress(percent * 100);
        })
        .done(() => {
          setDownloadProgress(100);
          setDownloadingAudio(false);
          setIsDownloadedAudio(true);

          setTimeout(() => {
            setShowDownloadView(false);
            initDownloadStatus();
            updateDownloadStatus();
          }, 1000);
        })
        .error(error => {
          setDownloadingAudio(false);
          setShowDownloadView(false);
          initDownloadStatus();
        });
    }
  };

  const updateDownloadStatus = async () => {
    await apiDownloadedAudio(debate?.debate);
  };

  const initDownloadStatus = () => {
    setDownloadProgress(0);
    setTotalAudioSize(0);
  };

  const handlePlayer = () => {
    setIsPlayed(prev => !prev);
    if (String(curTrack?.id) === String(debate?.id)) {
      togglePlayer();
    } else {
      if (debate && debate?.url) {
        playOneTrack(
          {
            id: String(debate?.id),
            image: debate?.mediaUrls,
            title: debate?.keywords,
            artists: [debate?.creator.name],
            description: debate?.description,
            url: debate?.url.split(',')[0],
            previewUrl: debate?.url.split(',')[0],
          },
          debate?.id,
          false,
        );
      }
    }
  };

  const onSave = async () => {
    if (isAudioSaved) {
      onUnSave();
    } else {
      const res = await apiSaveDebate(debate?.debate);
      if (res.success) {
        toast.show({
          render: () => (
            <SavedLibarayToast
              onUnDo={() => {
                toast.closeAll();
                onUnSave();
              }}
            />
          ),
          placement: 'top',
        });

        setIsAudioSaved(true);
      }
    }
  };

  const onUnSave = async () => {
    const res = await apiUnSaveDebate(debate?.debate);

    if (res.success) {
      setIsAudioSaved(false);
    }
  };

  const renderThreads = () => {
    const leftCount = debateThreadsCount - debateThreads.length;
    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{`Threads (${debateThreadsCount})`}</Text>
        </View>
        {isThreadLoading ? (
          <Loader color="white" />
        ) : (
          debateThreads.map(thread => {
            return (
              <ThreadCard
                key={thread.id}
                data={thread}
                hidePost={onHideThread}
              />
            );
          })
        )}
        {leftCount ? (
          <TouchableOpacity onPress={onShowMore} style={styles.showMoreButton}>
            {isMoreLoading ? (
              <Loader color="white" bgColor="transparent" />
            ) : (
              <Text
                style={styles.showMoreText}>{`Show More (${leftCount})`}</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderHeaderBackground = () => {
    return (
      <View style={styles.background}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.1)', '#000000']}
          style={{
            width: '100%',
            height: 237,
            top: 0,
            left: 0,
            right: 0,
            position: 'absolute',
            zIndex: 1,
          }}
        />
        <Image
          source={{uri: debate?.creator.image}}
          style={{width: '100%', height: '100%'}}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftBackIcon />
        </TouchableOpacity>
        <View style={styles.rowItem}>
          <TouchableOpacity onPress={() => onDownloadAudio()}>
            <DownloadIcon />
            {downloadingAudio && (
              <View style={{position: 'absolute', right: -6, top: -5}}>
                <DownloadingIcon />
              </View>
            )}
            {isDownloadedAudio && (
              <View style={{position: 'absolute', right: -6, top: -5}}>
                <DownloadedIcon />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookMarkIcon} onPress={onSave}>
            {isAudioSaved ? <SavedIcon /> : <BookMarkIcon />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  const renderDownloadingView = () => {
    return (
      <View style={styles.downloadView}>
        <View style={styles.downloadBody}>
          <StatusDownloadIcon />
          <Text style={styles.downloadDescTxt}>
            {'Downloading all conversation \nin background'}
          </Text>
          <View style={styles.downloadStatusView}>
            <Text style={{color: 'white'}}>{`${downloadProgress.toFixed(
              2,
            )}%`}</Text>
            <Text style={{color: 'rgba(255, 255, 255, 0.4)'}}>
              {formatBytes((downloadProgress * totalAudioSize) / 100)}/
              {formatBytes(totalAudioSize, 2)}
            </Text>
          </View>
        </View>
        <View style={styles.downloadSlider}>
          <Slider
            minimumValue={0}
            maximumValue={100}
            onSlidingComplete={() => {}}
            value={downloadProgress}
            minimumTrackTintColor={'#ffffff'}
            maximumTrackTintColor={'#ffffff'}
            thumbStyle={{
              width: 0,
              height: 0,
            }}
            trackStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              height: 1,
            }}
          />
        </View>
      </View>
    );
  };

  const renderTopContent = () => {
    if (!debate) {
      return;
    }
    const {keywords, tags, description, isModuulelated} = debate;
    const keywordsData = keywords?.split(',');
    return (
      <View style={styles.content}>
        <View style={styles.rowItem}>
          {keywordsData?.map((item, index) => {
            return (
              <CustomBadge
                key={index}
                label={item}
                containerStyle={styles.largeBadge}
                labelStyle={styles.largeBadgeLabel}
              />
            );
          })}
        </View>
        <View style={[styles.rowItem, {marginTop: 8}]}>
          <Text style={styles.byLabel}>by</Text>
          <Text style={styles.mail}>@{tags}</Text>
          {isModuulelated && (
            <CustomBadge
              label="Modulated"
              color="#ff6651"
              containerStyle={styles.smallBadge}
              labelStyle={styles.smallBadgeLabel}
            />
          )}
          {/* <CustomBadge
            label="Awarded"
            color="#9214f5"
            containerStyle={styles.smallBadge}
            labelStyle={styles.smallBadgeLabel}
          /> */}
        </View>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}

        <View style={styles.createYours}>
          <View style={styles.rowItem}>
            <EmojiLikeIcon />
            <Text style={styles.likeCount}>
              {!emolikes.length
                ? 'No emolikes created yet'
                : `${emolikes.length} emolikes `}
            </Text>
            {emolikes.length ? (
              <Text style={styles.created}>created</Text>
            ) : null}
          </View>
          <Text
            style={[styles.likeCount, {color: '#ff6651'}]}
            onPress={() => {
              setShowSelectAudio(true);
            }}>
            Create Yours
          </Text>
        </View>
      </View>
    );
  };

  const renderSuccessView = () => {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: successViewFadeAnim,
          },
        ]}>
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.9)'},
          ]}>
          <Image
            source={SUCCESS_THREAD_BG}
            style={[
              StyleSheet.absoluteFill,
              {width: SCREEN_WIDTH, height: SCREEN_HEIGHT},
            ]}
          />
          <View style={styles.successContainer}>
            <Text style={styles.successTxtContainer}>
              {`✅\n`}
              <Text style={styles.successTxt}>Success Adding Emolike!</Text>
            </Text>
            {renderPlayerView(successEmojiUrl, successEmojiUrl)}
            <TouchableOpacity
              style={styles.successViewDismiss}
              onPress={() => {
                successViewFadeAnim.setValue(0);
                setShowSuccessCreatedView(false);
              }}>
              <Text style={styles.successViewDismissTxt}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderEmolikeDetailView = () => {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: 'rgba(0, 0, 0, 0.9)'},
        ]}>
        <Image
          source={SUCCESS_THREAD_BG}
          style={[
            StyleSheet.absoluteFill,
            {width: SCREEN_WIDTH, height: SCREEN_HEIGHT},
          ]}
        />
        <View style={styles.successContainer}>
          {renderPlayerView(emolikeDetailVideoUrl, null)}
          <TouchableOpacity
            style={styles.successViewDismiss}
            onPress={() => {
              setShowEmolikeDetailView(false);
            }}>
            <Text style={styles.successViewDismissTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPlayerView = (videoUrl, imageUrl) => {
    return (
      <View style={styles.playerView}>
        <View style={[StyleSheet.absoluteFill, {borderRadius: 16}]}>
          {videoUrl !== '' && (
            <Video
              source={{uri: videoUrl}}
              ref={videoRef}
              paused={audioPaused}
              audioOnly={true}
              onLoadStart={() => setIsLoadingAudio(true)}
              onLoad={() => setIsLoadingAudio(false)}
              onError={() => setIsLoadingAudio(false)}
              onEnd={() => {
                setAudioPaused(true);
                setTimeout(() => {
                  videoRef.current?.seek(0);
                  setAudioProgress(0);
                }, 100);
              }}
              resizeMode={'cover'}
              onProgress={progress => {
                const currentPro =
                  (progress.currentTime / progress.playableDuration) * 100;
                setAudioProgress(currentPro);
              }}
              style={[StyleSheet.absoluteFill, {borderRadius: 16}]}
            />
          )}
          <LinearGradient
            useAngle={true}
            angle={180}
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
            style={[StyleSheet.absoluteFill, {borderRadius: 16}]}
          />
        </View>
        <EmojiWaveProgress />
        {renderPlayControl()}
        {imageUrl && (
          <View style={styles.emoView}>
            <Image source={{uri: imageUrl}} style={[{width: 35, height: 35}]} />
          </View>
        )}
      </View>
    );
  };

  const renderPlayControl = () => {
    return (
      <View style={styles.controlView}>
        <TouchableOpacity onPress={onPlaySuccessEmolike}>
          {audioPaused ? <PlayIcon /> : <PauseIcon />}
        </TouchableOpacity>
        <Slider
          containerStyle={styles.slider}
          minimumValue={0}
          maximumValue={100}
          onSlidingComplete={() => {}}
          value={audioProgress}
          minimumTrackTintColor={'#D9D9D9'}
          maximumTrackTintColor={'#D9D9D9'}
          thumbStyle={{
            width: 6,
            height: 6,
            borderRadius: 6,
            backgroundColor: '#D9D9D9',
          }}
          trackStyle={{
            backgroundColor: '#D9D9D9',
            height: 2,
          }}
        />
        <Text style={styles.txtSliderTime}>0:05</Text>
      </View>
    );
  };

  const renderAddEmolikeToPost = () => {
    return (
      <AddEmolikeToPostSheet
        show={showAddEmolikeToPost}
        onContinue={(audioUrl, emojiUrl) => {
          setSuccessEmolikeUrl(audioUrl);
          setSuccessEmojiUrl(emojiUrl);
          setShowAddEmolikeToPost(false);

          onShowSuccessEmolike();
        }}
        onCreateNew={() => {
          setShowAddEmolikeToPost(false);
          setShowSelectAudio(true);
        }}
        onClose={() => {
          setShowAddEmolikeToPost(false);
        }}
      />
    );
  };

  const renderVoiceDescription = () => {
    return (
      <View style={styles.voiceDescription}>
        {isVisibleCaption && (
          <>
            <Text style={styles.voiceLabel}>
              My voice downed out in the thumber
            </Text>
            <Text style={styles.voiceLabelBold}>
              Here comes a wave meant to away
            </Text>
            <Text style={styles.voiceLabel}>
              Broken again, left with nothing to say
            </Text>
          </>
        )}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.btnAction}
            onPress={() => setIsVisibleCaption(!isVisibleCaption)}>
            <HideIcon />
            <Text style={styles.btnActionTxt}>
              {isVisibleCaption ? 'Hide caption' : 'Show Caption'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnAction}
            onPress={() => {
              setShowSnipAudio(true);
            }}>
            <CutIcon />
            <Text style={styles.btnActionTxt}>{'Snip Audio'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMediaImageCarousel = () => {
    if (!debate?.mediaUrls) {
      return;
    }
    const medias = debate?.mediaUrls.split(',');
    const mediaType = debate?.mediaTypes.split(',');
    return (
      <>
        <Carousel
          layout={'default'}
          data={medias}
          sliderWidth={width}
          itemWidth={330}
          inactiveSlideOpacity={1}
          inactiveSlideScale={0.8}
          renderItem={({item, index}) => {
            return (
              <View key={index} style={styles.mediaWrap}>
                {mediaType[index] === 'image' && (
                  <Image source={{uri: item}} style={styles.mediaImg} />
                )}
                {mediaType[index] === 'video' && <VideoPlayer url={item} />}
              </View>
            );
          }}
        />
        <View style={styles.audioPlayBtnWrapper}>
          <TouchableOpacity style={styles.audioPlayBtn} onPress={handlePlayer}>
            {isPlayed ? <AudioPauseIcon /> : <AudioPlayIcon />}
          </TouchableOpacity>
        </View>
        <View style={styles.waveProgress}>
          <BarChart
            data={waveData}
            height={100}
            yAxisThickness={0}
            xAxisThickness={0}
            spacing={Math.floor(SCREEN_WIDTH / (wavefromData?.width + 36))}
            hideYAxisText
            barWidth={3}
            initialSpacing={0}
            hideRules
            frontColor={isPlayed ? '#FF6651' : 'grey'}
            disableScroll
            scrollToEnd
          />
        </View>
      </>
    );
  };

  const renderDebate = () => {
    return (
      <View style={styles.userContainer}>
        <View style={styles.tabContainer}>
          <TouchableWithoutFeedback onPress={() => onPressTab(true)}>
            <View style={isAgreeTab ? styles.tab1 : styles.tab2}>
              <AgreeIcon isSelected={isAgreeTab} />
              <Text style={isAgreeTab ? styles.agree : styles.disagree}>
                Agree
              </Text>
              {debate && debate?.yes > debate?.no && (
                <CustomBadge
                  label="Win"
                  icon={<WinIcon />}
                  color="#08b883"
                  labelStyle={styles.winLabel}
                  containerStyle={styles.winBadge}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.tabSpace} />
          <TouchableWithoutFeedback onPress={() => onPressTab(false)}>
            <View style={!isAgreeTab ? styles.tab1 : styles.tab2}>
              <DisagreeIcon isSelected={isAgreeTab} />
              <Text style={!isAgreeTab ? styles.agree : styles.disagree}>
                Disagree
              </Text>
              {debate && debate?.yes < debate?.no && (
                <CustomBadge
                  label="Win"
                  icon={<WinIcon />}
                  color="#08b883"
                  labelStyle={styles.winLabel}
                  containerStyle={styles.winBadge}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.emoUsersContainer}>
          <View style={styles.emoUserAvatar} />
          <View style={styles.emoUserAvatar} />
          <View style={styles.emoUserAvatar} />
          <Text style={styles.emoUserDesc}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Rio, Andrea, Joss,
            </Text>{' '}
            and 6 other friends are on this side.
          </Text>
        </View>
        {renderThreads()}
      </View>
    );
  };

  const renderSnipAudio = () => {
    return (
      <SaveAudioToLibrary
        debateId={debate?.debate}
        totalDuration={debate?.duration}
        show={showSnipAudio}
        onNext={(startTime, endTime) => {
          setShowSnipAudio(false);

          setSelectedAudio({
            start: startTime,
            end: endTime,
            debate: debate?.debate,
            url:
              debate?.url.split(',').length > 0
                ? debate?.url.split(',')[0]
                : '',
          });

          setShowCreateEmoji(true);
        }}
        onClose={() => setShowSnipAudio(false)}
      />
    );
  };

  const renderSelectAudioSheet = () => {
    return (
      <SelectAudioSheet
        debateId={debate?.debate}
        show={showSelectAudio}
        onContinue={audioInfo => {
          setSelectedAudio(audioInfo);
          setShowSelectAudio(false);

          setTimeout(() => {
            setShowCreateEmoji(true);
          }, 500);
        }}
        onClose={() => {
          setShowSelectAudio(false);
        }}
      />
    );
  };

  const renderEmoLikeSheet = () => {
    return (
      <EmolikeSheet
        close={() => setShowEmolikeSheet(false)}
        show={showEmolikeSheet}
        onAdd={() => {
          setShowEmolikeSheet(false);

          setTimeout(() => {
            setShowSnipAudio(true);
          }, 500);
        }}
      />
    );
  };

  const renderRightAddEmolike = () => {
    return (
      <RightAddEmolike
        data={emolikes}
        onClickEmolike={url => {
          setEmolikeDetailVideoUrl(url);
          setShowEmolikeDetailView(true);
        }}
        onAddEmolike={() => {
          navigation.navigate('EmolikePage', {debateId: debate?.debate});
        }}
      />
    );
  };

  const renderCreateEmolikeSheet = () => {
    return (
      <CreateEmolikeSheet
        audioInfo={selectedAudio}
        duration={debate?.duration}
        show={showCreateEmoji}
        onClose={() => {
          setShowCreateEmoji(false);
        }}
        onSuccess={(audioUrl, emojiUrl) => {
          setShowCreateEmoji(false);
          toast.show({
            render: () => (
              <CustomToast
                title="Successfully created your emolike!"
                color="#08b883"
                hideButton={true}
              />
            ),
            placement: 'top',
          });
        }}
      />
    );
  };

  const onVote = async val => {
    if (val && isVotedAgree) {
      return;
    }
    if (!val && isVotedDisagree) {
      return;
    }
    const params = {
      debate: id,
      vote: val ? 'yes' : 'no',
    };
    const res = await apiPostVote(params);
    if (res.success) {
      if (val) {
        setIsVotedAgree(true);
      } else {
        setIsVotedDisagree(true);
      }
    } else {
      alert(JSON.stringify(res.error));
    }
  };

  let backCount = 0;

  const onPressTab = val => {
    backCount++;
    if (backCount === 2) {
      onVote(val);
    } else {
      setIsAgreeTab(val);
      backCount = 0;
    }
  };

  // const renderRelatedAudios = () => {
  // return (
  //   <WheelView
  //     data={{
  //       inner_image: item.image,
  //       middle_colour:
  //         item.duration > 300 ? 'L' : item.duration < 30 ? 'S' : 'M',
  //       middle_speed: 2000,
  //       outer_yes: item.yes,
  //       outer_no: item.no,
  //       outer_speed: 3000,
  //       outer_emoji: item.emolike,
  //       topic: Array.isArray(item.keywords)
  //         ? item.keywords[0]
  //         : item.keywords.split(',').length > 0
  //         ? item.keywords.split(',')[0]
  //         : item.keywords,
  //       duration: item.duration,
  //       saved: item.saved === 1,
  //       seen: item.seen === 1,
  //     }}
  //   />
  // );
  // };

  const renderAddNewThreadBtn = () => {
    return (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setCreateNewPostVisible(true)}>
          <MicIcon />
          <Text style={styles.newButtonTitle}>Add New Thread</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.mainContent}>
          <>
            {renderHeaderBackground()}
            {renderHeader()}
            {renderTopContent()}
            {renderMediaImageCarousel()}
            {renderVoiceDescription()}
            {renderDebate()}
            {/* {renderRelatedAudios()} */}
          </>
        </View>
      </ScrollView>
      {renderAddEmolikeToPost()}
      {renderAddNewThreadBtn()}
      {renderSnipAudio()}
      {renderRightAddEmolike()}
      {renderCreateEmolikeSheet()}
      {renderSelectAudioSheet()}
      {renderEmoLikeSheet()}
      {showSuccessCreatedView && renderSuccessView()}
      {showEmolikeDetailView && renderEmolikeDetailView()}
      {showDownloadView && renderDownloadingView()}
      {createNewPostVisible && (
        <CreateNewPostModal
          onDetail={id => {}}
          visible={createNewPostVisible}
          hideModal={() => setCreateNewPostVisible(false)}
        />
      )}
    </View>
  );
};

export default ThreadPage;

const EmojiWaveProgress = ({progress = 0, ...props}) => (
  <Svg
    width={'100%'}
    height={15}
    viewBox="0 0 200 15"
    preserveAspectRatio="none"
    fill="none"
    {...props}>
    <G>
      {Array(50)
        .fill('')
        .map((_, index) => {
          const x = 4 * index;
          const height = 15 - Math.floor(Math.random() * 12);
          const y = (15 - height) / 2;
          const fillOpacity = index * 2 <= progress ? 1 : 0.2;
          return (
            <Rect
              width={2}
              x={x}
              y={y}
              height={height}
              fill="white"
              fillOpacity={fillOpacity}
            />
          );
        })}
    </G>
  </Svg>
);

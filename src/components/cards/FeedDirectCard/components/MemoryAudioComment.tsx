import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import {SmallWaveProgress} from 'screens/MusicPlayer/components/musicPlayerIcons';
import Svg, {Path} from 'react-native-svg';

const BackgroundImage = ImageBackground || Image; // fall back to Image if RN < 0.46

let ViewPropTypesVar;

if (ViewPropTypes) {
  ViewPropTypesVar = ViewPropTypes;
} else {
  ViewPropTypesVar = View.propTypes;
}

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

const styles = StyleSheet.create({
  preloadingPlaceholder: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    color: 'white',
  },
  video:
    Platform.Version >= 24
      ? {}
      : {
          backgroundColor: 'black',
        },
  controls: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playControl: {
    color: 'white',
    padding: 8,
  },
  extraControl: {
    color: 'white',
    padding: 8,
  },
  seekBar: {
    alignItems: 'center',
    height: 30,
    flexGrow: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginLeft: -10,
    marginRight: -5,
  },
  seekBarFullWidth: {
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
    marginTop: -3,
    height: 3,
  },
  seekBarProgress: {
    height: 3,
    backgroundColor: '#F00',
  },
  seekBarKnob: {
    width: 20,
    height: 20,
    marginHorizontal: -8,
    marginVertical: -10,
    borderRadius: 10,
    backgroundColor: '#F00',
    transform: [{scale: 0.8}],
    zIndex: 1,
  },
  seekBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 3,
  },
  overlayButton: {
    flex: 1,
  },
  activeDurationText: {
    paddingLeft: 8,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  durationText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    marginStart: 10,
    paddingEnd: 10,
  },
});

export default class MemoryAudioComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStarted: props.autoplay,
      isPlaying: props.autoplay,
      hasEnded: false,
      width: 200,
      progress: 0,
      isMuted: props.defaultMuted,
      isControlsVisible: !props.hideControlsOnStart,
      duration: 0,
      isSeeking: false,
    };

    this.seekBarWidth = 200;
    this.wasPlayingBeforeSeek = props.autoplay;
    this.seekTouchStart = 0;
    this.seekProgressStart = 0;

    this.onLayout = this.onLayout.bind(this);
    this.onStartPress = this.onStartPress.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onPlayPress = this.onPlayPress.bind(this);
    this.onMutePress = this.onMutePress.bind(this);
    this.showControls = this.showControls.bind(this);
    this.onToggleFullScreen = this.onToggleFullScreen.bind(this);
    this.onSeekBarLayout = this.onSeekBarLayout.bind(this);
    this.onSeekGrant = this.onSeekGrant.bind(this);
    this.onSeekRelease = this.onSeekRelease.bind(this);
    this.onSeek = this.onSeek.bind(this);
    this.onSeekEvent = this.onSeekEvent.bind(this);
  }

  componentDidMount() {
    if (this.props.autoplay) {
      this.hideControls();
    }
  }

  componentWillUnmount() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
  }

  onLayout(event) {
    const {width} = event.nativeEvent.layout;
    this.setState({
      width,
    });
  }

  onStartPress() {
    if (this.props.onStart) {
      this.props.onStart();
    }

    this.setState(state => ({
      isPlaying: true,
      isStarted: true,
      hasEnded: false,
      progress: state.progress === 1 ? 0 : state.progress,
    }));

    this.hideControls();
  }

  onProgress(event) {
    if (this.state.isSeeking) {
      return;
    }
    if (this.props.onProgress) {
      this.props.onProgress(event);
    }
    this.setState({
      progress:
        event.currentTime / (this.props.duration || this.state.duration),
    });
    this.currentTime?.setNativeProps({
      text: getDurationTime(event.currentTime),
    });
  }

  onEnd(event) {
    if (this.props.onEnd) {
      this.props.onEnd(event);
    }

    if (this.props.endWithThumbnail || this.props.endThumbnail) {
      this.setState({isStarted: false, hasEnded: true});
      this.player.dismissFullscreenPlayer();
    }

    this.setState({progress: 1});

    if (!this.props.loop) {
      this.setState(
        {isPlaying: false, progress: 0},
        () => this.player && this.player.seek(0),
      );
    } else {
      this.player.seek(0);
    }

    this.currentTime?.setNativeProps({
      text: getDurationTime(this.state.duration),
    });
  }

  onLoad(event) {
    if (this.props.onLoad) {
      this.props.onLoad(event);
    }

    const {duration} = event;
    this.setState({duration});
  }

  onPlayPress() {
    if (this.props.onPlayPress) {
      this.props.onPlayPress();
    }

    this.setState({
      isPlaying: !this.state.isPlaying,
    });
    this.showControls();
  }

  onMutePress() {
    const isMuted = !this.state.isMuted;
    if (this.props.onMutePress) {
      this.props.onMutePress(isMuted);
    }
    this.setState({
      isMuted,
    });
    this.showControls();
  }

  onToggleFullScreen() {
    this.player.presentFullscreenPlayer();
  }

  onSeekBarLayout({nativeEvent}) {
    const customStyle = this.props.customStyles.seekBar;
    let padding = 0;
    if (customStyle && customStyle.paddingHorizontal) {
      padding = customStyle.paddingHorizontal * 2;
    } else if (customStyle) {
      padding = customStyle.paddingLeft || 0;
      padding += customStyle.paddingRight ? customStyle.paddingRight : 0;
    } else {
      padding = 20;
    }

    this.seekBarWidth = nativeEvent.layout.width - padding;
  }

  onSeekStartResponder() {
    return true;
  }

  onSeekMoveResponder() {
    return true;
  }

  onSeekGrant(e) {
    this.seekTouchStart = e.nativeEvent.pageX;
    this.seekProgressStart = this.state.progress;
    this.wasPlayingBeforeSeek = this.state.isPlaying;
    this.setState({
      isSeeking: true,
      isPlaying: false,
    });
  }

  onSeekRelease() {
    this.setState({
      isSeeking: false,
      isPlaying: this.wasPlayingBeforeSeek,
    });
    this.showControls();
  }

  onSeek(e) {
    const diff = e.nativeEvent.pageX - this.seekTouchStart;
    const ratio = 100 / this.seekBarWidth;
    const progress = this.seekProgressStart + (ratio * diff) / 100;

    this.setState({
      progress,
    });

    this.player.seek(progress * this.state.duration);
  }

  onSeekEvent(e) {
    this.currentTime?.setNativeProps({text: getDurationTime(e.currentTime)});
  }

  getSizeStyles() {
    const {videoWidth, videoHeight} = this.props;
    const {width} = this.state;
    const ratio = videoHeight / videoWidth;
    return {
      height: width * ratio,
      width,
    };
  }

  hideControls() {
    if (this.props.onHideControls) {
      this.props.onHideControls();
    }

    if (this.props.disableControlsAutoHide) {
      return;
    }

    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
    this.controlsTimeout = setTimeout(() => {
      this.setState({isControlsVisible: false});
    }, this.props.controlsTimeout);
  }

  showControls() {
    if (this.props.onShowControls) {
      this.props.onShowControls();
    }

    this.setState({
      isControlsVisible: true,
    });
    this.hideControls();
  }

  seek(t) {
    this.player.seek(t);
  }

  stop() {
    this.setState({
      isPlaying: false,
      progress: 0,
    });
    this.seek(0);
    this.showControls();
  }

  pause() {
    this.setState({
      isPlaying: false,
    });
    this.showControls();
  }

  resume() {
    this.setState({
      isPlaying: true,
    });
    this.showControls();
  }

  renderStartButton() {
    const {customStyles} = this.props;
    return (
      <TouchableOpacity
        style={[styles.playButton, customStyles.playButton]}
        onPress={this.onStartPress}>
        <Icon
          style={[styles.playArrow, customStyles.playArrow]}
          name="play-arrow"
          size={12}
        />
      </TouchableOpacity>
    );
  }

  renderThumbnail(thumbnail) {
    const {style, customStyles, ...props} = this.props;
    return (
      <BackgroundImage
        {...props}
        style={[
          styles.thumbnail,
          this.getSizeStyles(),
          style,
          customStyles.thumbnail,
        ]}
        source={thumbnail}>
        {this.renderStartButton()}
      </BackgroundImage>
    );
  }

  renderSeekBar(fullWidth) {
    const {customStyles, disableSeek} = this.props;
    return (
      <View
        style={[
          styles.seekBar,
          fullWidth ? styles.seekBarFullWidth : {},
          customStyles.seekBar,
          fullWidth ? customStyles.seekBarFullWidth : {},
        ]}
        onLayout={this.onSeekBarLayout}>
        <View
          style={[
            {flexGrow: this.state.progress},
            styles.seekBarProgress,
            customStyles.seekBarProgress,
          ]}
        />
        {!fullWidth && !disableSeek ? (
          <View
            style={[
              styles.seekBarKnob,
              customStyles.seekBarKnob,
              this.state.isSeeking ? {transform: [{scale: 1}]} : {},
              this.state.isSeeking ? customStyles.seekBarKnobSeeking : {},
            ]}
            hitSlop={{top: 20, bottom: 20, left: 10, right: 20}}
            onStartShouldSetResponder={this.onSeekStartResponder}
            onMoveShouldSetPanResponder={this.onSeekMoveResponder}
            onResponderGrant={this.onSeekGrant}
            onResponderMove={this.onSeek}
            onResponderRelease={this.onSeekRelease}
            onResponderTerminate={this.onSeekRelease}
          />
        ) : null}
        <View
          style={[
            styles.seekBarBackground,
            {flexGrow: 1 - this.state.progress},
            customStyles.seekBarBackground,
          ]}
        />
      </View>
    );
  }

  renderControls() {
    const {customStyles, showDuration} = this.props;
    return (
      <View style={[styles.controls, customStyles.controls]}>
        <TouchableOpacity
          onPress={this.onPlayPress}
          style={[customStyles.controlButton, customStyles.playControl]}>
          <Icon
            style={[
              styles.playControl,
              customStyles.controlIcon,
              customStyles.playIcon,
            ]}
            name={this.state.isPlaying ? 'pause' : 'play-arrow'}
            size={20}
          />
        </TouchableOpacity>
        <SmallWaveProgress progress={this.state.progress * 100} />
        {showDuration && (
          <>
            <Text style={[styles.durationText, customStyles.durationText]}>
              {getDurationTime(this.state.duration)}
            </Text>
          </>
        )}
      </View>
    );
  }

  renderVideo() {
    const {
      video,
      style,
      resizeMode,
      pauseOnPress,
      fullScreenOnLongPress,
      customStyles,
      ...props
    } = this.props;
    return (
      <View style={customStyles.videoWrapper}>
        <Video
          {...props}
          style={[
            styles.video,
            this.getSizeStyles(),
            style,
            customStyles.video,
          ]}
          ref={p => {
            this.player = p;
          }}
          muted={this.props.muted || this.state.isMuted}
          paused={
            this.props.paused
              ? this.props.paused || !this.state.isPlaying
              : !this.state.isPlaying
          }
          onProgress={this.onProgress}
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          source={video}
          resizeMode={resizeMode}
          onSeek={this.onSeekEvent}
        />
        {this.renderControls()}
      </View>
    );
  }

  renderContent() {
    return this.renderVideo();
  }

  render() {
    return (
      <View onLayout={this.onLayout} style={[this.props.customStyles.wrapper]}>
        {this.renderContent()}
      </View>
    );
  }
}

MemoryAudioComment.propTypes = {
  video: Video.propTypes.source,
  thumbnail: Image.propTypes.source,
  endThumbnail: Image.propTypes.source,
  videoWidth: PropTypes.number,
  videoHeight: PropTypes.number,
  duration: PropTypes.number,
  autoplay: PropTypes.bool,
  paused: PropTypes.bool,
  defaultMuted: PropTypes.bool,
  muted: PropTypes.bool,
  style: ViewPropTypesVar.style,
  controlsTimeout: PropTypes.number,
  disableControlsAutoHide: PropTypes.bool,
  disableFullscreen: PropTypes.bool,
  loop: PropTypes.bool,
  resizeMode: Video.propTypes.resizeMode,
  hideControlsOnStart: PropTypes.bool,
  endWithThumbnail: PropTypes.bool,
  disableSeek: PropTypes.bool,
  pauseOnPress: PropTypes.bool,
  fullScreenOnLongPress: PropTypes.bool,
  customStyles: PropTypes.shape({
    wrapper: ViewPropTypesVar.style,
    video: Video.propTypes.style,
    videoWrapper: ViewPropTypesVar.style,
    controls: ViewPropTypesVar.style,
    playControl: ViewPropTypesVar.style,
    controlButton: ViewPropTypesVar.style,
    controlIcon: Icon.propTypes.style,
    playIcon: Icon.propTypes.style,
    seekBar: ViewPropTypesVar.style,
    seekBarFullWidth: ViewPropTypesVar.style,
    seekBarProgress: ViewPropTypesVar.style,
    seekBarKnob: ViewPropTypesVar.style,
    seekBarKnobSeeking: ViewPropTypesVar.style,
    seekBarBackground: ViewPropTypesVar.style,
    thumbnail: Image.propTypes.style,
    playButton: ViewPropTypesVar.style,
    playArrow: Icon.propTypes.style,
    durationText: ViewPropTypesVar.style,
  }),
  onEnd: PropTypes.func,
  onProgress: PropTypes.func,
  onLoad: PropTypes.func,
  onStart: PropTypes.func,
  onPlayPress: PropTypes.func,
  onHideControls: PropTypes.func,
  onShowControls: PropTypes.func,
  onMutePress: PropTypes.func,
  showDuration: PropTypes.bool,
};

MemoryAudioComment.defaultProps = {
  videoWidth: 170,
  videoHeight: 0,
  autoplay: false,
  controlsTimeout: 2000,
  loop: false,
  resizeMode: 'contain',
  disableSeek: false,
  pauseOnPress: false,
  fullScreenOnLongPress: false,
  customStyles: {},
  showDuration: true,
  disableFullscreen: true,
  disableControlsAutoHide: true,
};

const SmallAudioPlayIcon = props => (
  <Svg width="9" height="12" fill="none" viewBox="0 0 9 12">
    <Path
      fill="#fff"
      d="M7.74 4.846a1.5 1.5 0 010 2.308l-4.5 3.734c-.977.812-2.457.116-2.457-1.154V2.266C.783.996 2.263.3 3.24 1.112L7.74 4.846z"></Path>
  </Svg>
);

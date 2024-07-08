import {BlurView} from '@react-native-community/blur';
import {RouteProp} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  Animated,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  RotationGestureHandler,
  RotationGestureHandlerGestureEvent,
  State,
  TextInput,
} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import appAction from 'redux/app/actions';
import mediaAction from 'redux/media/actions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  STATUS_BAR_HEIGHT,
} from '../../helper/utils';
import {useKeyboardStatus} from '../../helper/utils';
import {styles} from './index.styles';
import {MainStackParams} from 'navigators';
import {StackScreenProps} from '@react-navigation/stack';

type StoryText = {
  text: string;
  x: number;
  y: number;
  animX: Animated.Value;
  animY: Animated.Value;
  fontSize: number;
  width: number;
  height: number;
  textBg: boolean;
  textAlign: 'flex-start' | 'center' | 'flex-end';
  color: string;
  ratio: number;
  animRatio: Animated.Value;
  zIndex: number;
};
export type StoryLabel = {
  type: 'address' | 'people' | 'hashtag' | 'emoji';
  address_id?: string;
  text: string;
  x: number;
  y: number;
  animX: Animated.Value;
  animY: Animated.Value;
  fontSize: number;
  width: number;
  height: number;
  ratio: number;
  animRatio: Animated.Value;
  zIndex: number;
};
export type StoryProcessedVideo = {
  name: string;
  uri: string;
  extension: string;
  width: number;
  height: number;
  base64: string;
  ratio: number;
  translateX: number;
  translateY: number;
  rotateDeg: number;
  texts: StoryText[];
  labels: StoryLabel[];
};

const textColors = [
  '#000',
  '#fff',
  '#318bfb',
  '#6cc070',
  '#ffcc00',
  '#f37121',
  '#c70039',
  '#512b58',
  '#ff926b',
  '#fff3cd',
  '#ffe277',
  '#4d3e3e',
  '#3f3f44',
];

export const emojiList = [
  '😀',
  '😁',
  '😂',
  '🤣',
  '😃',
  '😄',
  '😅',
  '😆',
  '😉',
  '😊',
  '😋',
  '😎',
  '😍',
  '😘',
  '😗',
  '😙',
  '😚',
  '☺',
  '🙂',
  '🤗',
  '🤩',
  '🤔',
  '🤨',
  '😐',
  '😑',
  '😶',
  '🙄',
  '😏',
  '😣',
  '😥',
  '😮',
  '🤐',
  '😯',
  '😪',
  '😫',
  '😴',
  '😌',
  '😛',
  '😜',
  '😝',
  '🤤',
  '😒',
  '😓',
  '😔',
  '😕',
  '🙃',
  '🤑',
  '😲',
  '🙁',
  '😖',
  '😞',
  '😟',
  '😤',
  '😢',
  '😭',
  '😦',
  '😧',
  '😨',
  '😩',
  '🤯',
  '😬',
  '😰',
  '😱',
  '😳',
  '🤪',
  '😵',
  '😡',
  '😠',
  '🤬',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🤧',
  '😇',
  '🤠',
  '🤡',
  '🤥',
  '🤫',
  '🤭',
  '🧐',
  '🤓',
  '🤪',
];

const MediaVideoProcessor = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const {mediaName, mediaUri, mediaType, songId, location} = route.params!;
  const videos = [
    {
      name: mediaName,
      uri: mediaUri,
      width: 300,
      height: 300,
      base64: '',
      extension: 'mp4',
    },
  ];

  const keyboard = useKeyboardStatus();
  const [currentVideoIndex, setCurrentIndex] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [draggingLabel, setDraggingLabel] = useState<boolean>(false);
  const [showLabelOptions, setShowLabelOptions] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>('#fff');
  const [textAlign, setTextAlign] = useState<
    'flex-start' | 'center' | 'flex-end'
  >('center');
  const [textBg, setTextBg] = useState<boolean>(false);
  const _animRatioTrashCan = React.useMemo(() => new Animated.Value(1), []);
  const _hScrollRef = useRef<ScrollView>(null);
  const _rotationRefList = [...videos].map(img =>
    useRef<RotationGestureHandler>(null),
  );
  const _pinchRefList = [...videos].map(img =>
    useRef<PinchGestureHandler>(null),
  );
  /**
   * mode
   * 1: general
   * 2: TextEdit
   * 3: Metion Label
   * 4: Hashtag Label
   */
  const [mode, setMode] = useState<1 | 2 | 3 | 4>(1);
  //Init animated value
  const _scaleAnimList = [...videos].map(img =>
    React.useMemo(() => new Animated.Value(SCREEN_WIDTH / img.width), []),
  );
  const _rotateAnimList = [...videos].map(img =>
    React.useMemo(() => new Animated.Value(0), []),
  );
  const _translateXAnimList = [...videos].map(img =>
    React.useMemo(() => new Animated.Value(0), []),
  );
  const _translateYAnimList = [...videos].map(img =>
    React.useMemo(() => new Animated.Value(0), []),
  );
  const _labeLWrapperYAnim = React.useMemo(() => new Animated.Value(0), []);
  const [enableGesture, setEnableGesture] = useState<boolean>(true);
  const ref = useRef<{
    processVideos: StoryProcessedVideo[];
    textWidth: number;
    textHeight: number;
    trashCanX: number;
    trashCanY: number;
    zoomTrashCan: boolean;
    labelContainerY: number;
  }>({
    processVideos: [...videos].map(video => {
      return {
        name: video.name,
        base64: video.base64,
        extension: video.extension,
        uri: video.uri,
        width: video.width,
        height: video.height,
        ratio: SCREEN_WIDTH / video.width,
        translateX: 0,
        translateY: 0,
        rotateDeg: 0,
        texts: [],
        labels: [],
      };
    }),
    textWidth: 0,
    textHeight: 0,
    trashCanX: (SCREEN_WIDTH - 44) / 2,
    trashCanY: SCREEN_HEIGHT - 62,
    zoomTrashCan: false,
    labelContainerY: 0,
  });
  useEffect(() => {
    _hScrollRef.current?.scrollTo({
      x: SCREEN_WIDTH * currentVideoIndex,
      y: 0,
      animated: true,
    });
  }, [currentVideoIndex]);
  useEffect(() => {
    if (!keyboard) {
      setMode(1);
    }
  }, [keyboard]);
  const _onEndDrag = ({
    nativeEvent: {
      contentOffset: {x},
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const tabIndex = Math.floor(x / SCREEN_WIDTH);
    const percentOffset = (x - tabIndex * SCREEN_WIDTH) / SCREEN_WIDTH;
    let nextTabIndex = 0;
    if (percentOffset > 0.5) {
      nextTabIndex = tabIndex + 1;
    } else {
      nextTabIndex = tabIndex;
    }
    _hScrollRef.current?.scrollTo({
      x: nextTabIndex * SCREEN_WIDTH,
      y: 0,
      animated: true,
    });
    setCurrentIndex(nextTabIndex);
  };
  //Translate processor
  const _onTranslateHandler = ({
    nativeEvent: {translationX, translationY},
  }: PanGestureHandlerGestureEvent) => {
    _translateXAnimList[currentVideoIndex].setValue(
      ref.current.processVideos[currentVideoIndex].translateX + translationX,
    );
    _translateYAnimList[currentVideoIndex].setValue(
      ref.current.processVideos[currentVideoIndex].translateY + translationY,
    );
  };
  const _onTranslateStateChange = ({
    nativeEvent: {translationX, translationY, state},
  }: PanGestureHandlerGestureEvent) => {
    if (state === State.END) {
      ref.current.processVideos[currentVideoIndex].translateX += translationX;
      ref.current.processVideos[currentVideoIndex].translateY += translationY;
    }
  };
  //Zoom processor
  const _onZoomHandler = ({
    nativeEvent: {scale},
  }: PinchGestureHandlerGestureEvent) => {
    _scaleAnimList[currentVideoIndex].setValue(
      ref.current.processVideos[currentVideoIndex].ratio * scale,
    );
  };
  const _onZoomStateChange = ({
    nativeEvent: {scale, state},
  }: PinchGestureHandlerGestureEvent) => {
    if (state === State.END) {
      ref.current.processVideos[currentVideoIndex].ratio *= scale;
    }
  };
  //Rotation processor
  const _onRotateHandler = ({
    nativeEvent: {rotation},
  }: RotationGestureHandlerGestureEvent) => {
    _rotateAnimList[currentVideoIndex].setValue(
      ref.current.processVideos[currentVideoIndex].rotateDeg + rotation,
    );
  };
  const _onRotateStateChange = ({
    nativeEvent: {rotation, state},
  }: RotationGestureHandlerGestureEvent) => {
    if (state === State.END) {
      ref.current.processVideos[currentVideoIndex].rotateDeg += rotation;
    }
  };

  const _onText = () => {
    setMode(2);
    refreshTextState();
  };
  const refreshTextState = () => {
    setText('');
    setTextAlign('center');
    setTextBg(false);
    setTextColor('#fff');
  };
  const _onChangeTextAlign = () => {
    if (textAlign === 'center') setTextAlign('flex-start');
    else if (textAlign === 'flex-start') setTextAlign('flex-end');
    else if (textAlign === 'flex-end') setTextAlign('center');
  };
  const _onDoneText = () => {
    if (text.length > 0) {
      const offsetX =
        textAlign === 'center'
          ? (SCREEN_WIDTH - ref.current.textWidth) / 2
          : textAlign === 'flex-start'
          ? 15
          : SCREEN_WIDTH - ref.current.textWidth - 15;
      const textZindexList = ref.current.processVideos[
        currentVideoIndex
      ].texts.map(x => x.zIndex);
      const labelZindexList = ref.current.processVideos[
        currentVideoIndex
      ].labels.map(x => x.zIndex);
      let maxlabelZindex = Math.max(...textZindexList.concat(labelZindexList));
      maxlabelZindex = maxlabelZindex !== -Infinity ? maxlabelZindex : 0;
      const storyText: StoryText = {
        zIndex: maxlabelZindex + 1,
        color: textColor,
        fontSize: 40,
        text,
        textAlign,
        textBg,
        x: offsetX,
        y: (SCREEN_HEIGHT - ref.current.textHeight) / 2,
        animX: new Animated.Value(offsetX),
        animY: new Animated.Value((SCREEN_HEIGHT - ref.current.textHeight) / 2),
        height: ref.current.textHeight,
        width: ref.current.textWidth,
        ratio: 1,
        animRatio: new Animated.Value(1),
      };
      ref.current.processVideos[currentVideoIndex].texts.push(storyText);
    }
    setMode(1);
  };
  //Label translate processor
  const _onTextLabelTranslateHandler = (
    index: number,
    {nativeEvent: {translationX, translationY}}: PanGestureHandlerGestureEvent,
  ) => {
    if (!draggingLabel) setDraggingLabel(true);
    const label = ref.current.processVideos[currentVideoIndex].texts[index];

    if (
      Math.abs(
        (label.y + translationY + label.height) * label.ratio -
          ref.current.trashCanY,
      ) < 50
    ) {
      if (!ref.current.zoomTrashCan) {
        Animated.spring(_animRatioTrashCan, {
          toValue: 1.5,
          useNativeDriver: true,
        }).start(() => (ref.current.zoomTrashCan = true));
      }
    } else {
      if (ref.current.zoomTrashCan) {
        Animated.spring(_animRatioTrashCan, {
          toValue: 1,
          useNativeDriver: true,
        }).start(() => (ref.current.zoomTrashCan = false));
      }
    }
    label.animX.setValue((label.x + translationX) * label.ratio);
    label.animY.setValue((label.y + translationY) * label.ratio);
  };
  const _onTextLabelTranslateChangeState = (
    index: number,
    {
      nativeEvent: {translationX, translationY, state},
    }: PanGestureHandlerGestureEvent,
  ) => {
    setDraggingLabel(false);
    if (state === State.END) {
      const label = ref.current.processVideos[currentVideoIndex].texts[index];
      label.x += translationX;
      label.y += translationY;
      if (
        Math.abs(
          (label.y + label.height) * label.ratio - ref.current.trashCanY,
        ) < 50
      ) {
        ref.current.processVideos[currentVideoIndex].texts.splice(index, 1);
        // setState({});
      }
      ref.current.zoomTrashCan = false;
    }
  };
  //Label zoom processor
  const _onTextLabelZoomHandler = (
    index: number,
    {nativeEvent: {scale}}: PinchGestureHandlerGestureEvent,
  ) => {
    const label = ref.current.processVideos[currentVideoIndex].texts[index];
    label.animRatio.setValue(label.ratio * scale);
  };
  const _onTextLabelZoomChangeState = (
    index: number,
    {nativeEvent: {scale, state}}: PinchGestureHandlerGestureEvent,
  ) => {
    if (state === State.END) {
      const label = ref.current.processVideos[currentVideoIndex].texts[index];
      label.ratio *= scale;
    }
  };
  //Label Options Wrapper Translate processor

  const _onLabelOptionsContainerTranslate = ({
    nativeEvent: {translationY},
  }: PanGestureHandlerGestureEvent) => {
    if (mode !== 1) return;
    if (
      ref.current.labelContainerY + translationY <
        -(SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 50) ||
      ref.current.labelContainerY + translationY > 0
    )
      return;
    if (!showLabelOptions) setShowLabelOptions(true);
    _labeLWrapperYAnim.setValue(ref.current.labelContainerY + translationY);
  };
  const _onLabelOptionsContainerTranslateChangeState = ({
    nativeEvent: {translationY, state},
  }: PanGestureHandlerGestureEvent) => {
    if (state === State.END) {
      if (
        ref.current.labelContainerY + translationY <
        -(SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 50) / 2
      ) {
        Animated.timing(_labeLWrapperYAnim, {
          duration: 250,
          toValue: -(SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 50),
          useNativeDriver: true,
        }).start();
        ref.current.labelContainerY = -(SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 50);
      } else {
        Animated.timing(_labeLWrapperYAnim, {
          duration: 250,
          toValue: 0,
          useNativeDriver: true,
        }).start(() => setShowLabelOptions(false));
        ref.current.labelContainerY = 0;
        Keyboard.dismiss();
      }
    }
  };
  const _showLabelOptionsContainer = () => {
    setShowLabelOptions(true);
    Animated.timing(_labeLWrapperYAnim, {
      duration: 250,
      toValue: -(SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 50),
      useNativeDriver: true,
    }).start();
    ref.current.labelContainerY = -(SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 50);
  };
  const _hideLabelOptionsContainer = () => {
    Animated.timing(_labeLWrapperYAnim, {
      duration: 250,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setShowLabelOptions(false));
    ref.current.labelContainerY = 0;
    Keyboard.dismiss();
  };
  //Label processor
  const _onLabelTranslateHandler = (
    index: number,
    {nativeEvent: {translationX, translationY}}: PanGestureHandlerGestureEvent,
  ) => {
    if (!draggingLabel) setDraggingLabel(true);
    const label = ref.current.processVideos[currentVideoIndex].labels[index];

    if (
      Math.abs(
        (label.y + translationY + label.height) * label.ratio -
          ref.current.trashCanY,
      ) < 50
    ) {
      if (!ref.current.zoomTrashCan) {
        Animated.spring(_animRatioTrashCan, {
          toValue: 1.5,
          useNativeDriver: true,
        }).start(() => (ref.current.zoomTrashCan = true));
      }
    } else {
      if (ref.current.zoomTrashCan) {
        Animated.spring(_animRatioTrashCan, {
          toValue: 1,
          useNativeDriver: true,
        }).start(() => (ref.current.zoomTrashCan = false));
      }
    }
    label.animX.setValue((label.x + translationX) * label.ratio);
    label.animY.setValue((label.y + translationY) * label.ratio);
  };
  const _onLabelTranslateChangeState = (
    index: number,
    {
      nativeEvent: {translationX, translationY, state},
    }: PanGestureHandlerGestureEvent,
  ) => {
    setDraggingLabel(false);
    if (state === State.END) {
      const label = ref.current.processVideos[currentVideoIndex].labels[index];
      label.x += translationX;
      label.y += translationY;
      if (
        Math.abs(
          (label.y + label.height) * label.ratio - ref.current.trashCanY,
        ) < 50
      ) {
        ref.current.processVideos[currentVideoIndex].labels.splice(index, 1);
        // setState({});
      }
      ref.current.zoomTrashCan = false;
    }
  };
  //Label zoom processor
  const _onLabelZoomHandler = (
    index: number,
    {nativeEvent: {scale}}: PinchGestureHandlerGestureEvent,
  ) => {
    const label = ref.current.processVideos[currentVideoIndex].labels[index];
    label.animRatio.setValue(label.ratio * scale);
  };
  const _onLabelZoomChangeState = (
    index: number,
    {nativeEvent: {scale, state}}: PinchGestureHandlerGestureEvent,
  ) => {
    if (state === State.END) {
      const label = ref.current.processVideos[currentVideoIndex].labels[index];
      label.ratio *= scale;
    }
  };

  const _onSelectedEmoji = (emoji: string) => {
    const textZindexList = ref.current.processVideos[
      currentVideoIndex
    ].texts.map(x => x.zIndex);
    const labelZindexList = ref.current.processVideos[
      currentVideoIndex
    ].labels.map(x => x.zIndex);
    let maxlabelZindex =
      Math.max(...textZindexList.concat(labelZindexList)) || 0;
    maxlabelZindex = maxlabelZindex !== -Infinity ? maxlabelZindex : 0;
    const addressLabel: StoryLabel = {
      zIndex: maxlabelZindex + 1,
      animRatio: new Animated.Value(1),
      animX: new Animated.Value((SCREEN_WIDTH - 55) / 2),
      animY: new Animated.Value((SCREEN_HEIGHT - 55) / 2),
      x: (SCREEN_WIDTH - 55) / 2,
      y: (SCREEN_HEIGHT - 55) / 2,
      fontSize: 40,
      height: 55,
      width: 55,
      ratio: 1,
      text: emoji,
      type: 'emoji',
    };
    ref.current.processVideos[currentVideoIndex].labels.push(addressLabel);
    // setState({});
  };
  const _onDoneLabel = () => {
    if (text.length < 2) return setMode(1);
    const textZindexList = ref.current.processVideos[
      currentVideoIndex
    ].texts.map(x => x.zIndex);
    const labelZindexList = ref.current.processVideos[
      currentVideoIndex
    ].labels.map(x => x.zIndex);
    let maxlabelZindex =
      Math.max(...textZindexList.concat(labelZindexList)) || 0;
    maxlabelZindex = maxlabelZindex !== -Infinity ? maxlabelZindex : 0;
    const label: StoryLabel = {
      zIndex: maxlabelZindex + 1,
      animRatio: new Animated.Value(1),
      animX: new Animated.Value(
        (SCREEN_WIDTH - (ref.current.textWidth + 10)) / 2,
      ),
      animY: new Animated.Value((SCREEN_HEIGHT - 64) / 2),
      x: (SCREEN_WIDTH - (ref.current.textWidth + 10)) / 2,
      y: (SCREEN_HEIGHT - 64) / 2,
      fontSize: 40,
      height: 64,
      width: ref.current.textWidth + 10,
      ratio: 1,
      text,
      type: 'people',
    };
    if (mode === 4) {
      label.type = 'hashtag';
    }
    ref.current.processVideos[currentVideoIndex].labels.push(label);
    setMode(1);
  };
  const _onSelectLabel = (
    type: 'address' | 'people' | 'hashtag' | 'emoji',
    value?: string,
  ) => {
    switch (type) {
      case 'address':
        break;
      case 'people':
        refreshTextState();
        setMode(3);
        break;
      case 'hashtag':
        refreshTextState();
        setMode(4);
        break;
      case 'emoji':
        _onSelectedEmoji(value as string);
        break;
      default:
        throw new Error();
    }
    _hideLabelOptionsContainer();
  };
  const _validateLabelText = (txt: string) => {
    if (txt[0]) {
      if (mode === 3 && txt[0] !== '@') return setText('@' + txt);
      if (mode === 4 && txt[0] !== '#') return setText('#' + txt);
    }
    if (mode === 3 && /^((\@(\w|\.)+)|\@)$/g.test(txt)) setText(txt);
    if (mode === 4 && /^((\#\w+)|\#)$/g.test(txt)) setText(txt);
  };
  const _onNext = async () => {
    dispatch(
      mediaAction.saveMediaProcess({
        data: ref.current.processVideos[0],
        mediaType,
      }),
    );
    dispatch(appAction.showAddToNFTDialog(location, songId));
    dispatch(mediaAction.updateMediaProcessStatus());
    navigation.pop();
  };

  return (
    <PanGestureHandler
      onHandlerStateChange={_onLabelOptionsContainerTranslateChangeState}
      onGestureEvent={_onLabelOptionsContainerTranslate}>
      <View>
        {mode === 1 && !draggingLabel && !showLabelOptions && (
          <View style={styles.topOptionsWrapper}>
            <TouchableOpacity
              onPress={() => {
                navigation.pop();
              }}
              style={styles.btnTopOption}>
              <Text
                style={{
                  fontSize: 30,
                  color: '#fff',
                }}>
                ✕
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_showLabelOptionsContainer}
              style={styles.btnTopOption}>
              <Icon name="sticker-emoji" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={_onText} style={styles.btnTopOption}>
              <Icon name="alpha-a-box" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        {mode === 2 && (
          <KeyboardAvoidingView
            behavior="height"
            style={styles.textToolWrapper}>
            <View style={styles.textTopOptions}>
              <TouchableOpacity
                onPress={_onChangeTextAlign}
                style={styles.btnTopOption}>
                <Icon
                  name={
                    textAlign === 'center'
                      ? 'format-align-center'
                      : textAlign === 'flex-start'
                      ? 'format-align-left'
                      : 'format-align-right'
                  }
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={setTextBg.bind(null, !textBg)}
                style={styles.btnTopOption}>
                <Icon
                  name={textBg ? 'alpha-a-box' : 'alpha-a'}
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={_onDoneText}
                style={{
                  ...styles.btnTopOption,
                  width: 60,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: 18,
                  }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...styles.textWrapper,
                justifyContent: textAlign,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    textBg === true ? textColor : 'rgba(0,0,0,0)',
                  padding: 5,
                  borderRadius: 5,
                }}>
                <TextInput
                  onContentSizeChange={e => {
                    ref.current.textHeight = e.nativeEvent.contentSize.height;
                    ref.current.textWidth = e.nativeEvent.contentSize.width;
                  }}
                  multiline={true}
                  autoFocus={true}
                  autoCapitalize="none"
                  value={text}
                  onChangeText={setText}
                  style={{
                    textAlign:
                      textAlign === 'flex-start'
                        ? 'left'
                        : textAlign === 'flex-end'
                        ? 'right'
                        : 'center',
                    fontSize: 40,
                    fontWeight: '800',
                    color: textBg ? '#000' : textColor,
                    maxWidth: SCREEN_WIDTH - 30,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.textBottompOptions}>
              <View
                style={{
                  ...styles.circleSelectedColor,
                  backgroundColor: textColor,
                }}>
                <Icon
                  name="eyedropper-variant"
                  size={20}
                  color={textColor === '#fff' ? '#000' : '#fff'}
                />
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                style={{
                  width: SCREEN_WIDTH - 50,
                }}
                keyboardShouldPersistTaps="always"
                horizontal={true}>
                {textColors.map((tColor, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setTextColor(tColor)}
                    style={{
                      ...styles.circleTextColor,
                      backgroundColor: tColor,
                    }}></TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        )}
        {(mode === 3 || mode === 4) && (
          <KeyboardAvoidingView
            behavior="height"
            style={{
              ...styles.textToolWrapper,
            }}>
            <View
              style={{
                ...styles.textTopOptions,
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={_onDoneLabel}
                style={{
                  ...styles.btnTopOption,
                  width: 60,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: 18,
                  }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...styles.textWrapper,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  padding: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 64,
                }}>
                <TextInput
                  onSubmitEditing={_onDoneLabel}
                  onContentSizeChange={e => {
                    ref.current.textHeight = e.nativeEvent.contentSize.height;
                    ref.current.textWidth = e.nativeEvent.contentSize.width;
                  }}
                  autoFocus={true}
                  autoCapitalize="none"
                  value={text}
                  onChangeText={txt => {
                    _validateLabelText(txt);
                  }}
                  style={{
                    opacity: 0,
                    fontSize: 40,
                    fontWeight: '800',
                    maxWidth: SCREEN_WIDTH - 30,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    left: 5,
                    top: 5,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    alignItems: 'center',
                  }}></View>
              </View>
            </View>
            <View />
          </KeyboardAvoidingView>
        )}
        <ScrollView
          onScrollEndDrag={_onEndDrag}
          showsHorizontalScrollIndicator={false}
          ref={_hScrollRef}
          bounces={false}
          horizontal={true}
          style={styles.scrollView}>
          {ref.current.processVideos.map((video, index) => (
            <ImageBackground
              key={index}
              style={styles.backgroundContainer}
              source={{
                uri: 'https://www.gstatic.com/webp/gallery/1.jpg',
              }}
              blurRadius={10}>
              {video.texts.map((txtLabel, labelIndex) => (
                <PanGestureHandler
                  key={labelIndex}
                  onGestureEvent={e => {
                    _onTextLabelTranslateHandler(labelIndex, e);
                  }}
                  onHandlerStateChange={e => {
                    _onTextLabelTranslateChangeState(labelIndex, e);
                  }}>
                  <PinchGestureHandler
                    onGestureEvent={e => {
                      _onTextLabelZoomHandler(labelIndex, e);
                    }}
                    onHandlerStateChange={e => {
                      _onTextLabelZoomChangeState(labelIndex, e);
                    }}>
                    <Animated.View
                      style={{
                        zIndex: txtLabel.zIndex,
                        backgroundColor: txtLabel.textBg
                          ? txtLabel.color
                          : 'rgba(0,0,0,0)',
                        padding: 5,
                        borderRadius: 5,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transform: [
                          {
                            translateX: txtLabel.animX,
                          },
                          {
                            translateY: txtLabel.animY,
                          },
                          {
                            scale: txtLabel.animRatio,
                          },
                        ],
                      }}>
                      <Text
                        style={{
                          width: txtLabel.width,
                          height: txtLabel.height + 5,
                          textAlign:
                            txtLabel.textAlign === 'flex-start'
                              ? 'left'
                              : txtLabel.textAlign === 'flex-end'
                              ? 'right'
                              : 'center',
                          fontSize: 40,
                          fontWeight: '800',
                          color: txtLabel.textBg ? '#000' : txtLabel.color,
                        }}>
                        {txtLabel.text}
                      </Text>
                    </Animated.View>
                  </PinchGestureHandler>
                </PanGestureHandler>
              ))}
              {video.labels.map((label, labelIndex) => (
                <PanGestureHandler
                  key={labelIndex}
                  onGestureEvent={e => {
                    _onLabelTranslateHandler(labelIndex, e);
                  }}
                  onHandlerStateChange={e => {
                    _onLabelTranslateChangeState(labelIndex, e);
                  }}>
                  <PinchGestureHandler
                    onGestureEvent={e => {
                      _onLabelZoomHandler(labelIndex, e);
                    }}
                    onHandlerStateChange={e => {
                      _onLabelZoomChangeState(labelIndex, e);
                    }}>
                    <Animated.View
                      style={{
                        zIndex: label.zIndex,
                        backgroundColor:
                          label.type === 'emoji' ? 'rgba(0,0,0,0)' : '#fff',
                        borderRadius: 5,
                        position: 'absolute',
                        width: label.width,
                        height: label.height,
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 0,
                        left: 0,
                        transform: [
                          {
                            translateX: label.animX,
                          },
                          {
                            translateY: label.animY,
                          },
                          {
                            scale: label.animRatio,
                          },
                        ],
                      }}>
                      {label.type === 'emoji' ? (
                        <Text
                          style={{
                            fontSize: label.fontSize,
                          }}>
                          {label.text}
                        </Text>
                      ) : (
                        <View />
                      )}
                    </Animated.View>
                  </PinchGestureHandler>
                </PanGestureHandler>
              ))}
              <PanGestureHandler
                enabled={enableGesture}
                minPointers={2}
                onHandlerStateChange={_onTranslateStateChange}
                onGestureEvent={_onTranslateHandler}>
                <RotationGestureHandler
                  enabled={enableGesture}
                  onHandlerStateChange={_onRotateStateChange}
                  ref={_rotationRefList[index]}
                  simultaneousHandlers={_pinchRefList[index]}
                  onGestureEvent={_onRotateHandler}>
                  <PinchGestureHandler
                    enabled={enableGesture}
                    onHandlerStateChange={_onZoomStateChange}
                    ref={_pinchRefList[index]}
                    simultaneousHandlers={_rotationRefList[index]}
                    onGestureEvent={_onZoomHandler}>
                    <Animated.View
                      style={{
                        width: video.width,
                        height: video.height,
                        transform: [
                          {
                            scale: _scaleAnimList[index],
                          },
                          // {
                          //   rotate: _rotateAnimList[index],
                          // },
                          {
                            translateX: _translateXAnimList[index],
                          },
                          {
                            translateY: _translateYAnimList[index],
                          },
                        ],
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'red',
                        }}
                        source={{
                          uri: video.uri,
                        }}
                      />
                    </Animated.View>
                  </PinchGestureHandler>
                </RotationGestureHandler>
              </PanGestureHandler>
            </ImageBackground>
          ))}
        </ScrollView>
        {ref.current.processVideos.length >= 1 &&
          !draggingLabel &&
          !showLabelOptions && (
            <View
              style={{
                ...styles.selectedImageWrapper,
              }}>
              <ScrollView
                style={{
                  maxWidth: SCREEN_WIDTH - 100,
                }}
                bounces={false}
                horizontal={true}>
                {ref.current.processVideos.map((photo, index) => (
                  <TouchableOpacity
                    onPress={setCurrentIndex.bind(null, index)}
                    key={index}
                    style={{
                      ...styles.previewImageWrapper,
                      padding: index === currentVideoIndex ? 3 : 0,
                    }}>
                    <Image
                      source={{
                        uri: photo.uri,
                      }}
                      style={{
                        ...styles.previewMultiImage,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={_onNext}
                activeOpacity={0.8}
                style={styles.btnNext}>
                <Text
                  style={{
                    fontWeight: '600',
                  }}>
                  Next
                </Text>
                <Icon name="chevron-right" size={20} />
              </TouchableOpacity>
            </View>
          )}
        {draggingLabel && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height: 80,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
            <Animated.View
              style={{
                height: 44,
                width: 44,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 44,
                borderColor: '#fff',
                borderWidth: 1,
                transform: [
                  {
                    scale: _animRatioTrashCan,
                  },
                ],
              }}>
              <Icon name="trash-can-outline" size={30} color="#fff" />
            </Animated.View>
          </View>
        )}
        <Animated.View
          style={{
            ...styles.labelOptionsWrapper,
            transform: [
              {
                translateY: _labeLWrapperYAnim,
              },
            ],
          }}>
          <BlurView
            style={{
              width: '100%',
              height: '100%',
            }}
            blurType="dark"
            blurAmount={5}
            reducedTransparencyFallbackColor="white">
            <View style={styles.labelOptionsTitleWrapper}>
              <View style={styles.dragBar} />
              <View style={styles.labelOptionsSearchWrapper}>
                <View style={styles.searchIcon}>
                  <Icon name="magnify" size={24} color="#fff" />
                </View>
                <TextInput
                  style={styles.labelOptionsSearch}
                  placeholder="Search"
                  placeholderTextColor="#fff"
                />
              </View>
            </View>
            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              bounces={false}
              showsVerticalScrollIndicator={true}>
              <TouchableOpacity
                onPress={() => _onSelectLabel('address')}
                style={styles.labelItemWrapper}>
                <View style={styles.mainLabel}>
                  {/* <TextGradient
                    icon={{
                      name: 'map-marker',
                      size: 16,
                    }}
                    text="LOCATION"
                    style={{
                      fontSize: 16,
                    }}
                  /> */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => _onSelectLabel('people')}
                style={styles.labelItemWrapper}>
                <View style={styles.mainLabel}>
                  {/* <TextGradient
                    text="@MENTION"
                    style={{
                      fontSize: 16,
                    }}
                  /> */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => _onSelectLabel('hashtag')}
                style={styles.labelItemWrapper}>
                <View style={styles.mainLabel}>
                  {/* <TextGradient
                    text="#HASHTAG"
                    style={{
                      fontSize: 16,
                    }}
                  /> */}
                </View>
              </TouchableOpacity>
              {emojiList.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => _onSelectLabel('emoji', emoji)}
                  style={styles.labelItemWrapper}>
                  <Text
                    style={{
                      fontSize: 40,
                    }}>
                    {emoji}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </BlurView>
        </Animated.View>
      </View>
    </PanGestureHandler>
  );
};

export default MediaVideoProcessor;

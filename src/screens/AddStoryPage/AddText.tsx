import {BgAlphaIcon} from 'assets/svg';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useKeyboardStatus} from '../../helper/utils';

type StoryText = {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  width: number;
  height: number;
  textBg: boolean;
  textAlign: 'flex-start' | 'center' | 'flex-end';
  color: string;
  originScreenWidth: number;
  originScreenHeight: number;
  animX: Animated.Value;
  animY: Animated.Value;
  animRatio: Animated.Value;
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

type AddTextProps = {
  style: any;
  disableAddBtn?: boolean;
  isEditing: boolean;
  isEditingText: Function;
  onFinishEdit?: Function;
};

const AddText = ({
  style,
  isEditing,
  isEditingText,
  disableAddBtn = false,
  onFinishEdit,
}: AddTextProps) => {
  const keyboard = useKeyboardStatus();

  const [isSetSize, setIsSetSize] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [draggingLabel, setDraggingLabel] = useState(false);
  /**
   * mode
   * 1: general
   * 2: TextEdit
   */
  const [mode, setMode] = useState<1 | 2>(1);
  const [text, setText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('red');
  const [textAlign, setTextAlign] = useState<
    'flex-start' | 'center' | 'flex-end'
  >('center');
  const [textBg, setTextBg] = useState<boolean>(false);
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const _animRatioTrashCan = React.useMemo(() => new Animated.Value(1), []);
  const trashHeight = 80;
  const ref = useRef<{texts: StoryText[]}>({
    texts: [],
  });

  useEffect(() => {
    if (!keyboard) {
      setMode(1);
    }
  }, [keyboard]);

  useEffect(() => {
    if (!isEditing) {
      setMode(1);
      _onDoneText();
    }
  }, [isEditing]);

  const _onText = () => {
    setMode(2);
    refreshTextState();
    isEditingText(true);
  };

  const refreshTextState = () => {
    setText('');
    setTextAlign('center');
    setTextBg(false);
    setTextColor('red');
  };

  const _onChangeTextAlign = () => {
    if (textAlign === 'center') setTextAlign('flex-start');
    else if (textAlign === 'flex-start') setTextAlign('flex-end');
    else if (textAlign === 'flex-end') setTextAlign('center');
  };

  const _onDoneText = () => {
    // save text
    if (text.length > 0) {
      const offsetX = (screenWidth - textWidth) / 2;
      const offsetY = (screenHeight - textHeight) / 2;

      const storyText: StoryText = {
        color: textColor,
        fontSize: 40,
        text,
        textAlign,
        textBg,
        x: offsetX,
        y: offsetY,
        width: textWidth,
        height: textHeight,
        originScreenWidth: screenWidth,
        originScreenHeight: screenHeight,
        animX: new Animated.Value(offsetX),
        animY: new Animated.Value(offsetY),
        animRatio: new Animated.Value(1),
      };

      ref.current.texts.push(storyText);
      onFinishEdit(ref.current.texts);
    }
  };

  //Label translate processor
  const _onTextLabelTranslateHandler = (
    index: number,
    {nativeEvent: {translationX, translationY}}: PanGestureHandlerGestureEvent,
  ) => {
    if (!draggingLabel) setDraggingLabel(true);
    const label = ref.current.texts[index];
    label.animX.setValue(label.x + translationX);
    label.animY.setValue(label.y + translationY);

    onFinishEdit(ref.current.texts);
  };

  const _onTextLabelTranslateChangeState = (
    index: number,
    {
      nativeEvent: {translationX, translationY, state},
    }: PanGestureHandlerGestureEvent,
  ) => {
    setDraggingLabel(false);
    if (state === State.END) {
      const label = ref.current.texts[index];
      label.x += translationX;
      label.y += translationY;

      if (label.y + label.height - (screenHeight - trashHeight) > 50) {
        ref.current.texts.splice(index, 1);
      }

      onFinishEdit(ref.current.texts);
    }
  };

  return (
    <View
      style={style}
      onLayout={event => {
        let {width, height} = event.nativeEvent.layout;
        if (!isSetSize) {
          setScreenWidth(width);
          setScreenHeight(height);
          setIsSetSize(true);
        }
      }}>
      {mode == 1 && !isEditing && !draggingLabel && !disableAddBtn && (
        <View style={styles.alphaBtnContainer}>
          <TouchableOpacity onPress={_onText}>
            <BgAlphaIcon />
          </TouchableOpacity>
        </View>
      )}
      {mode == 2 && isEditing && (
        <KeyboardAvoidingView behavior="height" style={styles.textToolWrapper}>
          <View
            style={{
              ...styles.textWrapper,
              justifyContent: textAlign,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: textBg === true ? textColor : 'rgba(0,0,0,0)',
                padding: 5,
                borderRadius: 5,
              }}>
              <TextInput
                onContentSizeChange={e => {
                  setTextWidth(e.nativeEvent.contentSize.width);
                  setTextHeight(e.nativeEvent.contentSize.height);
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
                  color: textBg ? 'red' : textColor,
                  maxWidth: screenWidth - 30,
                }}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
      {ref.current.texts.map((itemText, itemIndex) => (
        <PanGestureHandler
          key={itemIndex}
          onGestureEvent={e => {
            _onTextLabelTranslateHandler(itemIndex, e);
          }}
          onHandlerStateChange={e => {
            _onTextLabelTranslateChangeState(itemIndex, e);
          }}>
          <Animated.View
            style={{
              // zIndex: itemText.zIndex,
              zIndex: 999,
              backgroundColor: itemText.textBg
                ? itemText.color
                : 'rgba(0,0,0,0)',
              padding: 5,
              borderRadius: 5,
              position: 'absolute',
              top: 0,
              left: 0,
              transform: [
                {
                  translateX: itemText.animX,
                },
                {
                  translateY: itemText.animY,
                },
                {
                  scale: itemText.animRatio,
                },
              ],
            }}>
            <Text
              style={{
                width: itemText.width,
                height: itemText.height + 5,
                textAlign: 'center',
                fontSize: 40,
                fontWeight: '800',
                color: itemText.textBg ? '#000' : itemText.color,
              }}>
              {itemText.text}
            </Text>
          </Animated.View>
        </PanGestureHandler>
      ))}
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
            <Icon name="trash-can-outline" size={30} color="red" />
          </Animated.View>
        </View>
      )}
      {mode == 2 && isEditing && (
        <View style={styles.textBottompOptions}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
              width: screenWidth - 50,
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
      )}
    </View>
  );
};

export default AddText;

const styles = StyleSheet.create({
  alphaBtnContainer: {
    width: '100%',
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
  },
  alphaBtnView: {},
  textWrapper: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBottompOptions: {
    minHeight: 36,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -30,
  },
  textToolWrapper: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  circleTextColor: {
    height: 24,
    width: 24,
    borderRadius: 24,
    borderColor: '#fff',
    borderWidth: 2,
    marginHorizontal: 5,
  },
});

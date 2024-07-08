import React from 'react';
import {View, Image, Text, Animated} from 'react-native';
import Video from 'react-native-video';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'helper/utils';

const areaWidth = 200;
const areaHeight = 200;
const xConvertRatio = areaWidth / SCREEN_WIDTH;
const yConvertRatio = areaHeight / SCREEN_HEIGHT; // 200: canvas size, 300: size when creating

const MediaVideo = ({
  data,
  mediaUrl,
  setNFTUrl,
  setShowNFT,
  stopSong,
}: MediaVideoProps) => {
  const renderTexts = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        {data.arrText &&
          data.arrText.map(textData => {
            return (
              <Animated.View
                style={{
                  zIndex: textData.zIndex,
                  backgroundColor: textData.textBg
                    ? textData.color
                    : 'rgba(0,0,0,0)',
                  padding: 5,
                  borderRadius: 5,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: [
                    {
                      translateX: textData.animX * xConvertRatio,
                    },
                    {
                      translateY: textData.animY * yConvertRatio - 20,
                    },
                    {
                      scale: textData.animRatio,
                    },
                  ],
                }}>
                <Text
                  style={{
                    textAlign:
                      textData.textAlign === 'flex-start'
                        ? 'left'
                        : textData.textAlign === 'flex-end'
                        ? 'right'
                        : 'center',
                    fontSize: 40 * xConvertRatio,
                    fontWeight: '800',
                    color: textData.textBg ? '#000' : textData.color,
                  }}>
                  {textData.text}
                </Text>
              </Animated.View>
            );
          })}
        {data.arrLabel &&
          data.arrLabel.map(textData => {
            return (
              <Animated.View
                style={{
                  zIndex: textData.zIndex,
                  backgroundColor: textData.textBg
                    ? textData.color
                    : 'rgba(0,0,0,0)',
                  padding: 5,
                  borderRadius: 5,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: [
                    {
                      translateX: textData.animX * xConvertRatio,
                    },
                    {
                      translateY: textData.animY * yConvertRatio - 20,
                    },
                    {
                      scale: textData.animRatio,
                    },
                  ],
                }}>
                <Text
                  style={{
                    textAlign:
                      textData.textAlign === 'flex-start'
                        ? 'left'
                        : textData.textAlign === 'flex-end'
                        ? 'right'
                        : 'center',
                    fontSize: 40 * xConvertRatio,
                    fontWeight: '800',
                    color: textData.textBg ? '#000' : textData.color,
                  }}>
                  {textData.text}
                </Text>
              </Animated.View>
            );
          })}
      </View>
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        height: 200,
        width: 200,
        borderRadius: 30,
        marginBottom: -200,
      }}>
      <Video
        source={{uri: mediaUrl}}
        resizeMode={'cover'}
        style={{flex: 1, aspectRatio: 1, width: '100%', borderRadius: 30}}
        onEnd={() => {
          setNFTUrl('');
          setShowNFT(false);
        }}
        onLoadStart={() => {
          // console.log('--- onLoadStart');
          stopSong(true);
        }}
        onReadyForDisplay={() => {
          // console.log('--- onReadyForDisplay');
          stopSong(false);
        }}
      />
      {renderTexts()}
    </View>
  );
};

export default MediaVideo;

type MediaVideoProps = {
  data: any;
  mediaUrl: string;
  setNFTUrl: Function;
  setShowNFT: Function;
  stopSong: Function;
};

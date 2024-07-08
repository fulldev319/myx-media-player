import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, ViewStyle} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {MediumWaveIcon, SmallWaveIcon} from 'screens/thread/assets/svgs';

interface EmolikeProps {
  url: string;
  size?: number;
  large?: boolean;
  containerStyle?: ViewStyle;
}
const Emolike = (props: EmolikeProps) => {
  const {url, size, large, containerStyle} = props;
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    createThumbnail({
      url: url,
      timeStamp: 10000,
    })
      .then(response => {
        setThumbnail(response.path);
      })
      .catch(err => console.log({err}));
  }, [url]);

  return (
    <View style={containerStyle}>
      <View style={[styles.avatar, size && {width: size, height: size}]}>
        {thumbnail !== '' && (
          <Image source={{uri: thumbnail}} style={styles.thumbnail} />
        )}
      </View>
      <View style={styles.emoji}>
        {large ? <MediumWaveIcon /> : <SmallWaveIcon />}
      </View>
    </View>
  );
};

export default Emolike;

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: 'grey',
  },
  emoji: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

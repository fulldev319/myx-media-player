import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SmallWaveIcon} from 'screens/thread/assets/svgs';
import {createThumbnail} from 'react-native-create-thumbnail';

interface Emolike {
  comment: number;
  emojiImage: string;
  emojiName: string;
  emolike_id: number;
  timestamp: string;
  url: string;
}

interface EmolikeProps {
  emolike: Emolike;
  index: number;
  isSelected?: boolean;
  onClick?: (emolike: Emolike) => void;
}

export const ExpandEmolike = (props: EmolikeProps) => {
  const {emolike, index, isSelected, onClick} = props;
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    createThumbnail({
      url: emolike.url,
      timeStamp: 10000,
    })
      .then(response => {
        setThumbnail(response.path);
      })
      .catch(err => console.log({err}));
  }, [emolike]);

  const onPressed = () => {
    onClick(emolike);
  };

  return (
    <TouchableOpacity
      onPress={onPressed}
      style={[styles.emolike, index % 3 === 2 && {marginRight: 0}]}>
      <Image source={{uri: thumbnail}} style={styles.thumbnail} />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.01)', '#171717']}
        style={styles.emoNameContaner}>
        <View style={styles.rowItem}>
          <SmallWaveIcon />
          <Text numberOfLines={1} style={styles.emoName}>
            {emolike.emojiName}
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.emoti}>
        <Image
          source={{uri: emolike.emojiImage}}
          style={{width: '100%', height: '100%'}}
        />
      </View>
      {isSelected && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(255, 102, 81, 0.6)', borderRadius: 8},
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  emolike: {
    width: '30%',
    height: 136,
    borderRadius: 8,
    backgroundColor: 'grey',
    marginRight: 12,
    marginBottom: 12,
  },
  emoNameContaner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoName: {
    fontFamily: 'Poppins',
    fontSize: 8,
    fontWeight: '500',
    lineHeight: 11.2,
    marginLeft: 4,
    color: '#ffffff40',
  },
  emoti: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'white',
    position: 'absolute',
    right: -4,
    top: -4,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

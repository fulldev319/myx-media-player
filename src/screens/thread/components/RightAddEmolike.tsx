/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {SCREEN_HEIGHT} from 'helper/utils';
import {SmallPlusIcon, MediumWaveIcon} from '../assets/svgs';

interface Emolike {
  id: number;
  url: string;
  debate: number;
  user: number;
  emoji_id: number;
  timestamp: string;
  comment: number;
}
interface RightAddEmolikeProps {
  onAddEmolike: () => void;
  onClickEmolike: (url) => void;
  data: Emolike[];
}

export const Emolike = ({data, handlePressEmolike}) => {
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    createThumbnail({
      url: data.url,
      timeStamp: 10000,
    })
      .then(response => {
        setThumbnail(response.path);
      })
      .catch(err => console.log({err}));
  }, [data]);

  return (
    <TouchableOpacity style={{marginBottom: 10}} onPress={handlePressEmolike}>
      <View style={styles.avatar}>
        <Image
          source={{uri: thumbnail}}
          style={[StyleSheet.absoluteFill, {borderRadius: 20}]}
        />
        <MediumWaveIcon />
      </View>
      <View style={styles.emoji}>
        <Image source={{uri: data.emojiImage}} style={styles.emojiIcon} />
      </View>
    </TouchableOpacity>
  );
};

export const RightAddEmolike = (props: RightAddEmolikeProps) => {
  const {onAddEmolike, data, onClickEmolike} = props;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView
          style={{maxHeight: 220, marginTop: 10, paddingTop: 10}}
          contentContainerStyle={styles.scrollView}>
          {data.map(emolike => {
            return (
              <Emolike
                data={emolike}
                key={`right_emolike_${emolike.id}`}
                handlePressEmolike={() => onClickEmolike(emolike?.url)}
              />
            );
          })}
        </ScrollView>
        <TouchableOpacity
          onPress={onAddEmolike}
          style={[styles.bottomContent, data.length > 0 && {paddingTop: 15}]}>
          <SmallPlusIcon />
          <Text style={styles.addLavel}>{'Add\nEmolike'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 150,
    maxHeight: 300,
    width: 70,
    right: 0,
    backgroundColor: '#222222',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollView: {
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  bottomContent: {
    paddingBottom: 15,
    alignItems: 'center',
  },
  addLavel: {
    marginTop: 7,
    color: 'grey',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 9,
    lineHeight: 10.12,
  },
  emoji: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    position: 'absolute',
    top: -4,
    right: -4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiIcon: {
    width: 12,
    height: 12,
    borderRadius: 12,
  },
  thumbnail: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
  },
});

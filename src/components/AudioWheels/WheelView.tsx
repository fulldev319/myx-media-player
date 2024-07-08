/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import RotateAnimationView from './RotateAnimationView';
import {getDefaultAvatar} from 'helper/userHelpers';
import moment from 'moment';
import {SunShineEffect} from 'assets/svg';
import {createThumbnail} from 'react-native-create-thumbnail';

const WheelView = ({
  data,
  hideTopic,
  hideLabel,
  hideDuration,
}: {
  data: any;
  hideTopic?: Boolean;
  hideLabel?: Boolean;
  hideDuration?: Boolean;
}) => {
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    if (data && data.outer_emoji) {
      createThumbnail({
        url: data.outer_emoji,
        timeStamp: 5000,
      })
        .then(response => {
          setThumbnail(response.path);
        })
        .catch(err => console.log({err}));
    }
  }, [data]);

  return (
    <View
      style={[
        styles.rotateContainer,
        !hideTopic && {
          borderColor:
            data.outer_yes === 0 && data.outer_no === 0
              ? '#ffffff40'
              : '#08B883',
        },
      ]}>
      <View style={{position: 'absolute', left: 44, zIndex: 2}}>
        <RotateAnimationView
          type="image"
          content={thumbnail}
          color={''}
          speed={data.outer_speed}
        />
      </View>
      <View style={{position: 'absolute'}}>
        <RotateAnimationView
          type="text"
          content={data.middle_colour}
          color={
            data.middle_colour === 'L'
              ? '#2F9BFF'
              : data.middle_colour === 'M'
              ? '#08B883'
              : '#EA9B02'
          }
          speed={data.middle_speed}>
          <View
            style={[
              styles.imageContainer,
              {
                borderColor:
                  data.middle_colour === 'L'
                    ? '#2F9BFF'
                    : data.middle_colour === 'M'
                    ? '#08B883'
                    : '#EA9B02',
                backgroundColor:
                  data.middle_colour === 'L'
                    ? 'rgba(47, 155, 255, 0.3)'
                    : data.middle_colour === 'M'
                    ? 'rgba(8, 184, 131, 0.3)'
                    : 'rgba(234, 155, 2, 0.3)',
              },
            ]}>
            <Image
              source={
                data.inner_image ? {uri: data.inner_image} : getDefaultAvatar()
              }
              style={styles.image}
            />
          </View>
        </RotateAnimationView>
      </View>
      <SunShineEffect />
      {!hideLabel && (
        <View style={styles.label}>
          <Text style={styles.labelText}>
            {data.saved ? 'Saved' : data.seen ? 'Seen' : 'Unseen'}
          </Text>
        </View>
      )}
      {data.topic !== '' && !hideTopic && (
        <View style={styles.topicContainer}>
          <Text style={styles.topicText}>{data.topic}</Text>
        </View>
      )}
      {!hideDuration && (
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>
            {moment.utc(data.duration * 1000).format('mm:ss')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default WheelView;

const styles = StyleSheet.create({
  rotateContainer: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 50,
    position: 'relative',
  },
  imageContainer: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 18,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  topicContainer: {
    position: 'absolute',
    bottom: -14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'grey',
    zIndex: 2,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  durationContainer: {
    position: 'absolute',
    bottom: -32,
  },
  durationText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#ffffff60',
  },
  label: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    zIndex: 1,
    transform: [{rotate: '-135deg'}],
    backgroundColor: '#000',
    paddingHorizontal: 2,
  },
  labelText: {color: '#fff', fontSize: 6, fontWeight: '600'},
});

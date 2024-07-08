/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import RotateAnimationView from './RotateAnimationView';
import {getDefaultAvatar} from 'helper/userHelpers';
import {SunShineEffect} from 'assets/svg';

const WheelViewWithoutOutBorder = ({
  data,
  speed = 3000,
  type = 'yellow',
}: {
  data: any;
  speed?: number;
  type?: 'yellow' | 'blue' | 'green';
}) => {
  return (
    <View style={[styles.rotateContainer]}>
      <RotateAnimationView
        type="image"
        content={data.outer_emoji}
        color={
          type === 'yellow'
            ? '#FFA51F'
            : type === 'blue'
            ? '#2F9BFF'
            : '#08B883'
        }
        speed={speed}
      />
      <View
        style={{position: 'absolute', top: 0, left: 0, width: 60, height: 60}}>
        <RotateAnimationView
          type="text"
          content={type === 'yellow' ? 'S' : type === 'blue' ? 'L' : 'M'}
          color={
            type === 'yellow'
              ? '#FFA51F'
              : type === 'blue'
              ? '#2F9BFF'
              : '#08B883'
          }
          speed={speed}>
          <View
            style={[
              styles.imageContainer,
              {
                borderColor:
                  type === 'yellow'
                    ? '#FFA51F'
                    : type === 'blue'
                    ? '#2F9BFF'
                    : '#08B883',
                backgroundColor:
                  type === 'blue'
                    ? 'rgba(47, 155, 255, 0.3)'
                    : type === 'yellow'
                    ? 'rgba(255, 165, 31, 0.3)'
                    : 'rgba(8, 184, 131, 0.3)',
              },
            ]}>
            <Image
              source={data === '' ? getDefaultAvatar() : {uri: data}}
              style={styles.image}
            />
          </View>
        </RotateAnimationView>
      </View>
      <View style={{marginTop: 8, marginLeft: 3}}>
        <SunShineEffect />
      </View>
    </View>
  );
};

export default WheelViewWithoutOutBorder;

const styles = StyleSheet.create({
  rotateContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 50,
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

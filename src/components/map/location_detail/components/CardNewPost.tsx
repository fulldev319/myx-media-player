import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';

export const CardNewPost = () => {
  const renderAwardedMark = () => {
    return (
      <View style={styles.markAwardedContainer}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            backgroundColor: '#9214F5',
          }}></View>
        <Text style={styles.txtAwarded}>Awarded</Text>
      </View>
    );
  };

  const renderPlayBtn = () => {
    return (
      <View style={styles.btnPlay}>
        <PlayIcon />
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        <Image source={getDefaultAvatar()} style={styles.postImage} />
        <Text style={styles.title}>Rio Alexis in Urland</Text>
        <View style={styles.tagContainer}>
          {Array(6)
            .fill(0)
            .map((item, index) => {
              return (
                <View style={styles.tagItem} key={`new_post_${index}`}>
                  <Text style={styles.txtTagItem}>Love</Text>
                </View>
              );
            })}
        </View>
        <View style={styles.postContainer}>
          {Array(3)
            .fill(0)
            .map((item, index) => {
              return (
                <Image
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeEJgMQScyr97236zz-VtCy-l9XW6UDWa91U-faxTbdQ&s',
                  }}
                  style={styles.postItem}></Image>
              );
            })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderAwardedMark()}
      {renderPlayBtn()}
      {renderBody()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 151,
    height: 200,
    marginEnd: 15,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 64,
  },
  markAwardedContainer: {
    position: 'absolute',
    right: 0,
    top: 24,
    height: 22,
    width: 67,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4E7FE',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 4,
    marginEnd: -7,
    paddingHorizontal: 5,
  },
  txtAwarded: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: '#9214F5',
    marginStart: 4,
  },
  btnPlay: {
    position: 'absolute',
    bottom: 0,
    right: -6,
  },
  body: {
    flex: 1,
    margin: 16,
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
    marginEnd: 30,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagItem: {
    backgroundColor: '#F3F4F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 30,
    marginEnd: 4,
  },
  txtTagItem: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '500',
    color: '#010101',
    opacity: 0.6,
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  postItem: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginEnd: 2,
  },
});

const PlayIcon = () => (
  <Svg width="40" height="40" fill="none" viewBox="0 0 40 40">
    <Rect width="40" height="40" fill="#FF6651" rx="20"></Rect>
    <Path
      fill="#fff"
      d="M24.36 18l-6.44-3.693a2.28 2.28 0 00-3.42 2v7.413a2.28 2.28 0 003.42 1.973L24.36 22a2.28 2.28 0 000-3.947V18zm-.666 2.793l-6.44 3.747a.96.96 0 01-.947 0 .947.947 0 01-.473-.82v-7.44a.946.946 0 011.42-.82l6.44 3.72a.947.947 0 010 1.64v-.027z"></Path>
  </Svg>
);

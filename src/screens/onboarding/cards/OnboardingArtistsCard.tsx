import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const OnboardingArtistsCard = ({
  data,
  isFollowing,
  onFollow,
  onUnFollow,
  style = {},
}) => {
  return (
    <View style={[styles.container, style]}>
      <Image source={{uri: data.image}} style={styles.image} />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>{data.name}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followContainer,
          isFollowing && {backgroundColor: '#FF6651'},
        ]}
        onPress={() => (isFollowing ? onUnFollow(data.id) : onFollow(data.id))}>
        <Text style={[styles.txtFollow, isFollowing && {color: 'white'}]}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 144,
    height: 150,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    padding: 12,
    marginEnd: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  songInfoContainer: {
    flex: 1,
    marginTop: 15,
  },
  txtName: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  txtDesc: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },
  followContainer: {
    width: 80,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

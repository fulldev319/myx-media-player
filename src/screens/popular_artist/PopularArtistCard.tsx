import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export const PopularArtistCard = ({
  data,
  isFollowing,
  onFollow,
  onUnFollow,
  onDetail = null,
  style = {},
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onDetail && onDetail(data)}>
      <Image source={{uri: data.image}} style={styles.image} />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>{data.name}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followContainer,
          isFollowing && {backgroundColor: '#FF6651'},
        ]}
        onPress={() => (isFollowing ? onUnFollow(data) : onFollow(data))}>
        <Text style={[styles.txtFollow, isFollowing && {color: 'white'}]}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    padding: 14,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  songInfoContainer: {
    flex: 1,
    marginTop: 14,
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
    marginTop: 14,
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

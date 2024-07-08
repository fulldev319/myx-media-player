import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export const TrendingArtistCard = ({
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
      onPress={() => onDetail && onDetail(data.item)}>
      <Image source={{uri: data.item.image}} style={styles.image} />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>{data.item.name}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followContainer,
          isFollowing && {backgroundColor: '#FF6651'},
        ]}
        onPress={() =>
          isFollowing ? onUnFollow(data.item) : onFollow(data.item)
        }>
        <Text style={[styles.txtFollow, isFollowing && {color: 'white'}]}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 144,
    height: 165,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: 'rgba(255,255,255,0.2)',
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
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  followContainer: {
    width: 60,
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

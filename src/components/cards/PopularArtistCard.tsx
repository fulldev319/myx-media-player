import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export const PopularArtistCard = ({
  data,
  isFollowing,
  onFollow,
  onUnFollow,
  onGoToPeopleProfile = null,
  style = {},
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onGoToPeopleProfile && onGoToPeopleProfile(data.item.id)}>
      <Image
        source={
          data.item.image && data.item.image != 'string'
            ? {
                uri: data.item.image,
              }
            : getDefaultAvatar()
        }
        style={styles.image}
      />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>
          {data.item.name ?? data.item.username}
        </Text>
      </View>
      {!isFollowing ? (
        <TouchableOpacity
          style={styles.followContainer}
          onPress={() => {
            onFollow(data.item);
          }}>
          <Text style={styles.txtFollow}>Follow</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.followContainer}
          onPress={() => {
            onUnFollow(data.item);
          }}>
          <Text style={styles.txtFollow}>Unfollow</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtDuration: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  txtName: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins-Regular',
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
    borderColor: '#FF6651',
  },
  txtFollow: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontSize: 10,
    color: '#FF6651',
  },
});

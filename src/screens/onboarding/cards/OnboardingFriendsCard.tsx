import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const OnboardingFriendsCard = ({
  data,
  isFollowing,
  onFollow,
  onUnFollow,
  style = {},
}) => {
  return (
    <View style={[styles.container, style]}>
      <View>
        <Image source={{uri: data.image}} style={styles.image} />
      </View>

      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>{data.name}</Text>
        <Text style={styles.txtDesc} numberOfLines={1} ellipsizeMode="tail">
          {data.handle}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.followContainer,
            isFollowing && {backgroundColor: '#ff6651'},
          ]}
          onPress={() =>
            isFollowing ? onUnFollow(data.id) : onFollow(data.id)
          }>
          <Text style={[styles.txtFollow, isFollowing ? {color: 'white'} : {}]}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 22,
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtName: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  txtPlaylist: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginEnd: 10,
  },
  actionContainer: {},
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
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

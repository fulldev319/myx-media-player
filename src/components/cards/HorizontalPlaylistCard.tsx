import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const HorizontalPlaylistCard = ({data, style = {}}) => {
  const {navigate} = useNavigation();

  const goToPlayListPage = () => {
    navigate('TrackPlayListPage', {playlistId: data.item.id});
  };
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={goToPlayListPage}>
      <Image source={{uri: data.item.image}} style={styles.image} />
      <View style={styles.songInfoContainer}>
        <Text style={styles.tag}>Playlist</Text>
        <Text style={styles.txtName} ellipsizeMode="tail" numberOfLines={1}>
          {data.item.title}
        </Text>
        <Text style={styles.txtDesc}>
          {data.item.artistNumber ?? 0} Artists • {data.item.trackNumber ?? 0}{' '}
          Songs
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  image: {
    width: 60,
    height: 60,
    marginStart: 20,
    borderRadius: 4,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  tag: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
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
});

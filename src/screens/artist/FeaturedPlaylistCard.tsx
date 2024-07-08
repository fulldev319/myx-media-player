import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const FeaturedPlaylistCard = ({data}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('TrackPlayListPage', {playlistId: data.item.id});
      }}>
      <Image
        source={{
          uri: data.item.image,
        }}
        style={[StyleSheet.absoluteFill, styles.backgroundImage]}
      />
      <LinearGradient
        colors={['rgba(1, 1, 1, 0)', '#010101']}
        style={styles.gradient}
      />
      <View style={[StyleSheet.absoluteFill, styles.body]}>
        <View style={styles.playlistMarkContainer}>
          <Text style={styles.playlistMarkTitle}>Playlist</Text>
        </View>
        <Text style={styles.txtTitle}>{data.item.title}</Text>
        <Text
          style={
            styles.txtDesc
          }>{`${data.item.trackNumber} songs • ${data.item.artistNumber} artists`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 190,
    height: 150,
    borderRadius: 16,
    marginEnd: 16,
  },
  backgroundImage: {
    borderRadius: 16,
  },
  body: {
    justifyContent: 'flex-end',
    padding: 20,
  },
  gradient: {
    width: '100%',
    height: '60%',
    position: 'absolute',
    bottom: -5,
  },
  txtTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1)',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playlistMarkContainer: {
    width: 50,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  playlistMarkTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

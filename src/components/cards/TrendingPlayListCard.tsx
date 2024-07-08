import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity, Text, View} from 'react-native';
import {StyleSheet, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const TrendingPlayListCard = ({
  data,
  style,
}: TrendingPlayListCardProps) => {
  const {navigate} = useNavigation();

  return (
    <TouchableOpacity
      style={{...styles.container, ...style}}
      onPress={() => navigate('TrackPlayListPage', {playlistId: data.id})}>
      <Image
        source={{uri: data?.image}}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(1, 1, 1, 0)', '#010101']}
        style={styles.gradient}
      />
      <View style={styles.informationContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Playlist</Text>
        </View>
        <Text style={styles.title}>{data?.title}</Text>
        <Text style={styles.name}>
          {data?.artistNumber ?? 0} Artists • {data?.trackNumber ?? 0} Songs
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type TrendingPlayListCardProps = {
  data: any;
  style?: any;
};

export const styles = StyleSheet.create({
  container: {
    width: 191,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 191,
    height: 149,
    borderRadius: 16,
  },
  informationContainer: {
    position: 'absolute',
    padding: 16,
    bottom: 0,
    left: 0,
  },
  gradient: {
    width: '100%',
    height: '60%',
    position: 'absolute',
    bottom: -5,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 5,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  name: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#A7A7A7',
  },
});

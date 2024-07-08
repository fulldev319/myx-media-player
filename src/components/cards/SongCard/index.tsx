import React, {useEffect, useMemo} from 'react';
import {Image, TouchableOpacity, Text} from 'react-native';
import {styles} from './index.styles';
import sampleImage from './../../assets/sample/song_image_1.png';

export const SongCard = ({
  data,
  size = 190,
  marginRight = 20,
  marginTop = 0,
  onGoToDetail,
  onAddToPlaylist,
}: SongCardProps) => {
  return (
    <TouchableOpacity
      style={
        styles({size: size, marginRight: marginRight, marginTop: marginTop})
          .container
      }
      onPress={() => {
        onGoToDetail && onGoToDetail(data.id);
        onAddToPlaylist && onAddToPlaylist(data);
      }}>
      <Image
        source={
          data?.ImageUrl
            ? {uri: data?.ImageUrl}
            : require('assets/sample/song_image_1.png')
        }
        style={styles({size: size}).image}
        resizeMode="cover"
      />
      <Text style={styles({}).title}>{data?.Title ?? 'Title'}</Text>
      <Text style={styles({}).name}>{data?.songCount ?? 0} Songs</Text>
    </TouchableOpacity>
  );
};

type SongCardProps = {
  data: any;
  size?: number;
  marginRight?: number;
  marginTop?: number;
  onGoToDetail?: Function;
  onAddToPlaylist?: Function;
};

import React from 'react';
import {Image, TouchableOpacity, Text} from 'react-native';
import {styles} from './index.styles';

export const ArtistCard = ({
  data,
  marginRight = 16,
  marginTop = 0,
  size = 70,
  onGoToDetail,
}: ArtistCardProps) => {
  const style = styles({
    size: size,
    marginRight: marginRight,
    marginTop: marginTop,
  });

  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => {
        onGoToDetail(data.id);
      }}>
      <Image
        source={{uri: data.ImageUrl}}
        style={style.image}
        resizeMode="cover"
      />
      <Text style={style.name}>{data.ArtistName ?? 'Artist Name'}</Text>
    </TouchableOpacity>
  );
};

type ArtistCardProps = {
  data: any;
  marginRight?: number;
  marginTop?: number;
  size?: number;
  onGoToDetail?: Function;
};

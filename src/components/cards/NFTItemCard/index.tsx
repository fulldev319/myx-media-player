import React from 'react';
import {Image, TouchableOpacity, Text} from 'react-native';
import Video from 'react-native-video';

import {styles} from './index.styles';

export const NFTItemCard = ({
  data,
  marginRight = 16,
  marginTop = 0,
  size = 70,
  onGoToDetail,
}: NFTItemCard) => {
  const style = styles({
    size: size,
    marginRight: marginRight,
    marginTop: marginTop,
  });

  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => {
        onGoToDetail(data.MediaURL, data.MediaType, data);
      }}>
      {(data.MediaType === 'jpg' || data.MediaType === 'image') && (
        <Image
          source={{uri: data.MediaURL}}
          style={style.image}
          resizeMode="cover"
        />
      )}
      {data.MediaType === 'video' && (
        <Video source={{uri: data.MediaURL}} style={style.image} />
      )}
      {data.MediaType === 'txt' && (
        <Text style={style.name}>- {data.Name}</Text>
      )}
    </TouchableOpacity>
  );
};

type NFTItemCard = {
  data: any;
  marginRight?: number;
  marginTop?: number;
  size?: number;
  onGoToDetail?: Function;
};

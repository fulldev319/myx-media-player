import React, { useEffect, useMemo } from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import { styles } from './index.styles';

export const CollectionCard = ({
  data,
  size = 190,
  marginRight = 20,
  marginTop = 0,
}: SongCardProps) => {
  const style = styles({ size: size, marginRight: marginRight, marginTop: marginTop });
  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => { }}>
      <Image
        source={data?.ImageUrl ? { uri: data?.ImageUrl } : require('assets/sample/collection_image_1.png')}
        style={style.image}
        resizeMode="cover"
      />
      <Text style={style.title}>{data?.Title ?? 'Collection Name'}</Text>
      <Text style={style.name}>{data?.songCount ?? 0} Songs</Text>
    </TouchableOpacity>
  );
};

type SongCardProps = {
  data: any;
  size?: number;
  marginRight?: number;
  marginTop?: number;
};

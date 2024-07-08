import React, { useEffect, useMemo } from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import { styles } from './index.styles';
import { ShareIcon } from 'assets/svg';

export const SpottedCard = ({
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
        source={data?.ImageUrl ? { uri: data?.ImageUrl } : require('assets/sample/song_image_1.png')}
        style={style.image}
        resizeMode="cover"
      />
      <View style={{
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        width: "100%", marginTop: 16
      }}>
        <View>
          <Text style={style.title}>{data?.Title ?? 'Title'}</Text>
          <Text style={style.name}>{data?.songCount ?? 0} Songs</Text>
        </View>
        <TouchableOpacity onPress={() => { }}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

type SongCardProps = {
  data: any;
  size?: number;
  marginRight?: number;
  marginTop?: number;
};

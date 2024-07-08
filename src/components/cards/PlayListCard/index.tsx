import {PinkShareIcon} from 'assets/svg';
import React, {useEffect, useMemo} from 'react';
import {Image, TouchableOpacity, Text, View} from 'react-native';
import {styles} from './index.styles';

export const PlayListCard = ({
  data,
  size = 190,
  marginRight = 20,
  marginTop = 0,
  onGoToDetail,
  onShare,
}: PlayListCardProps) => {
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
        source={
          data?.ImageUrl
            ? {uri: data?.ImageUrl}
            : require('assets/sample/collection_image_1.png')
        }
        style={style.image}
        resizeMode="cover"
      />
      <View style={styles({}).informationContainer}>
        <View>
          <Text style={style.title}>{data?.Title ?? 'Collection Name'}</Text>
          <Text style={style.name}>{data?.songCount ?? 0} Songs</Text>
        </View>
        <TouchableOpacity onPress={() => onShare && onShare(data)}>
          <PinkShareIcon />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

type PlayListCardProps = {
  data: any;
  size?: number;
  marginRight?: number;
  marginTop?: number;
  onGoToDetail?: Function;
  onShare?: Function;
};

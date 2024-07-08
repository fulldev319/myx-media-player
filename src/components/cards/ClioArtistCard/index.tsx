import React from 'react';
import {Image, TouchableOpacity, Text, View} from 'react-native';
import {styles} from './index.styles';

export const ClioArtistCard = ({
  data,
  marginRight = 16,
  marginTop = 0,
  size = 70,
  onGoToDetail,
}: ClioArtistCardProps) => {
  const style = styles({
    size: size - 20,
    marginRight: marginRight,
    marginTop: marginTop,
  });

  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => {
        onGoToDetail(data.id);
      }}>
      <View style={style.imageContainer}>
        <Image
          source={require('./../../../assets/sample/artist_image_1.png')}
          style={style.image}
          resizeMode="cover"
        />
      </View>
      <Text style={style.name}>{'Celine'}</Text>
    </TouchableOpacity>
  );
};

type ClioArtistCardProps = {
  data: any;
  marginRight?: number;
  marginTop?: number;
  size?: number;
  onGoToDetail?: Function;
};

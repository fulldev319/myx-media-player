import React from 'react';
import {Image, TouchableOpacity, Text, Dimensions} from 'react-native';
import {styles} from './index.styles';

export const SLIDER_WIDTH = Dimensions.get('window').width - 40;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH / 3);

export const CarouselArtistItem = ({
  item,
  index,
  curIndex,
  onDetail,
}: {
  item: any;
  index: any;
  curIndex: any;
  onDetail: Function;
}) => {
  const style = styles({size: ITEM_WIDTH, selected: index === curIndex});
  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => {
        onDetail(item.id);
      }}>
      <Image
        source={{uri: item.ImageUrl}}
        style={style.image}
        resizeMode="cover"
      />
      {index === curIndex && <Text style={style.name}>{item.ArtistName}</Text>}
    </TouchableOpacity>
  );
};

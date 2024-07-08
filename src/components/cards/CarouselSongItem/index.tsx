import React from 'react';
import {View, Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import {styles} from './index.styles';

export const SLIDER_WIDTH = Dimensions.get('window').width - 40;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const CarouselSongItem = ({
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
  return (
    <TouchableOpacity
      style={styles({size: ITEM_WIDTH}).container}
      onPress={() => {
        onDetail(item.id);
      }}>
      <View
        style={{width: ITEM_WIDTH, height: ITEM_WIDTH, position: 'relative'}}>
        <View
          style={{
            transform: [
              {perspective: index == curIndex ? 800 : 700},
              {rotateX: '-60deg'},
              {scaleY: 1.5},
              {scaleX: 0.6},
            ],
          }}>
          <Image
            source={
              item?.ImageUrl
                ? {uri: item?.ImageUrl}
                : require('assets/sample/song_image_1.png')
            }
            style={styles({size: ITEM_WIDTH}).image}
            resizeMode="cover"
          />
        </View>
      </View>
      {index == curIndex && (
        <>
          <Text style={styles({}).title}>{item?.Title ?? 'Title'}</Text>
          <Text style={styles({}).name}>{item?.songCount ?? 0} Songs</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default CarouselSongItem;

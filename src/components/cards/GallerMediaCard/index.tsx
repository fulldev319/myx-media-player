import {MediaSelectedIcon} from 'assets/svg';
import {View} from 'native-base';
import React from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import {styles} from './index.styles';

export const GalleryMediaCard = ({
  data,
  index,
  selectedIndex,
  marginRight = 16,
  marginTop = 0,
  size = 70,
  onSelected,
}: GalleryMediaCardProps) => {
  const style = styles({
    size: size,
    marginRight: marginRight,
    marginTop: marginTop,
  });

  return (
    <View
      style={
        selectedIndex.length === 0
          ? style.defaultContainer
          : selectedIndex.includes(index)
          ? style.selectedContainer
          : style.disableContainer
      }>
      <TouchableOpacity
        onPress={() => {
          onSelected(index);
        }}>
        <Image
          source={{uri: data.node.image.uri}}
          style={style.image}
          resizeMode="cover"
        />
        {selectedIndex.includes(index) && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <MediaSelectedIcon />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

type GalleryMediaCardProps = {
  data: any;
  index: number;
  selectedIndex: number[];
  marginRight?: number;
  marginTop?: number;
  size?: number;
  onSelected?: Function;
};

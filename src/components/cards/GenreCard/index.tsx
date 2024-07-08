import React from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import {styles} from './index.styles';

export const GenreCard = ({
  data,
  size = 190,
  marginRight = 20,
  marginTop = 0,
  onGoDetail,
}: GenreCardType) => {
  const renderImage = () => {
    if (data.imgUrl?.length == 0 || data.imgUrl === '') {
      if (data.id && Number(data.id) < 29) {
        return (
          <Image
            source={
              Number(data.id) == 1
                ? require('./../../../assets/images/genreImages/01.webp')
                : Number(data.id) == 2
                ? require('./../../../assets/images/genreImages/02.webp')
                : Number(data.id) == 3
                ? require('./../../../assets/images/genreImages/03.webp')
                : Number(data.id) == 4
                ? require('./../../../assets/images/genreImages/04.webp')
                : Number(data.id) == 5
                ? require('./../../../assets/images/genreImages/05.webp')
                : Number(data.id) == 6
                ? require('./../../../assets/images/genreImages/06.webp')
                : Number(data.id) == 7
                ? require('./../../../assets/images/genreImages/07.webp')
                : Number(data.id) == 8
                ? require('./../../../assets/images/genreImages/08.webp')
                : Number(data.id) == 9
                ? require('./../../../assets/images/genreImages/09.webp')
                : Number(data.id) == 10
                ? require('./../../../assets/images/genreImages/10.webp')
                : Number(data.id) == 11
                ? require('./../../../assets/images/genreImages/11.webp')
                : Number(data.id) == 12
                ? require('./../../../assets/images/genreImages/12.webp')
                : Number(data.id) == 13
                ? require('./../../../assets/images/genreImages/13.webp')
                : Number(data.id) == 14
                ? require('./../../../assets/images/genreImages/14.webp')
                : Number(data.id) == 15
                ? require('./../../../assets/images/genreImages/15.webp')
                : Number(data.id) == 16
                ? require('./../../../assets/images/genreImages/16.webp')
                : Number(data.id) == 17
                ? require('./../../../assets/images/genreImages/17.webp')
                : Number(data.id) == 18
                ? require('./../../../assets/images/genreImages/18.webp')
                : Number(data.id) == 19
                ? require('./../../../assets/images/genreImages/19.webp')
                : Number(data.id) == 20
                ? require('./../../../assets/images/genreImages/20.webp')
                : Number(data.id) == 21
                ? require('./../../../assets/images/genreImages/21.webp')
                : Number(data.id) == 22
                ? require('./../../../assets/images/genreImages/22.webp')
                : Number(data.id) == 23
                ? require('./../../../assets/images/genreImages/23.webp')
                : Number(data.id) == 24
                ? require('./../../../assets/images/genreImages/24.webp')
                : Number(data.id) == 25
                ? require('./../../../assets/images/genreImages/25.webp')
                : Number(data.id) == 26
                ? require('./../../../assets/images/genreImages/26.webp')
                : Number(data.id) == 27
                ? require('./../../../assets/images/genreImages/27.webp')
                : require('./../../../assets/images/genreImages/28.webp')
            }
            style={styles({}).image}
            resizeMode="cover"
          />
        );
      } else {
        return (
          <Image
            source={require('./../../../assets/images/genreImages/default.webp')}
            style={styles({}).image}
            resizeMode="cover"
          />
        );
      }
    } else {
      return (
        <Image
          source={{uri: data.imgUrl}}
          style={styles({}).image}
          resizeMode="cover"
        />
      );
    }
  };
  return (
    <TouchableOpacity
      style={
        styles({size: size, marginRight: marginRight, marginTop: marginTop})
          .container
      }
      onPress={() => {
        onGoDetail && onGoDetail(data.id, data.name);
      }}>
      <View style={styles({}).imageContainer}>
        {renderImage()}
        <View style={styles({}).textContainer}>
          <Text style={styles({}).title}>{data.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type GenreCardType = {
  data: any;
  size?: number;
  marginRight?: number;
  marginTop?: number;
  onGoDetail?: Function;
};

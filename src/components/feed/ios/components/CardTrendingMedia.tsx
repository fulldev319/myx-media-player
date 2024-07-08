/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getDefaultAvatar} from 'helper/userHelpers';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const CardTrendingMedia = ({
  data,
  isBigCard,
}: {
  data: any;
  isBigCard?: boolean;
}) => {
  const navigation = useNavigation();

  const label = useMemo(() => {
    return data.duration > 300 ? 'L' : data.duration < 30 ? 'S' : 'M';
  }, []);

  const handleMedia = () => {
    if (data.is_debate === 0) {
      navigation.navigate('SubThreadPage', {id: data.id, url: data.url});
    } else {
      navigation.navigate('ThreadPage', {id: data.id});
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: isBigCard ? 160 : 105,
          height: isBigCard ? 220 : 140,
          marginBottom: isBigCard ? 19 : 0,
        },
      ]}
      onPress={handleMedia}>
      <Image
        source={{uri: data.media_urls}}
        style={[
          styles.mediaImage,
          {
            width: isBigCard ? 160 : 105,
            height: isBigCard ? 220 : 140,
          },
        ]}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.01)', '#171717']}
        style={styles.emoNameContaner}
      />
      <View style={styles.infoContainer}>
        <View
          style={{
            backgroundColor:
              label === 'L'
                ? 'rgba(47, 155, 255, 0.3)'
                : label === 'M'
                ? 'rgba(8, 184, 131, 0.3)'
                : 'rgba(234, 155, 2, 0.3)',
            borderColor:
              label === 'L' ? '#2F9BFF' : label === 'M' ? '#08B883' : '#EA9B02',
            width: isBigCard ? 48 : 31,
            height: isBigCard ? 48 : 31,
            borderWidth: 0.7,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
          }}>
          <Image
            source={data.image ? {uri: data.image} : getDefaultAvatar()}
            style={[
              styles.emoti,
              {
                width: isBigCard ? 32 : 22,
                height: isBigCard ? 32 : 22,
              },
            ]}
          />
          <View
            style={{
              backgroundColor:
                label === 'L'
                  ? '#2F9BFF'
                  : label === 'M'
                  ? '#08B883'
                  : '#EA9B02',
              borderRadius: 30,
              width: isBigCard ? 17 : 11,
              height: isBigCard ? 17 : 11,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: 0,
              top: 0,
            }}>
            <Text
              style={{
                fontSize: isBigCard ? 8.5 : 5.5,
                fontWeight: '600',
                color: '#fff',
              }}>
              {label}
            </Text>
          </View>
        </View>
        <Text
          numberOfLines={1}
          style={[styles.subTitle1, {fontSize: isBigCard ? 15 : 10}]}>
          {data.name}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.duration, {fontSize: isBigCard ? 15 : 10}]}>
          {moment.utc(data.duration * 1000).format('mm:ss')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardTrendingMedia;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
  },
  emoNameContaner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 100,
    width: '100%',
    borderRadius: 12,
  },
  infoContainer: {position: 'absolute', bottom: 10, left: 10},
  mediaImage: {
    borderRadius: 12,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  duration: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    color: '#ffffff40',
    marginTop: 4,
  },
  emoti: {
    borderRadius: 24,
    backgroundColor: 'white',
  },
  subTitle1: {
    fontWeight: '500',
    color: '#fff',
  },
});

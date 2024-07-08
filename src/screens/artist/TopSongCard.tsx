import {convertTimeFormat} from 'helper/utils';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Svg, {Path} from 'react-native-svg';

export const TopSongCard = ({data, index, numRow, togglePlay, style = {}}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={togglePlay}>
      <Text style={styles.numberText}>
        {getTwoNumberStr(numRow === 1 ? index * 2 + 1 : (index + 1) * 2)}
      </Text>
      <Image
        source={{
          uri: data.image,
        }}
        style={styles.image}
      />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName} ellipsizeMode="tail" numberOfLines={1}>
          {data.title}
        </Text>
        <Text style={styles.txtDesc}>{data.artists[0]}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getTwoNumberStr = number => {
  return number > 9 ? '' + number : '0' + number;
};

const styles = StyleSheet.create({
  container: {
    width: 210,
    height: 100,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 30,
  },
  numberText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  image: {
    width: 50,
    height: 50,
    marginStart: 10,
    borderRadius: 10,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 10,
    justifyContent: 'center',
  },
  txtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

const PlayIcon = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fill="#fff"
      d="M12 2c5.512 0 10 4.486 10 10.006C22 17.514 17.512 22 12 22S2 17.514 2 12.006C2 6.486 6.488 2 12 2zm-1.139 6.03c-.212 0-.415.048-.608.145a1.251 1.251 0 00-.54.598c-.068.173-.174.694-.174.704-.107.57-.164 1.495-.164 2.518 0 .976.057 1.862.144 2.441.01.01.116.656.232.878.212.405.627.656 1.071.656h.039c.29-.01.898-.26.898-.27 1.023-.425 3.04-1.746 3.851-2.624l.058-.058c.106-.106.241-.27.27-.309.155-.202.232-.453.232-.703 0-.281-.087-.542-.251-.754-.039-.038-.184-.202-.319-.337-.791-.85-2.857-2.239-3.938-2.663-.164-.067-.579-.212-.801-.222z"
      opacity="0.3"
    />
  </Svg>
);

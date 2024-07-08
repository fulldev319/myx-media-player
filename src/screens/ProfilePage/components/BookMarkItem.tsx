import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Svg, {Path} from 'react-native-svg';

export const BookMarkItem = ({item}) => (
  <View style={styles.root}>
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{uri: item.Image}}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.duration}>3:32</Text>
        <Text style={styles.name}>Freak in Me</Text>
        <Text style={styles.artist}>Anuel AA</Text>
      </View>
      <TouchableOpacity style={styles.action}>
        <PlayIcon />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    padding: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginHorizontal: 17,
  },
  duration: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  name: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
  },
  artist: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  action: {},
});

const PlayIcon = props => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M10 0C15.5116 0 20 4.48625 20 10.0058C20 15.5137 15.5116 20 10 20C4.48842 20 0 15.5137 0 10.0058C0 4.48625 4.48842 0 10 0ZM8.861 6.02991C8.64865 6.02991 8.44595 6.07815 8.2529 6.17463C8.01158 6.3097 7.81853 6.52195 7.71236 6.77279C7.64479 6.94645 7.53861 7.46744 7.53861 7.47709C7.43243 8.04631 7.37452 8.9725 7.37452 9.99518C7.37452 10.9706 7.43243 11.8572 7.51931 12.4361C7.52896 12.4457 7.63514 13.0921 7.75097 13.314C7.96332 13.7192 8.37838 13.9701 8.82239 13.9701H8.861C9.15058 13.9604 9.75869 13.7096 9.75869 13.7C10.7819 13.2754 12.7992 11.9537 13.61 11.0757L13.668 11.0178C13.7741 10.9117 13.9093 10.7477 13.9382 10.7091C14.0927 10.5065 14.1699 10.2557 14.1699 10.0058C14.1699 9.72504 14.083 9.46454 13.9189 9.25229C13.8803 9.2137 13.7355 9.04969 13.6004 8.91462C12.8089 8.06561 10.7432 6.67631 9.66216 6.25181C9.49807 6.18524 9.08301 6.03956 8.861 6.02991Z"
      fill="white"
    />
  </Svg>
);

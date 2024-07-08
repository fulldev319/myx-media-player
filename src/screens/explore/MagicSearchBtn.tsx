import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';

export const MagicSearchBtn = ({startMagicSearch}) => {
  return (
    <TouchableOpacity onPress={startMagicSearch} style={styles.root}>
      <View style={styles.container}>
        <View style={styles.mark}>
          <SearchMark />
          <Text style={styles.typo01}>Hear cool music at party?</Text>
        </View>
        <Text style={styles.typo02}>Try Magic Search</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    marginVertical: 16,
    borderRadius: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FF6651',
    borderRadius: 10,
    height: 45,
  },
  mark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typo01: {
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
  },
  typo02: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
  },
});

const SearchMark = props => (
  <Svg
    width={29}
    height={29}
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle
      cx={14.3333}
      cy={14.3333}
      r={14.3333}
      fill="white"
      fillOpacity={0.2}
    />
    <Path
      d="M14.7652 8.50879L9.07739 15.3342H14.1964L13.6277 19.8844L19.3155 13.0591H14.1964L14.7652 8.50879Z"
      stroke="white"
      strokeWidth={0.68254}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

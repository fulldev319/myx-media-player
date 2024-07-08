import {convertTimeFormat} from 'helper/utils';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Svg, {Path, Rect} from 'react-native-svg';

export const SelectSongCard = ({data, isSelected = false, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => onPress(data.item)}>
      <Image
        source={{uri: data.item.image}}
        style={[styles.image, isSelected && {opacity: 0.4}]}
      />
      <View style={styles.songInfoContainer}>
        {data.item.duration !== undefined && (
          <Text style={styles.txtDuration}>
            {convertTimeFormat(data.item.duration)}
          </Text>
        )}
        <Text style={styles.txtName}>{data.item.title}</Text>
        <Text style={styles.txtDesc}>
          {data.item.aritsts ? data.item.aritsts[0] : data.item.artists[0]}
        </Text>
      </View>
      {isSelected && (
        <View style={[styles.selectedConatiner]}>
          <PlayingIcon />
          <SelectedIcon />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginStart: 10,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
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
  txtDuration: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginEnd: 10,
  },
  actionContainer: {
    padding: 10,
  },
  selectedConatiner: {
    backgroundColor: 'rgba(255, 102, 81, 0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 81, 0.4)',
    padding: 12,
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const SelectedIcon = props => (
  <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <Rect width="24" height="24" fill="#FF6651" rx="12"></Rect>
    <Path
      stroke="#0E0E0E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.333 8L10 15.333 6.667 12"></Path>
  </Svg>
);

const PlayingIcon = props => (
  <Svg width="52" height="19" fill="none" viewBox="0 0 52 19">
    <Rect
      width="2.437"
      height="11.645"
      y="3.677"
      fill="#FF6651"
      rx="1.218"></Rect>
    <Rect
      width="2.437"
      height="16.548"
      x="4.874"
      y="1.225"
      fill="#FF6651"
      rx="1.218"></Rect>
    <Rect width="2.437" height="19" x="9.748" fill="#FF6651" rx="1.218"></Rect>
    <Rect width="2.437" height="19" x="14.621" fill="#FF6651" rx="1.218"></Rect>
    <Rect
      width="2.437"
      height="14.097"
      x="19.495"
      y="2.452"
      fill="#FF6651"
      rx="1.218"></Rect>
    <Rect width="2.437" height="19" x="24.369" fill="#FF6651" rx="1.218"></Rect>
    <Rect width="2.437" height="19" x="29.243" fill="#FF6651" rx="1.218"></Rect>
    <Rect width="2.437" height="19" x="34.117" fill="#FF6651" rx="1.218"></Rect>
    <Rect
      width="2.437"
      height="14.097"
      x="38.99"
      y="2.452"
      fill="#FF6651"
      fillOpacity="0.2"
      rx="1.218"></Rect>
    <Rect
      width="2.437"
      height="19"
      x="43.864"
      fill="#FF6651"
      fillOpacity="0.2"
      rx="1.218"></Rect>
    <Rect
      width="2.437"
      height="11.645"
      x="48.738"
      y="3.677"
      fill="#FF6651"
      fillOpacity="0.2"
      rx="1.218"></Rect>
  </Svg>
);

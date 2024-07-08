import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');
const size = (width - 40) / 4;

export const RoomUserCard = ({data = null, isAction = false, style = {}}) => {
  return (
    <TouchableOpacity style={[styles.container, style]}>
      <Image
        style={styles.image}
        resizeMode="cover"
        source={require('./../../assets/sample/dummy_member.png')}
      />
      <Text style={styles.name}>Collen</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: size,
    height: size,
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 70,
    height: 70,
  },
  name: {
    marginTop: 7,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
  },
});

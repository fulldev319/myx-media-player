import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

export const TopHostCard = () => {
  return (
    <View style={[styles.container]}>
      <Image
        source={require('./../../assets/sample/artist_image_2.png')}
        style={styles.image}
      />
      <View>
        <Text style={styles.name}>Jessica</Text>
        <Text style={styles.desc}>Curabitur a purus</Text>
      </View>
      <TouchableOpacity style={styles.followContainer}>
        <Text style={styles.txtFollow}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 145,
    height: 165,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 14,
    marginEnd: 10,
    padding: 12,
    justifyContent: 'space-between',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: '#ffffff',
  },
  desc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 5,
  },
  followContainer: {
    width: 60,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

export const Citizen = ({data}) => {
  return (
    <View>
	    <Image
	      source={{
	        uri:
	          data.image === null || data.image === '' || data.image === 'url'
	            ? 'https://thumbs.dreamstime.com/b/forest-panorama-rays-sunlight-scenic-fresh-green-deciduous-trees-sun-casting-its-light-foliage-53826213.jpg'
	            : data.image,
	      }}
	      style={styles.bgTopImage}
	    />
	    <Text style={styles.name}>{data.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
	bgTopImage: {
		width: 48,
		height: 48,
		borderRadius: 48,
		backgroundColor: '#eee'
	},
	name: {
		marginTop: 8,
		fontSize: 12,
		lineHeight: 12,
		textAlign: 'center',
		color: 'black',
		fontFamily: 'Poppins',
		fontWeight: '400',
		marginBottom: 32,
	}
});

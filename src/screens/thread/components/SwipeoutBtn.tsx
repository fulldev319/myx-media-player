import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {HideThreadIcon} from '../assets/svgs';

export const SwipeoutBtn = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <HideThreadIcon />
      <View style={styles.textWrap}>
        <Text style={styles.hideText}>Hide all</Text>
        <Text style={styles.hideText}>
          <Text style={{color: 'white'}}>Jessica</Text> post
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  textWrap: {
    marginTop: 12,
  },
  hideText: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#ffffff80',
  },
});

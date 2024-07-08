import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableHighlight,
  Text,
  Platform,
  View,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';

export const MyContactCard = ({data, onDelete}: MyContactCardProps) => {
  const rightButtons = [
    <TouchableHighlight style={styles.bgDelete} onPress={() => onDelete(data)}>
      <Text style={styles.txtDelete}>Delete</Text>
    </TouchableHighlight>,
  ];

  return (
    <Swipeable
      style={styles.container}
      rightButtons={rightButtons}
      rightButtonWidth={100}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.address}>{data.address}</Text>
      <View style={styles.divider}></View>
    </Swipeable>
  );
};

type MyContactCardProps = {
  data: any;
  onDelete: Function;
};

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#F6943E',
  },
  name: {
    flex: 1,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  address: {
    flex: 1,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  divider: {
    width: '100%',
    height: 1,
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  bgDelete: {
    width: 100,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
  },
  txtDelete: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

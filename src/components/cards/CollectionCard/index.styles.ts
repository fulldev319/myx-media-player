import {StyleSheet, Platform} from 'react-native';

export const styles = ({marginRight = 20, marginTop = 0, size = 190}) =>
  StyleSheet.create({
    container: {
      marginRight: marginRight,
      marginTop: marginTop,
      width: size,
      alignItems: 'center',
    },
    image: {
      width: size,
      height: size,
      borderRadius: 16,
    },
    title: {
      fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 16,
      color: '#FFFFFF',
      marginTop: 16,
    },
    name: {
      fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 10,
      color: '#A7A7A7',
      marginTop: 8,
    },
  });

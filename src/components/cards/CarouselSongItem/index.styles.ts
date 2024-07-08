import {StyleSheet} from 'react-native';

export const styles = ({size = 190}) =>
  StyleSheet.create({
    container: {
      width: size,
      alignItems: 'center',
    },
    image: {
      width: size,
      height: size,
      borderRadius: 8,
    },
    title: {
      fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 16,
      color: '#FFFFFF',
      marginTop: -36,
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

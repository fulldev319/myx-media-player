import {StyleSheet, Platform} from 'react-native';

export const styles = ({marginRight = 16, marginTop = 0, size = 70}) =>
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
      borderRadius: size,
    },
    name: {
      fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
      fontWeight: '400',
      fontSize: 20,
      color: '#FFFFFF',
      marginTop: 8,
    },
  });

import {StyleSheet, Platform} from 'react-native';

export const styles = ({marginRight = 16, marginTop = 0, size = 70}) =>
  StyleSheet.create({
    container: {
      marginRight: marginRight,
      marginTop: marginTop,
      width: size,
      alignItems: 'center',
    },
    imageContainer: {
      width: size,
      height: size,
      borderRadius: size,
      borderWidth: 1,
      borderColor: '#2F9BFF',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: size - 10,
      height: size - 10,
      borderRadius: size - 10,
    },
    name: {
      fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 12,
      color: '#FFFFFF',
      marginTop: 8,
    },
  });

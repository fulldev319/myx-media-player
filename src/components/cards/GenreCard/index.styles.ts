import {StyleSheet, Platform} from 'react-native';

export const styles = ({marginRight = 0, marginTop = 0, size = 150}) =>
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
      borderRadius: 80,
    },
    image: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
    textContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 22,
      color: '#FFFFFF',
    },
  });

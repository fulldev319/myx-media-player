import {StyleSheet, Platform} from 'react-native';

export const styles = ({marginRight = 16, marginTop = 0, size = 70}) =>
  StyleSheet.create({
    defaultContainer: {
      marginRight: marginRight,
      marginTop: marginTop,
      width: size,
      height: size,
      alignItems: 'center',
      opacity: 1,
    },
    disableContainer: {
      marginRight: marginRight,
      marginTop: marginTop,
      width: size,
      height: size,
      alignItems: 'center',
      opacity: 0.3,
    },
    selectedContainer: {
      marginRight: marginRight,
      marginTop: marginTop,
      width: size,
      height: size,
      alignItems: 'center',
      borderRadius: 15,
      borderColor: 'white',
      borderWidth: 4,
      opacity: 1,
    },
    image: {
      width: size - 8,
      height: size - 8,
      borderRadius: 12,
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

import {StyleSheet} from 'react-native';

export const styles = ({size = 190, selected = false}) =>
  StyleSheet.create({
    container: {
      width: size,
      alignItems: 'center',
    },
    image: {
      width: size,
      height: size,
      borderRadius: size,
      borderWidth: selected ? 2 : 0,
      borderColor: '#FF7A67',
      shadowColor: '#FF7A67',
      shadowOffset: {width: -20, height: 40},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    name: {
      fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 18,
      color: '#FFFFFF',
      marginTop: 12,
    },
  });

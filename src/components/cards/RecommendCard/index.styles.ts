import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    width: 150,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  title: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 14,
  },
  name: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#A7A7A7',
    marginTop: 5,
  },
});

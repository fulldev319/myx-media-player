import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    width: 150,
  },
  imageContainer: {
    width: 150,
    height: 150,
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
    color: '#000000',
  },
  tag: {
    marginTop: 5,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 18,
    color: '#000000',
  },
  description: {
    marginTop: 14,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#A7A7A7',
  },
});

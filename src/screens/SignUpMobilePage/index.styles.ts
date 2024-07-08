import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0E0E0E',
  },
  mainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    padding: 30,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  skipBtn: {
    position: 'absolute',
    right: 24,
    top: 40,
  },
  skipText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  title: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 28,
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 150,
  },
  subTitle: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: '#A7A7A7',
    marginTop: 21,
  },
  phoneNumLabel: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  phoneNumInput: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#707070',
  },
  button: {
    borderRadius: 30,
    background: 'linear-gradient(137.57deg, #F6943D 6.81%, #F85B2B 92.63%)',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  btnText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
  },
});

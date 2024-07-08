import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0E0E0E',
  },
  backBtn: {
    marginBottom: 10,
  },
  mainContainer: {
    height: '100%',
    width: '100%',
    padding: 20,
  },
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  subContainer: {
    marginVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 22,
    color: '#FFFFFF',
  },
  action: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  cardContainer: {
    marginTop: 28,
  },
  playContainer: {},
});

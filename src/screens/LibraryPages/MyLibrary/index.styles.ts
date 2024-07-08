import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0E0E0E',
    padding: 16,
  },
  title: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: Platform.OS === 'android' ? 22 : 30,
    color: '#FFFFFF',
    marginTop: Platform.OS === 'android' ? 20 : 60,
  },
  tabContainer: {
    width: '100%',
    height: '100%',
  },
});

import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    width: 150,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
  name: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 14,
  },
});

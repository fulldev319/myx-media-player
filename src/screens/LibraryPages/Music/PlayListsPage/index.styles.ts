import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0E0E0E',
    padding: 16,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  textCreatePlayList: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 15,
  },
});

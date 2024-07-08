import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#13162BCC',
    zIndex: 10,
  },
  loadingMainContainer: {
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(22)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingContent: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 32,
    color: '#FFFFFF',
  },
  loadingDescription: {
    marginTop: 16,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 22,
    color: '#C7C7C7',
    textAlign: 'center',
  },
});

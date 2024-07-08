import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  shareView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#13162BCC',
    blurRadius: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  shareContainer: {
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(10)',
  },
  closeBtn: {
    marginTop: 100,
    marginRight: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  body: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 32,
    color: '#FFFFFF',
  },
  subTitle: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 14,
  },
  actionView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 55,
  },
  actionItemContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionItem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: '85%',
    marginTop: 62,
  },
  contactsContainer: {
    width: '90%',
    marginTop: 50,
  },
  btnEditSave: {
    borderRadius: 30,
    background: 'linear-gradient(137.57deg, #F6943D 6.81%, #F85B2B 92.63%)',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEditSaveText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  successImage: {
    marginTop: 20,
  },
  successText: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

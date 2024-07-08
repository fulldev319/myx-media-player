import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  mainBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtAgo: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: 10,
    opacity: 0.6,
  },
  txtDesc: {
    flexDirection: 'row',
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
  },
  normalDesc: {
    color: 'white',
    fontSize: 12,
    opacity: 0.6,
    paddingHorizontal: 5,
    fontFamily: 'Poppins-Regular',
  },
  highlightDesc: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  trackImage: {
    width: 68,
    height: 68,
    borderRadius: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 20,
  },
  redActionBtn: {
    width: 100,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6651',
    marginEnd: 6,
  },
  blackActionBtn: {
    width: 100,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginEnd: 6,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  actionBtnText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
  },
});

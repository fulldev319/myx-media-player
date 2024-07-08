import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000132',
    borderRadius: 16,
    marginHorizontal: 0,
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
    width: 60,
    height: 2,
  },
  headerImage: {
    width: '100%',
    height: 286,
  },
  bodyBg: {
    flex: 1,
    backgroundColor: '#540D37',
  },
  txtNewWorld: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.5,
  },
  txtExplore: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 12,
  },
  btnExplore: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  txtBtnExplore: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

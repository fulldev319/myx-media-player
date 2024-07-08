import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
    margin: 24,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 8,
    paddingHorizontal: 24,
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
    width: 60,
    height: 2,
    alignSelf: 'center',
  },
  topView: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: '#F3F4F5',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtNewWorld: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 15,
    textAlign: 'left',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    opacity: 0.6,
    marginTop: 12,
  },
  btnExplore: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderColor: '#ff6651',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  txtBtnExplore: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6651',
  },
});

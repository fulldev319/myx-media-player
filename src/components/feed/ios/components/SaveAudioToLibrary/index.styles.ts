import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginBottom: 20,
    width: 60,
    height: 2,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 24,
    paddingEnd: 48,
  },
  btnBack: {
    marginStart: 24,
  },
  txtTitle: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  btnSave: {
    marginHorizontal: 24,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSaveAndCreate: {
    marginHorizontal: 24,
    height: 45,
    borderRadius: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FF6651',
  },
  btnSaveTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  btnSaveAndCreateTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6651',
  },
});

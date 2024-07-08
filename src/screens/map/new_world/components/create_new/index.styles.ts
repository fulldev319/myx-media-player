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
    marginVertical: 20,
  },
  countryNameWrap: {
    padding: 16,
    backgroundColor: '#f3f4f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  countryName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  btnContinue: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 4,
  },
  btnCancel: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 4,
  },
  txtBtnCreate: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  txtBtnCancel: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  flagContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagColorTxt: {
    fontFamily: 'Poppins',
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  flagColor: {
    width: 32,
    height: 32,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 30,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectFlagColor: {
    width: 40,
    height: 40,
    borderWidth: 3.75,
    borderColor: '#d5d6d7',
    borderRadius: 20,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInputImageAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInputImageText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#ffa51f',
    marginLeft: 18,
  },
  editInputImageDesc: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  editInputImageDescText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#C7C7C7',
  },
  editImagePreview: {
    display: 'flex',
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editImageSelected: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  editImageSelectedFileName: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 0.9,
    marginStart: 10,
  },
  editThumnailPreview: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editImagePreviewContianer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 112,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editInputImage: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

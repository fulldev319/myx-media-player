import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0E0E0E',
    paddingBottom: 40,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
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
  blureView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  editContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#13162BCC',
    blurRadius: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  editMainContainer: {
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(22)',
  },
  closeBtn: {
    marginTop: 70,
    marginRight: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editContent: {
    flex: 1,
    padding: 20,
  },
  editTitle: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 32,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  editDescription: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 22,
    textAlign: 'center',
    color: '#C7C7C7',
  },
  editTabList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tabSel: {
    borderBottomWidth: 2,
    borderColor: '#F6943D',
    marginHorizontal: 20,
    paddingBottom: 8,
  },
  tabSelText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  tab: {
    marginHorizontal: 20,
    paddingBottom: 8,
  },
  tabText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 18,
    color: '#A7A7A7',
  },
  editTabContent: {},
  editInputGroup: {
    marginTop: 25,
  },
  editInputLabel: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  editInputText: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 25,
    paddingVertical: 18,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  editSocialInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editSocialInputText: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    paddingLeft: 25,
    paddingRight: 60,
    paddingVertical: 18,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  editSocialIcon: {
    position: 'absolute',
    right: 25,
  },
  btnEditSave: {
    borderRadius: 30,
    background: 'linear-gradient(137.57deg, #F6943D 6.81%, #F85B2B 92.63%)',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
  },
  btnEditSaveText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
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
  editInputImageAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInputImageText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#13162BCC',
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
  editCoverPreview: {},
});

import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  largetStyleContent: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 15,
    fontFamily: 'Poppins',
  },
  ownerDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playMarkContainer: {
    height: 28,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 4,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  textContent: {
    fontSize: 32,
    fontWeight: '500',
    color: '#fff',
  },
  ownerImage: {
    width: 24,
    height: 24,
    borderRadius: 50,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
    marginLeft: 8,
  },
  postName: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 12,
    marginBottom: 12,
    maxWidth: 200,
    maxHeight: 36,
  },
  postDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  bookmarkContainer: {
    width: 44,
    height: 148,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 118,
    backgroundColor: 'rgba(40, 40, 40, 0.79)',
    padding: 8,
  },
  text: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bottomContainer: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
  },
  commentContainer: {
    width: '100%',
    height: 55,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: 50,
    fontSize: 12,
    fontWeight: '400',
    color: 'white',
    marginStart: 10,
  },
  taggedPersonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // comment dialog
  commentTabContainer: {height: 60, flexDirection: 'row'},
  commentTab: {flex: 1, alignItems: 'center'},
  commentTabTopView: {flexDirection: 'row', alignItems: 'center'},
  commentTabText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    marginStart: 10,
  },
  commentTabDefaultBorder: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 16,
  },
  commentTabSelectedtBorder: {
    width: '100%',
    height: 3,
    backgroundColor: '#FF6651',
    marginTop: 14,
  },
  addEmojiContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEmojiButton: {
    width: 135,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEmojiButtonTxt: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  sideMusicButton: {
    position: 'absolute',
    top: 10,
    right: 0,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#282828',
    borderTopLeftRadius: 64,
    borderBottomLeftRadius: 64,
    padding: 8,
    zIndex: 1,
  },
  sideSmileButton: {
    position: 'absolute',
    top: 74,
    right: 0,
    width: 64,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#282828',
    borderTopLeftRadius: 64,
    borderBottomLeftRadius: 64,
    padding: 8,
    zIndex: 1,
  },
  sidePlusButton: {
    position: 'absolute',
    top: 138,
    right: 0,
    width: 64,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#282828',
    borderTopLeftRadius: 64,
    borderBottomLeftRadius: 64,
    padding: 8,
    zIndex: 1,
  },
  commentActionBtn: {
    padding: 10,
  },

  // add emoji
  addEmojiHeader: {
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  addEmojiTitle: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginEnd: 29,
  },
  addEmojiContent: {
    flex: 1,
  },
  addEmojiBottom: {
    marginBottom: 40,
    alignItems: 'center',
  },
  addEmojiList: {
    height: 70,
  },
  addEmojiListItem: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
  },
  addEmojiSubmit: {
    width: 225,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  addEmojiSubmitTxt: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 20,
  },
  songImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  content: {
    // flex: 1,
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  description: {
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  toast: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  toastTxt: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 20,
  },
  followContainer: {
    width: 100,
    height: 44,
    backgroundColor: '#009282',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfollowContainer: {
    width: 100,
    height: 44,
    backgroundColor: '#E31855',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 1)',
  },
  followLoading: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  createSlambookTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
  createSlambookInput: {
    width: '100%',
    fontSize: 20,
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 40,
  },
  publishBtn: {
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishSlambookTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
});
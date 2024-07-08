import {SCREEN_WIDTH} from 'helper/utils';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 24,
    paddingVertical: 8,
  },
  content: {
    padding: 16,
    alignItems: 'flex-start',
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
    width: 60,
    height: 2,
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: 'white',
    marginRight: 30,
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 74,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  newButton: {
    width: 116,
    height: 42,
    backgroundColor: '#ff6651',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  newButtonTitle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 18,
    marginLeft: 4,
  },
  emolikesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emolike: {
    width: 105,
    height: 136,
    borderRadius: 8,
    backgroundColor: 'grey',
    marginRight: 12,
  },
  emoNameContaner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoName: {
    fontFamily: 'Poppins',
    fontSize: 8,
    fontWeight: '500',
    lineHeight: 11.2,
    marginLeft: 4,
    color: '#ffffff40',
  },
  emoti: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'white',
    position: 'absolute',
    right: 4,
    top: -4,
    overflow: 'hidden',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTxtContainer: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 36,
    color: '#ffffff',
    textAlign: 'center',
  },
  successTxt: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 36,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 40,
  },
  playerView: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    backgroundColor: '#494949',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  controlView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    height: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  txtSliderTime: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 6,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.4,
  },
  emoView: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#F3F4F5',
    borderColor: '#010101',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiSelectedTxt: {
    fontSize: 35,
  },
  emojiView: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 24,
    padding: 12,
  },
  successViewDismiss: {
    width: 220,
    height: 45,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  successViewDismissTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successEmoView: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#F3F4F5',
    borderColor: '#010101',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

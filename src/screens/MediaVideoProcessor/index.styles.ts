import {SCREEN_HEIGHT, SCREEN_WIDTH, STATUS_BAR_HEIGHT} from 'helper/utils';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  backgroundContainer: {
    overflow: 'hidden',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  topOptionsWrapper: {
    height: 50 + STATUS_BAR_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1,
    width: '100%',
  },
  bottomOptionsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
  bottomOption: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  textToolWrapper: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  textTopOptions: {
    flexDirection: 'row',
    height: 50 + STATUS_BAR_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrapper: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBottompOptions: {
    minHeight: 36,
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  circleSelectedColor: {
    width: 36,
    marginHorizontal: 5,
    height: 36,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleTextColor: {
    height: 24,
    width: 24,
    borderRadius: 24,
    borderColor: '#fff',
    borderWidth: 2,
    marginHorizontal: 5,
  },
  btnTopOption: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImageWrapper: {
    paddingHorizontal: 5,
    bottom: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 10,
  },
  previewImageWrapper: {
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    width: 32,
  },
  previewMultiImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  btnNext: {
    marginRight: 10,
    width: 80,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelOptionsWrapper: {
    width: '100%',
    height: SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 50,
    position: 'absolute',
    top: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
    left: 0,
  },
  labelOptionsTitleWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragBar: {
    marginTop: 15,
    width: 50,
    height: 3,
    borderRadius: 1,
    backgroundColor: '#fff',
  },
  labelOptionsSearchWrapper: {
    height: 44,
    flexDirection: 'row',
    width: SCREEN_WIDTH - 30,
    marginHorizontal: 15,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  labelOptionsSearch: {
    fontSize: 16,
    color: '#fff',
    width: SCREEN_WIDTH - 30 - 44,
  },
  searchIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelItemWrapper: {
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLabel: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
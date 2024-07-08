import {SCREEN_HEIGHT} from 'helper/utils';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  groupName: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 26,
    color: 'white',
  },
  requestTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
  },
  requestBtn: {
    width: 113,
    height: 41,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff20',
  },
  indicator: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorItem: {
    flex: 1,
    height: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    marginHorizontal: 2,
  },
  selectedIndicatorItem: {
    flex: 1,
    height: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    opacity: 0.4,
    marginHorizontal: 2,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 24,
    color: 'white',
  },
  topHeader: {
    width: '100%',
    marginTop: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeTitleTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center'
  },
  createBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

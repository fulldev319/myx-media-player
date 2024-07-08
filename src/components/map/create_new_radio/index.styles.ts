import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {position: 'relative'},
  radioTitle: {
    position: 'absolute',
    top: 40,
    left: 10,
    fontSize: 14,
    fontWeight: '400',
    color: '#01010160',
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  audioRequest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    width: '100%',
  },
  audioRequestText: {fontSize: 14, fontWeight: '500', color: '#010101'},
  hostText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#010101',
    marginTop: 24,
  },
  hostScroll: {marginTop: 24, width: '100%'},
  hostContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderStyle: 'solid',
    borderRadius: 32,
    marginRight: 8,
  },
  hostImage: {width: 32, height: 32, borderRadius: 20},
  hostNameText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#010101',
    marginLeft: 8,
    marginRight: 12,
  },
  radioTitleText: {
    fontSize: 14,
    color: '#010101',
    fontFamily: 'Poppins',
    fontWeight: '400',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00000040',
    marginTop: 48,
    paddingLeft: 24,
  },
  searchBar: {
    width: '100%',
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F5',
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  imageContainer: {
    width: 90,
    height: 76,
    alignItems: 'center',
  },
  imageBg01: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 13,
    left: 40,
    backgroundColor: '#292929',
    borderRadius: 10,
  },
  imageBg02: {
    position: 'absolute',
    width: 64,
    height: 64,
    top: 6,
    left: 19,
    backgroundColor: '#515151',
    borderRadius: 10,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 76,
    left: 0,
    borderRadius: 10,
  },
  toast: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastTxt: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 20,
  },
  searchInput: {height: 18, flex: 1, marginLeft: 13},
  secondScrollView: {height: 330, marginTop: 22, width: '100%'},
  secondScrollContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  secondScrollInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  secondeHostImage: {width: 40, height: 40, borderRadius: 20},
  secondTextContainer: {flex: 1, marginStart: 12},
  secondHostName: {
    fontWeight: '500',
    fontSize: 14,
    color: '#010101',
  },
});

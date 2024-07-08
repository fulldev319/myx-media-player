import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff20',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchBtnTxt: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 14,
    color: '#bf76f9',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  followedTxt: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 14,
    color: 'white',
  },
  followedBadge: {
    paddingHorizontal: 12,
    height: 36,
    marginLeft: 8,
    justifyContent: 'center',
    backgroundColor: '#25272d',
    borderRadius: 16,
  },

  dropDown: {
    backgroundColor: '#25272d',
    borderRadius: 8,
  },
  dropDownButton: {
    backgroundColor: '#25272d',
    width: 155,
    borderRadius: 16,
    height: 36,
  },
  dropDownButtonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  row: {
    borderBottomWidth: 0,
    height: 40,
  },
  rowChild: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
    paddingLeft: 13,
  },
});

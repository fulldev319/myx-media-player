import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    marginTop: 60,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 26,
    color: 'black',
    marginLeft: 10,
  },
  emptyView: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
  createNewBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  createNewTxt: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  manageHeader: {
    height: 40,
    borderWidth: 1,
    borderColor: '#00000020',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupNewTxt: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 14,
    color: 'black',
    marginLeft: 18,
  }
});

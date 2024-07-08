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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 24,
    color: 'white',
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 32,
    overflow: 'hidden',
  },
  searchBtn: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff20',
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBtnTxt: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 14,
    color: '#bf76f9',
  },
  createNewBtn: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  groups: {
    marginTop: 20,
    paddingBottom: 50,
  },
  groupContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 32,
  },
});

import {Background} from '@react-navigation/elements';
import {StyleSheet, Platform} from 'react-native';
import actions from '../../redux/auth/actions';

export const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0E0E0E',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {},
  title: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: Platform.OS === 'android' ? 22 : 30,
    color: '#FFFFFF',
    marginHorizontal: 20,
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  container: {
    marginTop: 20,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btnAddNewContainer: {
    borderRadius: 20,
    background: 'linear-gradient(137.57deg, #F6943D 6.81%, #F85B2B 92.63%)',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  btnAddNew: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  searchContainer: {
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(10)',
  },
  closeBtn: {
    marginTop: 20,
    marginRight: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  body: {
    display: 'flex',
    alignItems: 'center',
  },
  searchBar: {
    width: '85%',
    marginTop: 10,
  },
  contactsContainer: {
    width: '90%',
    marginTop: 20,
  },
  subTitle: {
    fontFamily:
      Platform.OS === 'android' ? "'PP Right Grotesk'" : 'RightGrotesk-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 14,
  },
  btnEditSave: {
    borderRadius: 30,
    background: 'linear-gradient(137.57deg, #F6943D 6.81%, #F85B2B 92.63%)',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEditSaveText: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

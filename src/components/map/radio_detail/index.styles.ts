import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 0,
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
    width: 60,
    height: 2,
  },
  filterContainer: {
    width: '100%',
    height: 50,
    marginVertical: 20,
  },
  filterItemNormalContainer: {
    height: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginEnd: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  filterItemSelectedContainer: {
    height: '100%',
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  filterItemText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: '#010101',
    textAlign: 'center',
    opacity: 0.6,
  },
  subContainer: {
    width: '100%',
    marginTop: 12,
  },
  subTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#010101',
  },
});

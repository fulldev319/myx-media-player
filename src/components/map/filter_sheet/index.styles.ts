import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 45,
    marginHorizontal: 0,
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
    width: 60,
    height: 2,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 18,
    fontWeight: '600',
    color: '#010101',
    textAlign: 'center',
  },
  itemRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfoContainer: {
    marginStart: 12,
  },
  itemTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: '#010101',
  },
  itemDescription: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '500',
    color: '#010101',
    opacity: 0.4,
  },
  switchContianer: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 3,
  },
  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 18,
    marginEnd: 3,
  },
});

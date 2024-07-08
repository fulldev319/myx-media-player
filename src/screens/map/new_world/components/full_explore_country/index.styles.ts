import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
    width: 60,
    height: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  body: {
    flex: 1,
    marginHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  txtTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
});

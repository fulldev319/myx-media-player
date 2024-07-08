import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  backgroundContainer: {
    width: '100%',
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: '#000000',
  },
  content: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  inputSearch: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'white',
    marginStart: 5,
    marginTop: 5,
  },
});

import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 25,
    height: 25,
    position: 'absolute',
  },
  itemNumberContainer: {
    width: 25,
    height: 25,
    position: 'absolute',
    backgroundColor: 'grey',
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 24,
    height: 24,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'white',
  },
  txtMore: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: '700',
  },
});

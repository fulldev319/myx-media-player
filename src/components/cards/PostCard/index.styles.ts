import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 5,
    width: '100%',
  },
  largetStyleContent: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
  },
  ownerDataContainer: {
    width: 70,
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    backgroundColor: 'rgba(1,1,1,0.5)',
    paddingHorizontal: 10,
  },
  playMarkContainer: {
    width: 42,
    height: 42,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(1,1,1,0.5)',
  },
  ownerImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  ownerName: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  postName: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  postDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
});

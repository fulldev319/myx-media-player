import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingBottom: 12,
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
  smallStyleContent: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
  },
  ownerDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playMarkContainer: {
    height: 31,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(1,1,1,0.6)',
    padding: 8,
    alignSelf: 'flex-start',
  },
  ownerImage: {
    width: 24,
    height: 24,
    borderRadius: 10,
  },
  ownerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  postName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 13,
    marginBottom: 13,
  },
  postDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  bookmarkContainer: {
    height: 44,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 118,
    backgroundColor: 'rgba(1, 1, 1, 0.79)',
    padding: 8,
    marginTop: 13,
  },
  text: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

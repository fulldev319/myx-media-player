import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  container: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subAction: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: -3,
  },
  horizontalLayout: {
    marginVertical: 16,
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#292929',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  recentSearchKeyword: {
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 10,
    height: 72,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentSearchKeywordText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 16,
    marginRight: 'auto',
  },
  category: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.4,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#0E0E0E',
    borderRadius: 8,
    padding: 10,
  },
  categorySelected: {
    fontSize: 12,
    color: '#FF6651',
    marginRight: 16,
    padding: 10,
  },
  miniPlayer: {
    marginBottom: -20,
  },
  genreText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
  },
});

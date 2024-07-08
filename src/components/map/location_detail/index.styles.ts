import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
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
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  topicItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    height: 35,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 10,
  },
  topicItemText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  sectionContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  sectionSeeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionSeeAllText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '500',
    color: '#FF6651',
    marginEnd: 5,
  },
});

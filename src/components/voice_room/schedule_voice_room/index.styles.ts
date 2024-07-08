import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderRadius: 45,
    marginHorizontal: 0,
  },
  indicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 0,
    width: 60,
    height: 2,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  txtRoomTopic: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  txtStartTime: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 1)',
  },
  infoView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 10,
  },
  txtInvite: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  txtShowAll: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6651',
  },
  txtMemberName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
  },
  btnStartNowContainer: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF6651',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginStart: 20,
  },
  btnScheduleContainer: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btnStartNowText: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },
  addTopicInput: {
    width: '100%',
    height: 20,
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    marginTop: 5,
  },
});

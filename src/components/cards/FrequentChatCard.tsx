import {useNavigation} from '@react-navigation/native';
import {getDefaultAvatar} from 'helper/userHelpers';
import {timeSince} from 'helper/utils';
import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';
import chatActions from 'redux/chats/actions';

export const FrequentChatCard = ({data, onDetail = null, style = {}}) => {
  const agoTime = data.updated ? timeSince(data.updated) + ' ago' : '';

  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  const user = useSelector((state: RootState) => state.auth.user);
  const gotoChatRoom = () => {
    dispatch(
      chatActions.setCurrentChat({
        users: {
          userFrom: {userId: user.id},
          userTo: {userId: data.id},
        },
      }),
    );
    navigate('ChatRoom');
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => {
        gotoChatRoom();
      }}>
      <Image
        source={data.image === '' ? getDefaultAvatar() : {uri: data.image}}
        style={styles.image}
      />
      <View style={styles.chatInfoContainer}>
        <Text style={styles.txtName}>{data.name}</Text>
        <Text style={styles.txtDesc}>{`@${data.handle}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 130,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chatInfoContainer: {
    flex: 1,
    marginTop: 16,
  },
  txtName: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  txtDesc: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 2,
  },
  followContainer: {
    width: 80,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 14,
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

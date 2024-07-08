import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import defaultAvatar from './../../assets/images/default_avatar.png';
import chatActions from 'redux/chats/actions';
import {RootState} from 'redux/interfaces';
import {apiFollowPeople} from 'helper/userHelpers';

export const ChatFriendCard = ({
  otherUser = null,
  sendFollowRequest,
  style = {},
}) => {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  const user = useSelector((state: RootState) => state.auth.user);
  const [status, setStatus] = useState<'true' | 'requested' | 'false'>(
    otherUser.isFollowed,
  );
  const [isLoading, setIsLoading] = useState(false);

  const gotoChatRoom = () => {
    dispatch(
      chatActions.setCurrentChat({
        users: {
          userFrom: {userId: user.id},
          userTo: {userId: otherUser.id},
        },
      }),
    );
    navigate('ChatRoom');
  };

  const onGoToProfile = () => {
    navigate('OtherProfilePage', {userId: otherUser.id});
  };

  const onFollowPeople = async () => {
    setIsLoading(true);
    const res = await apiFollowPeople(otherUser.id);
    if (res.success) {
      if (res.isFollowed === 'true') {
        setStatus('requested');
      }
    }
    setIsLoading(false);
  };

  return (
    <TouchableOpacity onPress={onGoToProfile} style={[styles.container, style]}>
      <View style={styles.avatar}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={
            otherUser.profileImage
              ? {uri: otherUser.profileImage}
              : defaultAvatar
          }
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
          {otherUser.username}
        </Text>
        <Text style={styles.desc} numberOfLines={1} ellipsizeMode={'tail'}>
          {otherUser.handle}
        </Text>
      </View>
      {status === 'true' ? (
        <TouchableOpacity style={styles.action} onPress={async () => {}}>
          <Text style={styles.chat}>Following</Text>
        </TouchableOpacity>
      ) : status === 'requested' ? (
        <Text style={styles.chat}>Requested</Text>
      ) : isLoading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          style={styles.action}
          onPress={async () => {
            onFollowPeople();
          }}>
          <Text style={styles.chat}>Follow</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  info: {
    flex: 1,
    marginHorizontal: 16,
  },
  action: {
    width: 49,
    height: 31,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  desc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 2,
  },
  chat: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});

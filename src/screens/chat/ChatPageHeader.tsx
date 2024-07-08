import React from 'react';
import {BackIcon, CameraIcon, PhoneIcon} from 'assets/svg/pageHeaderIcons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import defaultAvatar from './../../assets/images/default_avatar.png';
import {useNavigation} from '@react-navigation/native';

export const ChatPageHeader = ({
  otherUser,
  handleBack,
  isOtherTyping,
  isOtherConnected,
}) => {
  const navigation = useNavigation();
  const onGoToDetail = () => {
    navigation.navigate('ChatPersonDetail', {userData: otherUser});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={handleBack}>
        <BackIcon />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.info, {marginHorizontal: 0}]}
        onPress={onGoToDetail}>
        <View style={styles.info}>
          <Image
            source={otherUser?.image ? {uri: otherUser.image} : defaultAvatar}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.detail}>
            <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
              {otherUser?.name}
            </Text>
            <View style={styles.status}>
              {isOtherTyping ? (
                <Text style={styles.inactiveTxt}>typing...</Text>
              ) : isOtherConnected ? (
                <Text style={styles.activeTxt}>Active Now</Text>
              ) : otherUser?.status?.last_seen ? (
                <Text style={styles.inactiveTxt}>
                  last seen {otherUser?.status?.last_seen}
                </Text>
              ) : (
                <Text style={styles.inactiveTxt}>Inactive</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity>
          <PhoneIcon marginRight={10} />
        </TouchableOpacity>
        <TouchableOpacity>
          <CameraIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  back: {marginLeft: 26},
  info: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  detail: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  status: {
    marginTop: 2,
  },
  activeTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#1D8662',
  },
  inactiveTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  actions: {
    marginRight: 16,
    flexDirection: 'row',
  },
});

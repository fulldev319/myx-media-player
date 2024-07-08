import {useNavigation} from '@react-navigation/native';
import {apiFollowPeople, getDefaultAvatar} from 'helper/userHelpers';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const CardSlambookMember = ({data, ownerId, style = {}}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(data.isFollowing);

  const onFollowPeople = async () => {
    setIsLoading(true);
    const res = await apiFollowPeople(data.id);

    if (res.success) {
      setStatus('requested');
    }
    setIsLoading(false);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('OtherProfilePage', {
          userId: data.id,
        });
      }}>
      <Image
        source={data.image === '' ? getDefaultAvatar() : {uri: data.image}}
        style={styles.image}
      />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>{data.name}</Text>
        <Text style={styles.txtDesc}>{}</Text>
      </View>
      {ownerId === data.id ? (
        <View />
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : status === 'false' ? (
        <TouchableOpacity
          style={styles.followBtnContainer}
          onPress={() => {
            onFollowPeople();
          }}>
          <Text style={styles.txtFollow}>Follow</Text>
        </TouchableOpacity>
      ) : status === 'true' ? (
        <TouchableOpacity
          style={styles.followingBtnContainer}
          onPress={() => {}}>
          <Text style={styles.txtFollow}>Following</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.followingBtnContainer}
          onPress={() => {}}>
          <Text style={styles.txtFollow}>Requested</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default CardSlambookMember;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 19,
    marginTop: 16,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtDuration: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  txtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  loadingContainer: {
    width: 76,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followingBtnContainer: {
    width: 76,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
  },
  followBtnContainer: {
    width: 76,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#FF6651',
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 1)',
  },
});

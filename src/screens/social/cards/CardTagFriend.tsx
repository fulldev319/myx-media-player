import {useNavigation} from '@react-navigation/native';
import {AddPersonSmallIcon} from 'assets/svg';
import {apiSlambookAddFriend} from 'helper/slambookHelper';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const CardTagFriend = ({data, slamBookId}) => {
  const navigation = useNavigation();
  const [isRequested, setIsRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onGoToProfile = () => {
    navigation.navigate('OtherProfilePage', {userId: data.id});
  };

  const onAddToMember = async () => {
    setIsLoading(true);
    const res = await apiSlambookAddFriend(slamBookId, [data.id]);

    if (res.success) {
      setIsRequested(true);
    }

    setIsLoading(false);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onGoToProfile();
      }}>
      <Image
        source={{
          uri:
            data.image !== ''
              ? data.image
              : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
        }}
        style={styles.image}
      />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>{data.name}</Text>
        <Text style={styles.txtDesc}>{data.description}</Text>
      </View>
      {isRequested ? (
        <TouchableOpacity
          style={styles.actionDeleteContainer}
          onPress={() => {}}>
          <Text style={styles.txtRequested}>Requested</Text>
        </TouchableOpacity>
      ) : isLoading ? (
        <ActivityIndicator color={'#FF6651'} />
      ) : (
        <TouchableOpacity
          style={styles.actionContainer}
          onPress={onAddToMember}>
          <AddPersonSmallIcon />
          <Text style={styles.txtAdd}>Add</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default CardTagFriend;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 20,
    marginBottom: 10,
  },
  selectedContainer: {
    width: '100%',
    height: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 102, 81, 0.15)',
    borderColor: 'rgba(255, 102, 81, 0.4)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 10,
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
    fontWeight: '700',
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
  actionContainer: {
    height: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDeleteContainer: {
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  txtAdd: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: '#FF6651',
    marginStart: 4,
  },
  txtRequested: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginStart: 4,
  },
});

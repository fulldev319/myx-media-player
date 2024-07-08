import {useNavigation} from '@react-navigation/native';
import {apiGetUserInfo, getDefaultAvatar} from 'helper/userHelpers';
import {getTimeDifference} from 'helper/utils';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GreyCheckIcon} from '../assets/GreyCheckIcon';
import {PlayBg} from '../assets/PlayBg';
import {PlayIcon} from '../assets/PlayIcon';

export const CardBubbleDetail = ({data, onPress}) => {
  const {duration, tags, creator} = data;
  const arrTags = tags.split(',');
  const navigation = useNavigation();

  const [user, setUser] = useState({});

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const res = await apiGetUserInfo(creator);
    if (res.success) {
      setUser(res.data);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MyProfilePage', {
              id: user.id,
              fromOtherPage: true,
            })
          }
          style={styles.headerLeft}>
          <View style={styles.userAvatarView}>
            <Image
              source={user?.image ? {uri: user?.image} : getDefaultAvatar()}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <Text style={styles.txtHeader}>{user?.name}</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.txtHeader}>
            {getTimeDifference(new Date(), new Date(data.timestamp))}
          </Text>
          <GreyCheckIcon />
        </View>
      </View>
    );
  };

  const renderTags = () => {
    return (
      <Text style={{marginBottom: 5}}>
        {arrTags.map((item, index) => {
          return <Text style={styles.txtTag}>{`${item}  `}</Text>;
        })}
      </Text>
    );
  };

  const renderBottom = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <View style={{marginStart: -5}}>
          <PlayBg />
        </View>
        <View style={[StyleSheet.absoluteFill, {alignItems: 'center'}]}>
          <TouchableOpacity style={{bottom: -5}}>
            <PlayIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ImageBackground
        source={{uri: data.mediaUrls.split(',')[0]}}
        style={{width: '100%', height: '100%'}}>
        <View style={{flex: 1, padding: 8, justifyContent: 'space-between'}}>
          {renderHeader()}
          <View>
            {renderTags()}
            {renderBottom()}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: 230,
    backgroundColor: 'black',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarView: {
    width: 24,
    height: 24,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtHeader: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 10,
    color: 'white',
    opacity: 0.4,
    paddingHorizontal: 6,
  },
  txtTag: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 10,
    color: 'white',
  },
});

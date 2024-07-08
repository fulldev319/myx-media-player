import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {getDefaultAvatar} from 'helper/userHelpers';
import {generateComponentKey, isCloseToBottom} from 'helper/utils';
import CreateNewIcon from './assets/CreateNewIcon';
import SearchIcon from './assets/SearchIcon';
import {GroupCard} from './GroupCard';
import {styles} from './index.styles';
import {Loader} from 'screens/map/components';
import {apiGetMyGroupAll} from 'helper/groupHelper';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

const MyGroupPage = () => {
  const navigation = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const [hasMoreGroup, setHasMoreGroup] = useState(true);
  const [lastIdGroup, setLastIdGroup] = useState(null);
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);
  const [arrGroup, setArrGroup] = useState([]);

  useEffect(() => {
    loadGroupData();
  }, []);

  const goToProfile = () => {
    navigation.navigate('MyProfilePage', {fromOtherPage: true});
  };

  const loadGroupData = async () => {
    if (hasMoreGroup && !isLoadingGroup) {
      setIsLoadingGroup(true);
      const res = await apiGetMyGroupAll({offset: lastIdGroup, limit: 10});

      if (res.success) {
        setLastIdGroup(res.lastId);
        setHasMoreGroup(res.hasMore);
        setArrGroup(prev => [...prev, ...res.data]);
      }
      setIsLoadingGroup(false);
    }
  };

  const onCreateNew = () => {
    navigation.navigate('ChatsScreen');
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Groups</Text>
        <TouchableOpacity style={styles.avatarWrap} onPress={goToProfile}>
          <Image
            source={
              user?.image === '' || user === undefined || user === null
                ? getDefaultAvatar()
                : {uri: user?.image}
            }
            style={styles.userAvatar}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSearchBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('GroupPage')}
        style={styles.searchBtn}>
        <View>
          <SearchIcon />
        </View>
        <Text style={styles.searchBtnTxt}>Explore New Groups...</Text>
        <View />
      </TouchableOpacity>
    );
  };

  const renderCreateBtn = () => {
    return (
      <TouchableOpacity style={styles.createNewBtn} onPress={onCreateNew}>
        <CreateNewIcon />
      </TouchableOpacity>
    );
  };

  const renderGroups = () => {
    if (isLoadingGroup) {
      return (
        <View style={styles.loader}>
          <Loader color="white" />
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.groups}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadGroupData();
          }
        }}
        scrollEventThrottle={500}>
        <View style={styles.groupContents}>
          {arrGroup.map((item, index) => {
            return (
              <GroupCard
                onPress={() =>
                  navigation.navigate('GroupBookPage', {group: item})
                }
                index={index}
                data={item}
                key={`my_group_card_${generateComponentKey()}`}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {renderHeader()}
        {renderSearchBtn()}
        {renderGroups()}
        {renderCreateBtn()}
      </View>
    </SafeAreaView>
  );
};

export default MyGroupPage;

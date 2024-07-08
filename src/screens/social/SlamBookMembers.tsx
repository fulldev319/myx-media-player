import {useNavigation, useRoute} from '@react-navigation/native';
import {AddPersonIcon} from 'assets/svg';
import {CommonSkeleton} from 'components/common/Skeleton';
import {apiGetSlambookMember} from 'helper/slambookHelper';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

import {BackIcon} from 'screens/TrackPlayList/components/TrackPlayListIcons';
import CardSlambookMember from './cards/CardSlambookMember';

const SlamBookMembersPage = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();
  const {params} = useRoute();

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastRole, setLastRole] = useState('creator');
  const [lastId, setLastId] = useState(null);
  const [arrData, setArrData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData(true);
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async (isReload = false) => {
    if (!isLoading && hasMore) {
      setIsLoading(true);

      const res = await apiGetSlambookMember(params.slambook, lastRole, lastId);

      if (res.success) {
        if (isReload) {
          setArrData(res.data);
        } else {
          setArrData(prev => [...prev, ...res.data]);
        }

        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setLastRole(res.lastRole);
      }
    }
    setIsLoading(false);
  };

  const onBack = () => {
    navigation.goBack();
  };

  const onGoToAddMember = () => {
    navigation.navigate('SlamBookTagFriendPage', {slambook: params.slambook});
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTxt}>Slambook Members</Text>
        <TouchableOpacity onPress={onGoToAddMember}>
          <AddPersonIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const arrCreator = useMemo(
    () => arrData.filter((item, index) => item.role === 'creator'),
    [arrData],
  );

  const arrMember = useMemo(
    () =>
      arrData.filter(
        (item, index) => item.role === 'member' && item.id !== arrCreator[0].id,
      ),
    [arrData],
  );

  const arrRequest = useMemo(
    () => arrData.filter((item, index) => item.role === 'requested'),
    [arrData],
  );

  const renderCreatorView = () => {
    return (
      <View style={styles.subView}>
        <Text style={styles.subTitleTxt}>Creator</Text>
        {arrCreator[0] && (
          <CardSlambookMember data={arrCreator[0]} ownerId={user.id} />
        )}
      </View>
    );
  };

  const renderMembersView = () => {
    return (
      <View style={styles.subView}>
        <Text style={styles.subTitleTxt}>Members</Text>
        {arrMember.map(itemData => (
          <CardSlambookMember data={itemData} ownerId={user.id} />
        ))}
      </View>
    );
  };

  const renderRequestsView = () => {
    return (
      <View style={[styles.subView, {marginBottom: 100}]}>
        <Text style={styles.subTitleTxt}>Requests</Text>
        {arrRequest.map(itemData => (
          <CardSlambookMember data={itemData} ownerId={user.id} />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{marginBottom: 50}}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadData();
          }
        }}
        scrollEventThrottle={500}>
        {renderHeader()}
        {renderCreatorView()}
        {arrMember.length > 0 && renderMembersView()}
        {arrRequest.length > 0 && renderRequestsView()}
        {isLoading && <CommonSkeleton />}
      </ScrollView>
    </View>
  );
};

export default SlamBookMembersPage;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 26,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 70,
  },
  headerTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: 'white',
  },
  subView: {
    marginTop: 24,
  },
  subTitleTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: 'white',
  },
});

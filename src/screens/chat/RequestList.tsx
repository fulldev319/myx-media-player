import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RequestListItem} from './RequestListItem';
import {apiGetChatRequests} from 'helper/chatHelpers';
import {useNavigation} from '@react-navigation/native';

const RequestList = () => {
  const [requestedChats, setRequestedChats] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getChatRequests(true);
  }, []);

  const getChatRequests = (isNew = false) => {
    if (!isNew && (loading || !hasMore)) {
      return;
    }
    setLoading(true);
    apiGetChatRequests(isNew ? 0 : lastId)
      .then((res: any) => {
        if (res.success) {
          if (isNew) {
            setRequestedChats(res.data);
          } else {
            setRequestedChats(prev => [...prev, ...res.data]);
          }
          setHasMore(res.hasMore);
          setLastId(res.lastId);
        } else {
          setHasMore(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getChatRequests(true);
    });
    return focusHandler;
  }, [navigation]);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <View style={styles.container}>
      {requestedChats && requestedChats?.length > 0 ? (
        <>
          <FlatList
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                apiGetChatRequests();
              }
            }}
            scrollEventThrottle={500}
            keyExtractor={item => item.room}
            data={requestedChats}
            renderItem={({item}) => {
              return <RequestListItem chat={item} />;
            }}
          />
          {loading && (
            <View style={{width: '100%', alignItems: 'center', marginTop: 32}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          )}
        </>
      ) : (
        <View style={styles.empty}>
          <Image
            source={require('./../../assets/images/no_friends_icon.png')}
          />
          <Text style={styles.emptyText}>No friends yet.</Text>
        </View>
      )}
    </View>
  );
};

export default RequestList;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    position: 'relative',
  },
  container: {
    flex: 1,
    marginTop: 8,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 20,
  },
  chatBtn: {
    position: 'absolute',
    right: 35,
    bottom: 24,
  },
  friendListScroll: {
    marginTop: 28,
  },
  friendList: {},
});

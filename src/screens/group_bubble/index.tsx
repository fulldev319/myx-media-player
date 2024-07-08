import {useNavigation, useRoute} from '@react-navigation/native';
import {
  apiGetGroupsBubble,
  apiGetGroupsDebates,
  apiGetGroupsMembers,
} from 'helper/groupHelper';
import {getDefaultAvatar} from 'helper/userHelpers';
import {
  convertTimeFormat,
  generateComponentKey,
  isCloseToBottom,
  secondsToHms,
} from 'helper/utils';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CreateNewPostModal} from 'screens/bubble_detail/components/CreateNewPostModal';
import {AllPersonIcon} from './assets/AllPersonIcon';
import {BackIcon} from './assets/BackIcon';
import {CommentIcon} from './assets/CommentIcon';
import CreateNewPostsIcon from './assets/CreateNewPostsIcon';
import NoAllPersonIcon from './assets/NoAllPersonIcon';
import {PinkPlayIcon} from './assets/PinkPlayIcon';
import {CardBubbleDetail} from './component/CardBubbleDetail';

import {styles} from './index.styles';

export const GroupBubbleDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [lastId, setLastId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [debates, setDebates] = useState([]);

  const [memberIsLoading, setMemberIsLoading] = useState(false);
  const [memberLastId, setMemberLastId] = useState(0);
  const [memberHasMore, setMemberHasMore] = useState(true);
  const [members, setMembers] = useState([]);

  const [bubble, setBubble] = useState(route.params?.bubble);

  useEffect(() => {
    initDebates();
  }, [selectedUser]);

  useEffect(() => {
    loadGroupMembers();
  }, []);

  useEffect(() => {
    loadGroupBubble();
  }, []);

  const initDebates = async () => {
    setIsLoading(true);
    const params = {
      bubble: bubble?.id,
      limit: 10,
      offset: 0,
    };
    if (selectedUser) {
      params['member'] = selectedUser?.user;
    }
    const res = await apiGetGroupsDebates(params);
    if (res.success) {
      setDebates(res.data);
      setLastId(res.lastId);
      setHasMore(res.hasMore);
    }
    setIsLoading(false);
  };

  const loadDebates = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    const params = {
      bubble: bubble?.id,
      limit: 10,
      offset: lastId,
    };
    if (selectedUser) {
      params['member'] = selectedUser?.user;
    }
    const res = await apiGetGroupsDebates(params);
    if (res.success) {
      setDebates(prev => [...prev, res.data]);
      setLastId(res.lastId);
      setHasMore(res.hasMore);
    }
    setIsLoading(false);
  };

  const loadGroupMembers = async () => {
    if (!memberHasMore || memberIsLoading) return;
    setMemberIsLoading(true);
    const params = {
      group: route.params?.groupId,
      limit: 10,
      type: 'all',
      offset: memberLastId,
    };
    if (selectedUser) {
      params['member'] = selectedUser?.user;
    }
    const res = await apiGetGroupsMembers(params);
    if (res.success) {
      if (lastId === 0) {
        setMembers(res.data);
      } else {
        setMembers(prev => [...prev, res.data]);
      }
      setMemberLastId(res.lastId);
      setMemberHasMore(res.hasMore);
    }
    setMemberIsLoading(false);
  };

  const loadGroupBubble = async () => {
    const res = await apiGetGroupsBubble({bubble: bubble?.id});
    if (res.success) {
      setBubble(res.data);
    }
  };

  const onChats = () => {
    navigation.navigate('ChatsScreen', {bubbleId: bubble?.id});
  };

  const onBack = () => {
    navigation.goBack();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.titleTxt}>{bubble?.name}</Text>
        <TouchableOpacity onPress={onChats}>
          <CommentIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPersons = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.personContainer}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadGroupMembers();
          }
        }}
        scrollEventThrottle={500}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.personItem}>
          <PinkPlayIcon />
        </View>
        <TouchableOpacity
          onPress={() => setSelectedUser(null)}
          style={styles.personItem}>
          {selectedUser?.user ? <NoAllPersonIcon /> : <AllPersonIcon />}
        </TouchableOpacity>
        <View
          style={[
            styles.personItem,
            {
              width: 1,
              height: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          ]}
        />
        {members.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => setSelectedUser(item)}
              style={[
                styles.personItem,
                {
                  borderWidth: 2,
                  borderColor:
                    selectedUser?.user == item.user ? '#9214F5' : 'transparent',
                },
              ]}
              key={`person_item_${generateComponentKey()}`}>
              <Image
                source={item.image ? {uri: item.image} : getDefaultAvatar()}
                style={{width: '100%', height: '100%'}}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.panContainer}>
        <View>{renderPersons()}</View>
        {isLoading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator color="white" />
          </View>
        ) : (
          <ScrollView
            style={styles.posts}
            showsVerticalScrollIndicator={false}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                loadDebates();
              }
            }}
            scrollEventThrottle={500}
            contentContainerStyle={{paddingBottom: 50}}>
            <View style={styles.postContents}>
              {debates.map((item, index) => {
                return (
                  <CardBubbleDetail
                    data={item}
                    key={`card_bubble_detail_${generateComponentKey()}`}
                    onPress={() =>
                      navigation.navigate('BubbleDetailPage', {
                        bubbleId: bubble?.id,
                        bubble: bubble,
                        audioId: item.id,
                      })
                    }
                  />
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    );
  };

  const renderCreateNewPostBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => setVisibleModal(true)}
        style={styles.createBtn}>
        <CreateNewPostsIcon />
      </TouchableOpacity>
    );
  };

  const renderCreateNewPostModal = () => {
    if (!visibleModal) return;
    return (
      <CreateNewPostModal
        bubble={bubble}
        visible={visibleModal}
        hideModal={() => setVisibleModal(false)}
        onSuccess={() => initDebates()}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <Text style={styles.timeTitleTxt}>
        {bubble?.duration ? secondsToHms(bubble.duration) : ''}
      </Text>
      <View style={styles.panView} />
      {renderBody()}
      {renderCreateNewPostBtn()}
      {renderCreateNewPostModal()}
    </View>
  );
};

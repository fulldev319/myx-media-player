import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';

import {ArrowBack, DetailVerticalIcon} from 'assets/svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import CardDiscussion from './cards/CardDiscussion';
import {SlamBookInput} from 'screens/social/components/SlamBookChatInput';

import {apiGetHashTagComments} from 'helper/slambookHelper';
import {CommonSkeleton} from 'components/common/Skeleton';

const HashTagDiscussPage = () => {
  const navigation = useNavigation();
  const {params} = useRoute();

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [arrMessages, setArrMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);

      const res = await apiGetHashTagComments(
        params.slambookId,
        params.topicId,
        params.tagName,
        lastId,
      );

      if (res.success) {
        setArrMessages(prev => [...prev, ...res.data]);
        setTotalCount(res.count);
        setHasMore(res.hasMore);
        setLastId(res.lastId);
      }

      setIsLoading(false);
    }
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <ArrowBack />
        </TouchableOpacity>
        <View style={styles.headerTagInfo}>
          <Text style={styles.headerTagName}>#{params.tagName}</Text>
          <Text style={styles.headreTagDiscussion}>
            {totalCount} discussions
          </Text>
        </View>
        <TouchableOpacity>
          <DetailVerticalIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={{marginTop: 20}}>
        {arrMessages.map(item => {
          return <CardDiscussion data={item} key={item.id} />;
        })}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadData();
          }
        }}
        scrollEventThrottle={500}>
        {renderHeader()}
        {renderContent()}
        {isLoading && <CommonSkeleton />}
      </ScrollView>
      <SlamBookInput />
    </View>
  );
};

export default HashTagDiscussPage;

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
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  headerTagInfo: {
    alignItems: 'center',
  },
  headerTagName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: 'white',
  },
  headreTagDiscussion: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

const dummyMessages = [
  {
    id: 1,
    image:
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
    name: 'Edwin Adenike',
    created: '2 mins ago',
    text: 'Lorem ipsum young dolor sit amet, consectetur adipiscing elit. Young Netus aenean ac. Bestie Forever YoungAge',
    tags: ['Bestie', 'Forever', 'YoungAge'],
    mentions: ['young'],
  },
  {
    id: 2,
    image:
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
    name: 'Edwin Adenike',
    created: '2 mins ago',
    text: 'Young ipsum dolor sit amet, consectetur adipiscing elit. Netus aenean ac. Forever',
    tags: ['Forever'],
    mentions: ['Young'],
  },
  {
    id: 3,
    image:
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
    name: 'Edwin Adenike',
    created: '2 mins ago',
    text: 'Lorem ipsum dolor sit amet. Bestie Forever YoungAge',
    tags: ['Bestie', 'Forever', 'YoungAge'],
    mentions: ['Bestie'],
  },
  {
    id: 4,
    image:
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
    name: 'Edwin Adenike',
    created: '2 mins ago',
    text: 'Lorem ipsum dolor sit amet. Bestie Forever YoungAge',
    tags: ['Bestie', 'Forever', 'YoungAge'],
    mentions: ['Bestie'],
  },
  {
    id: 5,
    image:
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
    name: 'Edwin Adenike',
    created: '2 mins ago',
    text: 'Lorem ipsum dolor sit amet. Bestie Forever YoungAge',
    tags: ['Bestie', 'Forever', 'YoungAge'],
    mentions: ['Bestie'],
  },
];

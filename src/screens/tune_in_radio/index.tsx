/* eslint-disable react-native/no-inline-styles */
import {StackScreenProps} from '@react-navigation/stack';
import {PostCard} from 'components/cards/PostCard';
import {TopHostCard} from 'components/cards/TopHostCard';
import {PostLayoutType} from 'helper/constants';
import {MainStackParams} from 'navigators';
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';

export const TuneInRadioPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const onGoToRoom = postItem => {
    navigation.navigate('RoomPage');
  };

  const renderTrending = () => {
    return (
      <View style={styles.subContainer}>
        <Text style={styles.subTitle}>Trending 👻</Text>
        <View style={styles.postResourceView}>
          <View style={styles.postLayoutFirst}>
            <View style={{width: '60%'}}>
              <PostCard
                type={PostLayoutType.Large}
                data={''}
                onClicked={onGoToRoom}
              />
            </View>
            <View style={{width: '40%'}}>
              <PostCard type={PostLayoutType.Small} data={''} />
              <PostCard type={PostLayoutType.Small} data={''} />
            </View>
          </View>
          {Array(1)
            .fill('')
            .map((itemData, index) => (
              <View style={styles.postLayoutSecond}>
                <View style={{width: '60%'}}>
                  <PostCard type={PostLayoutType.Medium} data={''} />
                </View>
                <View style={{width: '40%'}}>
                  <PostCard type={PostLayoutType.Small} data={''} />
                </View>
              </View>
            ))}
        </View>
      </View>
    );
  };

  const renderRecommend = () => {
    return (
      <View style={styles.subContainer}>
        <Text style={styles.subTitle}>Recommended for you ❤️</Text>
        <FlatList
          data={Array(4).fill('')}
          renderItem={({item, index}) => (
            <PostCard key={index} data={item} type={PostLayoutType.Normal} />
          )}
          keyExtractor={item => `${item.id}_${item.title}`}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          style={{marginVertical: 20}}
        />
      </View>
    );
  };

  const renderTopHosts = () => {
    return (
      <View style={styles.subContainer}>
        <Text style={styles.subTitle}>Top Hosts 🎙</Text>
        <ScrollView horizontal style={{marginTop: 20}}>
          {Array(10)
            .fill('')
            .map((user, index) => (
              <TopHostCard />
            ))}
        </ScrollView>
      </View>
    );
  };

  const renderDiscover = () => {
    return (
      <View style={[styles.subContainer, {marginBottom: 150}]}>
        <Text style={styles.subTitle}>Discover New Show 🎃</Text>
        <FlatList
          data={Array(8).fill('')}
          renderItem={({item, index}) => (
            <PostCard key={index} data={item} type={PostLayoutType.Normal} />
          )}
          keyExtractor={item => `${item.id}_${item.title}`}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          style={{marginVertical: 20}}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Tune-in Radio</Text>
      </View>
      <View>
        {renderTrending()}
        {renderRecommend()}
        {renderTopHosts()}
        {renderDiscover()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    marginVertical: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subContainer: {
    marginTop: 20,
  },
  subTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  postResourceView: {
    display: 'flex',
    marginTop: 24,
  },
  postLayoutFirst: {
    flexDirection: 'row',
  },
  postLayoutSecond: {
    flexDirection: 'row',
  },
});

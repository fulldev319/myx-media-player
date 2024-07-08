import {StackScreenProps} from '@react-navigation/stack';
import {
  ArrowRightIcon,
  BackIcon,
  DetailHorizontalIcon,
  ExitIcon,
  PersonIcon,
  SendCommentIcon,
} from 'assets/svg';
import CommentCard from 'components/cards/CommentCard';
import {MemeberGroup} from 'components/memberGroup';
import {MainStackParams} from 'navigators';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  FlatList,
  TextInput,
} from 'react-native';

const CommentPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const renderMemberGroup = () => {
    return (
      <View>
        <View style={styles.memberView}>
          <View style={styles.topMemberCount}>
            <PersonIcon />
            <Text style={styles.txtTopMemberCount}>234</Text>
            <ArrowRightIcon />
          </View>
          <View style={{}}>
            <View style={styles.ownerImageContainer}>
              <View style={styles.userImageContainer1}>
                <View style={styles.userImageContainer2}>
                  <View style={styles.userImageContainer3}>
                    <Image
                      style={styles.userImage}
                      resizeMode="stretch"
                      source={require('./../../assets/sample/dummy_user.png')}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <MemeberGroup />
        </View>
      </View>
    );
  };

  const renderInput = () => {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={{flex: 1, marginStart: 10}}
          placeholder="Write your comment here..."
          placeholderTextColor={'rgba(255, 255, 255, 0.4)'}
        />
        <SendCommentIcon />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Farel 🎉👻</Text>
        <View style={{flex: 1}} />
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => {}} style={{padding: 10}}>
            <DetailHorizontalIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={{padding: 10}}>
            <ExitIcon />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {renderMemberGroup()}
        <View style={styles.commentContainer}>
          {dummyData.map((item, index) => {
            return <CommentCard data={item} />;
          })}
        </View>
      </ScrollView>
      {renderInput()}
    </View>
  );
};

export default CommentPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginStart: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topMemberContainer: {
    display: 'flex',
  },
  topMemberCount: {
    width: 90,
    height: 30,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  txtTopMemberCount: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 11,
    color: '#FFFFFF',
    paddingHorizontal: 5,
  },
  ownerImageContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  userImageContainer1: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.2)',
  },
  userImageContainer2: {
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.3)',
  },
  userImageContainer3: {
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.5)',
  },
  userImage: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  commentContainer: {
    marginTop: 20,
  },
  inputContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 5,
  },
});

const dummyData = [
  {
    owner: 'Kristin',
    comments: [
      {
        name: 'Miles Esther',
        desc: 'Lorem ipsum dolor sit Praesent ut ullamcorper 👻🎃',
        url: 'https://i.pravatar.cc/150?img=53',
      },
    ],
  },
  {
    owner: 'Robert',
    comments: [
      {
        name: 'Miles Esther',
        desc: 'Lorem ipsum dolor site',
        url: 'https://i.pravatar.cc/150?img=37',
      },
      {
        name: 'Amjad',
        desc: 'Lorem ipsum dolor sit Praesent ut ullamcorper 👻🎃',
        url: 'https://i.pravatar.cc/150?img=21',
      },
    ],
  },
  {
    owner: 'Miles Esther',
    comments: [
      {
        name: 'My Story',
        desc: 'Lorem ipsum dolor site',
        url: 'https://i.pravatar.cc/150?img=53',
      },
      {
        name: 'Beatiful',
        desc: 'Lorem ipsum dolor site',
        url: 'https://i.pravatar.cc/150?img=53',
      },
    ],
  },
];

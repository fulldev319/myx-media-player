import {useNavigation} from '@react-navigation/native';
import {SubPageHeader} from 'components/header/SubPageHeader';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import RequestList from './RequestList';

const ChatRequest = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <SubPageHeader label={'Chat Request'} navigation={navigation} />
      <View style={styles.content}>
        <RequestList />
      </View>
    </View>
  );
};

export default ChatRequest;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    position: 'relative',
    paddingTop: 40,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
});

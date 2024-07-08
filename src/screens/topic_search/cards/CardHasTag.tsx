import {useNavigation} from '@react-navigation/native';
import {SCREEN_WIDTH} from 'helper/utils';
import React, {useMemo, useRef} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

const CardHashTag = ({data, selectedTag, slambookId, topicId}) => {
  const navigation = useNavigation();

  const onGoToDiscuss = () => {
    navigation.navigate('HashTagDiscussPage', {
      tagName: selectedTag,
      slambookId,
      topicId,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onGoToDiscuss}>
      <View style={styles.contentView}>
        <View style={styles.leftView}>
          <Text style={styles.symbolText}>#</Text>
          <Text style={styles.itemText}>{data.item.hashTag}</Text>
        </View>

        <Text style={styles.messageText}>{data.item.count} messages</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardHashTag;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 24,
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.4)',
    marginStart: 8,
  },
  itemText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1)',
    marginStart: 13,
  },
  messageText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginEnd: 8,
  },
});

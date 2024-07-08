import React from 'react';
import {Text, View, StyleSheet, Platform, FlatList, Image} from 'react-native';

const CommentCard = ({data}: CommentCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.ownerInfo}>
        <Text style={styles.ownerName}>{data.owner}</Text>
        <Text style={styles.joinTheRoom}>join the room</Text>
      </View>
      <View style={styles.memberContainer}>
        {data.comments.map((item, index) => {
          return (
            <View style={styles.memberItemContainer}>
              <Image source={{uri: item.url}} style={styles.memberImage} />
              <View style={{marginStart: 10}}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberDesc}>{item.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

type CommentCardProps = {
  data: any;
};

export default CommentCard;

const styles = StyleSheet.create({
  container: {},
  ownerInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    color: '#FFFFFF',
  },
  joinTheRoom: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginStart: 5,
  },
  memberContainer: {},
  memberItemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  memberImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  memberName: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    color: '#FFFFFF',
  },
  memberDesc: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

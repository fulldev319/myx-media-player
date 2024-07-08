import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

const CommentCard = ({data}) => {
  return (
    <View style={styles.root}>
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri:
                data.image !== '' && data.image !== undefined
                  ? data.image
                  : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
            }}
            style={styles.userIcon}
          />
          <Text style={styles.userName}>{data.posterName}</Text>
          <Text style={styles.agoTime}>{'26 mins ago'}</Text>
        </View>
        <Text style={styles.bodyContainer}>{data.commentText}</Text>
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    padding: 20,
    paddingTop: 0,
  },
  headerContainer: {
    width: '100%',
  },
  userInfo: {flexDirection: 'row', alignItems: 'center'},
  userIcon: {width: 24, height: 24, borderRadius: 12},
  userName: {
    fontSize: 12,
    fontWeight: '400',
    marginStart: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  agoTime: {
    fontSize: 12,
    fontWeight: '400',
    marginStart: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  bodyContainer: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ffffff',
    marginTop: 5,
    marginStart: 34,
  },
});

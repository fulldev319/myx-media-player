import React from 'react';
import {Image, Text, View} from 'react-native';
import defaultAvatar from 'assets/images/default_avatar.png';

import {styles} from './index.styles';

export const MemeberGroup = ({data = [], isDummy = false}) => {
  data = isDummy ? dummyMemberList : data;

  return (
    <View
      style={[
        styles.container,
        {width: (data.length > 4 ? 5 : data.length + 1) * 16},
      ]}>
      {data.map((itemData, index) => {
        if (index < 3) {
          return (
            <View
              style={[styles.itemImageContainer, {left: 16 * index}]}
              key={`member_group_${index}`}>
              <Image
                source={itemData.image ? {uri: itemData.image} : defaultAvatar}
                style={styles.itemImage}
              />
            </View>
          );
        } else {
          return <View />;
        }
      })}
      {data.length > 3 && (
        <View
          style={[
            styles.itemNumberContainer,
            {width: 20, height: 20},
            {left: 16 * 3},
          ]}>
          <Text style={styles.txtMore}>+{data.length - 3}</Text>
        </View>
      )}
    </View>
  );
};

const dummyMemberList = [
  {
    image: 'https://i.pravatar.cc/150?img=53',
  },
  {
    image: 'https://i.pravatar.cc/150?img=8',
  },
  {
    image: 'https://i.pravatar.cc/150?img=37',
  },
  {
    image: 'https://i.pravatar.cc/150?img=21',
  },
  {
    image: 'https://i.pravatar.cc/150?img=53',
  },
  {
    image: 'https://i.pravatar.cc/150?img=53',
  },
];

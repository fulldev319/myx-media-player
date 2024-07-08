import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {GroupCard} from 'screens/my_group/GroupCard';
import {styles} from './index.styles';
import {generateComponentKey} from 'helper/utils';

const GroupView = ({data}) => {
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={styles.groups}
      onScroll={({nativeEvent}) => {}}
      scrollEventThrottle={500}>
      <View style={styles.groupContents}>
        {data.map((item, index) => {
          return (
            <GroupCard
              onPress={() => navigation.navigate('GroupBookPage', {group: item})}
              index={index}
              data={item}
              key={`my_group_card_${generateComponentKey()}`}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default GroupView;

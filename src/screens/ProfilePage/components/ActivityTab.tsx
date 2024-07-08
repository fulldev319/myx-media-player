import {useNavigation} from '@react-navigation/native';
import {ActivityCard} from 'components/cards/ActivityCard';
import {apiGetActivity} from 'helper/userHelpers';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

export const ActivityTab = ({userId}) => {
  const navigation = useNavigation();
  const [arrActivity, setArrActivity] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(false);
      const res = await apiGetActivity(lastId);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);

        setArrActivity(res.data);
      }
      setIsLoading(true);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Activities</Text>
      <ScrollView>
        <View style={styles.container}>
          {arrActivity.map((itemData, index) => (
            <ActivityCard
              userId={userId}
              data={itemData}
              navigation={navigation}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 21,
    paddingTop: 12,
  },
  container: {
    paddingBottom: 120,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 7,
    marginBottom: 12,
  },
});

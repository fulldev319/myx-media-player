import {LikeIcon, LogoIcon, NotificationIcon} from 'assets/svg/pageHeaderIcons';
import {useMessages} from 'contexts/MessagesContext';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const PageHeader = ({navigation}) => {
  const {unreadMessages} = useMessages();
  const gotoMessageBox = () => {
    navigation.navigate('MessageBox');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <LogoIcon />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity>
          <LikeIcon marginRight={10} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => gotoMessageBox()}>
          <NotificationIcon hasNew={unreadMessages > 0} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  logo: {marginLeft: 26},
  actions: {
    marginRight: 16,
    flexDirection: 'row',
  },
});

/* eslint-disable react-native/no-inline-styles */
import {
  ChatIcon,
  FeedIcon,
  HomeIcon,
  SearchIcon,
  CenterPlusIcon,
  SocialIcon,
  ProfileIcon,
} from 'assets/svg/bottomNavIcons';
import {PageName, useAuth} from 'contexts/AuthContext';
import {getDefaultAvatar} from 'helper/userHelpers';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

const {width} = Dimensions.get('window');
export const TAB_BAR_WIDTH = width - 50;
export const TAB_SLIDE_WIDTH = TAB_BAR_WIDTH / 5 + 60;
export const TAB_WIDTH = (TAB_BAR_WIDTH - TAB_SLIDE_WIDTH) / 4;

const BottomTab = ({tab, onPress, routeName}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const {curPage} = useAuth();

  const isActive = tab === routeName;
  const renderIcon = tabName => {
    let icon = null;
    switch (tabName) {
      case 'Social':
        icon = (
          <LinearGradient
            colors={
              isActive ? ['#FF3F3F', '#FF701F'] : ['transparent', 'transparent']
            }
            useAngle={true}
            angle={120}
            style={styles.tabItem}>
            <SocialIcon isActive={isActive} />
            <Text
              style={[
                isActive ? styles.tabSelectedItemTxt : styles.tabItemTxt,
              ]}>
              Social
            </Text>
          </LinearGradient>
        );
        break;
      case 'Feed':
        icon = (
          <LinearGradient
            colors={
              isActive ? ['#FF3F3F', '#FF701F'] : ['transparent', 'transparent']
            }
            useAngle={true}
            angle={120}
            style={styles.tabItem}>
            <FeedIcon isActive={isActive} />
            <Text
              style={[
                isActive ? styles.tabSelectedItemTxt : styles.tabItemTxt,
              ]}>
              Feed
            </Text>
          </LinearGradient>
        );
        break;
      case 'Music':
        icon = (
          <LinearGradient
            colors={
              isActive ? ['#FF3F3F', '#FF701F'] : ['transparent', 'transparent']
            }
            useAngle={true}
            angle={120}
            style={styles.tabItem}>
            <FeedIcon isActive={isActive} />
            <Text
              style={[
                isActive ? styles.tabSelectedItemTxt : styles.tabItemTxt,
              ]}>
              Music
            </Text>
          </LinearGradient>
        );
        break;
      case 'Profile':
        icon = (
          <LinearGradient
            colors={
              isActive ? ['#FF3F3F', '#FF701F'] : ['transparent', 'transparent']
            }
            useAngle={true}
            angle={120}
            style={styles.tabItem}>
            <ProfileIcon isActive={isActive} />
            <Text
              style={[
                isActive ? styles.tabSelectedItemTxt : styles.tabItemTxt,
              ]}>
              Profile
            </Text>
          </LinearGradient>
        );
        break;
    }
    return icon;
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(tab)}>
      <View>{renderIcon(tab)}</View>
    </TouchableOpacity>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabItem: {
    height: 40,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  tabProfileItem: {
    height: 40,
    width: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  tabItemTxt: {
    marginLeft: 10,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: 'rgba()',
  },
  tabSelectedItemTxt: {
    marginLeft: 10,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
  },
});

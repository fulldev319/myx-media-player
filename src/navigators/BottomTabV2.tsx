/* eslint-disable react-native/no-inline-styles */
import {
  V2FeedTabIcon,
  V2ForYouTabIcon,
  V2BubbleTabIcon,
} from 'assets/svg/v2BottomNavIcons';
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
import Svg, {Path} from 'react-native-svg';

const {width} = Dimensions.get('window');
export const TAB_BAR_WIDTH = width - 50;
export const TAB_SLIDE_WIDTH = TAB_BAR_WIDTH / 5 + 60;
export const TAB_WIDTH = (TAB_BAR_WIDTH - TAB_SLIDE_WIDTH) / 4;

const V2BottomTab = ({tab, onPress, routeName}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const {curPage} = useAuth();

  const isActive = tab === routeName;
  const renderIcon = tabName => {
    let icon = null;
    switch (tabName) {
      case 'Feed':
        icon = (
          <View style={styles.tabItem}>
            <V2FeedTabIcon isActive={isActive} />
            <Text
              style={[
                isActive ? styles.tabSelectedItemTxt : styles.tabItemTxt,
              ]}>
              Feed
            </Text>
            {isActive && (
              <View style={styles.bottomBubble}>
                <BottomBubbleIcon />
              </View>
            )}
          </View>
        );
        break;
      case 'Music':
        icon = (
          <View style={styles.tabItem}>
            <V2FeedTabIcon isActive={isActive} />
            <Text
              style={[
                isActive ? styles.tabSelectedItemTxt : styles.tabItemTxt,
              ]}>
              Feed
            </Text>
            {isActive && (
              <View style={styles.bottomBubble}>
                <BottomBubbleIcon />
              </View>
            )}
          </View>
        );
        break;
      case 'ForYou':
        icon = (
          <View style={styles.tabItem}>
            <V2ForYouTabIcon isActive={isActive} />
            <Text
              style={[
                isActive ? styles.tabSelectedItemTxt : styles.tabItemTxt,
              ]}>
              For You
            </Text>
            {isActive && (
              <View style={styles.bottomBubble}>
                <BottomBubbleIcon />
              </View>
            )}
          </View>
        );
        break;
      case 'Groups':
        icon = (
          <View style={styles.tabItem}>
            <V2BubbleTabIcon isActive={isActive} />
            <Text
              style={[
                isActive ? styles.tabSelectedItemTxt : styles.tabItemTxt,
              ]}>
              Groups
            </Text>
            {isActive && (
              <View style={styles.bottomBubble}>
                <BottomBubbleIcon />
              </View>
            )}
          </View>
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

export default V2BottomTab;

const styles = StyleSheet.create({
  tabItem: {
    height: '100%',
    paddingHorizontal: 18,
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
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 5,
  },
  tabSelectedItemTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 5,
  },
  bottomBubble: {
    position: 'absolute',
    bottom: 0,
  },
});

const BottomBubbleIcon = () => {
  return (
    <Svg width="49" height="13" fill="none" viewBox="0 0 49 13">
      <Path
        fill="#fff"
        d="M0 13l24.5 13L49 13 39.09 7.741c-8.057-4.275-21.12-4.275-29.178 0L0 13z"></Path>
    </Svg>
  );
};

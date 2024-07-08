import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {HomeIcon, LibraryIcon, SearchIcon, SettingIcon} from 'assets/svg';

const {width} = Dimensions.get('window');
export const TAB_BAR_WIDTH = width - 50;
export const TAB_SLIDE_WIDTH = TAB_BAR_WIDTH / 5 + 60;
export const TAB_WIDTH = (TAB_BAR_WIDTH - TAB_SLIDE_WIDTH) / 4;

const Tab = ({tab, onPress, activeRoute, index}) => {
  const isActive = activeRoute === index;

  const renderIcon = tab => {
    let icon = null;
    switch (tab) {
      case 'Home':
        icon = <HomeIcon isActive={isActive} />;
        break;
      case 'Search':
        icon = <SearchIcon isActive={isActive} />;
        break;
      case 'Library':
        icon = <LibraryIcon isActive={isActive} />;
        break;
      case 'Setting':
        icon = <SettingIcon isActive={isActive} />;
        break;
    }
    return icon;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(index, tab)}
      style={styles.tabItem}>
      <View style={styles.activeSlideView}>
        {renderIcon(tab)}
        <Text
          style={{
            ...styles.tabItemLabel,
            color: isActive ? '#F6943D' : '#A7A7A7',
          }}>
          {tab}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Tab;

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeSlideView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabItemLabel: {
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    marginTop: 8,
  },
});

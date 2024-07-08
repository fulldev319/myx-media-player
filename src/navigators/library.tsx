import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Animated, View, TouchableOpacity, StyleSheet} from 'react-native';

import {LikedPlaylistPage} from 'screens/LibraryPages/MyLibrary/LikedPlaylistPage';
import {ArtistsPage} from 'screens/LibraryPages/MyLibrary/ArtistsPage';
import {LikedSongPage} from 'screens/LibraryPages/MyLibrary/LikedSongPage';

const Tab = createMaterialTopTabNavigator();

export const MyLibraryNavigator = () => {
  return (
    <Tab.Navigator tabBar={props => <CustomLibraryTabBar {...props} />}>
      <Tab.Screen
        name="LikedSongPage"
        options={{title: 'Liked Songs'}}
        component={LikedSongPage}
      />
      <Tab.Screen
        name="LikedPlaylistPage"
        options={{title: 'Liked Playlists'}}
        component={LikedPlaylistPage}
      />
      <Tab.Screen
        name="ArtistsPage"
        options={{title: 'Artists'}}
        component={ArtistsPage}
      />
    </Tab.Navigator>
  );
};

export function CustomLibraryTabBar({
  state,
  descriptors,
  navigation,
  position,
}) {
  return (
    <View style={styles.tabStyle}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0.4)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            key={label}
            style={styles.tabItemStyle}>
            <Animated.Text style={[{opacity}, styles.tabSelectedLabelStyle]}>
              {label}
            </Animated.Text>
            <View
              style={
                isFocused
                  ? styles.indicatorActiveStyle
                  : styles.indicatorDefaultStyle
              }></View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabStyle: {
    flexDirection: 'row',
    marginTop: 20,
  },
  tabItemStyle: {
    marginRight: 30,
  },
  tabSelectedLabelStyle: {
    fontSize: 16,
    color: 'white',
    textTransform: 'capitalize',
  },
  indicatorActiveStyle: {
    height: 2,
    backgroundColor: '#F6943D',
    borderRadius: 3,
    marginTop: 8,
  },
  indicatorDefaultStyle: {
    height: 2,
    backgroundColor: 'transparent',
    borderRadius: 3,
    marginTop: 8,
  },
});

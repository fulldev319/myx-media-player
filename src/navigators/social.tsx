import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Animated, View, TouchableOpacity, StyleSheet} from 'react-native';
import AroundYouPage from 'screens/social/around_you';
import SlamBookPage from 'screens/social/slam_book';
import IntroPage from 'screens/social/intro';

const Tab = createMaterialTopTabNavigator();

export const SocialNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={'SlamBookPage'}
      tabBar={props => <CustomSocialTabBar {...props} />}>
      <Tab.Screen
        name="AroundYouPage"
        options={{title: 'Around You'}}
        component={AroundYouPage}
      />
      <Tab.Screen
        name="SlamBookPage"
        options={{title: 'Slambook'}}
        component={SlamBookPage}
      />
      <Tab.Screen
        name="IntroPage"
        options={{title: 'Intro'}}
        component={IntroPage}
      />
    </Tab.Navigator>
  );
};

export function CustomSocialTabBar({state, descriptors, navigation, position}) {
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
            <Animated.Text
              style={[
                {opacity},
                styles.tabSelectedLabelStyle,
                isFocused && {fontWeight: '500'},
              ]}>
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
    marginTop: 30,
  },
  tabItemStyle: {
    flex: 1,
  },
  tabSelectedLabelStyle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 16,
    color: 'white',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  indicatorActiveStyle: {
    height: 3,
    backgroundColor: '#FF6651',
    borderRadius: 1,
    marginTop: 14,
  },
  indicatorDefaultStyle: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1,
    marginTop: 15,
  },
});

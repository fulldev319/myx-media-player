import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';
import {DarkBorderBackIcon} from 'assets/svg';
import {useNavigation} from '@react-navigation/native';

export const HelpAndSupportPage = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <ScrollView style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <DarkBorderBackIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Help and Support</Text>
        <View style={styles.divider} />
        <View style={styles.body}>
          <Text style={styles.description}>
            {
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae scelerisque augue aliquam dignissim purus. Urna nibh elit praesent in vel, eu. \n\nConsectetur pulvinar sem nibh dignissim dui accumsan. Ac phasellus at nulla quis cursus volutpat leo. Ultrices nisi, curabitur quis sit vitae nisi enim enim. Ullamcorper erat elementum donec mauris nunc ante morbi nisi sit. \n\nCursus suscipit in viverra est. Varius adipiscing arcu mauris adipiscing sed lorem pellentesque netus. Et et pellentesque blandit dictum velit nibh tellus condimentum. Tincidunt ornare et netus vel, et at arcu, et bibendum. \n\nSemper nulla faucibus id sed non eleifend cursus. Egestas ac diam feugiat consectetur nisi eget sollicitudin. Lectus pretium nam et dictum. Eleifend venenatis in est felis tortor.'
            }
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 450,
  },
  backgroundLight: {position: 'absolute', top: 0, right: 0, height: 450},
  header: {
    marginVertical: 20,
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 28,
    color: '#FFFFFF',
    padding: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 30,
    marginHorizontal: 20,
  },
  body: {},
  description: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 28,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1)',
    padding: 20,
  },
});

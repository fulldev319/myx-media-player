import React from 'react';
import { View, Image, ImageBackground, SafeAreaView } from 'react-native';
import { styles } from './index.styles';

import logo from 'assets/images/logo.png';
import splashBg from 'assets/images/splash_bg.png';

export const SplashPage = () => {
  return (
    <SafeAreaView style={styles.root}>
      <ImageBackground
        source={splashBg}
        resizeMode="cover"
        style={[styles.background]}
      >
        <View style={styles.mainContainer}>
          <Image source={logo} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
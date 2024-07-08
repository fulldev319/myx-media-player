import React from 'react';
import { View, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { styles } from './index.styles';

import SignUpBg from 'assets/svg/SignUpbg';
import LinearGradient from 'react-native-linear-gradient';

export const SignUpPinPage = () => {
  return (
    <SafeAreaView style={styles.root}>
      <SignUpBg style={styles.background} />
      <View style={styles.mainContainer}>
        <TouchableOpacity onPress={() => { }} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Signup on MUSIC POD</Text>
        <Text style={styles.subTitle}>Enjoy HD Music Streaming & Podcast with Offline playback</Text>
        <View style={{ width: '100%', marginTop: 70 }}>
          <TextInput
            style={styles.phoneNumInput}
            onChangeText={value => () => { }}
          />
          <TouchableOpacity onPress={() => { }}>
            <LinearGradient colors={['#F6943D', '#F85B2B']} style={styles.button}>
              <Text style={styles.btnText}>Verify PIN</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View  style={styles.send}>
          <Text style={styles.pinText}>Didn’t get Pin?</Text>
          <TouchableOpacity><Text style={styles.sendText}>Send Again</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
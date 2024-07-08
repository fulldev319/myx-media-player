import {View, Text, StyleSheet, Modal, Platform} from 'react-native';
import React from 'react';
import {hp, wp} from './global';
import {Colors, Fonts} from './res';
import AntDesign from 'react-native-vector-icons/AntDesign';
import VoiceChanger from './voicechanger/VoiceChanger';

const RecorderModal = (props: any) => {
  const {visible = false, onClose = null, onSelect = null} = props;

  return (
    <Modal
      visible={visible}
      transparent={false}
      onRequestClose={onClose}
      onDismiss={onClose}>
      <View style={Style.header}>
        <AntDesign
          name="close"
          color={Colors.black}
          size={wp(7)}
          onPress={onClose}
        />
        <Text style={Style.headerTitle}>Record the Audio</Text>
      </View>
      <View style={Style.voiceChangerContainer}>
        <VoiceChanger onSelect={onSelect} />
      </View>
    </Modal>
  );
};

export default RecorderModal;

const Style = StyleSheet.create({
  header: {
    height: hp(8),
    justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  headerTitle: {
    color: Colors.black,
    position: 'absolute',
    alignSelf: 'center',
    fontSize: wp(5),
    fontFamily: Fonts.APPFONT_R,
    top: Platform.OS === 'android' ? hp(2.1) : 0,
  },
  voiceChangerContainer: {
    paddingVertical: hp(10),
  },
});

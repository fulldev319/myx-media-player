import {View, Text, StyleSheet, Modal, Platform} from 'react-native';
import React from 'react';
import {hp, wp} from './global';
import {Colors, Fonts} from './res';
import AntDesign from 'react-native-vector-icons/AntDesign';
//@ts-ignore
import EmojiInput from 'react-native-emoji-input';

const GEmojiSelector = (props: any) => {
  const {visible = false, onClose = null, onEmojiSelected = null} = props;
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
        <Text style={Style.headerTitle}>Select the Emoji</Text>
      </View>

      <EmojiInput
        onEmojiSelected={onEmojiSelected}
        categoryLabelHeight={hp(8)}
      />
    </Modal>
  );
};

export default GEmojiSelector;

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
});

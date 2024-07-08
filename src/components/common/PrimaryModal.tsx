import {SCREEN_HEIGHT} from 'helper/utils';
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';

interface PrimaryModalProps {
  visible: boolean;
  hideModal: () => void;
  children?: any;
  showIndicator?: boolean;
}

export const PrimaryModal = (props: PrimaryModalProps) => {
  const {visible, hideModal, children, showIndicator} = props;
  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={hideModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      swipeDirection={'down'}
      onBackdropPress={hideModal}
      style={{margin: 0}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.content}>
          {!showIndicator && <View style={styles.indicator} />}
          <ScrollView>{children}</ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#D9D9D9',
    width: 60,
    height: 4,
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 2,
    top: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    maxHeight: SCREEN_HEIGHT,
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    padding: 24,
  },
});

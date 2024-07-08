import React from 'react';
import {Modal, View, Text, StyleSheet, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import avatar from 'assets/images/wheelHelperImages/avatar.png';
import mainBoard from 'assets/images/wheelHelperImages/main.png';
import character from 'assets/images/wheelHelperImages/character.png';
import effect from 'assets/images/wheelHelperImages/effect.png';
import emoji from 'assets/images/wheelHelperImages/emoji.png';
import outerLine from 'assets/images/wheelHelperImages/outer_line.png';
import line1 from 'assets/images/wheelHelperImages/line1.png';
import line2 from 'assets/images/wheelHelperImages/line2.png';
import line3 from 'assets/images/wheelHelperImages/line3.png';
import line4 from 'assets/images/wheelHelperImages/line4.png';
import line5 from 'assets/images/wheelHelperImages/line5.png';
import line6 from 'assets/images/wheelHelperImages/line6.png';

const WheelHelperModal = ({open, onClose}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <Animatable.View
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver>
          <Text style={styles.title}>Legends</Text>
        </Animatable.View>
        <Animatable.Image
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          source={line1}
          style={styles.line1}
        />
        <Animatable.View
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          style={styles.emolikeContainer}>
          <View style={styles.label}>
            <Text style={styles.textStyle2}>Emolike</Text>
          </View>
        </Animatable.View>
        <Animatable.Image
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          source={line2}
          style={styles.line2}
        />
        <Animatable.View
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          style={styles.creatorContainer}>
          <View style={styles.label}>
            <Text style={styles.textStyle2}>Creator</Text>
          </View>
        </Animatable.View>
        <Animatable.Image
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          source={line3}
          style={styles.line3}
        />
        <Animatable.View
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          style={styles.timestampContainer}>
          <View style={styles.label}>
            <Text style={styles.textStyle2}>Timestamp</Text>
          </View>
        </Animatable.View>
        <Animatable.Image
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          source={line4}
          style={styles.line4}
        />
        <Animatable.View
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          style={styles.keywordContainer}>
          <View style={styles.label}>
            <Text style={styles.textStyle2}>Keywords</Text>
          </View>
        </Animatable.View>
        <Animatable.Image
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          source={line5}
          style={styles.line5}
        />
        <Animatable.View
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          style={styles.statusContainer}>
          <View style={styles.label}>
            <Text style={styles.textStyle2}>Status</Text>
          </View>
        </Animatable.View>
        <Animatable.Image
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          source={line6}
          style={styles.line6}
        />
        <Animatable.View
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver
          style={styles.durationContainer}>
          <View style={styles.label}>
            <Text style={styles.textStyle2}>Duration Category</Text>
          </View>
        </Animatable.View>
        <View style={styles.mainImageContainer}>
          <Image source={mainBoard} />
          <Animatable.Image
            animation={{
              from: {
                translateX: 0,
                translateY: 0,
              },
              to: {
                translateX: 50,
                translateY: -50,
              },
            }}
            duration={1000}
            delay={1000}
            easing="linear"
            useNativeDriver
            source={avatar}
            style={styles.mainAvatar}
          />
          <Animatable.Image
            animation={{
              from: {
                translateX: 0,
                translateY: 0,
              },
              to: {
                translateX: 50,
                translateY: -50,
              },
            }}
            duration={1000}
            delay={1000}
            easing="linear"
            useNativeDriver
            source={character}
            style={styles.mainCharacter}
          />
          <Animatable.Image
            animation={{
              from: {
                translateX: 0,
                translateY: 0,
              },
              to: {
                translateX: 30,
                translateY: -30,
              },
            }}
            duration={1000}
            delay={1000}
            easing="linear"
            useNativeDriver
            source={effect}
            style={styles.mainEffect}
          />
          <Animatable.Image
            animation={{
              from: {
                translateX: 0,
                translateY: 0,
              },
              to: {
                translateX: 50,
                translateY: -50,
              },
            }}
            duration={1000}
            delay={1000}
            easing="linear"
            useNativeDriver
            source={emoji}
            style={styles.mainEmoji}
          />
          <Animatable.Image
            animation={{
              from: {
                translateX: 0,
                translateY: 0,
              },
              to: {
                translateX: 10,
                translateY: -10,
              },
            }}
            duration={1000}
            delay={1000}
            easing="linear"
            useNativeDriver
            source={outerLine}
            style={styles.mainOuterline}
          />
        </View>
        <Animatable.View
          animation={'fadeIn'}
          duration={1000}
          delay={2500}
          easing="linear"
          useNativeDriver>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.textStyle1}>Dismiss</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  button: {
    width: 207,
    height: 45,
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  label: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 32,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mainImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 160,
  },
  mainAvatar: {position: 'absolute', top: 56, left: 92, zIndex: 3},
  mainCharacter: {position: 'absolute', top: 36, left: 40, zIndex: 1},
  mainEffect: {position: 'absolute', top: 36, left: 64, zIndex: 2},
  mainEmoji: {position: 'absolute', top: -32, zIndex: 1},
  mainOuterline: {position: 'absolute', top: 0, left: 28, zIndex: 1},
  line1: {
    position: 'absolute',
    top: 200,
    right: 100,
  },
  line2: {
    position: 'absolute',
    top: 320,
    right: 80,
  },
  line3: {
    position: 'absolute',
    bottom: 200,
    right: 100,
  },
  line4: {
    position: 'absolute',
    bottom: 200,
    left: 80,
  },
  line5: {
    position: 'absolute',
    top: 290,
    left: 60,
  },
  line6: {
    position: 'absolute',
    top: 210,
    left: 130,
  },
  emolikeContainer: {position: 'absolute', top: 160, right: 70},
  creatorContainer: {position: 'absolute', top: 290, right: 45},
  timestampContainer: {position: 'absolute', bottom: 160, right: 60},
  keywordContainer: {position: 'absolute', bottom: 160, left: 45},
  statusContainer: {position: 'absolute', top: 250, left: 30},
  durationContainer: {position: 'absolute', top: 170, left: 80},
  title: {fontSize: 24, fontWeight: '700', color: '#fff'},
  textStyle1: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  textStyle2: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default WheelHelperModal;

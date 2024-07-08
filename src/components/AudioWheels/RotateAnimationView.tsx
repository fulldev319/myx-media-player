/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Animated, Text, View, StyleSheet, Easing, Image} from 'react-native';

type RotateProps = {
  type: string;
  content: string;
  color: string;
  speed: string;
};

class RotateAnimationView extends React.Component<RotateProps> {
  constructor() {
    super();
    this.animated = new Animated.Value(0);
    var inputRange = [0, 1];
    var outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    outputRange = ['0deg', '-360deg'];
    this.rotateOpposit = this.animated.interpolate({inputRange, outputRange});
  }

  componentDidMount(): void {
    this.animate();
  }

  animate() {
    Animated.loop(
      Animated.timing(this.animated, {
        toValue: 1,
        duration: this.props.speed,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }

  render() {
    const transform = [{rotate: this.rotate}];
    const transform1 = [{rotate: this.rotateOpposit}];

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.item, {transform}]}>
          <Animated.View
            style={[
              styles.dot,
              {transform: transform1},
              {
                left: this.props.type === 'text' ? 8 : -10,
                padding: this.props.type === 'text' ? 12 : 0,
              },
            ]}>
            {this.props.type === 'text' ? (
              <View
                style={[
                  styles.textContainer,
                  {backgroundColor: this.props.color},
                ]}>
                <Text style={styles.text}>{this.props.content}</Text>
              </View>
            ) : this.props.content ? (
              // <Video source={{uri:this.props.content}} style={styles.image} />
              <Image source={{uri: this.props.content}} style={styles.image} />
            ) : (
              <></>
            )}
          </Animated.View>
        </Animated.View>
        <View>{this.props.children}</View>
      </View>
    );
  }
}

export default RotateAnimationView;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    position: 'absolute',
    width: 100,
    height: 0,
    zIndex: 10,
  },
  dot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  text: {
    fontSize: 8,
    color: '#FAFAFA',
    fontWeight: '600',
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 30,
  },
});

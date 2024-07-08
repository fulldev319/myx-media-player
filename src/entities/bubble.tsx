import Matter from 'matter-js';
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const Objectify = props => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;

  const xBody = props.body.position.x - width / 2;
  const yBody = props.body.position.y - height / 2;

  const countValueRef = useRef(1);
  const timerRef = useRef(null);
  const onPressed = () => {
    if (props.isBubbleEditMode) {
      if (countValueRef.current >= 2) {
        props.onEditTopic();

        countValueRef.current = 1;
        clearTimeout(timerRef.current);
      } else {
        countValueRef.current = countValueRef.current + 1;

        timerRef.current = setTimeout(() => {
          countValueRef.current = 1;
        }, 1000);
      }
    } else {
      props.onPress();
    }
  };

  return (
    <View
      style={[
        styles.bubble,
        {
          top: yBody,
          left: xBody,
          height: props.body.circleRadius * 2,
          width: props.body.circleRadius * 2,
          borderRadius: props.body.circleRadius,
          borderWidth: 0,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <TouchableWithoutFeedback
        onPress={onPressed}
        style={[
          StyleSheet.absoluteFill,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <View
          style={[
            StyleSheet.absoluteFill,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          {props.image ? (
            <Image
              source={{
                uri: props.image,
              }}
              style={[StyleSheet.absoluteFill, {borderRadius: 1000}]}
              resizeMode={'cover'}
            />
          ) : (
            <LinearGradient
              colors={[props.color2 ?? '#000000', props.color1 ?? '#000000']}
              useAngle={true}
              angle={140}
              style={[
                StyleSheet.absoluteFill,
                styles.topicBubble,
              ]}></LinearGradient>
          )}
          <Text style={styles.topicBubbleText}>{props.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

function Bubble(props) {
  const top = props.position[0];
  const left = props.position[1];
  const radius = props.radius;
  const touchId = props.id;
  const bubble = Matter.Bodies.circle(top, left, radius, {
    label: props.id,
    frictionAir: 0.001,
  });

  Matter.World.add(props.world, bubble);

  return {
    body: bubble,
    touchId: {touchId},
    title: props.title,
    color1: props.color1,
    color2: props.color2,
    radius: props.radius,
    image: props.image,
    onPress: props.onPress,
    onEditTopic: props.onEditTopic,
    isBubbleEditMode: props.isBubbleEditMode,
    renderer: <Objectify />,
  };
}

const styles = StyleSheet.create({
  bubble: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  bubbleHuge: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  topicBubble: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicBubbleText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

export default Bubble;

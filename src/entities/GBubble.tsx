import React, {useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import Matter from 'matter-js';

import {BubbleEditIcon, BubbleMoveIcon} from 'assets/svg';
import {getTimeDifference} from 'helper/utils';

const Objectify = props => {
  const countValueRef = useRef(1);
  const timerRef = useRef(null);

  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;

  const xBody = props.body.position.x - width / 2;
  const yBody = props.body.position.y - height / 2;

  const onPressed = () => {
    props.onPress();
  };

  const onEdit = () => {
    if (countValueRef.current >= 2) {
      props.onEditGroupBubble();

      countValueRef.current = 1;
      clearTimeout(timerRef.current);
    } else {
      countValueRef.current = countValueRef.current + 1;

      timerRef.current = setTimeout(() => {
        countValueRef.current = 1;
      }, 1000);
    }
  };

  const image = useMemo(() => {
    return props.image
      ? {uri: props.image}
      : require('assets/images/BubbleBackground.png');
  }, [props.image]);

  return (
    <View
      style={{
        position: 'absolute',
        top: yBody,
        left: xBody,
        height: props.body.circleRadius * 2,
        width: props.body.circleRadius * 2,
        borderRadius: props.body.circleRadius,
      }}>
      <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress={onPressed}>
        <View style={styles.touchableContent}>
          <Image source={image} style={styles.bubbleContent} />
          <Text
            numberOfLines={1}
            style={[styles.topicBubbleText, props.image && {color: 'white'}]}>
            {props.name}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.time, props.image && {color: 'white'}]}>
            {getTimeDifference(new Date(), new Date(props.timestamp))}
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onEdit}
            style={{position: 'absolute', top: -10, right: 20}}>
            <BubbleEditIcon />
          </TouchableOpacity>
          <View style={{position: 'absolute', top: 20, right: 0}}>
            <BubbleMoveIcon />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

function GBubble(props) {
  const id = props.id;
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
    id: id,
    body: bubble,
    touchId: {touchId},
    name: props.name,
    timestamp: props.timestamp,
    color: props.color,
    radius: props.radius,
    image: props.image,
    onPress: props.onPress,
    onEditGroupBubble: props.onEditGroupBubble,
    isBubbleEditMode: props.isBubbleEditMode,
    renderer: <Objectify />,
  };
}

const styles = StyleSheet.create({
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
    fontSize: 12,
    fontWeight: '600',
    color: 'black',
  },
  time: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: 'black',
    opacity: 0.7,
  },
  bubbleContent: {
    width: '100%',
    height: '100%',
    borderRadius: 10000,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  touchableContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10000,
  },
});

export default GBubble;

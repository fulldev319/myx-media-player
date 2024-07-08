import React, {useEffect, useRef, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {GameEngine} from 'react-native-game-engine';

import Rect from 'entities/rect';
import Matter from 'matter-js';
import GBubble from 'entities/GBubble';
import Drag from 'entities/dragMechanism';
import InitDrag from 'entities/initDragMechnism';
import Zoom from 'entities/zoomingMechanism';

interface GroupBubbleProps {
  id: number;
  bubbles: any[];
  onUpdate: Function;
  onUpdateMaxPosX: Function;
  onUpdateMaxPosY: Function;
  onUpdateImage: (bubble: any) => void;
}

const {height, width} = Dimensions.get('window');
const topViewHeight = 110;

const GroupBubble = (props: GroupBubbleProps) => {
  const {
    bubbles,
    id,
    onUpdate,
    onUpdateMaxPosX,
    onUpdateMaxPosY,
    onUpdateImage,
  } = props;

  const engineRef = useRef(null);
  const topicEditModalRef = useRef(null);
  const navigation = useNavigation();

  const [arrBubbles, setArrBubbles] = useState([]);
  const [isBubbleEditMode, setIsBubbleEditMode] = useState(true);
  const [isMoving, setIsMoving] = useState(false);

  const onGoToStartConversation = (bubble: any) => {
    navigation.navigate('GroupBubbleDetail', {bubble: bubble, groupId: id});
  };

  useEffect(() => {
    const newBubbles = bubbles.map((item, index) => {
      const color = '#ffffff';
      return {
        id: item.id.toString(),
        name: item.name,
        image: item.image,
        description: item.description,
        timestamp: item.timestamp,
        position: [item.x, item.y],
        radius: item.radius < 10 ? item.radius * 10 : item.radius,
        color: color,
        onEditGroupBubble: () => {
          onUpdateImage(item);
        },
        onPress: () => onGoToStartConversation(item),
        onMoved: onBubbleMoved,
      };
    });

    let currentMaxY = Math.max.apply(
      Math,
      newBubbles.map((item, _) => item.position[1]),
    );

    let currentMaxX = Math.max.apply(
      Math,
      newBubbles.map((item, _) => item.position[0]),
    );

    setCurrentMaxPos({
      x: currentMaxX,
      y: currentMaxY,
      radius: 100,
    });
    setArrBubbles(newBubbles);
  }, [bubbles]);

  let engine = Matter.Engine.create({enableSleeping: false});
  let world = engine.world;
  engine.gravity.y = 0;

  const onBubbleMoved = (newPosition, bubbleData) => {
    console.log({newPosition});
  };

  const entities = {
    physics: {engine, world},
    1: Rect({
      x: -40,
      y: height + 40 - topViewHeight,
      world: world,
      size: {w: width * 2, h: 40},
    }), //acts as a bottom border
    2: Rect({x: -40, y: 20, world: world, size: {w: width * 2 + 80, h: 40}}), //acts as a top border
    3: Rect({
      x: -40,
      y: height + 40 - topViewHeight,
      world: world,
      size: {w: 40, h: (height - topViewHeight) * 2},
    }), //acts as a left border
    4: Rect({
      x: width + 40,
      y: height + 40 - topViewHeight,
      world: world,
      size: {w: 40, h: (height - topViewHeight) * 2},
    }),
  };

  const [currentMaxPos, setCurrentMaxPos] = useState({x: 0, y: 0, radius: 0});

  useEffect(() => {
    redraw();
  }, [arrBubbles, isBubbleEditMode]);

  useEffect(() => {
    onUpdateMaxPosX(currentMaxPos.x);
    onUpdateMaxPosY(currentMaxPos.y);
  }, [currentMaxPos]);

  const updateLocation = event => {
    if (event.id && event.id.touchId) {
      const updatedBubbleId = event.id.touchId;
      const newPosition = event.newPosition;
      let editItemIndex = -1;

      arrBubbles.forEach((item, index) => {
        if (
          item.id === updatedBubbleId &&
          item.position[0] != newPosition.x &&
          item.position[1] != newPosition.y
        ) {
          editItemIndex = index;
        }
      });

      if (editItemIndex !== -1) {
        arrBubbles[editItemIndex].position[0] = newPosition.x;
        arrBubbles[editItemIndex].position[1] = newPosition.y;
      }

      // calculate max y position
      let currentMaxY = Math.max.apply(
        Math,
        arrBubbles.map((item, _) => item.position[1]),
      );
      const prevMaxY = Math.max.apply(
        Math,
        arrBubbles.map((item, _) => item.position[1]),
      );

      let currentMaxX = Math.max.apply(
        Math,
        arrBubbles.map((item, _) => item.position[0]),
      );
      const prevMaxX = Math.max.apply(
        Math,
        arrBubbles.map((item, _) => item.position[0]),
      );
      let currentMaxRadius = currentMaxPos.radius;

      let maxXPos = currentMaxX > currentMaxPos.x ? currentMaxX : prevMaxX;
      let maxYPos = currentMaxY > currentMaxPos.y ? currentMaxY : prevMaxY;

      onUpdate(arrBubbles);

      setCurrentMaxPos({
        x: maxXPos,
        y: maxYPos,
        radius: currentMaxRadius,
      });
    }
  };

  const updateRadius = event => {
    if (event.id && event.id.touchId) {
      const updatedBubbleId = event.id.touchId;
      const newRadius = event.radius;
      let editItemIndex = -1;

      arrBubbles.forEach((item, index) => {
        if (item.id === updatedBubbleId) {
          editItemIndex = index;
        }
      });

      if (editItemIndex !== -1) {
        arrBubbles[editItemIndex].radius = newRadius;
      }

      // calculate max y position
      let currentMaxY = Math.max.apply(
        Math,
        arrBubbles.map((item, _) => item.position[1]),
      );
      const prevMaxY = Math.max.apply(
        Math,
        arrBubbles.map((item, _) => item.position[1]),
      );

      let currentMaxX = Math.max.apply(
        Math,
        arrBubbles.map((item, _) => item.position[0]),
      );
      const prevMaxX = Math.max.apply(
        Math,
        arrBubbles.map((item, _) => item.position[0]),
      );
      let currentMaxRadius = currentMaxPos.radius;

      let maxXPos = currentMaxX > currentMaxPos.x ? currentMaxX : prevMaxX;
      let maxYPos = currentMaxY > currentMaxPos.y ? currentMaxY : prevMaxY;

      onUpdate(arrBubbles);

      setCurrentMaxPos({
        x: maxXPos,
        y: maxYPos,
        radius: currentMaxRadius,
      });
    }
  };

  const redraw = () => {
    const newData = {
      physics: {engine, world},
      1: Rect({
        x: -40,
        y: height + 40 - topViewHeight,
        world: world,
        size: {w: width * 2, h: 40},
      }), //acts as a bottom border
      2: Rect({x: -40, y: 20, world: world, size: {w: width * 2 + 80, h: 40}}), //acts as a top border
      3: Rect({
        x: -40,
        y: height + 40 - topViewHeight,
        world: world,
        size: {w: 40, h: (height - topViewHeight) * 2},
      }), //acts as a left border
      4: Rect({
        x: width + 40,
        y: height + 40 - topViewHeight,
        world: world,
        size: {w: 40, h: (height - topViewHeight) * 2},
      }),
    };

    arrBubbles.forEach((bubble, index) => {
      const color = '#ffffff';
      const newBubble = GBubble({
        id: bubble.id,
        name: bubble.name,
        description: bubble.description,
        timestamp: bubble.timestamp,
        world: world,
        position: bubble.position,
        radius: bubble.radius,
        image: bubble.image,
        color: color,
        isBubbleEditMode,
        onEditGroupBubble: () => {
          onUpdateImage(bubble);
        },
        onPress: () => onGoToStartConversation(bubble),
        onMoved: onBubbleMoved,
      });

      newData[bubble.id.toString()] = newBubble;
    });

    engineRef.current.swap(newData);
  };

  const hideTopicEditModal = () => {
    topicEditModalRef.current?.close();
    setIsBubbleEditMode(false);
  };

  return (
    <View style={{backgroundColor: 'black'}}>
      <GameEngine
        ref={engineRef}
        systems={isBubbleEditMode ? [Drag, Zoom] : [InitDrag]} //logic related stuff...
        entities={entities}
        onEvent={event => {
          if (event.type === 'end') {
            updateLocation(event);
            setIsMoving(false);
          } else if (event.type === 'move') {
            setIsMoving(true);
          } else if (event.type === 'zoom') {
            updateRadius(event);
          }
        }}
      />
    </View>
  );
};

export default GroupBubble;

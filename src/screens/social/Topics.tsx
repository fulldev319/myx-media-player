import React, {useEffect, useRef, useState} from 'react';
import {View, Dimensions} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';
import Rect from '../../entities/rect';
import Bubble from '../../entities/bubble';
import Drag from '../../entities/dragMechanism';
import InitDrag from '../../entities/initDragMechnism';
import Zoom from '../../entities/zoomingMechanism';
import TopicEditButton from './components/TopicEditButton';
import TopicEditModal from './components/TopicEditModal';

const colors = [
  ['#FFB185', '#A52412'],
  ['#EDD8FD', '#9214F5'],
  ['#FFCCE5', '#FF67B2'],
  ['#62F9CB', '#08B883'],
];

interface TopicsProps {
  id: string;
  arrTopic: any[];
  onUpdate: Function;
  onUpdateMaxPosX: Function;
  onUpdateMaxPosY: Function;
}

const {height, width} = Dimensions.get('window');
const topViewHeight = 300;

const Topics = (props: TopicsProps) => {
  const engineRef = useRef(null);
  const topicEditModalRef = useRef(null);
  const navigation = useNavigation();
  const [arrBubbles, setArrBubbles] = useState([]);
  const [isBubbleEditMode, setIsBubbleEditMode] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const {arrTopic, id, onUpdate, onUpdateMaxPosX, onUpdateMaxPosY} = props;

  const onGoToStartConversation = (
    topicId: string,
    topicTitle: string,
    bgColor1: string,
    bgColor2: string,
  ) => {
    if (!isBubbleEditMode && !isMoving) {
      navigation.navigate('SlamBookChatPage', {
        slambook: id,
        topic: topicId,
        title: topicTitle,
        bgColor1,
        bgColor2,
      });
    }
  };

  const getColors = (index: number) => {
    return colors[index % colors.length];
  };

  useEffect(() => {
    const newBubbles = arrTopic.map((item, index) => {
      const newIndex1 = index % 4;
      const color = getColors(newIndex1);
      return {
        id: item.id.toString(),
        title: item.title,
        ranking: item.ranking,
        image: item.image,
        position: [item.coordinates[0], item.coordinates[1]],
        radius: item.radius < 10 ? item.radius * 10 : item.radius,
        color1: color[0],
        color2: color[1],
        onEditTopic: () => {
          setCurrentEditTopicIndex(index);
          topicEditModalRef.current?.present();
        },
        onPress: () =>
          onGoToStartConversation(item.id, item.title, color[0], color[1]),
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
      radius: 50,
    });
    setArrBubbles(newBubbles);
  }, [arrTopic]);

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
  const [arrUpdatedData, setArrUpdatedData] = useState([]);
  const [currentEditTopicIndex, setCurrentEditTopicIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    redraw();
    setArrUpdatedData(arrBubbles);
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

      setArrUpdatedData(arrBubbles);

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

      setArrUpdatedData(arrBubbles);

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
      const newIndex = index % 4;
      const color = getColors(newIndex);
      const newBubble = Bubble({
        id: bubble.id,
        title: bubble.title,
        world: world,
        position: bubble.position,
        radius: bubble.radius,
        image: bubble.image,
        color1: color[1],
        color2: color[2],
        isBubbleEditMode,
        onEditTopic: () => {
          setCurrentEditTopicIndex(index);
          topicEditModalRef.current?.present();
        },
        onPress: () =>
          onGoToStartConversation(bubble.id, bubble.title, color[0], color[1]),
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

  const updateTopic = async (title: string, imageUrl: string) => {
    const currentEditTopic = {
      ...arrTopic[currentEditTopicIndex],
      image: imageUrl,
      title,
    };

    arrTopic[currentEditTopicIndex] = currentEditTopic;

    setIsUpdating(true);
    hideTopicEditModal();
    setIsUpdating(false);
    await onUpdate(arrTopic);
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
      <TopicEditButton
        onPress={() => {
          if (isBubbleEditMode) {
            setIsBubbleEditMode(false);
            onUpdate(arrUpdatedData);
          } else {
            setIsBubbleEditMode(true);
          }
        }}
        isEditMode={isBubbleEditMode}
      />
      <TopicEditModal
        topicEditModalRef={topicEditModalRef}
        isUpdating={isUpdating}
        onUpdateTopic={updateTopic}
        onBack={hideTopicEditModal}
      />
    </View>
  );
};

export default Topics;

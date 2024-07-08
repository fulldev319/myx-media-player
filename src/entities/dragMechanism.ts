import Matter from 'matter-js';
import React from 'react';

function Drag(entities, {touches, time, dispatch}) {
  // if (touches.length > 0) console.log("are you here?:", Object.keys(entities));

  let lowestRadius = 50;

  if (touches.length < 4) {
    touches.forEach(item => {
      Object.keys(entities).map(num => {
        if (
          // num === '1' ||
          // num === '2' ||
          // num === '3' ||
          // num === '4' ||
          // num === 'physics'
          true
        ) {
          let bubble = entities[num].body;

          if (item.type === 'move' && bubble) {
            let factorX = bubble.position.x - item.event.pageX;
            let factorY = bubble.position.y - item.event.pageY;
            if (factorX < 0) factorX = factorX * -1;
            if (factorY < 0) factorY = factorY * -1;

            if (
              Math.abs(factorY - 110) < lowestRadius &&
              factorX < lowestRadius
            ) {
              Matter.Body.translate(bubble, {
                x: item.delta.pageX,
                y: item.delta.pageY,
              });
              Matter.Body.applyForce(bubble, bubble.position, {
                x: 0,
                y: 0,
              });
            }
            dispatch({type: 'move'});
          } else if (item.type === 'end' && bubble) {
            dispatch({
              type: 'end',
              id: entities[num].touchId,
              newPosition: bubble.position,
            });
          }
        }
      });
    });
  }

  let engine = entities.physics.engine;

  Matter.Engine.update(engine, time.delta);

  return entities;
}

export default Drag;

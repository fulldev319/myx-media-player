import Matter from 'matter-js';

function Zooming(entities, {touches, time, dispatch}) {
  let lowestRadius = 50;
  if (touches.length == 4) {
    Object.keys(entities).map(num => {
      let bubble = entities[num].body;
      if (
        touches[0].type === 'move' &&
        touches[1].type === 'move' &&
        touches[2].type === 'move' &&
        touches[3].type === 'move'
      ) {
        if (bubble) {
          if (
            (bubble.position.y + 300 - touches[0].event.pageY) *
              (bubble.position.y + 300 - touches[0].event.pageY) +
              (bubble.position.x - touches[0].event.pageX) *
                (bubble.position.x - touches[0].event.pageX) <
            bubble.circleRadius * bubble.circleRadius
          ) {
            if (
              (touches[0].event.pageY - touches[1].event.pageY) *
                (touches[0].event.pageY - touches[1].event.pageY) +
                (touches[0].event.pageX - touches[1].event.pageX) *
                  (touches[0].event.pageX - touches[1].event.pageX) <
              (touches[2].event.pageX - touches[3].event.pageX) *
                (touches[2].event.pageX - touches[3].event.pageX) +
                (touches[2].event.pageY - touches[3].event.pageY) *
                  (touches[2].event.pageY - touches[3].event.pageY)
            ) {
              Matter.Body.scale(bubble, 1.1, 1.1);

              dispatch({
                type: 'zoom',
                id: entities[num].touchId,
                radius: bubble.circleRadius,
              });
            } else {
              Matter.Body.scale(bubble, 1 / 1.2, 1 / 1.2);
              dispatch({
                type: 'zoom',
                id: entities[num].touchId,
                radius: bubble.circleRadius,
              });
            }
          }
        }
      }
    });
  }
  let engine = entities.physics.engine;

  Matter.Engine.update(engine, time.delta);

  return entities;
}

export default Zooming;

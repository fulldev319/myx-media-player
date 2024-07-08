import {generateComponentKey} from 'helper/utils';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';

export const TaggedText = ({
  text,
  indexStr = '@',
  fontSize = 12,
  defaultColor = 'rgba(255, 255, 255, 0.7)',
  highLightColor = '#FF6651',
}) => {
  const formatedText = useMemo(() => {
    const newText = [];
    const arrWords = text?.split(' ');

    arrWords?.forEach(itemWord => {
      if (itemWord.includes(indexStr)) {
        newText.push(
          <Text
            style={{fontSize, color: highLightColor}}
            key={`${generateComponentKey()}`}>{` ${itemWord}`}</Text>,
        );
      } else {
        newText.push(
          <Text
            style={{fontSize, color: defaultColor}}
            key={`${generateComponentKey()}`}>{` ${itemWord}`}</Text>,
        );
      }
    });

    return newText;
  }, [text]);

  return (
    <Text
      style={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {formatedText}
    </Text>
  );
};

import React, {useMemo} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Emolike from 'components/common/Emolike';
import {generateComponentKey} from 'helper/utils';

export const ThumbEmolike = ({
  data,
  itemSize = 24,
  maxSize = 2,
  showPlus = false,
  showMoreView = true,
  onAddEmoji,
}) => {
  const showData = useMemo(() => {
    if (data.length > 2) {
      return data.slice(0, maxSize);
    } else {
      return data;
    }
  }, [data]);

  const renderList = () => {
    return showData.map(data => {
      const key = generateComponentKey();

      return (
        <Emolike
          key={`${key}`}
          url={data.url}
          size={itemSize}
          containerStyle={styles.itemContainer}
        />
      );
    });
  };

  const renderMoreView = () => {
    return (
      <View style={[styles.itemContainer, {width: itemSize, height: itemSize}]}>
        <Text style={styles.itemTxt}>{`+${
          data.length > maxSize ? data.length - maxSize : data.length
        }`}</Text>
      </View>
    );
  };

  const renderAdd = () => {
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          styles.plusContainer,
          {width: itemSize, height: itemSize},
        ]}
        onPress={() => {
          onAddEmoji && onAddEmoji();
        }}>
        <Text style={styles.plusTxt}>+</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderList()}
      {showMoreView && data.length > maxSize && renderMoreView()}
      {showPlus && renderAdd()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 6,
  },
  plusContainer: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderStyle: 'dashed',
  },
  itemTxt: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  plusTxt: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

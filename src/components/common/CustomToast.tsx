import React from 'react';
import {Alert, Stack} from 'native-base';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import Svg, {Path} from 'react-native-svg';

interface CustomToastProps {
  title: string;
  color?: string;
  hideButton?: boolean;
  onRightPress?: () => void;
}

export const CustomToast = (props: CustomToastProps) => {
  const {color = 'black', title, hideButton, onRightPress} = props;
  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.rowItem}>
        <AntDesignIcon name="checkcircleo" size={20} color="white" />
        <Text style={styles.title}>{title}</Text>
      </View>
      {hideButton ? (
        <View />
      ) : (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={styles.rightBtnTxt}>View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const SavedLibarayToast = ({onUnDo}) => {
  return (
    <View style={[styles.container, {backgroundColor: '#27292A'}]}>
      <View style={styles.rowItem}>
        <SavedIcon />
        <Text style={styles.title}>{'Saved conversation to your library'}</Text>
      </View>
      <TouchableOpacity onPress={onUnDo}>
        <Text style={styles.rightBtnTxt}>Undo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WINDOW_WIDTH * 0.9,
    padding: 14,
    borderRadius: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins',
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 9,
  },
  rightBtnTxt: {
    fontFamily: 'Poppins',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

const SavedIcon = () => {
  return (
    <Svg width="21" height="20" fill="none" viewBox="0 0 21 20">
      <Path
        fill="#FF6651"
        d="M14.236 1.667H7.569a2.5 2.5 0 00-2.5 2.5V17.5a.833.833 0 001.25.725l4.583-2.65 4.584 2.65c.127.072.27.11.416.109a.833.833 0 00.417-.109.834.834 0 00.416-.725V4.167a2.5 2.5 0 00-2.5-2.5z"></Path>
    </Svg>
  );
};

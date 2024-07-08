import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';

export const MiniHeader = ({isSelf, userInfo, showName, onClickedAction}) => {
  const {goBack} = useNavigation();
  const handleBack = () => {
    if (!isSelf) {
      goBack();
    }
  };
  const handleMore = () => {
    onClickedAction && onClickedAction();
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={handleBack}>
        {!isSelf && <BackIcon />}
      </TouchableOpacity>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {showName && userInfo?.handle}
      </Text>
      <TouchableOpacity onPress={handleMore}>
        <MoreIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 33,
    flexDirection: 'row',
    paddingHorizontal: 26,
    alignItems: 'center',
    height: 60,
  },
  name: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: '#FFFFFF',
    paddingHorizontal: 30,
  },
});

export const BackIcon = props => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M7.29289 15.2929C6.90237 15.6834 6.90237 16.3166 7.29289 16.7071L13.6569 23.0711C14.0474 23.4616 14.6805 23.4616 15.0711 23.0711C15.4616 22.6805 15.4616 22.0474 15.0711 21.6569L9.41421 16L15.0711 10.3431C15.4616 9.95262 15.4616 9.31946 15.0711 8.92893C14.6805 8.53841 14.0474 8.53841 13.6569 8.92893L7.29289 15.2929ZM24 15H8V17H24V15Z"
      fill="white"
    />
    <Rect x={0.5} y={0.5} width={31} height={31} rx={15.5} stroke="#0E0E0E" />
  </Svg>
);

export const MoreIcon = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M3 10.25C2.0335 10.25 1.25 11.0335 1.25 12C1.25 12.9665 2.0335 13.75 3 13.75C3.9665 13.75 4.75 12.9665 4.75 12C4.75 11.0335 3.9665 10.25 3 10.25Z"
      fill="white"
    />
    <Path
      d="M12 10.25C11.0335 10.25 10.25 11.0335 10.25 12C10.25 12.9665 11.0335 13.75 12 13.75C12.9665 13.75 13.75 12.9665 13.75 12C13.75 11.0335 12.9665 10.25 12 10.25Z"
      fill="white"
    />
    <Path
      d="M21 10.25C20.0335 10.25 19.25 11.0335 19.25 12C19.25 12.9665 20.0335 13.75 21 13.75C21.9665 13.75 22.75 12.9665 22.75 12C22.75 11.0335 21.9665 10.25 21 10.25Z"
      fill="white"
    />
  </Svg>
);

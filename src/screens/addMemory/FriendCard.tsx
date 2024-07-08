import {
  MediaSelectedIcon,
  RoundCloseGrayIcon,
  RoundSelectedRedIcon,
} from 'assets/svg';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Svg, {Path} from 'react-native-svg';

const FriendCard = ({
  data,
  isDeletable,
  isSelected,
  onAdd,
  onRemove,
  style = {},
}) => {
  return (
    <TouchableOpacity
      style={[isSelected ? styles.selectedContainer : styles.container, style]}
      onPress={() => {
        if (!isDeletable) {
          !isSelected ? onAdd(data) : onRemove(data);
        }
      }}>
      <Image
        source={{
          uri:
            data.image !== ''
              ? data.image
              : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
        }}
        style={styles.image}
      />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>{data.name}</Text>
        <Text style={styles.txtDesc}>{data.description}</Text>
      </View>
      {isDeletable ? (
        <TouchableOpacity
          style={styles.actionDeleteContainer}
          onPress={() => onRemove(data)}>
          <RoundCloseGrayIcon />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.actionContainer}>
          {isSelected ? <RoundSelectedRedIcon /> : <View />}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 20,
    marginBottom: 10,
  },
  selectedContainer: {
    width: '100%',
    height: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 102, 81, 0.15)',
    borderColor: 'rgba(255, 102, 81, 0.4)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtDuration: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  txtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  actionContainer: {
    width: 24,
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionDeleteContainer: {
    width: 24,
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

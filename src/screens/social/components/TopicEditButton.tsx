import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface TopicEditButtonProps {
  isEditMode: boolean;
  onPress: () => void;
}

const TopicEditButton = (props: TopicEditButtonProps) => {
  const {onPress, isEditMode} = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <FeatherIcon name="edit-2" size={13} />
        <Text style={styles.editLabel}>
          {!isEditMode ? 'Edit' : 'Save Edition'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TopicEditButton;

const styles = StyleSheet.create({
  container: {
    height: 34,
    paddingHorizontal: 20,
    borderRadius: 53,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 99,
  },
  editLabel: {
    fontFamily: 'Poppins',
    fontSize: 12,
    marginLeft: 10,
  },
});

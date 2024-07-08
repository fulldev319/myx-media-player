import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface PrimaryButtonProps {
  label: string;
  width?: any;
  icon?: any;
  isLoading?: boolean;
  onPress: () => void;
}

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const {label, width, icon, isLoading, onPress} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, width && {width: width}]}>
      {isLoading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <View style={styles.rowItem}>
          <View style={{marginRight: 8}}>{icon}</View>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 32,
    backgroundColor: '#ff6651',
    paddingHorizontal: 20,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins',
    color: 'white',
  },
});

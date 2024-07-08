import {PrimaryButton} from 'components/common';
import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

const MakeScrap = ({onPress, description, setDescription}) => {
  return (
    <View>
      <TextInput
        value={description}
        onChangeText={value => setDescription(value)}
        placeholder="Write down your thoughts here..."
        style={styles.textinput}
        multiline
      />
      <PrimaryButton label="Continue to Recording" onPress={onPress} />
    </View>
  );
};

export default MakeScrap;

const styles = StyleSheet.create({
  textinput: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19.2,
    color: 'black',
    height: 207,
    textAlign: 'left',
  },
});

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
// import AddText from './AddText';

const MediaTextEditor = ({onTextMemoryNext}) => {
  const [text, setText] = useState('');
  // const [showPlaceHolder, setShowPlaceholder] = useState(true);

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFill, styles.backgroundView]} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <TextInput
          value={text}
          onChangeText={value => setText(value)}
          maxLength={140}
          multiline={true}
          placeholder={'Type your text...'}
          placeholderTextColor="#ffffff80"
          style={styles.inputText}
          // onFocus={() => {
          //   setShowPlaceholder(false);
          // }}
          // onEndEditing={() => {
          //   setShowPlaceholder(true);
          // }}
        />
      </View>
      {text !== '' && (
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnNext}
            onPress={() => {
              setText('');
              onTextMemoryNext(text);
            }}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MediaTextEditor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundView: {
    backgroundColor: '#9747FF',
    borderRadius: 37,
  },
  inputText: {
    fontSize: 21,
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 10,
    width: '100%',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNext: {
    width: 120,
    height: 66,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 33,
    position: 'absolute',
    bottom: 10,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    color: '#FF3F3F',
    textAlign: 'center',
  },
});

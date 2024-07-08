import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import AddText from './AddText';

const MediaTextEditor = ({onTextMediaPublish}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [textArray, setTextArray] = useState([]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./../../assets/images/bg_media_text.png')}
        style={StyleSheet.absoluteFill}
        borderRadius={37}
      />
      <AddText
        style={[StyleSheet.absoluteFill]}
        isEditing={isEditingText}
        isEditingText={isEditing => {
          setIsEditingText(isEditing);
        }}
        onFinishEdit={textList => {
          setTextArray(textList);
        }}
        disableAddBtn={textArray.length > 0 ? true : false}
      />
      {isEditingText && (
        <TouchableOpacity
          style={styles.btnPostStory}
          onPress={() => setIsEditingText(false)}>
          <Text style={styles.buttonText}>Finish Editing</Text>
        </TouchableOpacity>
      )}
      {textArray.length > 0 && (
        <TouchableOpacity
          style={styles.btnPostStory}
          onPress={() => {
            onTextMediaPublish(textArray);
          }}>
          <Text style={styles.buttonText}>Post to story</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MediaTextEditor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnPostStory: {
    width: '80%',
    height: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 27,
    position: 'absolute',
    bottom: 10,
    marginHorizontal: '10%',
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
  },
});

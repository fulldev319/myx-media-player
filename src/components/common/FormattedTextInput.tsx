import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';

/**
 * @props
 * style: React.StyleSheet
 *
 * placeholder: string | default: 'Type something ...'
 *
 * placeholderTextColor: hexColor | default: #8e8e8e
 */

const validateMention = word => {
  var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
  if (
    (word.startsWith('@') && !format.test(word.substr(1))) ||
    (word.startsWith('#') && !format.test(word.substr(1)))
  ) {
    return true;
  }
  return false;
};

const FormattedTextInput = props => {
  const {
    style,
    placeholder = 'Type something ...',
    placeholderTextColor = '#FFFFFF',
    onChangeText,
    onChangeTagList,
    isOneLine = false,
  } = props;
  const [testFormattedContent, setTestFormattedContent] = useState([]);
  const refTextInput = useRef(null);

  const handleChangeText = inputText => {
    const retLines = inputText.split('\n');
    const formattedText = [];

    retLines.forEach((retLine, index) => {
      if (index !== 0) formattedText.push('\n');
      const words = retLine.split(' ');
      const contentLength = words.length;
      words.forEach((word, index) => {
        if (validateMention(word)) {
          const mention = (
            <Text key={index} style={{color: '#FF6651'}}>
              {word}
            </Text>
          );
          if (index !== contentLength - 1) formattedText.push(mention, ' ');
          else formattedText.push(mention);
        } else {
          if (index !== contentLength - 1) return formattedText.push(word, ' ');
          else return formattedText.push(word);
        }
      });
    });
    setTestFormattedContent(formattedText);

    let finalString = '';
    let hashTagList = [];
    formattedText.forEach(item => {
      var hashTagText = '';

      if (typeof item === 'object') {
        var jsonHashTagText = JSON.stringify(item).toString();
        hashTagText = jsonHashTagText.substring(
          jsonHashTagText.indexOf(`"children":"#`) + 13,
          jsonHashTagText.lastIndexOf(`"},"`),
        );

        hashTagList.push(hashTagText);
        finalString += hashTagText;
      } else {
        finalString += item;
      }
    });

    onChangeText(finalString);
    onChangeTagList(hashTagList);
  };

  return (
    <View
      style={[styles.container, style]}
      onTouchStart={() => {
        refTextInput.current.focus();
      }}>
      <View style={[styles.text, isOneLine && {height: 50}]}>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <Text
            style={[
              {
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 16,
                color: 'white',
              },
              isOneLine && {
                fontSize: 12,
              },
            ]}>
            {testFormattedContent}
          </Text>
        </ScrollView>
      </View>
      <TextInput
        ref={refTextInput}
        style={[
          styles.text_input,
          isOneLine && {
            fontSize: 12,
            height: 30,
          },
        ]}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={true}
        numberOfLines={5}
        returnKeyType={isOneLine ? 'search' : 'next'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text_input: {
    color: 'transparent',
    position: 'absolute',
    width: '100%',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    maxHeight: 120,
  },
  text: {
    position: 'absolute',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: 'white',
    maxHeight: 120,
  },
});
export default FormattedTextInput;

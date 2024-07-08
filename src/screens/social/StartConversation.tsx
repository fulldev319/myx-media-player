import {useNavigation, useRoute} from '@react-navigation/native';
import {RedImageIcon, RedRecordIcon, SelectedRadioIcon} from 'assets/svg';
import {SubPageHeader} from 'components/header/SubPageHeader';
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import QuestionBigIcon from 'assets/svg/QuestionBigIcon';
import FormattedTextInput from 'components/common/FormattedTextInput';

import {apiCreateTopicDiscussion} from 'helper/slambookHelper';

const StartConversationPage = () => {
  const navigation = useNavigation();
  const {params} = useRoute();

  const [isCreating, setIsCreating] = useState(false);
  const [text, setText] = useState('');
  const [tagList, setTagList] = useState([]);

  const _createDiscussion = async () => {
    if (text !== '') {
      setIsCreating(true);

      const slambook = params.slambook;
      const topic = params.topic;

      const res = await apiCreateTopicDiscussion(
        tagList,
        [],
        [],
        slambook,
        topic,
        text,
      );

      if (res.success) {
        navigation.goBack();
      }

      setIsCreating(false);
    }
  };

  const onSelectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then(async image => {});
  };

  return (
    <View style={styles.root}>
      <SubPageHeader label="Start Discussion" navigation={navigation} />
      <View style={styles.divider} />
      <View style={styles.inputView}>
        <FormattedTextInput
          value={text}
          onChangeText={value => setText(value)}
          onChangeTagList={value => setTagList(value)}
          placeholder="Enter your message here"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          multiline={true}
          style={styles.messageInput}
        />
      </View>
      <View style={styles.actionView}>
        <View style={styles.attachView}>
          <TouchableOpacity onPress={onSelectImage}>
            <RedImageIcon />
          </TouchableOpacity>
          <TouchableOpacity style={{marginStart: 30}}>
            <RedRecordIcon />
          </TouchableOpacity>
        </View>
        {isCreating ? (
          <TouchableOpacity style={styles.sendBtn}>
            <ActivityIndicator />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sendBtn} onPress={_createDiscussion}>
            <QuestionBigIcon />
            <Text style={styles.sendBtnTxt}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default StartConversationPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 60,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 30,
  },
  inputView: {
    height: 150,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    marginHorizontal: 27,
    paddingTop: 25,
  },
  messageInput: {
    width: '100%',
    height: '100%',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    textAlignVertical: 'top',
    color: 'white',
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 27,
    marginTop: 13,
  },
  attachView: {
    flexDirection: 'row',
  },
  sendBtn: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6651',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: 'white',
    marginStart: 8,
  },
});

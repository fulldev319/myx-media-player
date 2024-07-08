import {StackScreenProps} from '@react-navigation/stack';
import {RoundCloseIcon} from 'assets/svg';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import {apiPublishStory} from 'helper/storyHelpers';
import {convertTimeFormat} from 'helper/utils';
import {MainStackParams} from 'navigators';
import React, {useRef, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import ProgressBar from 'react-native-animated-progress';
import appActions from 'redux/app/actions';
import {useDispatch} from 'react-redux';
import AddText from './AddText';
import {compressMedia} from 'helper/utils';

const PublishStoryPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const mediaType = route.params!.mediaType;
  const videoUri = route.params!.videoUri;
  const videoDuration = route.params!.duration;

  const [isLoading, setIsLoading] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [arrLabel, setArrLabel] = useState([]);

  const onClose = () => {
    navigation.pop();
  };

  const updateArrLabel = textList => {
    setArrLabel(textList);
  };

  const onPublishStory = async () => {
    setIsLoading(true);

    const permission = 'public';
    let base64String;
    base64String = await compressMedia(mediaType, videoUri);
    base64String = await getBase64String(base64String);
    const mediaUrl = await uploadFileToIPFS(
      base64String,
      mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
    );
    const duration = mediaType === 'video' ? videoDuration : 0;
    const format = mediaType === 'video' ? 'mp4' : 'jpg';
    const labelArr = arrLabel;

    const res = await apiPublishStory(
      permission,
      mediaType,
      mediaUrl,
      duration,
      format,
      labelArr,
    );

    if (res.success) {
      navigation.navigate('Music');
      dispatch(appActions.setSnakeSuccessMessage('Story upload successful!'));
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <RoundCloseIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Add to story</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.editContainer}>
          <Image
            source={{uri: videoUri}}
            style={[StyleSheet.absoluteFill, {borderRadius: 37}]}
          />
          {mediaType === 'video' && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {convertTimeFormat(videoDuration)}
              </Text>
            </View>
          )}

          <AddText
            style={[StyleSheet.absoluteFill]}
            isEditing={isEditingText}
            isEditingText={isEditing => {
              setIsEditingText(isEditing);
            }}
            onFinishEdit={updateArrLabel}
          />
        </View>
        <View style={styles.btnContainer}>
          {isEditingText ? (
            <TouchableOpacity
              style={styles.btnPostStory}
              onPress={() => setIsEditingText(false)}>
              <Text style={styles.buttonText}>Finish Editing</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnPostStory}
              onPress={onPublishStory}>
              <Text style={styles.buttonText}>Post to story</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.waitText}>Please Wait...</Text>
          <View style={{width: '80%', marginTop: 20}}>
            <ProgressBar
              height={3}
              indeterminate
              backgroundColor="rgba(255, 255, 255, 1)"
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default PublishStoryPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 26,
  },
  title: {
    position: 'absolute',
    left: 50,
    right: 50,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  body: {
    flex: 1,
    marginTop: 40,
  },
  editContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  btnContainer: {
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btnPostStory: {
    width: '100%',
    height: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
  },
  timeContainer: {
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(1, 1, 1, 0.56)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  timeText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1, 1, 1, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

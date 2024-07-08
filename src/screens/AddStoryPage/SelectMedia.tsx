import {MediaType} from 'helper/typesHelper';
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MediaVideoSelector from './MediaVideoSelector';
import MediaImageSelector from './MediaImageSelector';
import MediaTextEditor from './MediaTextEditor';

type SelectMediaProps = {
  onGoToGallery?: Function;
  onGoToPublishStory: Function;
  onTextMediaPublish: Function;
};

const SelectMedia = ({
  onGoToGallery,
  onGoToPublishStory,
  onTextMediaPublish,
}: SelectMediaProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaType>(
    MediaType.Video,
  );

  const renderMediaTypes = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={
            selectedMedia !== MediaType.Text
              ? styles.defaultButtonContainer
              : styles.selectedButtonContainer
          }
          onPress={() => setSelectedMedia(MediaType.Text)}>
          <Text style={styles.buttonText}>Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedMedia !== MediaType.Video
              ? styles.defaultButtonContainer
              : styles.selectedButtonContainer
          }
          onPress={() => setSelectedMedia(MediaType.Video)}>
          <Text style={styles.buttonText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedMedia !== MediaType.Image
              ? styles.defaultButtonContainer
              : styles.selectedButtonContainer
          }
          onPress={() => setSelectedMedia(MediaType.Image)}>
          <Text style={styles.buttonText}>Image</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVideoSelect = () => {
    return (
      <MediaVideoSelector
        onGoToGallery={onGoToGallery}
        onGoToPublish={(videoUri, duration) =>
          onGoToPublishStory(videoUri, 'video', duration)
        }
      />
    );
  };

  const renderImageSelect = () => {
    return (
      <MediaImageSelector
        onGoToGallery={onGoToGallery}
        onGoToPublish={imageUri => onGoToPublishStory(imageUri, 'image', 0)}
      />
    );
  };

  const renderTextEditor = () => {
    return <MediaTextEditor onTextMediaPublish={onTextMediaPublish} />;
  };

  return (
    <View style={styles.root}>
      {renderMediaTypes()}
      <View style={styles.body}>
        {selectedMedia === MediaType.Video && renderVideoSelect()}
        {selectedMedia === MediaType.Image && renderImageSelect()}
        {selectedMedia === MediaType.Text && renderTextEditor()}
      </View>
    </View>
  );
};

export default SelectMedia;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
  },
  tabContainer: {
    height: 50,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  defaultButtonContainer: {
    flex: 1,
    height: 45,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedButtonContainer: {
    flex: 1,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  body: {
    flex: 1,
    marginTop: 20,
  },
});

import {MediaType} from 'helper/typesHelper';
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MediaVideoSelector from './MediaVideoSelector';
import MediaImageSelector from './MediaImageSelector';
import MediaTextEditor from './MediaTextEditor';

type SelectMediaProps = {
  onGoToGallery?: Function;
  onGoToSubmitMemory: Function;
  onTextMemoryNext: Function;
};

const SelectMedia = ({
  onGoToGallery,
  onGoToSubmitMemory,
  onTextMemoryNext,
}: SelectMediaProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaType>(
    MediaType.Image,
  );

  const renderMediaTypes = () => {
    return (
      <View style={styles.tabContainer}>
        <View style={{width: 250, flexDirection: 'row'}}>
          <TouchableOpacity
            style={
              selectedMedia !== MediaType.Text
                ? styles.defaultButtonContainer
                : styles.selectedButtonContainer
            }
            onPress={() => setSelectedMedia(MediaType.Text)}>
            <Text
              style={
                selectedMedia === MediaType.Text
                  ? styles.selectedButtonText
                  : styles.buttonText
              }>
              Text
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedMedia !== MediaType.Image
                ? styles.defaultButtonContainer
                : styles.selectedButtonContainer
            }
            onPress={() => setSelectedMedia(MediaType.Image)}>
            <Text
              style={
                selectedMedia === MediaType.Image
                  ? styles.selectedButtonText
                  : styles.buttonText
              }>
              Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedMedia !== MediaType.Video
                ? styles.defaultButtonContainer
                : styles.selectedButtonContainer
            }
            onPress={() => setSelectedMedia(MediaType.Video)}>
            <Text
              style={
                selectedMedia === MediaType.Video
                  ? styles.selectedButtonText
                  : styles.buttonText
              }>
              Video
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderVideoSelect = () => {
    return (
      <MediaVideoSelector
        onGoToGallery={onGoToGallery}
        onGoToPublish={(videoUri, duration) =>
          onGoToSubmitMemory(videoUri, 'video', duration)
        }
      />
    );
  };

  const renderImageSelect = () => {
    return (
      <MediaImageSelector
        onGoToGallery={onGoToGallery}
        onGoToPublish={imageUri => onGoToSubmitMemory(imageUri, 'image', 0)}
      />
    );
  };

  const renderTextEditor = () => {
    return <MediaTextEditor onTextMemoryNext={onTextMemoryNext} />;
  };

  return (
    <View style={styles.root}>
      <View style={styles.body}>
        {selectedMedia === MediaType.Video && renderVideoSelect()}
        {selectedMedia === MediaType.Image && renderImageSelect()}
        {selectedMedia === MediaType.Text && renderTextEditor()}
        {renderMediaTypes()}
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
    position: 'absolute',
    left: 0,
    bottom: 105,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultButtonContainer: {
    flex: 1,
    height: 45,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  selectedButtonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#FF6651',
    textAlign: 'center',
  },
  selectedButtonContainer: {
    flex: 1,
    height: 45,
  },
  body: {
    flex: 1,
    marginTop: 20,
  },
});

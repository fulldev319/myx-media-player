import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
import {WhiteCloseIcon} from 'assets/svg/chatIcons';
import Theme from 'components/common/Theme';

const ImageViewItem = () => {
  const {goBack} = useNavigation();
  const {params} = useRoute();
  const closeIcon = () => {
    return (
      <TouchableOpacity
        style={styles.closeContainer}
        onPress={() => {
          goBack();
        }}>
        <WhiteCloseIcon />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {params.type === 'video' ? (
        <View style={{flex: 1}}>
          <VideoPlayer
            video={{
              uri: params.url,
            }}
            videoWidth={Theme.width}
            videoHeight={Theme.height - 200}
          />
          {closeIcon()}
        </View>
      ) : (
        <ImageBackground
          source={{uri: params.url}}
          style={{flex: 1, backgroundColor: '#000'}}
          resizeMode="cover">
          {closeIcon()}
        </ImageBackground>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 100,
  },
});
export default ImageViewItem;

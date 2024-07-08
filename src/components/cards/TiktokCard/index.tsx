/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {PostLayoutType} from 'helper/constants';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import {styles} from './index.styles';
import LinearGradient from 'react-native-linear-gradient';
import ShareIcon from 'assets/svg/ShareIcon';
import {WebView} from 'react-native-webview';

const {width} = Dimensions.get('window');

export const TiktokCard = ({
  type,
  data,
  onClicked,
  onShareClick,
}: MemoryCardProps) => {
  const videoRef = useRef(null);

  const handleShare = () => {
    onShareClick(data);
  };

  const LargeCardContent = (
    <View style={styles.largetStyleContent}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.02)']}
        style={{
          position: 'absolute',
          height: 100,
          top: 0,
          left: 0,
          width: width,
        }}
      />
      <TouchableOpacity
        style={{position: 'absolute', right: 24, top: 24}}
        onPress={handleShare}>
        <ShareIcon />
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onClicked && onClicked(data)}>
      <View>
        <WebView
          ref={videoRef}
          style={[
            {
              width: '100%',
              height: type === PostLayoutType.Large ? 400 : 240,
              borderRadius: 8,
            },
          ]}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          viewportContent={`width=${
            Dimensions.get('window').width
          }, user-scalable=yes`}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEnabledWithZoomedin={false}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          androidHardwareAccelerationDisabled={false}
          mixedContentMode="always"
          source={{
            uri: data.video,
          }}
        />
        {type === PostLayoutType.Large && LargeCardContent}
      </View>
    </TouchableOpacity>
  );
};

type MemoryCardProps = {
  data: any;
  type: PostLayoutType;
  onClicked?: Function;
  onShareClick?: Function;
};

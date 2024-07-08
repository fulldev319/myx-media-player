/* eslint-disable react-native/no-inline-styles */
import {PinkShareIcon, PlayMark} from 'assets/svg';
import {MemeberGroup} from 'components/memberGroup';
import {PostLayoutType} from 'helper/constants';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {styles} from './index.styles';
import Video from 'react-native-video';

const {width} = Dimensions.get('window');
const size = (width - 40) / 2;

export const PostCard = ({type, data, onClicked}: PostCardProps) => {
  const videoRef = useRef(null);
  const [isStopVideo, setIsTopVideo] = useState(false);

  const renderMediaView = () => {
    return data.mediaType === 'video' ? (
      <Video
        ref={videoRef}
        source={{uri: data.mediaUrl}}
        resizeMode={'cover'}
        paused={isStopVideo}
        onReadyForDisplay={() => {
          if (videoRef) {
            setTimeout(() => {
              setIsTopVideo(true);
            }, 1000);
          }
        }}
        style={[{width: '100%', height: '100%', borderRadius: 15}]}
      />
    ) : data.mediaType === 'image' ? (
      <Image
        source={{uri: data.mediaUrl}}
        resizeMode="contain"
        style={{width: '100%', height: '100%', borderRadius: 15}}
      />
    ) : (
      <View
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 15,
          backgroundColor: '#9747FF',
        }}
      />
    );
  };

  if (type === PostLayoutType.Large) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            height: 300,
          },
        ]}
        onPress={() => onClicked && onClicked(data)}>
        {renderMediaView()}
        <View style={styles.largetStyleContent}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={styles.ownerDataContainer}>
              <Image
                source={{uri: 'https://i.pravatar.cc/150?img=53'}}
                style={styles.ownerImage}
              />
              <Text style={styles.ownerName}>{data.creator}</Text>
            </View>
            <View style={styles.playMarkContainer}>
              <PlayMark />
            </View>
          </View>
          <View style={{flex: 1}} />
          <View>
            <MemeberGroup isDummy />
            <Text style={[styles.postName, {fontSize: 14}]}>
              {data.caption ?? data.text}
            </Text>
            <Text style={styles.postDesc}>{data.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else if (type === PostLayoutType.Medium) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            height: 150,
          },
        ]}
        onPress={() => onClicked && onClicked(data)}>
        {renderMediaView()}
        <View style={styles.largetStyleContent}>
          <View style={{flex: 1}} />
          <View>
            <MemeberGroup />
            <Text style={styles.postName}>{data.caption ?? data.text}</Text>
            <Text style={styles.postDesc}>{data.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else if (type === PostLayoutType.Small) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            height: 150,
          },
        ]}
        onPress={() => onClicked && onClicked(data)}>
        {renderMediaView()}
        <View style={styles.largetStyleContent}>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={styles.postName}>234</Text>
          </View>
          <View>
            <Text style={styles.postName}>{data.caption ?? data.text}</Text>
            <Text style={styles.postDesc}>{data.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: size,
            height: 150,
          },
        ]}
        onPress={() => onClicked && onClicked(data)}>
        {renderMediaView()}
        <View style={styles.largetStyleContent}>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={styles.postName}>234</Text>
          </View>
          <View>
            <Text style={styles.postName}>{data.caption ?? data.text}</Text>
            <Text style={styles.postDesc}>{data.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

type PostCardProps = {
  data: any;
  type: PostLayoutType;
  onClicked?: Function;
};

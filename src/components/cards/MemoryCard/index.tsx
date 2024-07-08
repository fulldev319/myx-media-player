/* eslint-disable react-native/no-inline-styles */
import {PlayMark} from 'assets/svg';
import {MemeberGroup} from 'components/memberGroup';
import {PostLayoutType} from 'helper/constants';
import React, {useRef, useState} from 'react';
import {Image, TouchableOpacity, Text, View, Dimensions} from 'react-native';
import {styles} from './index.styles';
import Video from 'react-native-video';
import ScaledImage from 'components/ScaledImage';
import UnionIcon from 'assets/svg/UnionIcon';
import CommentIcon from 'assets/svg/CommentIcon';
import LineIcon from 'assets/svg/LineIcon';
import ShareIcon from 'assets/svg/ShareIcon';
import LikeIcon from 'assets/svg/LikeIcon';
import MusicSmallIcon from 'assets/svg/MusicSmallIcon';
import BookmarkIcon from 'assets/svg/BookmarkIcon';
import defaultAvatar from 'assets/images/default_avatar.png';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {
  apiLikeMemory,
  apiDislikeMemory,
  apiSaveMemory,
  apiUnsaveMemory,
} from 'helper/memoryHelpers';

const {width} = Dimensions.get('window');
const columnSize = (width - 85) / 2;

export const MemoryCard = ({type, data, onClicked}: MemoryCardProps) => {
  const videoRef = useRef(null);
  const [isStopVideo, setIsStopVideo] = useState(false);
  const [isLiked, setIsLiked] = useState(data.isLiked);
  const [isSaved, setIsSaved] = useState(data.isSaved);

  const diffTimes = dt1 => {
    return moment(dt1).fromNow();
  };

  const handleLikeMemory = memoryId => {
    if (!isLiked) {
      apiLikeMemory({postId: memoryId}).then(res => {
        if (res.success) {
          setIsLiked(true);
        }
      });
    } else {
      apiDislikeMemory({postId: memoryId}).then(res => {
        if (res.success) {
          setIsLiked(false);
        }
      });
    }
  };

  const handleSaveMemory = memoryId => {
    if (!isSaved) {
      apiSaveMemory({memoryId: memoryId}).then(res => {
        if (res.success) {
          setIsSaved(true);
        }
      });
    } else {
      apiUnsaveMemory({memoryId: memoryId}).then(res => {
        if (res.success) {
          setIsSaved(false);
        }
      });
    }
  };

  const LargeCardContent = (
    <View style={styles.largetStyleContent}>
      {data.mediaTypes[0] !== 'text' && (
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.03)']}
          style={{
            position: 'absolute',
            height: 100,
            top: 0,
            left: 0,
            width: width - 50,
          }}
        />
      )}
      {data.mediaTypes[0] !== 'text' && (
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.01)', 'rgba(0, 0, 0, 0.5)']}
          style={{
            position: 'absolute',
            height: 200,
            bottom: 0,
            left: 0,
            width: width - 50,
          }}
        />
      )}
      <View style={{justifyContent: 'space-between', height: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}>
          <View style={styles.ownerDataContainer}>
            <Image
              source={
                data.creatorInfo?.image
                  ? {uri: data.creatorInfo.image}
                  : defaultAvatar
              }
              style={styles.ownerImage}
            />
            <Text style={styles.ownerName}>{`@${data.creatorInfo.name}`}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#fff', fontSize: 10, marginRight: 14}}>
              {`${diffTimes(data.createdAt)}`}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <UnionIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {data.song && (
            <View style={styles.playMarkContainer}>
              <PlayMark />
              <Text style={{color: '#fff', fontSize: 10, marginLeft: 8}}>
                {`${data.song.title} ∙ ${data.song.artists}`}
              </Text>
            </View>
          )}
          <Text style={styles.postName}>
            {data.mediaTypes[0] === 'text' ? data.text : data.caption}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MemeberGroup data={data.tagged} />
            {data.commentsCount > 0 && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <LineIcon style={{marginLeft: 13, marginRight: 13}} />
                <CommentIcon />
                <Text style={{color: '#fff', fontSize: 12, marginLeft: 5}}>
                  {`${data.commentsCount} comments`}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.bookmarkContainer}>
            <TouchableOpacity onPress={() => handleLikeMemory(data.id)}>
              <LikeIcon isLiked={isLiked} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <ShareIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSaveMemory(data.id)}>
              <BookmarkIcon isSaved={isSaved} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const SmallCardContent = (
    <View style={styles.smallStyleContent}>
      <View style={{height: '100%', justifyContent: 'space-between'}}>
        <MemeberGroup data={data.tagged} />
        {data.mediaTypes[0] === 'text' && (
          <Text style={styles.text}>{data.text}</Text>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              padding: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 24,
            }}>
            <MusicSmallIcon />
          </View>
          <View style={{marginLeft: 4}}>
            <Text style={{color: '#fff', fontSize: 10}}>
              {data?.song?.title.length > 13
                ? `${data?.song?.title.slice(0, 13)}...`
                : data?.song?.title}
            </Text>
            <Text style={{color: '#fff', fontSize: 8, marginTop: 2}}>
              {data?.song?.artists[0].length > 15
                ? `${data?.song?.artists[0].slice(0, 15)}...`
                : data?.song?.artists[0]}
            </Text>
          </View>
        </View>
      </View>
      <View style={{position: 'absolute', bottom: 10, right: 0}}>
        <View
          style={{
            width: 28,
            backgroundColor: '#fff',
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            padding: 2,
          }}>
          <Image
            source={
              data.creatorInfo?.image
                ? {uri: data.creatorInfo.image}
                : defaultAvatar
            }
            style={{width: 22, height: 22, borderRadius: 32}}
          />
        </View>
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onClicked && onClicked(data)}>
      {data.mediaTypes[0] === 'video' ? (
        <View>
          <Video
            ref={videoRef}
            source={{uri: data.mediaUrls[0]}}
            resizeMode={'cover'}
            paused={isStopVideo}
            onReadyForDisplay={() => {
              if (videoRef) {
                setTimeout(() => {
                  setIsStopVideo(true);
                }, 1000);
              }
            }}
            style={[
              {
                width: '100%',
                height: type === PostLayoutType.Large ? 300 : 150,
                borderRadius: 8,
              },
            ]}
          />
          {type === PostLayoutType.Large ? LargeCardContent : SmallCardContent}
        </View>
      ) : data.mediaTypes[0] === 'image' ? (
        <View>
          <ScaledImage
            uri={data.mediaUrls[0]}
            width={type === PostLayoutType.Large ? width - 65 : columnSize}
            minHeight={300}
            style={{borderRadius: 8}}
          />
          {type === PostLayoutType.Large ? LargeCardContent : SmallCardContent}
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            minHeight: type === PostLayoutType.Large ? 300 : 150,
            borderRadius: 8,
            backgroundColor: '#9214F5',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
          {type === PostLayoutType.Large ? LargeCardContent : SmallCardContent}
        </View>
      )}
    </TouchableOpacity>
  );
};

type MemoryCardProps = {
  data: any;
  type: PostLayoutType;
  onClicked?: Function;
};

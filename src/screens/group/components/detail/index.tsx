import {getDefaultAvatar} from 'helper/userHelpers';
import {
  generateComponentKey,
  getArrFromString,
  SCREEN_WIDTH,
} from 'helper/utils';
import React, {useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AskJoinIcon, ReplyIcon} from 'screens/group/assets';
import BottomPlayIcon from 'screens/group/assets/BottomPlayIcon';
import {GroupCardProps} from 'screens/my_group/GroupCard';
import moment from 'moment';
import Carousel from 'react-native-snap-carousel';
import {styles} from './index.styles';
import {useNavigation} from '@react-navigation/native';
import {
  apiPostCancelRequest,
  apiPostJoinRequest,
  apiPostLeaveGroup,
} from 'helper/groupHelper';

const GroupDetail = ({data, onPress}: GroupCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  data.is_member = data.is_member === 'true';
  const [isAsked, setIsAsked] = useState(data.is_member === 'true');
  const navigation = useNavigation();

  const arrImages = useMemo(() => {
    const arrMedia = getArrFromString(data.mediaUrls);
    const arrConverted = arrMedia.map((item, index) => {
      const mediaUrl = getArrFromString(item ?? '', ',');

      if (mediaUrl.length > 0) {
        return mediaUrl[0];
      } else {
        return '';
      }
    });

    return arrConverted;
  }, [data]);

  const displayImage = useMemo(() => {
    if (arrImages.length >= currentIndex) {
      return arrImages[currentIndex];
    } else {
      return '';
    }
  }, [arrImages, currentIndex]);

  const userName = useMemo(() => {
    const arrUserName = getArrFromString(data.usernames);

    if (arrUserName.length >= 1) {
      return arrUserName[currentIndex];
    } else {
      return '';
    }
  }, [data, currentIndex]);

  const userImages = useMemo(() => {
    return getArrFromString(data.user_images);
  }, [data]);

  const userImage = useMemo(() => {
    if (userImages.length >= currentIndex) {
      return userImages[currentIndex];
    } else {
      return '';
    }
  }, [data, currentIndex]);

  const userIds = useMemo(() => {
    return getArrFromString(data.user_ids);
  }, [data]);

  const userId = useMemo(() => {
    if (userIds.length >= currentIndex) {
      return userIds[currentIndex];
    } else {
      return 0;
    }
  }, [data, currentIndex]);

  const timeStampList = useMemo(() => {
    return getArrFromString(data.timestamps);
  }, [data]);

  const agoTime = useMemo(() => {
    if (timeStampList.length > currentIndex) {
      return timeStampList[currentIndex];
    } else {
      return '';
    }
  }, [data, currentIndex]);

  const isReplied = useMemo(() => {
    const arrReply = getArrFromString(data.is_reply);
    const arrCountry = getArrFromString(data.country_names);
    if (arrReply.length > currentIndex && arrCountry.length > currentIndex) {
      if (arrReply[currentIndex] == 1) {
        return `Replying a post at ${arrCountry[currentIndex]}`;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }, [data, currentIndex]);

  const isDebate = useMemo(() => {
    const arrDebate = getArrFromString(data.is_debate);

    if (arrDebate.length > currentIndex) {
      return arrDebate[currentIndex];
    } else {
      return 0;
    }
  }, [data, currentIndex]);

  const arrDebate = useMemo(() => {
    return getArrFromString(data.debates);
  }, [data]);

  const currentDebateId = useMemo(() => {
    if (arrDebate.length > currentIndex) {
      return parseInt(arrDebate[currentIndex]);
    } else {
      return -1;
    }
  }, [currentIndex]);

  const onGoToViewPost = () => {
    if (currentDebateId == -1) {
      return;
    }

    if (isDebate !== 0) {
      navigation.navigate('ThreadPage', {id: currentDebateId});
    } else {
      navigation.navigate('SubThreadPage', {id: currentDebateId});
    }
  };

  const goToOtherProfile = userId => {
    navigation.navigate('MyProfilePage', {fromOtherPage: true, id: userId});
  };

  const carouselScrollHorizontal = async idx => {
    setCurrentIndex(idx);
  };

  const onRequest = async () => {
    if (data.is_member) {
      const res = await apiPostLeaveGroup({group: String(data.id)});
      if (res.success) {
        setIsAsked(false);
      } else {
        alert(JSON.stringify(res.error));
      }
    } else {
      if (!isAsked) {
        const res = await apiPostJoinRequest({group: String(data.id)});
        if (res.success) {
          setIsAsked(true);
        } else {
          alert(JSON.stringify(res.error));
        }
      } else {
        const res = await apiPostCancelRequest({group: String(data.id)});
        if (res.success) {
          setIsAsked(false);
        } else {
          alert(JSON.stringify(res.error));
        }
      }
    }
  };

  const renderHeader = () => {
    if (data.is_member) {
      return (
        <View style={styles.header}>
          <Text style={styles.groupName}>{data.name}</Text>
          <View />
          <TouchableOpacity style={styles.requestBtn} onPress={onRequest}>
            {!isAsked ? (
              <AskJoinIcon />
            ) : (
              <Text style={styles.requestTxt}>Joined</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.header}>
        <Text style={styles.groupName}>{data.name}</Text>
        <View />
        <TouchableOpacity style={styles.requestBtn} onPress={onRequest}>
          {!isAsked ? (
            <AskJoinIcon />
          ) : (
            <Text style={styles.requestTxt}>Request Sent</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderIndicator = () => {
    return (
      <View style={styles.indicator}>
        {arrImages.map((item, index) => {
          return (
            <View
              style={[
                index == currentIndex
                  ? styles.indicatorItem
                  : styles.selectedIndicatorItem,
              ]}
              key={`key_group_image_${generateComponentKey()}`}
            />
          );
        })}
      </View>
    );
  };

  const renderUserInfo = () => {
    return (
      <View style={styles.userInfo}>
        <TouchableOpacity
          style={styles.rowItem}
          onPress={() => {
            goToOtherProfile(userId);
          }}>
          <View style={styles.userAvatar}>
            <Image
              source={userImage === '' ? getDefaultAvatar() : {uri: userImage}}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </TouchableOpacity>
        <Text style={styles.userTime}>
          {agoTime === '' ? '' : `${moment(agoTime).fromNow()}`}
        </Text>
      </View>
    );
  };

  const renderLeftView = () => {
    return (
      <View style={styles.leftViewContainer}>
        <View style={styles.leftView}>
          <TouchableOpacity style={styles.country}></TouchableOpacity>
          <TouchableOpacity style={styles.country}></TouchableOpacity>
          <TouchableOpacity style={styles.country}></TouchableOpacity>
          <TouchableOpacity style={styles.country}>
            <Text style={styles.countryMore}>+2</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRightView = () => {
    return (
      <View style={styles.rightView}>
        {arrImages.map((item, index) => {
          return (
            <TouchableOpacity
              style={[
                styles.thumb,
                index === currentIndex && styles.selectedThumb,
              ]}
              onPress={() => setCurrentIndex(index)}
              key={`${generateComponentKey()}`}>
              <Image
                source={{uri: item}}
                style={[
                  StyleSheet.absoluteFill,
                  {flexWrap: 'wrap', overflow: 'hidden', borderRadius: 4},
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderBottomView = () => {
    return (
      <View style={styles.bottomView}>
        {isReplied !== '' && (
          <View style={styles.viewPostWrap}>
            <View style={styles.rowItem}>
              <ReplyIcon />
              <Text style={styles.replyTxt}>{isReplied}</Text>
            </View>
            <TouchableOpacity onPress={onGoToViewPost}>
              <Text style={styles.viewPost}>View Post</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{alignItems: 'center'}}>
          <BottomPlayIcon />
        </View>
      </View>
    );
  };

  const renderBgImage = () => {
    return (
      <View style={[StyleSheet.absoluteFill, styles.bgImage]}>
        <Image
          source={{uri: displayImage}}
          style={[StyleSheet.absoluteFill, styles.bgImage]}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      {renderHeader()}
      <Carousel
        layout={'default'}
        data={arrImages}
        renderItem={item => {
          return (
            <View style={{height: '100%', marginEnd: 30, padding: 20}}>
              {renderBgImage()}
              {renderIndicator()}
              {renderUserInfo()}
              {renderBottomView()}
              {renderLeftView()}
              {renderRightView()}
            </View>
          );
        }}
        sliderWidth={SCREEN_WIDTH}
        itemWidth={SCREEN_WIDTH}
        activeSlideAlignment={'center'}
        loop={true}
        onSnapToItem={carouselScrollHorizontal}
      />
    </View>
  );
};

export default GroupDetail;

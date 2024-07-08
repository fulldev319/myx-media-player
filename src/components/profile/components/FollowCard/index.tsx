import {UserBothIcon} from 'components/profile/assets/svgs/UserBothIcon';
import {
  apiSendFollowRequest,
  apiUnFollowPeople,
  getDefaultAvatar,
} from 'helper/userHelpers';
import {generateComponentKey} from 'helper/utils';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CountryItem} from '../CountryItem';

import BG_FOLLOW_BTN from './../../assets/images/bg_follow_btn.png';
import {styles} from './index.styles';

export interface FollowData {
  id: number;
  userName: string;
  userImage: string;
  countries: Array<string>;
  countryNames: Array<string>;
  countryImages: Array<string>;
  followers: number;
  posts: number;
  followStatus: 'true' | 'false' | 'requested';
}

export interface FollowCardProps {
  type: 'following' | 'follower';
  data: FollowData;
  onGoToCountryDetail: Function;
}

export const FollowCard = ({
  type,
  data,
  onGoToCountryDetail,
}: FollowCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState(data.followStatus);

  const onFollow = async () => {
    if (!isLoading) {
      setIsLoading(true);

      const res = await apiSendFollowRequest(data.id.toString());

      if (res.success) {
        setFollowStatus('requested');
      }

      setIsLoading(false);
    }
  };

  const onUnFollow = async () => {
    if (!isLoading) {
      setIsLoading(true);

      const res = await apiUnFollowPeople(data.id.toString());

      if (res.success) {
        setFollowStatus('false');
      }

      setIsLoading(false);
    }
  };

  const renderTopView = () => {
    return (
      <View style={styles.topView}>
        <Image
          source={
            data.userImage === '' ? getDefaultAvatar() : {uri: data.userImage}
          }
          style={styles.userImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{data.userName}</Text>
          <View style={styles.followInfo}>
            <UserBothIcon />
            <Text style={styles.followUsersTxt}>
              {data.followers} followers
            </Text>
          </View>
        </View>
        <View style={styles.postContainer}>
          <Text style={styles.postCountTxt}>{data.posts} post</Text>
          <Text style={styles.postWeekTxt}>/week</Text>
        </View>
      </View>
    );
  };

  const renderDivider = () => {
    return <View style={styles.divider}></View>;
  };

  const renderBottomView = () => {
    return (
      <View style={styles.bottomView}>
        <View style={styles.joinedView}>
          <Text style={styles.joinedTxt}>Joined Countries</Text>
          <View style={styles.countryView}>
            {data.countryImages.map((item, index) => {
              return (
                <CountryItem
                  url={item}
                  key={`${generateComponentKey()}`}
                  onClicked={() => {
                    onGoToCountryDetail(data.countries[index]);
                  }}
                />
              );
            })}
          </View>
        </View>
        {followStatus === 'true'
          ? renderFollowingBtn()
          : followStatus === 'false'
          ? renderFollowBtn()
          : renderRequestedBtn()}
      </View>
    );
  };

  const renderFollowingBtn = () => {
    return (
      <TouchableOpacity style={styles.btnContainer} onPress={onUnFollow}>
        <Image
          source={BG_FOLLOW_BTN}
          style={[StyleSheet.absoluteFill, {opacity: 0.4}]}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          {isLoading ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={[styles.followingTxt]}>Following</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRequestedBtn = () => {
    return (
      <TouchableOpacity style={styles.btnContainer} onPress={onUnFollow}>
        <Image
          source={BG_FOLLOW_BTN}
          style={[StyleSheet.absoluteFill, {opacity: 0.4}]}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          {isLoading ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={[styles.followingTxt]}>Requested</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFollowBtn = () => {
    return (
      <TouchableOpacity style={styles.btnContainer} onPress={onFollow}>
        <Image source={BG_FOLLOW_BTN} style={[StyleSheet.absoluteFill]} />
        <View
          style={[
            StyleSheet.absoluteFill,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          {isLoading ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={[styles.followingTxt, {color: 'white'}]}>Follow</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderTopView()}
      {renderDivider()}
      {renderBottomView()}
    </View>
  );
};

/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';
import moment from 'moment';
import {
  ClockIcon,
  MessageIcon,
  SmallAudioPlayIcon,
  SmallAudioPauseIcon,
} from 'screens/thread/assets/svgs';
import {CustomBadge} from 'screens/thread/components/CustomBadge';
import {TaggedText} from 'components/common/TaggedText';
import {useTracks} from 'contexts/TrackContext';
import WheelViewWithoutOutBorder from 'components/AudioWheels/WheelViewWithoutOutBorder';
import {ThumbEmolike} from 'components/thread/ThumbEmolike';
import {convertTimeFormat, generateComponentKey} from 'helper/utils';
import {useNavigation} from '@react-navigation/native';

export interface ForYouPost {
  id: number;
  type: number;
  debate: number;
  linkInfos: string;
  links: string;
  timestamp: number;
  image: string;
  keywords: string;
  description: string;
  duration: number;
  thread_duration: number;
  threads: number;
  emolike_count: number;
  emolikes: Array<any>;
  yes: number;
  no: number;
  url: string;
  is_debate: number;
}

export interface ForYouItemProps {
  data: ForYouPost;
  onAddEmoji: Function;
  onGotoCountry: Function;
  onGoToProfile: Function;
}

export const CardForYou = ({
  data,
  onAddEmoji,
  onGotoCountry,
  onGoToProfile,
}: ForYouItemProps) => {
  const navigation = useNavigation();
  const {togglePlayer, curTrack, playingStatus, playOneTrack} = useTracks();
  const [isPlayed, setIsPlayed] = useState(false);

  useEffect(() => {
    if (playingStatus === 'pause') {
      setIsPlayed(false);
    }
  }, [playingStatus]);

  const handlePlayer = () => {
    setIsPlayed(!isPlayed);
    if (String(curTrack?.id) === String(data.id)) {
      togglePlayer();
    } else {
      if (data && data.url) {
        playOneTrack(
          {
            id: String(data.id),
            image: '',
            title: data.keywords,
            artists: [''],
            description: data.description,
            url: data.url,
            previewUrl: data.url,
          },
          data.id,
          false,
        );
      }
    }
  };

  const handleMedia = () => {
    if (data.is_debate === 0) {
      navigation.navigate('SubThreadPage', {id: data.id, url: data.url});
    } else {
      navigation.navigate('ThreadPage', {id: data.id});
    }
  };

  const headerTypeTxt = useMemo(() => {
    const linkUsers = data.linkInfos?.split(',');
    if (linkUsers?.length === 2) {
      switch (data.type) {
        case 1:
          return `${linkUsers[0]} created this debate`;
        case 2:
          return `${linkUsers[0]} replies in this post`;
        case 3:
          return `${linkUsers[0]} emoliked in this post`;
        case 4:
          return `${linkUsers[0]} voted in this post`;
        default:
          break;
      }
    } else {
      return '';
    }
  }, [data]);

  const userLinkTxt = useMemo(() => {
    const linkUsers = data.linkInfos?.split(',');
    if (linkUsers?.length === 2) {
      return linkUsers;
    } else {
      return ['', ''];
    }
  }, [data]);

  const keyWords = useMemo(() => {
    if (data.keywords) {
      return data.keywords.split(',');
    } else {
      return [];
    }
  }, [data]);

  const renderHeader = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.headerView}>
          {data.type === 1 ? (
            <Type1HeadIcon />
          ) : data.type === 2 ? (
            <Type2HeadIcon />
          ) : data.type === 3 ? (
            <Type3HeadIcon />
          ) : (
            <Type4HeadIcon />
          )}
          <Text style={styles.headerStatusTxt}>{headerTypeTxt}</Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  };

  const renderInfo = () => {
    return (
      <View style={styles.infoView}>
        <TouchableOpacity style={styles.wheelView} onPress={handleMedia}>
          <WheelViewWithoutOutBorder
            data={data.image}
            type={
              data.duration > 300
                ? 'blue'
                : data.duration < 30
                ? 'yellow'
                : 'green'
            }
          />
        </TouchableOpacity>
        <View style={styles.infoBody}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={styles.nameTxt}
              onPress={() => {
                data.links[0] && onGoToProfile(data.links[0]);
              }}>
              {userLinkTxt[0]} <Text style={styles.nameSpaceTxt}>in</Text>{' '}
            </Text>
            <TouchableOpacity onPress={() => onGotoCountry()}>
              <Text style={styles.nameTxt}>{userLinkTxt[1]}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowItem}>
            {keyWords.map((item, index) => {
              const key = generateComponentKey().toString();

              return (
                <CustomBadge
                  key={key}
                  label={item}
                  containerStyle={styles.largeBadge}
                  labelStyle={styles.largeBadgeLabel}
                />
              );
            })}
          </View>
          <View style={styles.threadStatus}>
            <View style={styles.rowItem}>
              <ClockIcon />
              <Text style={styles.threadStatusText}>
                {convertTimeFormat(data.duration) === ''
                  ? '00:00'
                  : convertTimeFormat(data.duration)}
              </Text>
            </View>
            <View style={[styles.rowItem, {marginLeft: 18}]}>
              <MessageIcon />
              <Text style={styles.threadStatusText}>{data.threads}</Text>
            </View>
            <Text
              style={[
                styles.threadStatusText,
                {
                  marginStart: 20,
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontSize: 10,
                },
              ]}>
              {moment(data.timestamp).fromNow()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <View style={styles.descView}>
        <Text style={styles.description}>
          <TaggedText text={data.description} />
        </Text>
      </View>
    );
  };

  const renderVote = () => {
    return (
      <View style={[styles.voteView, {padding: 13}]}>
        <View style={styles.commentInfoItemRow}>
          <CommentUpIcon />
          <Text style={styles.commentStatusTxt}>
            <Text style={styles.commentCountTxt}>{data.yes}</Text> agreed
          </Text>
          {data.yes > data.no && renderWinMarker()}
        </View>
        <View style={[styles.commentInfoItemRow, {flex: 1}]}>
          <CommentDownIcon />
          <Text style={styles.commentStatusTxt}>
            <Text style={styles.commentCountTxt}>{data.no}</Text> disagreed
          </Text>
        </View>
        <TouchableOpacity style={{}}>
          <RedPlusIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderWinMarker = () => {
    return (
      <View style={styles.winMarkContainer}>
        <Text style={styles.winTxt}>WIN</Text>
      </View>
    );
  };

  const renderBottom = () => {
    return (
      <View style={styles.threadBottom}>
        <ThumbEmolike
          data={data.emolikes}
          itemSize={24}
          maxSize={3}
          showPlus={true}
          showMoreView={true}
          onAddEmoji={onAddEmoji}
        />
        <TouchableOpacity
          style={styles.smallAudioPlayButton}
          onPress={handlePlayer}>
          <Text style={styles.smallAudioPlay}>Play Audio</Text>
          {isPlayed ? <SmallAudioPauseIcon /> : <SmallAudioPlayIcon />}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <View style={{flexDirection: 'row'}}>
        <View style={{width: '100%', flex: 1}}>
          <View style={{flex: 1}}>
            {renderHeader()}
            {renderInfo()}
          </View>
          {renderDescription()}
        </View>
        <View style={{width: 25}}>
          <RightPlusIcon />
        </View>
      </View>

      {renderVote()}
      {renderBottom()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 12,
    padding: 16,
  },
  headerView: {
    height: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 4,
    paddingEnd: 10,
  },
  headerStatusTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    marginStart: 8,
  },
  infoView: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    marginTop: 16,
  },
  wheelView: {
    width: 60,
    height: 60,
  },
  infoBody: {
    flex: 1,
    marginStart: 16,
  },
  nameTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  nameSpaceTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  rowItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  largeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginTop: 8,
  },
  largeBadgeLabel: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  threadStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threadBottom: {
    marginTop: 16,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  threadAvatar: {
    width: 24,
    height: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    marginRight: 6,
  },
  descView: {
    marginVertical: 16,
  },
  description: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    color: '#ffffff80',
  },
  descEmail: {
    marginTop: 8,
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 19.2,
    color: '#ff6651',
  },
  smallAudioPlayButton: {
    width: 90,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    backgroundColor: '#ff6651',
    paddingHorizontal: 10,
  },
  smallAudioPlay: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  threadStatusText: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 18,
    color: '#ffffff80',
    marginLeft: 4,
  },
  tagedText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    color: '#ff6651',
  },
  voteView: {
    width: '100%',
    minHeight: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInfoItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 16,
  },
  commentCountTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    color: '#ffffff',
  },
  commentStatusTxt: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginStart: 6,
  },
  winMarkContainer: {
    height: 12,
    backgroundColor: '#08B883',
    borderRadius: 12,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 8,
  },
  winTxt: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 8,
    color: 'rgba(255, 255, 255, 1)',
  },
});

const CommentUpIcon = () => {
  return (
    <Svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <Path
        fill="#08B883"
        d="M14.25 10.5a.749.749 0 00-.915.54A5.25 5.25 0 018.25 15H4.058l.48-.473a.75.75 0 000-1.058A5.25 5.25 0 018.25 4.5a.75.75 0 100-1.5A6.75 6.75 0 003 13.964l-1.282 1.253a.75.75 0 00-.158.817.75.75 0 00.69.465h6a6.75 6.75 0 006.54-5.062.751.751 0 00-.54-.938zm2.033-6.556l-2.25-2.25a.75.75 0 00-.248-.157.75.75 0 00-.57 0 .75.75 0 00-.247.157l-2.25 2.25a.753.753 0 001.065 1.065l.967-.952v4.192a.75.75 0 101.5 0V4.057l.968.975a.75.75 0 001.065 0 .75.75 0 000-1.065v-.023z"
      />
    </Svg>
  );
};

const CommentDownIcon = () => (
  <Svg width="19" height="18" fill="none" viewBox="0 0 19 18">
    <Path
      fill="#FC82DA"
      d="M14.75 10.5a.75.75 0 00-.915.54A5.25 5.25 0 018.75 15H4.558l.48-.473a.75.75 0 000-1.057A5.25 5.25 0 018.75 4.5c.22-.011.44-.011.66 0A.755.755 0 009.59 3a6.24 6.24 0 00-.84 0A6.75 6.75 0 003.5 13.965l-1.282 1.252a.75.75 0 00-.158.818.75.75 0 00.69.465h6a6.75 6.75 0 006.54-5.063.752.752 0 00-.54-.937zm2.033-5.055a.75.75 0 00-1.065 0l-.968.997V2.25a.75.75 0 10-1.5 0v4.192l-.967-.974a.752.752 0 10-1.065 1.064l2.25 2.25a.75.75 0 00.247.158.705.705 0 00.57 0 .75.75 0 00.248-.157l2.25-2.25a.75.75 0 000-1.066v-.022z"
    />
  </Svg>
);

const RedPlusIcon = () => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <G
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      clipPath="url(#clip0_17039_50335)">
      <Path d="M10 18.335a8.333 8.333 0 100-16.667 8.333 8.333 0 000 16.667zM10 6.668v6.667M6.667 10h6.666" />
    </G>
    <Defs>
      <ClipPath id="clip0_17039_50335">
        <Path fill="#fff" d="M0 0H20V20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

const RightPlusIcon = () => (
  <Svg width="21" height="20" fill="none" viewBox="0 0 21 20">
    <Path
      fill="#000"
      stroke="#fff"
      strokeWidth="1.5"
      d="M1.75 10.003V10A9.25 9.25 0 1111 19.25H1.968a.25.25 0 01-.231-.133.25.25 0 01.056-.259v-.001L3.79 16.86l.482-.482-.434-.525a9.14 9.14 0 01-2.088-5.85zm2.13 7.467L2.6 18.75H11V18a8 8 0 10-5.66-2.34l-.532.529s0 0 0 0a.25.25 0 010 .352l-.928.929zM11.25 9v.75H14a.25.25 0 110 .5h-2.75V13a.25.25 0 01-.5 0v-2.75H8a.25.25 0 110-.5h2.75V7a.25.25 0 11.5 0v2z"
    />
  </Svg>
);

const Type1HeadIcon = () => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <Path
      fill="rgba(255, 255, 255, 0.4)"
      d="M12.308 4.892a.833.833 0 001.133-.309A.833.833 0 0115 5a.833.833 0 01-.834.833.833.833 0 100 1.667A2.5 2.5 0 1012 3.75a.835.835 0 00.308 1.142zm3.584 5.941a.833.833 0 00-.934.717 5.833 5.833 0 01-5.792 5.117H4.508l.542-.542a.833.833 0 000-1.175A5.833 5.833 0 019.166 5a.833.833 0 000-1.667 7.5 7.5 0 00-5.833 12.175l-1.425 1.4a.833.833 0 00-.175.909.834.834 0 00.767.516h6.666a7.5 7.5 0 007.442-6.558.831.831 0 00-.716-.942zm-1.409-2.441A.833.833 0 0014 8.333l-.15.05-.15.075-.125.109a.832.832 0 00-.175.266.7.7 0 00-.067.334.833.833 0 00.059.325c.043.1.105.19.183.266a.834.834 0 00.591.242.833.833 0 00.834-.833.7.7 0 00-.067-.317.891.891 0 00-.45-.45v-.008z"
    />
  </Svg>
);

const Type2HeadIcon = () => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <Path
      fill="rgba(255, 255, 255, 0.4)"
      d="M16.667 7.451a1.09 1.09 0 00-.05-.225v-.075a.89.89 0 00-.159-.233l-5-5a.893.893 0 00-.233-.158.266.266 0 00-.075 0 .734.734 0 00-.275-.092H5.833a2.5 2.5 0 00-2.5 2.5v11.667a2.5 2.5 0 002.5 2.5h8.334a2.5 2.5 0 002.5-2.5V7.5v-.05zm-5-2.941l2.158 2.158H12.5a.833.833 0 01-.833-.833V4.51zM15 15.835a.833.833 0 01-.833.833H5.833A.833.833 0 015 15.835V4.168a.833.833 0 01.833-.833H10v2.5a2.5 2.5 0 002.5 2.5H15v7.5zm-3.333-4.167h-.833v-.833a.833.833 0 00-1.667 0v.833h-.833a.834.834 0 000 1.667h.833v.833a.833.833 0 001.667 0v-.833h.833a.834.834 0 000-1.667z"
    />
  </Svg>
);

const Type3HeadIcon = () => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <Path
      fill="#fff"
      d="M7.017 10.176a.834.834 0 00.591.242.834.834 0 00.592-.242l1.25-1.25a.833.833 0 000-1.183L8.2 6.493a.837.837 0 00-1.183 1.183l.658.659-.658.658a.833.833 0 000 1.183zm4.95 1.667a3.134 3.134 0 01-3.934 0 .834.834 0 10-1.066 1.283 4.733 4.733 0 006.066 0 .834.834 0 10-1.066-1.283zm.533-4.342a.833.833 0 100 1.666.833.833 0 000-1.666zM10 1.668a8.333 8.333 0 100 16.667 8.333 8.333 0 000-16.667zm0 15a6.666 6.666 0 110-13.333 6.666 6.666 0 010 13.333z"
      opacity="0.4"
    />
  </Svg>
);

const Type4HeadIcon = () => (
  <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <Path
      fill="#fff"
      d="M10 1.668a8.333 8.333 0 00-8.333 8.333 8.241 8.241 0 001.883 5.275l-1.667 1.667a.833.833 0 00-.175.908.834.834 0 00.792.484H10a8.333 8.333 0 100-16.667zm0 15H4.508l.775-.775a.834.834 0 000-1.175A6.667 6.667 0 1110 16.668z"
      opacity="0.4"
    />
  </Svg>
);

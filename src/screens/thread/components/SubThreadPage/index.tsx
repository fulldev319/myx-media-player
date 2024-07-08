/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon, BookmarkIcon} from 'assets/svg';
import LinearGradient from 'react-native-linear-gradient';
import {Loader} from 'screens/map/components';
import {
  apiGetDebateThreads,
  apiGetEmolikes,
  apiPostHideContent,
} from 'helper/debateHelper';
import {
  HookDownIcon,
  ThreeDotIcon,
  ClockIcon,
  MessageIcon,
  SmallAudioPlayIcon,
  AgreeIcon,
  DisagreeIcon,
  PlusButton,
  SmallWaveIcon,
  WinIcon,
  MicIcon,
} from '../../assets/svgs';
import {CustomBadge} from '../CustomBadge';
import {SubThreadCard} from '../SubThreadCard';
import {getDefaultAvatar} from 'helper/userHelpers';
import {styles} from './index.styles';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {useTracks} from 'contexts/TrackContext';
import {eventListenDebate} from 'helper/socketHelper';

const SubThreadPage = props => {
  const {id, url} = props.route.params;
  const navigation = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const {togglePlayer, curTrack, playingStatus, playOneTrack, trackPosition} =
    useTracks();

  const [isLoading, setIsLoading] = useState(true);
  const [isThreadLoading, setIsThreadLoading] = useState(false);

  const [emolikes, setEmolikes] = useState<Emolike[]>([]);

  const [isAgreeTab, setIsAgreeTab] = useState(true);
  const [isVotedAgree, setIsVotedAgree] = useState(false);
  const [isVotedDisagree, setIsVotedDisagree] = useState(false);

  const [lastId, setLastId] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const [debate, setDebate] = useState<Debate>();
  const [debateThreads, setDebateThreads] = useState<DebateThread[]>([]);
  const [debateThreadsCount, setDebateThreadsCount] = useState(0);
  const [prevTrackPosition, setPrevTrackPosition] = useState(0);

  useEffect(() => {
    getEmolikes();
  }, []);

  useEffect(() => {
    getDebateThreads();
  }, [isAgreeTab]);

  useEffect(() => {
    if (playingStatus === 'playing' && trackPosition - prevTrackPosition > 5) {
      setPrevTrackPosition(trackPosition);
      eventListenDebate({
        comment: curTrack?.id,
        user: user?.id,
        time: trackPosition,
      });
    }
  }, [trackPosition]);

  const getEmolikes = async () => {
    let hasMoreEmolike = false;
    let emolikeLastId = 0;
    do {
      const res = await apiGetEmolikes(id, false, 10, emolikeLastId);
      if (res.success) {
        setEmolikes(prev => [...prev, ...res.data]);
        hasMoreEmolike = res.hasMore;
        emolikeLastId = res.lastId;
      }
    } while (hasMoreEmolike);
  };

  const getDebateThreads = async () => {
    setIsThreadLoading(true);
    const res = await apiGetDebateThreads(id, isAgreeTab ? 'yes' : 'no');
    if (res.success) {
      setDebateThreads(res.data);
      setDebateThreadsCount(res.threads);
    }
    setIsThreadLoading(false);
  };

  if (isLoading) {
    return <Loader color="white" bgColor="black" />;
  }

  const onShowMore = async () => {
    setIsMoreLoading(true);
    do {
      const res = await apiGetDebateThreads(
        id,
        isAgreeTab ? 'yes' : 'no',
        3,
        lastId,
      );
      if (res.success) {
        setDebateThreads(prev => [...prev, ...res.data]);
        setHasMore(res.hasMore);
        setLastId(res.lastId);
      }
    } while (hasMore);
    setIsMoreLoading(false);
  };

  const onHideThread = async (idx: string) => {
    const res = await apiPostHideContent(idx);
    if (res.success) {
      const newThreads = debateThreads.filter(
        thread => thread.creator.id === idx,
      );
      setDebateThreadsCount(newThreads.length);
      setDebateThreads(newThreads);
    }
  };

  const handlePlayer = () => {
    if (String(curTrack?.id) === String(id)) {
      togglePlayer();
    } else {
      if (url) {
        playOneTrack(
          {
            id: String(id),
            image: '',
            title: '',
            artists: [''],
            description: '',
            url: url,
            previewUrl: url,
          },
          id,
          false,
        );
      }
    }
  };

  const renderThreads = () => {
    const leftCount = debateThreadsCount - debateThreads.length;
    return (
      <View>
        <View style={styles.titleContainer}>
          <Text
            style={styles.title}>{`Sub threads (${debateThreadsCount})`}</Text>
        </View>
        {isThreadLoading ? (
          <Loader color="white" />
        ) : (
          debateThreads.map(thread => {
            return (
              <SubThreadCard
                key={thread.id}
                data={thread}
                hidePost={onHideThread}
              />
            );
          })
        )}
        {leftCount ? (
          <TouchableOpacity onPress={onShowMore} style={styles.showMoreButton}>
            {isMoreLoading ? (
              <Loader color="white" bgColor="transparent" />
            ) : (
              <Text
                style={styles.showMoreText}>{`Show More (${leftCount})`}</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderDebate = () => {
    return (
      <View style={styles.userContainer}>
        <View style={styles.tabContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={isAgreeTab ? styles.tab1 : styles.tab2}>
              {isVotedAgree ? (
                <AgreeIcon isSelected={true} />
              ) : (
                <DisagreeIcon isSelected={true} />
              )}
              <Text style={isAgreeTab ? styles.agree : styles.disagree}>
                Agree
              </Text>
              {debate && debate.yes > debate.no && (
                <CustomBadge
                  label="Win"
                  icon={<WinIcon />}
                  color="#08b883"
                  labelStyle={styles.winLabel}
                  containerStyle={styles.winBadge}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.tabSpace} />
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={!isAgreeTab ? styles.tab1 : styles.tab2}>
              {isVotedDisagree ? (
                <AgreeIcon isSelected={true} />
              ) : (
                <DisagreeIcon isSelected={true} />
              )}
              <Text style={!isAgreeTab ? styles.agree : styles.disagree}>
                Disagree
              </Text>
              {debate && debate.yes < debate.no && (
                <CustomBadge
                  label="Win"
                  icon={<WinIcon />}
                  color="#08b883"
                  labelStyle={styles.winLabel}
                  containerStyle={styles.winBadge}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        {emolikes.length ? (
          <View>
            <View style={styles.titleContainer}>
              <Text
                style={styles.title}>{`Emolikes (${emolikes.length})`}</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>
            <ScrollView
              horizontal
              indicatorStyle="white"
              contentContainerStyle={styles.emolikeContainer}>
              <TouchableOpacity style={styles.plusButton}>
                <PlusButton />
              </TouchableOpacity>
              <View>
                <View style={styles.emolike}>
                  <LinearGradient
                    colors={['rgba(0, 0, 0, 0.01)', '#171717']}
                    style={styles.emoNameContaner}>
                    <View style={styles.flexRowCenter}>
                      <SmallWaveIcon />
                      <Text numberOfLines={1} style={styles.emoName}>
                        jessicapieasdfasdf
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
                <View style={styles.emoti} />
              </View>
            </ScrollView>
          </View>
        ) : null}
        <View style={styles.emoUsersContainer}>
          <View style={styles.emoUserAvatar} />
          <View style={styles.emoUserAvatar} />
          <View style={styles.emoUserAvatar} />
          <Text style={styles.emoUserDesc}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Rio, Andrea, Joss,
            </Text>{' '}
            and 6 other friends are on this side.
          </Text>
        </View>
        {renderThreads()}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Thread</Text>
        <TouchableOpacity onPress={() => {}}>
          <BookmarkIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddNewThreadBtn = () => {
    return (
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.newButton}>
          <MicIcon />
          <Text style={styles.newButtonTitle}>Add New Sub Thread</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView>
        <View style={styles.mainContent}>
          <View style={styles.topicContainer}>
            <View style={{flexDirection: 'row'}}>
              <View style={{paddingTop: 8, marginRight: 6}}>
                <HookDownIcon />
              </View>
              <Image source={getDefaultAvatar()} style={styles.topicTagImage} />
              <View style={styles.topicTagBox}>
                <Text style={styles.text1}>Wedding</Text>
              </View>
              <View style={styles.topicTagBox}>
                <Text style={styles.text1}>Love</Text>
              </View>
              <View style={styles.topicTagBox}>
                <Text style={styles.text1}>Marriage</Text>
              </View>
            </View>
            <View style={[styles.flexRowBetween, {marginTop: 16}]}>
              <View style={styles.flexRowCenter}>
                <Image
                  source={getDefaultAvatar()}
                  style={styles.topicCreatorImage}
                />
                <View style={{marginLeft: 8}}>
                  <Text style={styles.text2}>Jessica Pierce</Text>
                  <Text style={styles.text3}>2 mins ago</Text>
                </View>
              </View>
              <ThreeDotIcon />
            </View>
            <View style={[styles.flexRowCenter, {marginTop: 16}]}>
              <View style={styles.topicTagBox}>
                <Text style={styles.text2}>Love</Text>
              </View>
              <View style={styles.topicTagBox}>
                <Text style={styles.text2}>Marry</Text>
              </View>
              <View style={styles.topicTagBox}>
                <Text style={styles.text2}>Date</Text>
              </View>
            </View>
            <Text style={[styles.text4, {marginTop: 12}]}>
              Late night chat with @abigailwatson in how we run.
            </Text>
            <View style={styles.threadStatus}>
              <View style={[styles.flexRowBetween, {flex: 1}]}>
                <View style={styles.flexRowCenter}>
                  <View style={styles.flexRowCenter}>
                    <ClockIcon />
                    <Text style={styles.threadStatusText}>{'2m 30s'}</Text>
                  </View>
                  <View style={[styles.flexRowCenter, {marginLeft: 18}]}>
                    <MessageIcon />
                    <Text style={styles.threadStatusText}>{'12 threads'}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.smallAudioPlayButton}
                  onPress={handlePlayer}>
                  <Text style={styles.smallAudioPlay}>Play Audio</Text>
                  <SmallAudioPlayIcon />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              horizontal
              style={{
                borderBottomColor: '#ffffff20',
                borderBottomWidth: 1,
                paddingBottom: 16,
              }}>
              {new Array(9).fill(0).map(item => (
                <Image
                  source={getDefaultAvatar()}
                  style={styles.topicPreviewImage}
                />
              ))}
            </ScrollView>
          </View>
          {renderDebate()}
        </View>
      </ScrollView>
      {renderAddNewThreadBtn()}
    </View>
  );
};

export default SubThreadPage;

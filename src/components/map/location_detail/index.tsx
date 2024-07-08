import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {SearchBar} from 'components/common/SearchBar';
import {styles} from './index.styles';

import {SCREEN_HEIGHT} from 'helper/utils';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {CardLocation} from './components/CardLocation';
import Svg, {Path} from 'react-native-svg';
import {CardOngoingLive} from './components/CardOngoingLive';
import {CardNewPost} from './components/CardNewPost';
import {CardHeated} from './components/CardHeated';
import {CardRecommended} from './components/CardRecommended';

export const LocationDetail = ({show, onClose}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [SCREEN_HEIGHT - 40, SCREEN_HEIGHT - 40],
    [],
  );

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    } else {
    }
  }, []);

  const renderHeader = () => {
    return (
      <View>
        <Text style={styles.title}>🌏 Global Feed</Text>
        <View style={{marginVertical: 20}}>
          <SearchBar
            value={searchText}
            txtPlaceholder="Search countries here..."
            onChangedText={setSearchText}
            theme={'gray'}
            style={{backgroundColor: '#FFFFFF', height: 40}}
          />
        </View>
      </View>
    );
  };

  const renderTopics = () => {
    return (
      <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {Array(10)
            .fill(0)
            .map((item, index) => {
              return (
                <View
                  style={styles.topicItem}
                  key={`global_feed_topic_${index}`}>
                  <Text style={styles.topicItemText}>🔥 What’s Cooking?</Text>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  };

  const renderLocations = () => {
    return (
      <View style={{marginTop: 20}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <CardLocation key={`global_feed_location_${index}`} />
            ))}
        </ScrollView>
      </View>
    );
  };

  const renderOngoingLive = () => {
    return (
      <View style={{marginTop: 20}}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ongoing Live Audio Room</Text>
          <View style={styles.sectionSeeAll}>
            <Text style={styles.sectionSeeAllText}>See All</Text>
            <SmallRedArrow />
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10}}>
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <CardOngoingLive key={`global_feed_ongoing_${index}`} />
            ))}
        </ScrollView>
      </View>
    );
  };

  const renderNewPost = () => {
    return (
      <View style={{marginTop: 20}}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>New Posts</Text>
          <View style={styles.sectionSeeAll}>
            <Text style={styles.sectionSeeAllText}>See All</Text>
            <SmallRedArrow />
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10}}>
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <CardNewPost key={`global_feed_newpost_${index}`} />
            ))}
        </ScrollView>
      </View>
    );
  };

  const renderHeated = () => {
    return (
      <View style={{marginTop: 20}}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🧑‍⚖️ Heated Debate</Text>
          <View style={styles.sectionSeeAll}>
            <Text style={styles.sectionSeeAllText}>See All</Text>
            <SmallRedArrow />
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10}}>
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <CardHeated key={`global_feed_heated_${index}`} />
            ))}
        </ScrollView>
      </View>
    );
  };

  const renderRecommend = () => {
    return (
      <View style={{marginTop: 20}}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <View style={styles.sectionSeeAll}>
            <Text style={styles.sectionSeeAllText}>See All</Text>
            <SmallRedArrow />
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10}}>
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <CardRecommended key={`global_feed_recommended_1_${index}`} />
            ))}
        </ScrollView>
      </View>
    );
  };

  const renderRecommend2 = () => {
    return (
      <View style={{marginTop: 20}}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <View style={styles.sectionSeeAll}>
            <Text style={styles.sectionSeeAllText}>See All</Text>
            <SmallRedArrow />
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10}}>
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <CardNewPost key={`global_feed_recommended_2_${index}`} />
            ))}
        </ScrollView>
      </View>
    );
  };

  const renderRecommend3 = () => {
    return (
      <View style={{marginTop: 20}}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <View style={styles.sectionSeeAll}>
            <Text style={styles.sectionSeeAllText}>See All</Text>
            <SmallRedArrow />
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10}}>
          {Array(10)
            .fill(0)
            .map((item, index) => (
              <CardNewPost key={`global_feed_recommended_3_${index}`} />
            ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={styles.indicator}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      onChange={handleSheetChanges}>
      <View style={[StyleSheet.absoluteFill, {top: 16, left: 16, right: 16}]}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}>
          <View>
            {renderHeader()}
            {renderTopics()}
            {renderLocations()}
            {renderOngoingLive()}
            {renderNewPost()}
            {renderHeated()}
            {renderRecommend()}
            {renderRecommend2()}
            {renderRecommend3()}
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
};

const SmallRedArrow = () => (
  <Svg width="12" height="12" fill="none" viewBox="0 0 12 12">
    <Path
      stroke="#FF6651"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4.5 9l3-3-3-3"></Path>
  </Svg>
);

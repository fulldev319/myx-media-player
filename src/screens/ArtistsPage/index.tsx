import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParams } from './../../navigators/index';

import HttpClient from './../../helper/apiClient';
import { styles } from './index.styles';

import {
  SLIDER_WIDTH,
  ITEM_WIDTH,
  CarouselArtistItem,
} from 'components/cards/CarouselArtistItem';
import { BackIcon } from 'assets/svg';
import { ArtistCard } from 'components/cards/ArtistCard';
import { processImage } from 'helper/utils';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export const ArtistsPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const { width } = Dimensions.get('window');
  const size = (width - 80) / 3;
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const [topArtists, setTopArtists] = useState([]);
  const [isLoadingTopArtists, setIsLoadingTopArtists] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);

  const [hasMoreArtist, setHasMoreArtist] = useState(true);
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    getTopArtists();
  }, []);

  useEffect(() => {
    getArtists();
  }, [pagination]);

  const snapItem = index => {
    setCurrentIndex(index);
  };

  const loadMore = () => {
    if (loadingArtists || !hasMoreArtist || artists.length === 0) return;
    setPagination(prev => prev + 1);
  };

  const getTopArtists = async () => {
    if (isLoadingTopArtists) return;

    setIsLoadingTopArtists(true);
    const res: any = await HttpClient.get('/musicDao/getPlayerTopArtists', {});
    const resp = res.data;

    if (resp.success) {
      let newTopArtists = [];
      if (resp.data.topArtists?.length > 0) {
        newTopArtists = resp.data.topArtists.map(v => {
          return { ...v, ImageUrl: processImage(v.ImageUrl) };
        });
      }

      setTopArtists(newTopArtists);
      setIsLoadingTopArtists(false);
    } else {
      setIsLoadingTopArtists(false);
    }
  };

  const getArtists = async () => {
    if (loadingArtists) return;
    setLoadingArtists(true);
    const res: any = await HttpClient.getWithToken(
      `/musicDao/getPlayerAllArtists/${pagination}`,
    );
    const response = res.data;

    if (response.success) {
      const newTopArtists = response.data.artists.map((v, index) => {
        return { ...v, ImageUrl: processImage(v.ImageUrl), key: index };
      });
      setArtists(prev => [...prev, ...newTopArtists]);
      setTopArtists(
        newTopArtists && newTopArtists.length > 0
          ? newTopArtists.slice(0, 7)
          : [],
      );

      setHasMoreArtist(response.data.hasMore);
    }

    setLoadingArtists(false);
  };

  const onGoToDetail = itemID => {
    navigation.navigate('ArtistDetailPage', { itemID });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.mainContainer}>
        <TouchableOpacity onPress={() => { navigation.goBack(); }} style={styles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              loadMore();
            }
          }}
          scrollEventThrottle={500}>
          <View style={styles.subContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Top Artists</Text>
            </View>
            <View style={styles.cardContainer}>
              <Carousel
                layout={'default'}
                ref={carouselRef}
                data={topArtists}
                renderItem={({ item, index }) =>
                  CarouselArtistItem({
                    item: item,
                    index: index,
                    curIndex: currentIndex + 3,
                    onDetail: onGoToDetail,
                  })
                }
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                loop={true}
                activeSlideAlignment={'center'}
                inactiveSlideScale={0.8}
                inactiveSlideShift={0}
                onSnapToItem={snapItem}
              />
            </View>
          </View>
          <View style={styles.subContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>All Artists</Text>
            </View>
            <FlatList
              data={artists}
              renderItem={({ item, index }) => (
                <ArtistCard
                  key={index}
                  size={size}
                  marginRight={0}
                  marginTop={20}
                  data={item}
                  onGoToDetail={itemID => onGoToDetail(itemID)}
                />
              )}
              keyExtractor={item => `${item.id}_${item.title}`}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

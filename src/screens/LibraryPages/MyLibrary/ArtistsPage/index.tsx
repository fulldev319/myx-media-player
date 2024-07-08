import React, {useState, useEffect} from 'react';
import {View, FlatList, Dimensions} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

import {ArtistCard} from 'components/cards/ArtistCard';
import {mediaGetPlayerLikedArtists} from 'helper/playListDaoHelpers';
import {MainStackParams} from 'navigators';

import {styles} from './index.styles';

export const ArtistsPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {width} = Dimensions.get('window');
  const size = (width - 80) / 3;

  const [likedArtists, setLikedArtists] = useState([]);
  const [loadingLikedArtists, setLoadingLikedArtists] = useState(false);
  const [lastLikedArtist, setLastLikedArtist] = useState(0);
  const [hasMoreLikedArtist, setHasMoreLikedArtist] = useState(true);

  useEffect(() => {
    loadLikedArtists();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLikedArtists();
    });
    return unsubscribe;
  }, [navigation]);

  const loadLikedArtists = async () => {
    if (loadingLikedArtists) return;
    try {
      setLoadingLikedArtists(true);

      const response = await mediaGetPlayerLikedArtists(lastLikedArtist);
      setLoadingLikedArtists(false);
      if (response.success) {
        const data = response.data.artists || [];
        const artistData = data.map(item => {
          return {
            ...item,
          };
        });
        setLikedArtists(artistData);
        setHasMoreLikedArtist(response.data.hasMore ?? false);
        setLastLikedArtist(response.data.lastIndex ?? 0);
      }
    } catch (err) {
      setLoadingLikedArtists(false);
    }
  };

  const onGoToDetail = itemID => {
    navigation.navigate('ArtistDetailPage', {itemID});
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={likedArtists}
        renderItem={({item, index}) => (
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
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  );
};

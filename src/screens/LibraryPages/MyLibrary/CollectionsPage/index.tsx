import {SongCard} from 'components/cards/SongCard';
import {mediaGetPlayerLikedAlbums} from 'helper/playListDaoHelpers';
import React, {useState, useRef, useEffect} from 'react';
import {View, FlatList, Dimensions} from 'react-native';

import {styles} from './index.styles';

export const CollectionsPage = () => {
  const {width} = Dimensions.get('window');
  const size = (width - 60) / 2;

  const [likedCollections, setLikedCollections] = useState([]);
  const [loadingLikedCollections, setLoadingLikedCollections] = useState(false);
  const [lastLikedCollection, setLastLikedCollection] = useState(0);
  const [hasMoreLikedCollection, setHasMoreLikedCollection] = useState(true);

  useEffect(() => {
    loadLikedCollections();
  }, []);

  const loadLikedCollections = async () => {
    if (loadingLikedCollections) return;

    try {
      setLoadingLikedCollections(true);
      const response = await mediaGetPlayerLikedAlbums(lastLikedCollection);
      setLoadingLikedCollections(false);
      if (response.success) {
        const data = response.data.albums || [];
        const collectionData = data.map(item => {
          return {
            ...item,
            playingStatus: 0,
          };
        });
        setLikedCollections(collectionData);
        setHasMoreLikedCollection(response.data.hasMore ?? false);
        setLastLikedCollection(response.data.lastIndex ?? 0);
      }
    } catch (err) {
      setLoadingLikedCollections(false);
    }
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={likedCollections}
        renderItem={({item, index}) => (
          <SongCard
            key={index}
            data={item}
            size={size}
            marginRight={0}
            marginTop={20}
            onGoToDetail={() => {}}
          />
        )}
        keyExtractor={item => `${item.id}_${item.title}`}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  );
};

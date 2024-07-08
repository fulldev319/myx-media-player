import {useRoute} from '@react-navigation/native';
import {ClockIcon} from 'assets/svg/clock';
import {TrashIcon} from 'assets/svg/trash';
import {SearchBar} from 'components/SearchBar';
import {
  apiGetTopicSearchComments,
  apiGetTopicSearchTags,
  apiGetTopicRecentSearch,
  apiRemoveTopicRecentSerch,
} from 'helper/slambookHelper';
import React, {useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardHashTag from './cards/CardHasTag';
import CardMessage from './cards/CardMessage';

import {styles} from './index.styles';

const TopicSearchPage = () => {
  const {params} = useRoute();

  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(true);
  const [queryStarted, setQueryStarted] = useState(false);

  const [searchCategory, setSearchCategory] = useState('messages');

  const [arrSearchedComment, setArrSearchedComment] = useState([]);
  const [hasMoreComment, setHasMoreComment] = useState(true);
  const [lastIdComment, setLastIdComment] = useState(null);

  const [arrSearchedTag, setArrSearchedTag] = useState([]);
  const [countComment, setCountComment] = useState(0);
  const [countTag, setCountTag] = useState(0);

  const [arrRecentSearch, setArrRecentSearch] = useState([]);
  const [selectedHasTag, setSelectedHasTag] = useState('');

  const startSearch = () => {
    setQueryStarted(true);

    _loadSearchComments(searchText, lastIdComment);
    _loadSearchTags(searchText);
  };

  const closeSearch = () => {
    setQueryStarted(false);
    setSearching(false);
    setSearchText('');
    setArrSearchedComment([]);
    setArrSearchedTag([]);
  };

  const recentSearch = searchItem => {
    setQueryStarted(true);
    _loadSearchComments(searchItem, null);
    _loadSearchTags(searchItem);
  };

  const _loadSearchComments = async (text, lastId) => {
    const res = await apiGetTopicSearchComments(
      params.slambook,
      params.topic,
      text,
      lastId,
    );

    if (res.success) {
      const newArray = res.data.map((item, _) => {
        const newItem = item;
        newItem.mentions = [text.toLowerCase()];
        return newItem;
      });

      if (lastIdComment) {
        setArrSearchedComment([...arrSearchedComment, ...newArray]);
      } else {
        setArrSearchedComment(newArray);
      }

      setHasMoreComment(res.hasMore);
      setLastIdComment(res.lastId);
      setCountComment(res.data.length);
    }
  };

  const _loadSearchTags = async text => {
    setSelectedHasTag(text);

    const res = await apiGetTopicSearchTags(
      params.slambook,
      params.topic,
      text,
    );

    if (res.success) {
      setArrSearchedTag(res.data);
    }
  };

  const _loadRecentSearch = async () => {
    const res = await apiGetTopicRecentSearch();

    if (res.success) {
      setArrRecentSearch(res.data);
    }
  };

  const _removeRecentSearch = async searchText => {
    const res = await apiRemoveTopicRecentSerch(searchText);
    if (res.success) {
      const newRecentSearch = arrRecentSearch.filter(
        item => item.search !== searchText,
      );

      setArrRecentSearch(newRecentSearch);
    }
  };

  const renderContentTypes = () => {
    return (
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => setSearchCategory('messages')}>
          <Text
            style={
              searchCategory === 'messages'
                ? styles.categorySelected
                : styles.category
            }>
            {`Messages (${countComment})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSearchCategory('hashtag')}>
          <Text
            style={
              searchCategory === 'hashtag'
                ? styles.categorySelected
                : styles.category
            }>
            {`Hashtags`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContents = () => {
    if (searchCategory === 'messages') {
      return (
        <FlatList
          data={arrSearchedComment}
          renderItem={itemData => {
            return <CardMessage data={itemData} key={itemData.index} />;
          }}
          keyExtractor={(item, index) => `searchedTopic-${item?.id}-${index}`}
        />
      );
    } else {
      return (
        <FlatList
          data={arrSearchedTag}
          renderItem={itemData => {
            return (
              <CardHashTag
                data={itemData}
                selectedTag={selectedHasTag}
                slambookId={params.slambook}
                topicId={params.topic}
                key={itemData.index}
              />
            );
          }}
          keyExtractor={(item, index) => `searchedTopic-${item?.id}-${index}`}
        />
      );
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.mainContainer}
        onScroll={({nativeEvent}) => {}}
        scrollEventThrottle={500}>
        <View style={{paddingHorizontal: 24}}>
          <SearchBar
            value={searchText}
            enableOneClickBack={true}
            txtPlaceholder="Search..."
            onChangedText={text => {
              _loadRecentSearch();
              setLastIdComment(null);
              setSearchText(text);
            }}
            isSearching={searching}
            closeSearch={closeSearch}
            startSearch={startSearch}
            startSearching={() => setSearching(true)}
          />
        </View>
        {queryStarted ? (
          <View style={styles.container}>
            {renderContentTypes()}
            {renderContents()}
          </View>
        ) : (
          searching && (
            <View style={styles.container}>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Recent search</Text>
              </View>
              <FlatList
                data={arrRecentSearch}
                renderItem={itemData => (
                  <TouchableOpacity
                    style={styles.recentSearchKeyword}
                    key={itemData.item}
                    onPress={() => {
                      recentSearch(itemData.item.search);
                      setSelectedHasTag(itemData.item.search);
                      setSearching(true);
                    }}>
                    <ClockIcon style={{opacity: 0.4}} />
                    <Text style={styles.recentSearchKeywordText}>
                      {itemData.item.search}
                    </Text>
                    <TouchableOpacity
                      onPress={() => _removeRecentSearch(itemData.item.search)}>
                      <TrashIcon style={{opacity: 0.6}} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `keyword-${item?.id}-${index}`}
              />
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default TopicSearchPage;

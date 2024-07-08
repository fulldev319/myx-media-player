import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import SelectDropdown from 'react-native-select-dropdown';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {useDebounce} from 'use-debounce';

import {BackIcon, SearchIcon, ViewModeIcon} from './assets';
import {GroupView, GroupDetail} from './components';
import {styles} from './index.styles';
import {apiGetGroupAll, apiGetSearchGroupAll} from 'helper/groupHelper';
import {generateComponentKey} from 'helper/utils';

const GroupPage = () => {
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState(false);
  const [isFollowedByFriend, setIsFollowedByFriend] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchTmpText, setSearchTmpText] = useState('');
  const [debouncedSearchValue] = useDebounce(searchTmpText, 1000);

  const [hasMoreGroup, setHasMoreGroup] = useState(true);
  const [lastIdGroup, setLastIdGroup] = useState(null);
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);
  const [arrGroup, setArrGroup] = useState([]);

  const [hasMoreSearchGroup, setHasMoreSearchGroup] = useState(true);
  const [lastIdSearchGroup, setLastIdSearchGroup] = useState(null);
  const [isLoadingSearchGroup, setIsLoadingSearchGroup] = useState(false);
  const [arrSearchGroup, setArrSearchGroup] = useState([]);

  useEffect(() => {
    if (searchText === '' && !isFollowedByFriend) {
      loadGroupData(true);
    } else {
      console.log('-- search');
      loadSearchGroupData(searchText, true);
    }
  }, [searchText, isFollowedByFriend]);

  const loadGroupData = async (isRefresh = false) => {
    if (isRefresh) {
      setIsLoadingGroup(true);
      const res = await apiGetGroupAll({
        offset: null,
        limit: 10,
      });

      if (res.success) {
        setLastIdGroup(res.lastId);
        setHasMoreGroup(res.hasMore);
        setArrGroup(res.data);
      }
      setIsLoadingGroup(false);
    } else {
      if (hasMoreGroup && !isLoadingGroup) {
        setIsLoadingGroup(true);
        const res = await apiGetGroupAll({
          offset: lastIdGroup,
          limit: 10,
        });

        if (res.success) {
          setLastIdGroup(res.lastId);
          setHasMoreGroup(res.hasMore);
          setArrGroup(prev => [...prev, ...res.data]);
        }
        setIsLoadingGroup(false);
      }
    }
  };

  const loadSearchGroupData = async (searchText, isRefresh = false) => {
    if (isRefresh) {
      setIsLoadingSearchGroup(true);
      const res = await apiGetSearchGroupAll({
        query: searchText,
        friends: isFollowedByFriend ? 'true' : '',
        offset: null,
        limit: 10,
      });

      if (res.success) {
        setLastIdSearchGroup(res.lastId);
        setHasMoreSearchGroup(res.hasMore);
        setArrSearchGroup(res.data);
      }
      setIsLoadingSearchGroup(false);
    } else {
      if (hasMoreSearchGroup && !isLoadingSearchGroup) {
        setIsLoadingSearchGroup(true);
        const res = await apiGetSearchGroupAll({
          query: searchText,
          friends: isFollowedByFriend ? 'true' : '',
          offset: lastIdSearchGroup,
          limit: 10,
        });

        if (res.success) {
          setLastIdSearchGroup(res.lastId);
          setHasMoreSearchGroup(res.hasMore);
          setArrSearchGroup(prev => [...prev, ...res.data]);
        }
        setIsLoadingSearchGroup(false);
      }
    }
  };

  useEffect(() => {
    setSearchText(searchTmpText);
  }, [debouncedSearchValue]);

  const onChangedSearchValue = val => {
    setSearchTmpText(val);
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.searchBtn}>
          <TouchableOpacity>
            <SearchIcon />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            value={searchTmpText}
            onChangeText={val => onChangedSearchValue(val)}
          />
        </View>
      </View>
    );
  };

  const CategoryDropDown = () => {
    return (
      <SelectDropdown
        data={['All Categories', 'Book']}
        onSelect={(selectedItem, index) => {}}
        defaultButtonText={'All Categories'}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(selectedItem, index) => {
          return '';
        }}
        buttonStyle={styles.dropDownButton}
        buttonTextStyle={styles.dropDownButtonText}
        dropdownStyle={styles.dropDown}
        rowStyle={styles.row}
        renderDropdownIcon={() => (
          <FeatherIcon color="white" size={14} name="chevron-down" />
        )}
        renderCustomizedRowChild={(item, index) => (
          <Text
            numberOfLines={1}
            allowFontScaling={false}
            style={styles.rowChild}>
            {item.toString() === 'Book' ? 'Book' : 'All Categories'}
          </Text>
        )}
      />
    );
  };

  const renderToolBar = () => {
    return (
      <View style={styles.toolBar}>
        <TouchableOpacity
          onPress={() => setViewMode(!viewMode)}
          style={{marginRight: 16}}>
          <ViewModeIcon />
        </TouchableOpacity>
        {CategoryDropDown()}
        <TouchableOpacity
          style={[
            styles.followedBadge,
            isFollowedByFriend && {backgroundColor: '#FF6651'},
          ]}
          onPress={() => {
            setIsFollowedByFriend(prev => !prev);
          }}>
          <Text style={styles.followedTxt}>Followed By Friends</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGroups = () => {
    if (viewMode) return;
    return (
      <GroupView
        data={
          searchText === '' && !isFollowedByFriend ? arrGroup : arrSearchGroup
        }
      />
    );
  };

  const renderDetail = () => {
    if (!viewMode) return;
    return (
      <ScrollView pagingEnabled showsVerticalScrollIndicator={false}>
        {(searchText === '' && !isFollowedByFriend
          ? arrGroup
          : arrSearchGroup
        ).map(item => {
          return (
            <GroupDetail
              key={`${generateComponentKey()}`}
              index={0}
              data={item}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {renderSearchBar()}
        {renderToolBar()}
        {renderGroups()}
        {renderDetail()}
      </View>
    </SafeAreaView>
  );
};

export default GroupPage;

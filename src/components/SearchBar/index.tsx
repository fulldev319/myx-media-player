import React, {useEffect, useState, useContext, useRef} from 'react';
import {Image, TouchableOpacity, TextInput, View} from 'react-native';
import {useDebounce} from 'use-debounce';

import {styles} from './index.styles';
import {BackIcon, SearchIcon} from 'assets/svg';
import {useNavigation} from '@react-navigation/native';

export const SearchBar = ({
  value = '',
  txtPlaceholder = '',
  enableOneClickBack = false,
  onChangedText,
  isSearching,
  closeSearch,
  startSearch,
  startSearching,
}: SearchBarProps) => {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput | null>();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  useEffect(() => {
    onChangedText(searchValue);
  }, [debouncedSearchValue]);

  const onChangedValue = val => {
    setSearchValue(val);
  };

  const handleBack = () => {
    if (isSearching && !enableOneClickBack) {
      setSearchValue('');
      closeSearch();
    } else {
      navigation.goBack();
    }
  };

  const handleStartSearch = () => {
    if (!searchValue) return;
    if (inputRef.current) inputRef.current?.blur();
    startSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}></View>
      <View style={styles.content}>
        {
          <TouchableOpacity onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
        }
        <TextInput
          ref={inputRef}
          style={styles.inputSearch}
          onChangeText={val => onChangedValue(val)}
          value={searchValue}
          placeholder={txtPlaceholder}
          placeholderTextColor="rgba(255,255,255,0.5)"
          onPressIn={startSearching}
        />
        <View>
          <TouchableOpacity onPress={handleStartSearch}>
            <SearchIcon isActive={false} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

type SearchBarProps = {
  value: string;
  txtPlaceholder: string;
  enableOneClickBack?: boolean;
  onChangedText: Function;
  isSearching?: boolean;
  closeSearch?: () => void;
  startSearch?: () => void;
  startSearching?: () => void;
};

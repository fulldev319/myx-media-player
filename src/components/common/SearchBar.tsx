/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import {useDebounce} from 'use-debounce';

import Svg, {Path} from 'react-native-svg';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const SearchBar = ({
  value = '',
  txtPlaceholder = '',
  onChangedText,
  style = {},
  theme = '',
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(value);
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);

  useEffect(() => {
    onChangedText(searchValue);
  }, [debouncedSearchValue]);

  const onChangedValue = val => {
    setSearchValue(val);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.inputSearch, theme === 'gray' && {color: 'black'}]}
        onChangeText={val => onChangedValue(val)}
        value={searchValue}
        placeholder={txtPlaceholder}
        placeholderTextColor={
          theme === 'gray' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255,255,255,0.4)'
        }
      />
      <TouchableOpacity>
        <SearchIcon
          isActive={true}
          color={theme === 'gray' ? 'rgba(0, 0, 0, 0.4)' : null}
        />
      </TouchableOpacity>
    </View>
  );
};

type SearchBarProps = {
  value: string;
  txtPlaceholder: string;
  onChangedText: Function;
  style?: any;
  theme?: string;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backgroundContainer: {},
  inputSearch: {
    flex: 1,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    marginRight: 20,
    color: 'white',
  },
});

const SearchIcon = props => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5581 14.5581C14.8021 14.314 15.1979 14.314 15.4419 14.5581L17.9419 17.0581C18.186 17.3021 18.186 17.6979 17.9419 17.9419C17.6979 18.186 17.3021 18.186 17.0581 17.9419L14.5581 15.4419C14.314 15.1979 14.314 14.8021 14.5581 14.5581Z"
      fill={props.color != null ? props.color : 'white'}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.58333 3.125C6.01649 3.125 3.125 6.01649 3.125 9.58333C3.125 13.1502 6.01649 16.0417 9.58333 16.0417C13.1502 16.0417 16.0417 13.1502 16.0417 9.58333C16.0417 6.01649 13.1502 3.125 9.58333 3.125ZM1.875 9.58333C1.875 5.32614 5.32614 1.875 9.58333 1.875C13.8405 1.875 17.2917 5.32614 17.2917 9.58333C17.2917 13.8405 13.8405 17.2917 9.58333 17.2917C5.32614 17.2917 1.875 13.8405 1.875 9.58333Z"
      fill={props.color != null ? props.color : 'white'}
    />
  </Svg>
);

import React, {useRef} from 'react';
import {Image, TouchableOpacity, Platform, View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import {styles} from './index.styles';

export const HeaderBar = () => {
  const actions = ['Profile', 'Log out'];
  const dropDownRef = useRef<SelectDropdown>(null);
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image source={require('assets/images/header_logo.png')} />
      </View>

      <SelectDropdown
        ref={dropDownRef}
        data={actions}
        onSelect={(selectedItem, index) => {
          // console.log(selectedItem, index);
        }}
        defaultButtonText={' '}
        buttonTextAfterSelection={(selectedItem, index) => {
          return '';
        }}
        rowTextForSelection={(selectedItem, index) => {
          return '';
        }}
        buttonStyle={{
          backgroundColor: 'transparent',
          borderColor: 'red',
          width: 60,
        }}
        dropdownStyle={{
          marginTop: 10,
          marginLeft: -120,
          backgroundColor: '#232323',
          paddingHorizontal: 20,
          borderColor: 'red',
          borderRadius: 8,
          width: 180,
        }}
        rowStyle={{
          borderBottomWidth: 0,
        }}
        renderDropdownIcon={() => (
          <LinearGradient colors={['#F6923D', '#F85B2B']} style={styles.avatar}>
            <TouchableOpacity
              onPress={() => {
                dropDownRef?.current?.openDropdown();
              }}>
              <Image
                source={require('assets/sample/artist_image_2.png')}
                style={styles.avatarImg}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </LinearGradient>
        )}
        renderCustomizedRowChild={(item, index) => (
          <Text
            numberOfLines={1}
            allowFontScaling={false}
            style={{
              fontFamily:
                Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: 12,
              textAlign: 'left',
              color: '#FFFFFF',
              borderColor: index === 0 ? '#3D3D3D' : 'transparent',
              marginHorizontal: 0,
              borderBottomWidth: 2,
              height: 50,
              textAlignVertical: 'center',
            }}>
            {item.toString()}
          </Text>
        )}
      />
    </View>
  );
};

type SearchBarProps = {
  value: string;
  onChangedText: Function;
};

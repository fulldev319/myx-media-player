import {useNavigation} from '@react-navigation/native';
import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export const CardUser = ({
  user = null,
  isAction = false,
  style = {},
  onPress,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.normalContainer, style]}
      onPress={() => {
        navigation.navigate('OtherProfilePage', {userId: user.id});
      }}>
      {isAction ? (
        <View style={styles.actionCircle}>
          <PlusIcon />
        </View>
      ) : (
        <View style={styles.circle}>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={
              user.image === ''
                ? getDefaultAvatar()
                : {
                    uri: user.image,
                  }
            }
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  normalContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
  },
  container1: {
    width: 60,
    height: 40,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    padding: 2,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  text: {
    marginTop: 7,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

const PlusIcon = props => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.7087 8.54858C14.1917 8.54858 14.5837 8.94058 14.5837 9.42358V12.8217L17.9862 12.822C18.4692 12.822 18.8612 13.214 18.8612 13.697C18.8612 14.18 18.4692 14.572 17.9862 14.572L14.5837 14.5717V17.9718C14.5837 18.4548 14.1917 18.8467 13.7087 18.8467C13.2257 18.8467 12.8337 18.4548 12.8337 17.9718V14.5717L9.43107 14.572C8.94691 14.572 8.55607 14.18 8.55607 13.697C8.55607 13.214 8.94691 12.822 9.43107 12.822L12.8337 12.8217V9.42358C12.8337 8.94058 13.2257 8.54858 13.7087 8.54858Z"
      fill="#010101"
    />
  </Svg>
);

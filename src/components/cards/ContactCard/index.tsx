import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';

export const ContactCard = ({data, userList, onClicked}: ContactCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onClicked(data.id);
      }}>
      <Image
        source={{
          uri:
            data.imageUrl === '' || data.imageUrl == undefined
              ? 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
              : data.imageUrl,
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{data.name}</Text>
      <Image
        source={
          userList.includes(data.id)
            ? require('./../../../assets/images/pink_selected.png')
            : require('./../../../assets/images/empty.png')
        }
      />
    </TouchableOpacity>
  );
};

type ContactCardProps = {
  data: any;
  userList: Array<any>;
  onClicked: Function;
};

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#F6943E',
  },
  name: {
    flex: 1,
    fontFamily: Platform.OS === 'android' ? "'PP Pangram Sans'" : 'Pangram',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
    marginStart: 16,
  },
});

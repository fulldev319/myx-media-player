import {getDefaultAvatar} from 'helper/userHelpers';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const CardSendChat = ({data, onSendChat}) => {
  return (
    <View style={styles.container}>
      <Image
        source={
          data.image === '' || data.profileImage === ''
            ? getDefaultAvatar()
            : {uri: data.image ? data.image : data.profileImage}
        }
        style={styles.image}
      />
      <View style={styles.songInfoContainer}>
        <Text style={styles.txtName}>{data.name ?? data.username}</Text>
        {/* <Text style={styles.txtDesc}>{''}</Text> */}
      </View>
      <TouchableOpacity
        style={styles.actionSend}
        onPress={() => {
          onSendChat(data.id);
        }}>
        <Text style={styles.txtSend}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CardSendChat;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    // borderRadius: 14,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  songInfoContainer: {
    flex: 1,
    marginStart: 20,
  },
  txtName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  txtDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  actionSend: {
    width: 80,
    height: 30,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  txtSend: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginStart: 4,
  },
});

import {SCREEN_WIDTH} from 'helper/utils';
import React, {useMemo, useRef} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

const CardMessage = ({data}) => {
  const formattedText = useMemo(() => {
    if (data.item.mentions.length > 0) {
      const newText = [];
      const arrWords = data.item.message.split(' ');
      arrWords.forEach(itemWord => {
        if (data.item.mentions.indexOf(itemWord.toLowerCase()) > -1) {
          newText.push(
            <Text style={styles.chatTagText}>{` ${itemWord}`}</Text>,
          );
        } else {
          newText.push(
            <Text style={styles.chatNormalText}>{` ${itemWord}`}</Text>,
          );
        }
      });

      return newText;
    } else {
      return <Text style={styles.chatNormalText}>{data.item.message}</Text>;
    }
  }, []);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Image
          source={{
            uri:
              data.item.from.image === ''
                ? 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                : data.item.from.image,
          }}
          style={styles.senderImage}
        />
        <View style={{marginStart: 14}}>
          <Text style={styles.senderName}>{data.item.from.name}</Text>
          {renderText()}
        </View>
      </View>
    );
  };

  const renderText = () => {
    return (
      <View style={styles.textView}>
        <Text>{formattedText}</Text>
      </View>
    );
  };

  const renderAudio = () => {
    return <View></View>;
  };

  const renderMedia = () => {
    return (
      <View style={{marginStart: 38}}>
        <View style={styles.chatMediaView}>
          <View style={{flex: 0.45, height: '100%'}}>
            {data.item.mediaUrls.length > 1 && (
              <Image
                source={{
                  uri: data.item.mediaUrls[1],
                }}
                style={[StyleSheet.absoluteFill, {borderRadius: 12}]}
                resizeMode="cover"
              />
            )}
          </View>
          <View
            style={{
              flex: 0.55,
              height: '100%',
              marginStart: 8,
            }}>
            {data.item.mediaUrls.length > 0 && (
              <Image
                source={{
                  uri: data.item.mediaUrls[0],
                }}
                style={[StyleSheet.absoluteFill, {borderRadius: 12}]}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={[styles.body]}>
        {renderHeader()}
        {renderAudio()}
        {data.item.mediaUrls.length > 0 && renderMedia()}
      </TouchableOpacity>
    </View>
  );
};

export default CardMessage;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  body: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
  },
  senderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  senderName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  agoTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  textView: {
    flex: 1,
    marginTop: 5,
    marginStart: -2,
    marginEnd: 24,
  },
  chatNormalText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  chatTagText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    color: 'white',
  },
  chatMediaView: {
    width: '100%',
    height: 120,
    flexDirection: 'row',
    marginTop: 12,
  },
  seeMoreTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
});

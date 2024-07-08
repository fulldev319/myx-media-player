import {getDefaultAvatar} from 'helper/userHelpers';
import {SCREEN_WIDTH} from 'helper/utils';
import React, {useMemo, useRef} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

const CardDiscussion = ({data}) => {
  const formattedText = useMemo(() => {
    if (data.hashTags.length > 0) {
      const newText = [];
      const arrWords = data.message.split(' ');

      arrWords.forEach(itemWord => {
        if (data.hashTags.indexOf(itemWord) > -1) {
          newText.push(
            <Text style={styles.chatTagText}>{` #${itemWord}`}</Text>,
          );
        } else {
          newText.push(
            <Text style={styles.chatNormalText}>{` ${itemWord}`}</Text>,
          );
        }
      });

      return newText;
    } else {
      return <Text style={styles.chatNormalText}>{data.message}</Text>;
    }
  }, []);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Image
          source={
            data.from.image === ''
              ? getDefaultAvatar()
              : {
                  uri: data.from.image,
                }
          }
          style={styles.senderImage}
        />
        <View style={{marginStart: 14}}>
          <Text style={styles.senderName}>{data.from.name}</Text>
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
            {data.mediaUrls.length > 1 && (
              <Image
                source={{
                  uri: data.mediaUrls[1],
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
            {data.mediaUrls.length > 0 && (
              <Image
                source={{
                  uri: data.mediaUrls[0],
                }}
                style={[StyleSheet.absoluteFill, {borderRadius: 12}]}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
        {data.mediaUrls.length > 2 && (
          <Text style={styles.seeMoreTxt}>See more</Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={[styles.body]}>
        {renderHeader()}
        {renderAudio()}
        {data.mediaUrls.length > 0 && renderMedia()}
      </TouchableOpacity>
    </View>
  );
};

export default CardDiscussion;

const styles = StyleSheet.create({
  container: {
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
    color: 'rgba(255, 255, 255, 1)',
  },
  chatTagText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    color: '#FF6651',
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

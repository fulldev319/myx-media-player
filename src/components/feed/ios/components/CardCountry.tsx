/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Lightning from 'assets/svg/LightningIcon';

import {styles} from '../index.styles';
import {apiPostJoinCountry, apiPostUndoJoinCountry} from 'helper/mapHelper';
import {SelectColorSheet} from '.';
import WheelView from 'components/AudioWheels/WheelView';
import moment from 'moment';

const CardTrendingCountry = ({item}) => {
  const isMember = item.isMember === 1 ? true : false;
  const [isJoined, setIsJoined] = useState(isMember);
  const [isLoading, setIsLoading] = useState(false);
  const [showSelectColor, setShowSelectColor] = useState(false);

  const onJoin = async color => {
    setShowSelectColor(false);
    const countryId = item.country;

    setIsLoading(true);
    const res = await apiPostJoinCountry(countryId, color);

    if (res.success) {
      setIsJoined(true);
    }
    setIsLoading(false);
  };

  const onLeave = async () => {
    setIsLoading(true);

    const countryId = item.country;
    const res = await apiPostUndoJoinCountry(countryId);

    if (res.sucess) {
      setIsJoined(false);
    }

    setIsLoading(false);
  };

  const renderSelectColor = () => {
    return (
      <SelectColorSheet
        show={showSelectColor}
        onClose={() => setShowSelectColor(false)}
        onContinue={color => {
          onJoin(color);
        }}
      />
    );
  };

  return (
    <View style={ownStyles.container}>
      <View style={[styles.flexRow, ownStyles.subContainer]}>
        {item.audios.slice(0, 3).map((audio, idx) => (
          <View style={ownStyles.flexCenter} key={idx}>
            <WheelView
              data={{
                inner_image: audio.image,
                middle_colour:
                  audio.duration > 300 ? 'L' : audio.duration < 30 ? 'S' : 'M',
                middle_speed: 2000,
                outer_yes: audio.yes,
                outer_no: audio.no,
                outer_speed: 3000,
                outer_emoji: audio.emolike,
              }}
              hideTopic
              hideLabel
              hideDuration
            />
            <Text style={styles.subTitle1}>
              {Array.isArray(audio.keywords)
                ? audio.keywords[0]
                : audio.keywords.split(',').length > 0
                ? audio.keywords.split(',')[0]
                : audio.keywords}
            </Text>
            <Text
              style={[styles.subTitle1, {color: '#ffffff40', marginTop: 4}]}>
              {moment.utc(audio.duration * 1000).format('mm:ss')}
            </Text>
          </View>
        ))}
      </View>
      <View
        style={[styles.flexRow, {paddingVertical: 12, paddingHorizontal: 8}]}>
        <View style={styles.flexRow}>
          <View style={ownStyles.lightBg}>
            <Lightning />
          </View>
          <View>
            <Text style={styles.subTitle7}>{item.name}</Text>
            <Text style={[styles.subTitle1, {color: '#ffffff40'}]}>
              {item.population} citizens
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={ownStyles.btnJoin}
          onPress={() => {
            if (!isLoading) {
              if (isJoined) {
                onLeave();
              } else {
                setShowSelectColor(true);
              }
            }
          }}>
          {isLoading ? (
            <ActivityIndicator color={'white'} size={10} />
          ) : (
            <Text style={styles.subTitle1}>
              {isJoined ? 'LEAVE' : 'JOIN NOW'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {renderSelectColor()}
    </View>
  );
};

export default CardTrendingCountry;

const ownStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginRight: 12,
  },
  subContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageView: {
    backgroundColor: 'rgba(47, 155, 255, 0.3)',
    borderColor: '#2F9BFF',
    borderWidth: 0.5,
    borderRadius: 40,
    width: 61,
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  imageBgView: {
    backgroundColor: 'rgba(255, 165, 31, 0.3)',
    borderColor: '#FFA51F',
    borderWidth: 0.5,
    borderRadius: 40,
    width: 61,
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  imageBgView2: {
    backgroundColor: 'rgba(8, 184, 131, 0.3)',
    borderColor: '#08B883',
    borderWidth: 0.5,
    borderRadius: 40,
    width: 61,
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  lightBg: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6651',
    borderRadius: 40,
    marginRight: 5,
  },
  btnJoin: {
    width: 70,
    paddingVertical: 5,
    backgroundColor: '#FF6651',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexCenter: {
    alignItems: 'center',
  },
});

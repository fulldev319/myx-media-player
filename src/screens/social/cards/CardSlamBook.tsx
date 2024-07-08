import {
  SmallGrayChatIcon,
  SmallGrayMemberIcon,
  SmallGrayStarIcon,
} from 'assets/svg';
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

const CardSlamBook = ({data, onDetail}) => {
  const getMainImage = () => {
    if (data.images.length === 0) {
      return 'https://thumbs.dreamstime.com/b/forest-panorama-rays-sunlight-scenic-fresh-green-deciduous-trees-sun-casting-its-light-foliage-53826213.jpg';
    } else {
      return data.images[0];
    }
  };

  const getExtraImage1 = () => {
    if (data.images.length === 0) {
      return 'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg';
    } else if (data.images.length === 1) {
      return data.images[0];
    } else {
      return data.images[1];
    }
  };

  const getExtraImage2 = () => {
    if (data.images.length === 0) {
      return 'https://thumbs.dreamstime.com/b/forest-path-panorama-25795025.jpg';
    } else if (data.images.length === 1) {
      return data.images[0];
    } else if (data.images.length === 2) {
      return data.images[1];
    } else {
      return data.images[2];
    }
  };

  const getExtraImage3 = () => {
    if (data.images.length === 0) {
      return 'https://thumbs.dreamstime.com/b/summer-sunny-forest-trees-green-grass-nature-wood-sunlight-background-instant-toned-image-53353502.jpg';
    } else if (data.images.length === 1) {
      return data.images[0];
    } else if (data.images.length === 2) {
      return data.images[1];
    } else if (data.images.length === 3) {
      return data.images[2];
    } else {
      return data.images[3];
    }
  };

  const getExtraImage4 = () => {
    if (data.images.length === 0) {
      return 'https://thumbs.dreamstime.com/b/panoramic-autumn-landscape-forest-stream-fall-nature-backg-sunny-day-background-79856609.jpg';
    } else if (data.images.length === 1) {
      return data.images[0];
    } else if (data.images.length === 2) {
      return data.images[1];
    } else if (data.images.length === 3) {
      return data.images[2];
    } else if (data.images.length === 4) {
      return data.images[3];
    } else {
      return data.images[4];
    }
  };

  const renderMediaView = () => {
    return (
      <View style={styles.mediaView}>
        <View style={styles.mainMediaView}>
          <Image
            source={{
              uri: getMainImage(),
            }}
            resizeMode={'cover'}
            style={[StyleSheet.absoluteFill, {borderTopLeftRadius: 12}]}
          />
        </View>
        <View style={styles.extraMediaView}>
          <View style={styles.extraRow}>
            <View style={styles.extraColumn}>
              <Image
                source={{
                  uri: getExtraImage1(),
                }}
                resizeMode={'cover'}
                style={[StyleSheet.absoluteFill]}
              />
            </View>
            <View style={styles.extraColumn}>
              <Image
                source={{
                  uri: getExtraImage2(),
                }}
                resizeMode={'cover'}
                style={[StyleSheet.absoluteFill, {borderTopRightRadius: 12}]}
              />
            </View>
          </View>
          <View style={styles.extraRow}>
            <View style={styles.extraColumn}>
              <Image
                source={{
                  uri: getExtraImage3(),
                }}
                resizeMode={'cover'}
                style={[StyleSheet.absoluteFill]}
              />
            </View>
            <View style={styles.extraColumn}>
              <Image
                source={{
                  uri: getExtraImage4(),
                }}
                resizeMode={'cover'}
                style={[StyleSheet.absoluteFill]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderInfoView = () => {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.titleTxt}>{data.title}</Text>
        <View style={styles.extraInfoContainer}>
          <View style={styles.extraInfoItem}>
            <SmallGrayStarIcon />
            <Text style={styles.extraInfoTxt}>{data.topics} topics</Text>
          </View>
          <View style={styles.extraInfoItem}>
            <SmallGrayMemberIcon />
            <Text style={styles.extraInfoTxt}>{data.members} members</Text>
          </View>
          <View style={styles.extraInfoItem}>
            <SmallGrayChatIcon />
            <Text style={styles.extraInfoTxt}>
              {data.discussions} discussions
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.root} onPress={() => onDetail(data)}>
      {renderMediaView()}
      {renderInfoView()}
    </TouchableOpacity>
  );
};

export default CardSlamBook;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: 240,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  titleTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    color: 'white',
  },
  mediaView: {
    width: '100%',
    height: 160,
    flexDirection: 'row',
  },
  mainMediaView: {
    flex: 0.45,
  },
  extraMediaView: {
    flex: 0.55,
  },
  extraRow: {
    flex: 1,
    height: '50%',
    flexDirection: 'row',
  },
  extraColumn: {
    flex: 1,
    height: '100%',
  },
  infoContainer: {
    marginTop: 12,
  },
  extraInfoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  extraInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraInfoTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginStart: 6,
  },
});

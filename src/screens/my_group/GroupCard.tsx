import {generateComponentKey, getArrFromString} from 'helper/utils';
import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export interface GroupItem {
  id: number;
  name: string;
  mediaTypes?: string;
  mediaUrls?: string;
  user_ids?: string;
  usernames?: string;
  user_images?: string;
  timestamps?: string;
  is_reply?: string;
  country_names?: string;
  is_debate?: string;
  debates?: string;
}

export interface GroupCardProps {
  index: number;
  data: GroupItem;
  onPress?: () => void;
}

export const GroupCard = ({index, data, onPress}: GroupCardProps) => {
  const showImageList = useMemo(() => {
    const arrMedia = getArrFromString(data.mediaUrls);
    const arrConverted = arrMedia.map((item, index) => {
      const mediaUrl = getArrFromString(item ?? '', ',');

      if (mediaUrl.length > 0) {
        return mediaUrl[0];
      } else {
        return '';
      }
    });

    return arrConverted;
  }, [data]);

  const showCountryList = useMemo(() => {
    if (data?.mediaUrls) {
      if (data?.mediaUrls.length > 3) {
        return data?.mediaUrls.slice(0, 3);
      } else {
        return data?.mediaUrls;
      }
    } else {
      return [];
    }
  }, [data]);

  const moreCountryCount = useMemo(() => {
    if (data?.mediaUrls) {
      if (data?.mediaUrls.length > 3) {
        return data?.mediaUrls.length - 3;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }, [data]);

  return (
    <View style={[styles.container, index % 2 === 0 && {marginRight: 11}]}>
      {showImageList.length > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{minHeight: 135}}>
          {showImageList?.map((item, _) => {
            if (item === '') {
              return <View style={styles.itemImage} />;
            } else {
              return (
                <Image
                  source={{uri: item}}
                  style={styles.itemImage}
                  key={`group_image_${generateComponentKey()}`}
                />
              );
            }
          })}
        </ScrollView>
      ) : (
        <View style={styles.defaultImageView} />
      )}

      <TouchableOpacity onPress={onPress} style={styles.info}>
        <Text style={styles.text} ellipsizeMode={'tail'} numberOfLines={1}>
          {data?.name}
        </Text>
        <View style={styles.countries}>
          <View style={styles.countryWrap}>
            <Image style={styles.country} />
          </View>
          <View style={styles.countryWrap}>
            <Image style={styles.country} />
          </View>
          <View style={styles.countryWrap}>
            <Image style={styles.country} />
          </View>
          <View style={styles.moreWrap}>
            <Text style={styles.moreText}>+2</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 16,
    padding: 6,
    backgroundColor: '#25272d',
    marginBottom: 15,
  },
  info: {
    alignItems: 'center',
    marginTop: 7,
  },
  text: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
  },
  countries: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  countryWrap: {
    width: 22,
    height: 22,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 4,
    backgroundColor: '#ffffff50',
  },
  country: {
    width: '100%',
    height: '100%',
  },
  moreWrap: {
    width: 22,
    height: 22,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff50',
  },
  moreText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 9,
    color: 'white',
  },
  itemImage: {
    width: 135,
    height: 135,
    borderRadius: 10,
    backgroundColor: 'grey',
    marginRight: 7,
  },
  defaultImageView: {
    width: '100%',
    height: 135,
    backgroundColor: 'black',
    borderRadius: 10,
  },
});

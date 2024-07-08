import {MemeberGroup} from 'components/memberGroup';
import {SCREEN_WIDTH} from 'helper/utils';
import React from 'react';
import {View, StyleSheet, Image, Text, ViewStyle} from 'react-native';

interface CardCountryProps {
  data: any;
  containerStyle?: ViewStyle;
}

export const CardCountry = (props: CardCountryProps) => {
  const {data, containerStyle} = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[StyleSheet.absoluteFill, styles.bgBody]}>
        <View style={styles.bgTopView}>
          <Image
            source={{
              uri:
                data.image === null || data.image === '' || data.image === 'url'
                  ? 'https://thumbs.dreamstime.com/b/forest-panorama-rays-sunlight-scenic-fresh-green-deciduous-trees-sun-casting-its-light-foliage-53826213.jpg'
                  : data.image,
            }}
            style={styles.bgTopImage}
          />
        </View>
        <View style={styles.bgBottomView}></View>
      </View>
      <View style={styles.mainBody}>
        <MemeberGroup isDummy={true} />
        <View style={styles.mainInfoView}>
          <Text style={styles.txtCountryTitle}>{data.name}</Text>
          <Text style={styles.txtCountryDesc}>12 citizen</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH / 2 - 35,
    height: 200,
    backgroundColor: '#F3F4F5',
    borderRadius: 16,
    marginBottom: 16,
  },
  bgBody: {},
  bgTopView: {
    flex: 1,
  },
  bgTopImage: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bgBottomView: {
    width: '100%',
    height: 40,
  },
  mainBody: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 0,
    margin: 8,
  },
  mainInfoView: {
    height: 60,
    borderRadius: 16,
    backgroundColor: 'white',
    marginRight: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  txtCountryTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  txtCountryDesc: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    opacity: 0.6,
  },
});

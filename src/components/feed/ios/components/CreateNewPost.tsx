import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {CalendarIcon, MicIcon, RightArrowIcon} from '../assets/svgs';

const CreateNewPost = ({onMakeScrap, onRecording}) => {
  return (
    <View>
      <TouchableOpacity onPress={onMakeScrap} style={styles.item}>
        <View style={{flex: 1, paddingRight: 30}}>
          <View style={styles.rowItem}>
            <CalendarIcon />
            <Text style={styles.cateTxt}>Make scrap-note first?</Text>
          </View>
          <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consecteturadipiscing elit ut dictum.
          </Text>
        </View>
        <RightArrowIcon color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onRecording}
        style={[styles.item, {borderBottomColor: 'transparent'}]}>
        <View style={{flex: 1, paddingRight: 30}}>
          <View style={styles.rowItem}>
            <MicIcon />
            <Text style={styles.cateTxt}>Go to Recording</Text>
          </View>
          <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consecteturadipiscing elit ut dictum.
          </Text>
        </View>
        <RightArrowIcon color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default CreateNewPost;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#00000020',
    borderBottomWidth: 1,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cateTxt: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  desc: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 19.2,
    color: 'black',
    opacity: 0.4,
    marginTop: 6,
  },
});

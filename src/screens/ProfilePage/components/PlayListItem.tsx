import {useNavigation} from '@react-navigation/native';
import {PlaylistCard} from 'components/cards/PlaylistCard';
import React, {useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Swipeable from 'react-native-swipeable-row';

export const PlayListItem = ({item, onDelete, onEdit}) => {
  const {navigate} = useNavigation();
  const swipeRef = useRef<Swipeable>();
  const rightButtons = [
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[styles.bgAction, styles.edit]}
        onPress={() => {
          swipeRef?.current?.recenter();
          onEdit();
        }}>
        <EditIcon />
        <Text style={styles.txtAction}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.bgAction, styles.delete]}
        onPress={() => {
          swipeRef?.current?.recenter();
          onDelete();
        }}>
        <DeleteIcon />
        <Text style={styles.txtAction}>Delete</Text>
      </TouchableOpacity>
    </View>,
  ];

  return (
    <Swipeable
      ref={swipeRef}
      style={styles.root}
      rightButtons={rightButtons}
      useNativeDriver={true}
      rightButtonWidth={136}>
      <TouchableOpacity
        onPress={() => {
          navigate('TrackPlayListPage', {playlistId: item.id});
        }}>
        <PlaylistCard item={item} />
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    height: '100%',
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
  },
  bgAction: {
    width: 68,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  edit: {
    backgroundColor: '#FF6651',
  },
  delete: {
    backgroundColor: '#FFFFFF33',
  },
  txtAction: {
    marginTop: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
  },
});

const EditIcon = props => (
  <Svg
    width={20}
    height={21}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M10 17.1667H17.5"
      stroke="white"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.75 3.41669C14.0815 3.08517 14.5312 2.89893 15 2.89893C15.2321 2.89893 15.462 2.94465 15.6765 3.03349C15.891 3.12233 16.0858 3.25254 16.25 3.41669C16.4142 3.58084 16.5444 3.77572 16.6332 3.9902C16.722 4.20467 16.7678 4.43455 16.7678 4.66669C16.7678 4.89884 16.722 5.12871 16.6332 5.34319C16.5444 5.55766 16.4142 5.75254 16.25 5.91669L5.83333 16.3334L2.5 17.1667L3.33333 13.8334L13.75 3.41669Z"
      stroke="white"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DeleteIcon = props => (
  <Svg
    width={20}
    height={21}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M2.5 5.5H4.16667H17.5"
      stroke="white"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.8333 5.50002V17.1667C15.8333 17.6087 15.6577 18.0326 15.3451 18.3452C15.0326 18.6578 14.6087 18.8334 14.1666 18.8334H5.83329C5.39127 18.8334 4.96734 18.6578 4.65478 18.3452C4.34222 18.0326 4.16663 17.6087 4.16663 17.1667V5.50002M6.66663 5.50002V3.83335C6.66663 3.39133 6.84222 2.9674 7.15478 2.65484C7.46734 2.34228 7.89127 2.16669 8.33329 2.16669H11.6666C12.1087 2.16669 12.5326 2.34228 12.8451 2.65484C13.1577 2.9674 13.3333 3.39133 13.3333 3.83335V5.50002"
      stroke="white"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

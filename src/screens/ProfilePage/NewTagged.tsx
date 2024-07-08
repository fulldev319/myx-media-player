import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
} from 'react-native';

import * as Progress from 'react-native-progress';
import {BackIcon, MediaSelectedIcon, WhiteCloseIcon} from 'assets/svg';
import Svg, {G, Path} from 'react-native-svg';
import {RootState} from 'redux/interfaces';
import {useDispatch, useSelector} from 'react-redux';
import {apiGetTaggedRequest} from './../../helper/userHelpers';
import {
  apiAcceptTaggedRequest,
  apiRemoveTaggedRequest,
} from './../../helper/memoryHelpers';
import {timeSince} from 'helper/utils';
import profileActions from 'redux/profile/actions';

const NewTaggedPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);

  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [arrTagged, setArrTagged] = useState([]);
  const [arrSelected, setArrSelected] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      const res = await apiGetTaggedRequest(user.id, lastId);
      if (res.success) {
        setArrTagged(res.data);
        setLastId(res.lastId);
        setHasMore(res.hasMore);
      }
    }
    setIsLoading(false);
  };

  const onCancelEditing = () => {
    setIsEditing(false);
    setArrSelected([]);
  };

  const onClickedItem = data => {
    if (isEditing) {
      const isExisted = arrSelected.includes(data.id);
      if (isExisted) {
        setArrSelected(prevState => {
          const arrNew = prevState.filter((item, index) => item !== data.id);
          return arrNew;
        });
      } else {
        setArrSelected(prevState => [...prevState, data.id]);
      }
    } else {
      if (data.type === 'slambook') {
        navigation.navigate('SlamBookDetailPage', {
          id: data.id,
          slambook: data.title,
        });
      }
    }
  };

  const onAcceptTag = async itemId => {
    setShowLoading(true);

    const params = {
      tagIds: [itemId],
      acceptAll: true,
    };

    const res = await apiAcceptTaggedRequest(params);

    if (res.success) {
      refreshTaggedCount();
      setArrTagged(prevState => {
        const arrNew = prevState.filter((item, index) => item.id !== itemId);
        return arrNew;
      });
    }
    setShowLoading(false);
  };

  const onRemoveTag = async itemId => {
    setShowLoading(true);

    const params = {
      tagIds: [itemId],
      acceptAll: true,
    };
    const res = await apiRemoveTaggedRequest(params);

    if (res.success) {
      refreshTaggedCount();
      setArrTagged(prevState => {
        const arrNew = prevState.filter((item, index) => item.id !== itemId);
        return arrNew;
      });
    }
    setShowLoading(false);
  };

  const onAcceptAllTag = async () => {
    setShowLoading(true);

    const params = {
      tagIds: arrSelected,
      acceptAll: true,
    };
    const res = await apiAcceptTaggedRequest(params);

    if (res.success) {
      refreshTaggedCount();
      arrSelected.map((itemId, index) => {
        setArrTagged(prevState => {
          const arrNew = prevState.filter((item, index) => item.id !== itemId);
          return arrNew;
        });
      });

      setIsEditing(false);
    }
    setShowLoading(false);
  };

  const onRemoveAllTag = async () => {
    setShowLoading(true);

    const params = {
      tagIds: arrSelected,
      acceptAll: true,
    };
    const res = await apiRemoveTaggedRequest(params);

    if (res.success) {
      refreshTaggedCount();
      arrSelected.map((itemId, index) => {
        setArrTagged(prevState => {
          const arrNew = prevState.filter((item, index) => item.id !== itemId);
          return arrNew;
        });
      });

      setIsEditing(false);
    }
    setShowLoading(false);
  };

  const refreshTaggedCount = () => {
    dispatch(profileActions.refreshTaggedRequestCount(user.id));
  };

  const renderMultiAction = () => {
    return (
      <View style={styles.multiActionContainer}>
        <TouchableOpacity
          style={styles.bulkWhiteActionBtn}
          onPress={onAcceptAllTag}>
          <Text style={[styles.actionBtnText, {color: 'black'}]}>
            Accept All
          </Text>
        </TouchableOpacity>
        <View style={{width: 8}} />
        <TouchableOpacity
          style={styles.bulkBlackActionBtn}
          onPress={onRemoveAllTag}>
          <Text style={styles.actionBtnText}>Remove Me</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {isEditing ? (
        <View style={styles.header}>
          <View style={styles.selectedHeader}>
            <TouchableOpacity onPress={onCancelEditing}>
              <WhiteCloseIcon />
            </TouchableOpacity>
            <Text style={styles.selectedTitle}>
              {arrSelected.length} selected
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <BackIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            {!isEditing && arrTagged.length > 0 ? (
              <EnabledSelectIcon />
            ) : (
              <DisabledSelectIcon />
            )}
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title}>New Tagged</Text>
        <View style={styles.divider} />
        {arrTagged.length > 0 ? (
          <View>
            <FlatList
              data={arrTagged}
              renderItem={({item, index}) => {
                return (
                  <NewTaggedCard
                    data={item}
                    isEditing={isEditing}
                    onPressed={onClickedItem}
                    onAccept={onAcceptTag}
                    onRemove={onRemoveTag}
                  />
                );
              }}
              keyExtractor={item => `${item.id}_${item.id}`}
            />
          </View>
        ) : (
          <View style={styles.empty}>
            <Image
              source={require('./../../assets/images/no_friends_icon.png')}
            />
            <Text style={styles.emptyText}>No new tag</Text>
          </View>
        )}
      </View>
      {isEditing && arrSelected.length > 0 && renderMultiAction()}
      {showLoading && (
        <View style={styles.loadingContainer}>
          <Progress.Circle
            size={80}
            indeterminate={true}
            borderWidth={5}
            color={'rgba(255, 102, 81, 1)'}
            thickness={20}
          />
        </View>
      )}
    </View>
  );
};

export default NewTaggedPage;

const NewTaggedCard = ({data, isEditing, onPressed, onAccept, onRemove}) => {
  const [isSelected, setIsSelected] = useState(false);
  const agoTime = timeSince(data.createdAt) + ' ago';

  useEffect(() => {
    setIsSelected(false);
  }, [isEditing]);

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        if (isEditing) {
          setIsSelected(!isSelected);
        }
        onPressed(data);
      }}>
      <View style={styles.mainBody}>
        {isEditing && (
          <View style={styles.editStatus}>
            {isSelected ? (
              <MediaSelectedIcon />
            ) : (
              <View style={styles.defaultSelectIcon} />
            )}
          </View>
        )}
        <View style={{flex: 1}}>
          <View>
            <Text style={styles.txtAgo}>{agoTime}</Text>
          </View>
          <Text style={[styles.txtDesc, {marginEnd: 10}]}>
            <Text style={styles.highlightDesc} onPress={() => {}}>
              {`@${data.creator.name}`}
            </Text>
            <Text style={[styles.normalDesc]}>
              {' '}
              just tagged you in a{' '}
              {data.type === 'slambook' ? 'slambook' : 'memory'} along with{' '}
              {data.taggedNumber} others
            </Text>
          </Text>
        </View>
        <Image
          source={{
            uri: data.creator.image,
          }}
          style={styles.trackImage}
        />
      </View>
      {!isEditing && (
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity
            style={styles.whiteActionBtn}
            onPress={() => onAccept(data.id)}>
            <Text style={[styles.actionBtnText, {color: 'black'}]}>
              Accept Tag
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.blackActionBtn}
            onPress={() => onRemove(data.id)}>
            <Text style={styles.actionBtnText}>Remove Me</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.itemDivider} />
    </TouchableOpacity>
  );
};

const EnabledSelectIcon = () => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></Path>
    </Svg>
  );
};

const DisabledSelectIcon = () => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <G
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        opacity="0.3">
        <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></Path>
      </G>
    </Svg>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 20,
  },
  header: {
    marginVertical: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 28,
    color: 'white',
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTitle: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
    marginStart: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 40,
  },
  itemContainer: {
    flex: 1,
    width: '100%',
    marginTop: 40,
  },
  itemDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 16,
  },
  mainBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  txtAgo: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: 10,
    opacity: 0.6,
  },
  txtDesc: {
    flexDirection: 'row',
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
  },
  normalDesc: {
    color: 'white',
    fontSize: 12,
    opacity: 0.6,
    paddingHorizontal: 5,
    fontFamily: 'Poppins-Regular',
  },
  highlightDesc: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  trackImage: {
    width: 68,
    height: 68,
    borderRadius: 8,
  },
  item: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 20,
  },
  whiteActionBtn: {
    width: 115,
    height: 27,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginEnd: 6,
  },
  blackActionBtn: {
    width: 115,
    height: 27,
    borderRadius: 27,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginEnd: 6,
  },
  bulkWhiteActionBtn: {
    flex: 1,
    height: 45,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bulkBlackActionBtn: {
    flex: 1,
    height: 45,
    borderRadius: 45,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginEnd: 6,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  actionBtnText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
  },
  editStatus: {
    marginEnd: 16,
  },
  defaultSelectIcon: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 20,
  },
  multiActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const dummyData = [
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4},
  {id: 5},
  {id: 6},
  {id: 7},
  {id: 8},
  {id: 9},
  {id: 10},
];

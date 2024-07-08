import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {apiGengreLike, apiGetGenres} from 'helper/genreHelpers';
import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ContentLoader, {Circle, Rect} from 'react-content-loader/native';
import * as Progress from 'react-native-progress';

const OnboardingSelectGenresPage = () => {
  const navigation = useNavigation();
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [arrGenres, setArrGenres] = useState([]);
  const [arrSelected, setArrSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    loadLocalSavedData();
    loadData();
  }, []);

  const loadLocalSavedData = async () => {
    const savedData = await AsyncStorage.getItem('@onboardingGrenres');
    if (savedData) {
      setArrSelected(savedData.split(','));
    }
  };

  const saveLocalSavedData = async () => {
    await AsyncStorage.setItem('@onboardingGrenres', arrSelected.toString());
  };

  const loadData = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      const res = await apiGetGenres(lastId, 24);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrGenres(prev => [...prev, ...res.data]);
      }
      setIsLoading(false);
    }
  };

  const onSelected = async item => {
    setArrSelected(prev => [...prev, ...[item]]);
  };

  const onDeselect = async selectedItem => {
    const filteredArr = arrSelected.filter(
      (item, index) => item !== selectedItem,
    );

    setArrSelected(filteredArr);
  };

  const onContinue = async () => {
    setShowLoading(true);
    const res = await apiGengreLike(arrSelected);
    setShowLoading(false);
    if (res.success) {
      await saveLocalSavedData();
      await AsyncStorage.setItem('@onboardingStep', 'artist');
      navigation.navigate('OnboardingSelectArtistsPage');
    }
  };

  const groupArr = (data, n) => {
    var group = [];
    for (var i = 0, j = 0; i < data.length; i++) {
      if (i >= n && i % n === 0) j++;
      group[j] = group[j] || [];
      group[j].push(data[i]);
    }
    return group;
  };

  const renderLoadMoreSkeleton = () => {
    return (
      <View style={{marginTop: 30}}>
        {Array(6)
          .fill(0)
          .map(item => {
            return (
              <View
                style={{
                  width: 180,
                  height: 53,
                  justifyContent: 'center',
                  paddingTop: 40,
                  borderRadius: 16,
                  marginEnd: 8,
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                }}>
                <ContentLoader
                  speed={0.6}
                  width={'100%'}
                  height={53}
                  viewBox="0 0 400 160"
                  backgroundColor={'#333'}
                  foregroundColor={'#999'}>
                  <Rect x="0" y="0" rx="3" ry="3" width="70%" height="5" />
                  <Rect x="0" y="15" rx="3" ry="3" width="60%" height="5" />
                  <Rect x="0" y="30" rx="3" ry="3" width="60%" height="5" />
                  <Rect x="0" y="45" rx="3" ry="3" width="30%" height="5" />
                </ContentLoader>
              </View>
            );
          })}
      </View>
    );
  };

  const renderStartSkeleton = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        {renderLoadMoreSkeleton()}
        {renderLoadMoreSkeleton()}
        {renderLoadMoreSkeleton()}
      </View>
    );
  };

  const renderItems = () => {
    const groupList = groupArr(arrGenres, 6);

    return (
      <View
        style={[
          styles.content,
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
          },
        ]}>
        {groupList.map((itemList, index) => {
          return (
            <View>
              {itemList.map((item, index) => {
                const isSelected = arrSelected.filter(
                  (selectedItem, index) => item === selectedItem,
                );

                return (
                  <TouchableOpacity
                    style={{
                      width: 180,
                      height: 53,
                      justifyContent: 'center',
                      padding: 16,
                      borderRadius: 16,
                      backgroundColor:
                        isSelected.length > 0
                          ? '#FF6651'
                          : 'rgba(255, 255, 255, 0.15)',
                      marginEnd: 8,
                      marginTop: 10,
                    }}
                    onPress={() =>
                      isSelected.length > 0
                        ? onDeselect(item)
                        : onSelected(item)
                    }>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: 14,
                        color: '#FFFFFF',
                        opacity: isSelected.length > 0 ? 1 : 0.6,
                        textAlign: 'center',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <View style={[styles.root]}>
        <View style={styles.progressView}>
          <View style={styles.activeProgress}></View>
        </View>
        <Text style={styles.txtHelpUs}>Help us get to know you</Text>
        <Text style={styles.txtSelect}>
          Select your favorite {'\n'}music genres
        </Text>
        <ScrollView
          ref={scrollRef}
          horizontal
          style={{
            flex: 1,
          }}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              loadData();
            }
          }}
          scrollEventThrottle={500}>
          <View style={{flexDirection: 'row', paddingEnd: 200}}>
            {renderItems()}
            {isLoading && arrGenres.length != 0 && renderLoadMoreSkeleton()}
            {isLoading && arrGenres.length == 0 && renderStartSkeleton()}
          </View>
        </ScrollView>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={() => {
              onContinue();
            }}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 0.9}}
              colors={['#ff3f3f', '#ff701f']}
              style={[StyleSheet.absoluteFill, styles.btnBgEffect]}>
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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

export default OnboardingSelectGenresPage;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.width + contentOffset.x >=
    contentSize.width - paddingToBottom
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    paddingTop: 60,
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
  progressView: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 1,
    marginHorizontal: 34,
  },
  activeProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#FF6651',
    borderRadius: 1,
  },
  txtHelpUs: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 40,
  },
  txtSelect: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 36,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  actionContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 34,
  },
  btnContainer: {
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBgEffect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27,
    borderWidth: 0,
  },
  btnSubmit: {
    width: '100%',
    height: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 27,
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginTop: 30,
    marginBottom: 200,
  },
});

import {PlusWithoutBorderIcon} from 'assets/svg';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import CardSlamBook from './cards/CardSlamBook';
import {useNavigation} from '@react-navigation/native';
import {apiCreateSlamBook, apiGetSlamBooks} from 'helper/slambookHelper';
import {CommonSkeleton} from 'components/common/Skeleton';
import SwitchToggle from 'react-native-switch-toggle';

const SlamBookPage = () => {
  const navigation = useNavigation();

  const createSlamBookSheetRef = useRef<BottomSheetModal>(null);
  const snapPointsCreateSlamBook = useMemo(() => [375, 375], []);

  const [arrSlamBook, setArrSlamBook] = useState([]);
  const [isOpenedSheet, setIsOpenedSheet] = useState(false);
  const [text, setText] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isRecentLoading, setIsRecentLoading] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showPlaceHolder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initData();
    });
    return unsubscribe;
  }, [navigation]);

  const initData = async () => {
    setIsRecentLoading(true);
    const res = await apiGetSlamBooks(null);

    if (res.success) {
      setHasMore(res.hasMore);
      setLastId(res.lastId);
      setArrSlamBook(res.data);
    }
    setIsRecentLoading(false);
  };

  const loadData = async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      const res = await apiGetSlamBooks(lastId);

      if (res.success) {
        setHasMore(res.hasMore);
        setLastId(res.lastId);
        setArrSlamBook(prev => [...res.data, ...prev]);
      }
      setIsLoading(false);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpenedSheet(false);
    } else {
      setIsOpenedSheet(true);
    }
  }, []);

  const _closeSheet = () => {
    createSlamBookSheetRef.current?.close();
  };

  const _createSlamBook = async () => {
    if (text === '') return;

    setIsCreating(true);
    const res = await apiCreateSlamBook(text, null, isPublic);
    if (res.success) {
      setText('');
      _closeSheet();
      initData();
    }

    setIsCreating(false);
  };

  const onCreateSlamBook = () => {
    createSlamBookSheetRef.current?.present();
  };

  const onSlamBookDetail = slamBook => {
    navigation.navigate('SlamBookDetailPage', {
      id: slamBook.id,
      slambook: slamBook.title,
    });
  };

  const renderAddButton = () => {
    return (
      <TouchableOpacity
        style={styles.plusButtonContainer}
        onPress={onCreateSlamBook}>
        <LinearGradient
          colors={['#FF3F3F', '#FF701F']}
          useAngle={true}
          angle={120}
          style={styles.plusButton}>
          <PlusWithoutBorderIcon />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderEmptyView = () => {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyView}>
          <Image
            source={require('assets/images/disabled_book.png')}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>
            No slambook yet. Create {'\n'}your first now!
          </Text>
        </View>
      </View>
    );
  };

  const renderCreateSlamBookSheet = () => {
    return (
      <BottomSheetModal
        ref={createSlamBookSheetRef}
        index={1}
        backgroundStyle={{
          backgroundColor: '#1F1F1F',
          borderRadius: 45,
          marginHorizontal: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginVertical: 0,
          width: 60,
          height: 2,
        }}
        snapPoints={snapPointsCreateSlamBook}
        keyboardBehavior={'interactive'}
        keyboardBlurBehavior="restore"
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        onChange={handleSheetChanges}>
        <View style={[StyleSheet.absoluteFill, {top: 10, left: 34, right: 34}]}>
          <Text style={styles.createSlambookTxt}>Create Slambook</Text>
          <BottomSheetTextInput
            value={text}
            onChangeText={text => setText(text)}
            maxLength={140}
            multiline={false}
            placeholder={showPlaceHolder ? 'Enter slambook title...' : ''}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={styles.createSlambookInput}
            onFocus={() => {
              setShowPlaceholder(false);
            }}
            onEndEditing={() => {
              setShowPlaceholder(true);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 24,
              borderTopColor: '#FFFFFF20',
              borderTopWidth: 1,
              marginBottom: 32,
            }}>
            <View>
              <Text style={{fontSize: 14, fontWeight: '500', color: '#fff'}}>
                Make it Private
              </Text>
              <Text
                style={{fontSize: 12, fontWeight: '400', color: '#ffffff60'}}>
                Only you can view this slambook
              </Text>
            </View>
            <SwitchToggle
              switchOn={isPublic}
              onPress={() => setIsPublic(prev => !prev)}
              containerStyle={styles.switchContianer}
              circleStyle={styles.switchCircle}
              circleColorOn="#fff"
              circleColorOff="#fff"
              backgroundColorOn="#FF3F3F"
              backgroundColorOff="#ffffff20"
            />
          </View>
          {isCreating ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={styles.publishBtn}
              onPress={_createSlamBook}>
              <Text style={styles.publishSlambookTxt}>Publish Slambook</Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetModal>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={'white'}
            refreshing={isRecentLoading}
            onRefresh={initData}
          />
        }
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadData();
          }
        }}>
        {arrSlamBook.map(item => (
          <CardSlamBook
            data={item}
            onDetail={data => {
              onSlamBookDetail(data);
            }}
            key={`slambook_item_key_${item.id}`}
          />
        ))}
        {isLoading && <CommonSkeleton />}
        <View style={{height: 100}} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.root}>
      {arrSlamBook.length > 0 ? renderContent() : renderEmptyView()}
      {renderAddButton()}
      {renderCreateSlamBookSheet()}
    </View>
  );
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 40;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default SlamBookPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    marginBottom: 70,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyView: {
    alignItems: 'center',
  },
  emptyImage: {
    width: 51,
    height: 51,
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
  plusButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createSlambookTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
  createSlambookInput: {
    width: '100%',
    height: 50,
    fontSize: 20,
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 40,
  },
  publishBtn: {
    height: 45,
    borderRadius: 45,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishSlambookTxt: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  toast: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastTxt: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 20,
  },
  switchContianer: {
    width: 40,
    height: 24,
    borderRadius: 32,
    padding: 3,
  },
  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 18,
    marginEnd: 3,
  },
});

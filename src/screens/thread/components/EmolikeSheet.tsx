import React, {useEffect, useMemo, useRef} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {EmojiLikeIcon, LeftBackIcon, SmallWaveIcon} from '../assets/svgs';

const {height} = Dimensions.get('window');

const Emolike = () => {
  return (
    <View>
      <View style={styles.emolike}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.01)', '#171717']}
          style={styles.emoNameContaner}>
          <View style={styles.rowItem}>
            <SmallWaveIcon />
            <Text numberOfLines={1} style={styles.emoName}>
              jessicapieasdfasdf
            </Text>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.emoti}></View>
    </View>
  );
};

const Header = ({onPress}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPress}>
        <LeftBackIcon />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Emolikes</Text>
      <View />
    </View>
  );
};

export const EmolikeSheet = ({show, close, onAdd}) => {
  const WelcomeSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [height, height], []);

  useEffect(() => {
    if (show) {
      WelcomeSheetRef.current?.present();
    } else {
      WelcomeSheetRef.current?.close();
    }
  }, [show]);

  return (
    <BottomSheetModal
      ref={WelcomeSheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{height: 0}}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={false}
      enableDismissOnClose={true}>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={styles.body}>
          <View style={styles.indicator} />
          <View style={styles.content}>
            <Header
              onPress={() => {
                WelcomeSheetRef.current.close();
                close();
              }}
            />
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <Emolike />
              <Emolike />
              <Emolike />
              <Emolike />
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.newButton}
              onPress={() => {
                // WelcomeSheetRef.current.close();
                onAdd();
              }}>
              <EmojiLikeIcon />
              <Text style={styles.newButtonTitle}>Add Emolike</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 24,
    paddingVertical: 8,
  },
  content: {
    padding: 16,
    alignItems: 'flex-start',
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
    width: 60,
    height: 2,
    alignSelf: 'center',
  },
  emolike: {
    width: 110,
    height: 136,
    borderRadius: 8,
    backgroundColor: 'grey',
    marginRight: 12,
  },
  emoNameContaner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoName: {
    fontFamily: 'Poppins',
    fontSize: 8,
    fontWeight: '500',
    lineHeight: 11.2,
    marginLeft: 4,
    color: '#ffffff40',
  },
  emoti: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'white',
    position: 'absolute',
    right: 4,
    top: -4,
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: 'white',
    marginRight: 30,
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 74,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  newButton: {
    width: 116,
    height: 42,
    backgroundColor: '#ff6651',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  newButtonTitle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 18,
    marginLeft: 4,
  },
});

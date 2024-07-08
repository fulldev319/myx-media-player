import {StackScreenProps} from '@react-navigation/stack';
import {
  ArrowRightIcon,
  BackIcon,
  DetailHorizontalIcon,
  ExitIcon,
  PersonIcon,
} from 'assets/svg';
import {MessageIcon} from 'assets/svg';
import {RoomUserCard} from 'components/cards/RoomUserCard';
import {MainStackParams} from 'navigators';
import LinearGradient from 'react-native-linear-gradient';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import SwipeButton from 'rn-swipe-button';
import thumbIcon from './../../assets/images/swipe_thumnail.png';

const RoomPage = ({route, navigation}: StackScreenProps<MainStackParams>) => {
  const [isJoined, setIsJoined] = useState(false);
  const [railColor, setRailColor] = useState('transparent');

  const renderMemberGroup = () => {
    return (
      <View>
        <View>
          <View style={styles.topMemberCount}>
            <PersonIcon />
            <Text style={styles.txtTopMemberCount}>234</Text>
            <ArrowRightIcon />
          </View>
        </View>
      </View>
    );
  };

  const renderAvatar = () => {
    return (
      <View style={styles.ownerImageContainer}>
        <View style={styles.userImageContainer1}>
          <View style={styles.userImageContainer2}>
            <View style={styles.userImageContainer3}>
              <Image
                style={styles.userImage}
                resizeMode="stretch"
                source={require('./../../assets/sample/dummy_user.png')}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderMemeberList = () => {
    return (
      <View>
        <FlatList
          data={Array(8).fill('')}
          renderItem={({item, index}) => (
            <RoomUserCard key={index} data={item} />
          )}
          keyExtractor={item => `${item.id}_${item.title}`}
          numColumns={4}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          style={{marginVertical: 0}}
        />
      </View>
    );
  };
  const CheckoutButton = () => {
    return (
      <View
        style={{
          width: 72,
          height: 60,
          backgroundColor: 'red',
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Image
          source={require('./../../assets/images/swipe_thumnail.png')}
          style={{width: 54, height: 63, backgroundColor: 'yellow'}}
        />
      </View>
    );
  };
  const renderAction = () => {
    return (
      <View style={styles.actionView}>
        {!isJoined ? (
          <SwipeButton
            thumbIconComponent={CheckoutButton}
            screenReaderEnabled={true}
            containerStyles={{
              borderRadius: 10,
              height: 75,
              backgroundColor: 'red',
            }}
            thumbIconStyles={{
              borderRadius: 10,
              borderWidth: 0,
              marginVertical: 12,
            }}
            railBackgroundColor={'rgba(255, 255, 255, 0.3)'}
            railStyles={{
              height: 75,
              backgroundColor: railColor,
              borderRadius: 10,
              borderWidth: 0,
            }}
            title="Swipe for join this room"
            titleColor={'#ffffff'}
            enableReverseSwipe={false}
            swipeSuccessThreshold={100}
            onSwipeStart={() => {
              setRailColor('rgba(124, 236, 176, 0.3)');
            }}
            onSwipeFail={() => {
              setRailColor('transparent');
            }}
            onSwipeSuccess={() => {
              setIsJoined(true);
            }}
          />
        ) : (
          <View style={{alignItems: 'flex-end', paddingHorizontal: 20}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CommentPage')}>
              <MessageIcon />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Party with me 🎉👻</Text>
        <View style={{flex: 1}} />
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => {}} style={{padding: 10}}>
            <DetailHorizontalIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={{padding: 10}}>
            <ExitIcon />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {renderMemberGroup()}
        {renderAvatar()}
        {renderMemeberList()}
      </ScrollView>
      {renderAction()}
    </View>
  );
};

export default RoomPage;

const ImageButton = () => {
  return (
    <View>
      <Text>Test</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginStart: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topMemberContainer: {
    display: 'flex',
  },
  topMemberCount: {
    width: 90,
    height: 30,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  txtTopMemberCount: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 11,
    color: '#FFFFFF',
    paddingHorizontal: 5,
  },
  ownerImageContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  userImageContainer1: {
    width: 170,
    height: 170,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.2)',
  },
  userImageContainer2: {
    width: 160,
    height: 160,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.3)',
  },
  userImageContainer3: {
    width: 150,
    height: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'rgba(47, 155, 255, 0.5)',
  },
  userImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  actionView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    height: 100,
  },
  swipeContainer: {
    width: '100%',
    height: 75,
    backdropFilter: 'blur(10)',
  },
});

/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {StackActions} from '@react-navigation/routers';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from 'redux/interfaces';

import {createStackNavigator} from '@react-navigation/stack';
import {createNavigationContainerRef} from '@react-navigation/native';
import SnackBar from 'react-native-snackbar-component';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {SplashPage} from 'screens/SplashPage';
import {SignUpMobilePage} from 'screens/SignUpMobilePage';
import {SignUpPinPage} from 'screens/SignUpPinPage';
import TabPage from './BottomTabNavigator';
import {SharePage} from 'screens/SharePage';
import {AddToPlaylistPage} from 'screens/AddToPlaylistPage';
import {AddSongToNFT} from 'screens/AddSongToNFT';
import {AddNewMyContact} from 'screens/AddNewMyContact';
import MediaImageProcessor from 'screens/MediaImageProcessor';
import MediaVideoProcessor from 'screens/MediaVideoProcessor';
import LoadingBar from 'components/LoadingBar';
import {ChatAddFriend} from 'screens/chat/ChatAddFriend';
import {ChatRoom} from 'screens/chat/ChatRoom';
import CommentPage from 'screens/comment';
import RoomPage from 'screens/room';
import {MessageBox} from 'screens/chat/MessageBox';
import {AddStoryPage} from 'screens/AddStoryPage';
import {MediaVideoGalleryPage} from 'screens/AddStoryPage/MediaVideoGalleryPage';
import PublishStoryPage from 'screens/AddStoryPage/PublishStoryPage';
import StoryDetailPage from 'screens/story/StoryDetailPage';
import ImageViewItem from 'screens/chat/ImageViewItem';

import appActions from 'redux/app/actions';
import {NewGreenSuccessIcon} from 'assets/svg';
import {AddMemoryPage} from 'screens/addMemory';
import {MemoryVideoGalleryPage} from 'screens/addMemory/MemoryVideoGalleryPage';
import MemorySubmitPage from 'screens/addMemory/MemorySubmitPage';
import TagFriendsPage from 'screens/addMemory/TagFriendsPage';
// import FeedHomePage from 'screens/feed/FeedHomePage';
import {EditProfilePage} from 'screens/ProfilePage/components/EditProfilePage';
import FeedDetailPage from 'screens/feed/FeedDetailPage';
import {verticalAnimation} from 'components/common/Animations';
import {FullMusicPlayer} from 'screens/MusicPlayer/FullMusicPlayer';
import {useTracks} from 'contexts/TrackContext';
import {TrendingMusicPage} from 'screens/trending_music';
import {TrackPlayListPage} from 'screens/TrackPlayList/TrackPlayListPage';
import {RecentReleasePage} from 'screens/recent_release';
import ExplorePage from 'screens/explore';
import {TrendingPeoplePage} from 'screens/trending_people';
import {SelectSongPage} from 'screens/select_song';
// import {AddTrackPlayListPage} from 'screens/ProfilePage/AddTrackPlayListPage';
import {TrendingPlaylistPage} from 'screens/trending_playlist';
import {MagicMatchPage} from 'screens/magic_match';
import ArtistPage from 'screens/artist';
import {LoginNavigator} from './login';
// import {HomePage} from 'screens/home/HomePage';
import {HelpAndSupportPage} from 'screens/help';
import {OtherProfilePage} from 'screens/ProfilePage/OtherProfilePage';
import {PopularArtistsPage} from 'screens/popular_artist';
import {EditTrackPlayListPage} from 'screens/ProfilePage/EditTrackPlayListPage';
import {OtherFollowingPage} from 'screens/ProfilePage/OtherFollowingPage';
import {FollowingPage} from 'screens/ProfilePage/FollowingPage';
import NewTaggedPage from 'screens/ProfilePage/NewTagged';
import {GenresPage} from 'screens/genres';
import ChatRequest from 'screens/chat/Requested';
import ChatPersonDetail from 'screens/chat/ChatPersonDetail';
import AddEmojiScreen from 'screens/add_emoji';
import MusicDetailsPage from 'screens/MusicDetails/MusicDetailsPage';
import {useToast} from 'native-base';
import {useSpotifyContext} from 'contexts/SpotifyContext';
import SlamBookDetailPage from 'screens/social/SlamBookDetail';
import StartConversationPage from 'screens/social/StartConversation';
import SlamBookChatPage from 'screens/social/SlamBookChat';
import SlamBookTagFriendPage from 'screens/social/SlamBookTagFriends';
import TopicSearchPage from 'screens/topic_search';
import HashTagDiscussPage from 'screens/hashtag_discuss';
import SlamBookMembersPage from 'screens/social/SlamBookMembers';
import {AddChat} from 'screens/chat/AddChat';
import TopicMemoryMediaPage from 'screens/social/TopicMemoryMedia';
import TopicAddEmojiPage from 'screens/social/TopicAddEmoji';
// import {MagicSearchPage} from 'screens/explore/MagicSearchPage';
import ManageMusicPage from 'screens/ProfilePage/ManageMusics';
import NewWorldPage from 'screens/map/new_world/NewWorld';
import {GiphyPage} from 'screens/giphy';
import {SoundSticker} from 'components/soundsticker';
import {CreateDebatPage} from 'components/create_debat';
import ThreadPage from 'screens/thread';
import {EmolikePage} from 'screens/emolike';
import ProfilePage from 'components/profile';
import SubThreadPage from 'screens/thread/components/SubThreadPage';
import GroupBookPage from 'screens/group_book';
import {GroupBubbleDetail} from 'screens/group_bubble';
import {ChatsScreen} from 'screens/chats';
import BubbleDetailPage from 'screens/bubble_detail';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {error: spotifyErr} = useSpotifyContext();
  const {setScreenHeight} = useTracks();
  const {
    loading,
    showDialogAddToNFT,
    showMagicSearch,
    showEditPlayList,
    showDialogAddMyContact,
    snakeSuccessMessage,
  } = useSelector((state: RootState) => state.app);
  const {showShare} = useSelector((state: RootState) => state.share);
  const {showAddToPlaylist} = useSelector(
    (state: RootState) => state.addToPlaylist,
  );
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    if (spotifyErr?.message) {
      toast.show({description: spotifyErr.message});
    }
  }, [spotifyErr]);

  useEffect(() => {
    if (snakeSuccessMessage) {
      setTimeout(() => {
        dispatch(appActions.setSnakeSuccessMessage(''));
      }, 3000);
    }
  }, [snakeSuccessMessage]);

  return (
    <View
      style={{
        flex: 1,
      }}
      onLayout={event => {
        setScreenHeight(event.nativeEvent.layout.height);
      }}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <BottomSheetModalProvider>
        <Stack.Navigator initialRouteName={'TabPage'}>
          <Stack.Screen
            name="SplashPage"
            component={SplashPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoginNavigator"
            component={LoginNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUpMobilePage"
            component={SignUpMobilePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUpPinPage"
            component={SignUpPinPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TabPage"
            component={TabPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MediaImageProcessor"
            component={MediaImageProcessor}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MediaVideoProcessor"
            component={MediaVideoProcessor}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChatAddFriend"
            component={ChatAddFriend}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddChat"
            component={AddChat}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MessageBox"
            component={MessageBox}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoom}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ImageViewItem"
            component={ImageViewItem}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RoomPage"
            component={RoomPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CommentPage"
            component={CommentPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddStoryPage"
            component={AddStoryPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MediaVideoGalleryPage"
            component={MediaVideoGalleryPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PublishStoryPage"
            component={PublishStoryPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoryDetailPage"
            component={StoryDetailPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddMemoryPage"
            component={AddMemoryPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MemoryVideoGalleryPage"
            component={MemoryVideoGalleryPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MemorySubmitPage"
            component={MemorySubmitPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TagFriendsPage"
            component={TagFriendsPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FeedDetailPage"
            component={FeedDetailPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EditProfilePage"
            component={EditProfilePage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="MyProfilePage"
            component={ProfilePage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="FullMusicPlayer"
            component={FullMusicPlayer}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="TrendingMusicPage"
            component={TrendingMusicPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="RecentReleasePage"
            component={RecentReleasePage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="ExplorePage"
            component={ExplorePage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="TrendingPeoplePage"
            component={TrendingPeoplePage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="TrackPlayListPage"
            component={TrackPlayListPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="SelectSongPage"
            component={SelectSongPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="TrendingPlaylistPage"
            component={TrendingPlaylistPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="ArtistPage"
            component={ArtistPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="MagicMatchPage"
            component={MagicMatchPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="HelpAndSupportPage"
            component={HelpAndSupportPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="OtherProfilePage"
            component={OtherProfilePage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="PopularArtistsPage"
            component={PopularArtistsPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="FollowingPage"
            component={FollowingPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="OtherFollowingPage"
            component={OtherFollowingPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="NewTaggedPage"
            component={NewTaggedPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="GenresPage"
            component={GenresPage}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="ChatRequest"
            component={ChatRequest}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="ChatPersonDetail"
            component={ChatPersonDetail}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="AddEmojiScreen"
            component={AddEmojiScreen}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="MusicDetails"
            component={MusicDetailsPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SlamBookDetailPage"
            component={SlamBookDetailPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StartConversationPage"
            component={StartConversationPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SlamBookChatPage"
            component={SlamBookChatPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TopicSearchPage"
            component={TopicSearchPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HashTagDiscussPage"
            component={HashTagDiscussPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SlamBookTagFriendPage"
            component={SlamBookTagFriendPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SlamBookMembersPage"
            component={SlamBookMembersPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TopicMemoryMediaPage"
            component={TopicMemoryMediaPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TopicAddEmojiPage"
            component={TopicAddEmojiPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ManageMusicPage"
            component={ManageMusicPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="NewWorldPage"
            component={NewWorldPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="GiphyPage"
            component={GiphyPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SoundSticker"
            component={SoundSticker}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CreateDebatPage"
            component={CreateDebatPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ThreadPage"
            component={ThreadPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EmolikePage"
            component={EmolikePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SubThreadPage"
            component={SubThreadPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="GroupBookPage"
            component={GroupBookPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BubbleDetailPage"
            component={BubbleDetailPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="GroupBubbleDetail"
            component={GroupBubbleDetail}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChatsScreen"
            component={ChatsScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </BottomSheetModalProvider>
      {showShare && <SharePage />}
      {showAddToPlaylist && <AddToPlaylistPage />}
      {showDialogAddMyContact && <AddNewMyContact />}
      {showDialogAddToNFT && <AddSongToNFT />}
      {/* {showMagicSearch && <MagicSearchPage />} */}
      {showEditPlayList && <EditTrackPlayListPage />}
      {loading && <LoadingBar />}

      <SnackBar
        visible={Boolean(snakeSuccessMessage)}
        textMessage={() => {
          return (
            <View style={styles.snackBarContainer}>
              <View style={styles.storySnackContainer}>
                <NewGreenSuccessIcon />
                <Text style={styles.storySnackText}>{snakeSuccessMessage}</Text>
              </View>
            </View>
          );
        }}
        position={'top'}
        top={87}
        autoHidingTime={3000}
        backgroundColor={'transparent'}
      />
    </View>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  snackBarContainer: {width: '100%', alignItems: 'center'},
  storySnackContainer: {
    width: '90%',
    height: 63,
    backgroundColor: '#0D4030',
    alignItems: 'center',
    borderRadius: 9,
    flexDirection: 'row',
    padding: 16,
  },
  storySnackText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
    marginStart: 16,
  },
});

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}

export function push(name, params) {
  navigationRef.current.dispatch(StackActions.push(name, params));
}

export type MainStackParams = {
  TabPage: undefined;
  HomePage: undefined;
  TrendingMusicPage: undefined;
  MagicMatchPage: {tracks: any[]};
  ExplorePage: undefined;
  TrendingPeoplePage: undefined;
  TuneInRadioPage: undefined;
  RoomPage: undefined;
  CommentPage: undefined;
  PlayListPage: undefined;
  PlayListDetailPage: {itemID: string};
  ArtistPage: {artistId: string};
  ArtistDetailPage: {itemID: string};
  GenresPage: {genres: string};
  GenresDetailPage: {itemID: string; name: string};
  MyContactsPage: undefined;
  MediaImageProcessor: {
    mediaUri: string;
    mediaType: string;
    songId: string;
    location: string;
  };
  MediaVideoProcessor: {
    mediaUri: string;
    mediaType: string;
    songId: string;
    location: string;
  };
  AddStoryPage: undefined;
  MediaVideoGalleryPage: {mediaType: string};
  PublishStoryPage: {mediaType: string; videoUri: string; duration: number};
  StoryDetailPage: {data: any};
  AddMemoryPage: {songId: string};
  MemoryVideoGalleryPage: {mediaType: string; songId: string; location?: any};
  MemorySubmitPage: {
    songId: string;
    mediaType: string;
    videoUri: string;
    videoDuration: number;
    location?: any;
  }[];
  TagFriendsPage: undefined;
  FeedHomePage: undefined;
  ProfilePage: {userId: string};
  FeedDetailPage: {feedId: string};
  RecentReleasePage: undefined;
  SelectSongPage: undefined;
  TrendingPlaylistPage: undefined;
  PopularArtistsPage: undefined;
  MusicDetailsPage: any;
  OnboardingSetProfilePage: {spotifyId: string; spotifyUri: string};
};

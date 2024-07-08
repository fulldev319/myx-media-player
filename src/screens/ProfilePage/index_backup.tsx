import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

import actions from '../../redux/auth/actions';
import appActions from 'redux/app/actions';
import HttpClient from '../../helper/apiClient';
import {validEmail} from 'helper/utils';
import {MainStackParams} from '../../navigators/index';
import {RootState} from 'redux/interfaces';

import {
  FacebookWhiteIcon,
  InstagramWhiteIcon,
  InstaIcon,
  MusicIcon,
  SpotifyWhiteIcon,
  SpotiIcon,
  TikTokWhiteIcon,
  TwitterIcon,
  TwitterWhiteIcon,
} from 'assets/svg/social';

import {BackIcon, DetailHorizontalIcon, PlayIcon} from 'assets/svg';
import {styles} from './index_backup.styles';
import LinearGradient from 'react-native-linear-gradient';
import {ColseIcon} from 'assets/svg/modal';
import {PostLayoutType, ProfileResourceTab} from 'helper/constants';
import {PostCard} from 'components/cards/PostCard';
import {ActivityCard} from 'components/cards/ActivityCard';
import {getAllMediasOfUser} from 'helper/mediaHelpers';

export const ProfilePage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const tabList = ['General', 'Social'];
  const [selTab, setSelTab] = useState('General');
  const [selectedResourceTab, setSelectedResourceTab] =
    useState<ProfileResourceTab>(ProfileResourceTab.Post);

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [alertMessage, setAlertMessgage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [spotify, setSpotify] = useState('');
  const [songList, setSongList] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getPostData();
  }, []);
  useEffect(() => {
    setUserData();
  }, [user]);

  const getPostData = async () => {
    const res: any = await getAllMediasOfUser();

    if (res.success) {
      setSongList(res.songNFTData);
    }
  };

  const setUserData = () => {
    setUserName(user.username);
    setDescription(user.description);
    setFollowers(user.followers);
    setFollowing(user.followings);
    setTwitter(user.twitter);
    setFacebook(user.facebook);
    setInstagram(user.instagram);
    setTiktok(user.tiktok);
    setSpotify(user.youtube);
  };

  const checkEmail = async () => {
    if (user.email) {
      if (!validEmail(user.email)) {
        onShowMessage('Please enter a valid email');
        return false;
      }

      const response = await HttpClient.get(
        `/user/checkEmailExists/${user.email}/${user.id}`,
        {},
      );

      if (response.data.success) {
        if (response.data.data.emailExist) {
          onShowMessage('This email is being used. Please, give another one.');
          return false;
        } else {
          return true;
        }
      } else {
        onShowMessage('Error when checking email, please try again');
        return false;
      }
    } else {
      onShowMessage('Please add your email on our website');
      return false;
    }
  };

  const checkSlug = async () => {
    const acceptedChars = "^[a-zA-Z0-9\\._\\-' ]{1,100}$";
    if (!user.urlSlug.match(acceptedChars)) {
      onShowMessage(
        'Please type only letters, numbers, or special characters . , - and _ in your profile URL',
      );
      return false;
    } else {
      if (user.urlSlug.endsWith('.')) {
        onShowMessage("Profile URL can't end with a .");
        return false;
      } else if (user.urlSlug.startsWith('.', 0)) {
        onShowMessage("Profile URL can't start with a .");
        return false;
      } else {
        const response = await HttpClient.get(
          `/user/checkSlugExists/${user.urlSlug}/${user.id}/user`,
          {},
        );

        if (response.data.success) {
          if (response.data.data.urlSlugExists) {
            onShowMessage(
              'This profile URL is being used. Please, choose another one.',
            );
            return false;
          } else {
            return true;
          }
        } else {
          onShowMessage('Error when checking url, please try again');
          return false;
        }
      }
    }
  };

  const onSaveProfile = async () => {
    setIsSaving(true);

    dispatch(appActions.showLoadingBar());
    let isValidEmail = await checkEmail();
    if (isValidEmail) {
      let isValidSlug = await checkSlug();

      if (isValidSlug) {
        const fakeUser = user;
        let nameSplit = userName.split(' ');
        let lastNameArray = nameSplit.filter((item, i) => {
          return i !== 0;
        });
        fakeUser.firstName = nameSplit[0];
        fakeUser.lastName = '';
        for (let i = 0; i < lastNameArray.length; i++) {
          if (lastNameArray.length === i + 1) {
            fakeUser.lastName = fakeUser.lastName + lastNameArray[i];
          } else {
            fakeUser.lastName = fakeUser.lastName + lastNameArray[i] + ' ';
          }
        }

        fakeUser.instagram = instagram?.replace('https://instagram.com/', '');
        fakeUser.twitter = twitter?.replace('https://twitter.com/', '');
        fakeUser.facebook = facebook?.replace('https://facebook.com/', '');
        fakeUser.tiktok = tiktok?.replace('https://tiktok.com/', '');
        fakeUser.youtube = spotify?.replace(
          'https://www.youtube.com/user/',
          '',
        );
        fakeUser.bio = description;

        const response = await HttpClient.post('/user/editUser', fakeUser, {});

        if (response.data.success) {
          dispatch(actions.updateProfileRequest(response.data.data));
        } else {
          let errorMsg = 'Something wrong, please try again later';
          if (response.data.validations?.length) {
            errorMsg = response.data.validations[0].message;
          }
          onShowMessage(errorMsg);
        }
      }
    }
    setShowProfileEdit(false);
    dispatch(appActions.dismissLoadingBar());
  };

  const onShowMessage = (msg: string) => {
    setAlertMessgage(msg);
    Alert.alert('Message', msg, [{text: 'OK', onPress: () => {}}]);
  };

  const onGoTwitter = () => {
    Linking.openURL(`https://twitter.com/${user.twitter}`);
  };

  const onGoInstagram = () => {
    Linking.openURL(`https://twitter.com/${user.instagram}`);
  };

  const onGoSpotify = () => {
    Linking.openURL(`https://twitter.com/${user.spotify}`);
  };

  const onGoTikTok = () => {
    Linking.openURL(`https://twitter.com/${user.tiktok}`);
  };

  const onEditProfile = () => {
    setShowProfileEdit(true);
  };

  const onGoMyContacts = () => {
    navigation.push('MyContactsPage');
  };

  const renderResourceView = () => {
    return (
      <View style={styles.resourceContainer}>
        <View style={styles.resourceTab}>
          <TouchableOpacity
            style={
              selectedResourceTab == ProfileResourceTab.Post
                ? styles.selectedResourceTab
                : styles.defaultResourceTab
            }
            onPress={() => {
              setSelectedResourceTab(ProfileResourceTab.Post);
            }}>
            <Text
              style={
                selectedResourceTab == ProfileResourceTab.Post
                  ? styles.selectedResourceTabText
                  : styles.defaultResourceTabText
              }>
              Posts({songList.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedResourceTab == ProfileResourceTab.Activity
                ? styles.selectedResourceTab
                : styles.defaultResourceTab
            }
            onPress={() => {
              setSelectedResourceTab(ProfileResourceTab.Activity);
            }}>
            <Text
              style={
                selectedResourceTab == ProfileResourceTab.Activity
                  ? styles.selectedResourceTabText
                  : styles.defaultResourceTabText
              }>
              Activity
            </Text>
          </TouchableOpacity>
        </View>
        {selectedResourceTab === ProfileResourceTab.Post
          ? renderResourcePostView()
          : renderResourceActivityView()}
      </View>
    );
  };

  const renderResourcePostView = () => {
    return (
      <View style={styles.postResourceView}>
        <View style={styles.postLayoutFirst}>
          <View style={{width: '60%'}}>
            {songList.length > 0 && (
              <PostCard type={PostLayoutType.Large} data={songList[0]} />
            )}
          </View>
          <View style={{width: '40%'}}>
            {songList.length > 1 && (
              <PostCard type={PostLayoutType.Small} data={songList[1]} />
            )}
            {songList.length > 2 && (
              <PostCard type={PostLayoutType.Small} data={songList[2]} />
            )}
          </View>
        </View>
        {songList.length > 3 &&
          songList
            .slice(3)
            .reduce(function (accumulator, currentValue, currentIndex, array) {
              if (currentIndex % 2 === 0)
                accumulator.push(array.slice(currentIndex, currentIndex + 2));
              return accumulator;
            }, [])
            .map((twoItems, index) => (
              <View style={styles.postLayoutSecond}>
                <View style={{width: '60%'}}>
                  <PostCard type={PostLayoutType.Medium} data={twoItems[0]} />
                </View>
                <View style={{width: '40%'}}>
                  {twoItems[1] && (
                    <PostCard type={PostLayoutType.Small} data={twoItems[1]} />
                  )}
                </View>
              </View>
            ))}
      </View>
    );
  };

  const renderResourceActivityView = () => {
    return (
      <View style={styles.activityResourceView}>
        {Array(10)
          .fill('')
          .map((itemData, index) => (
            <ActivityCard />
          ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.background}>
              <Image
                style={styles.bgImage}
                resizeMode="stretch"
                source={require('assets/images/artist_detail_bg.png')}
              />
            </View>
            <View style={styles.content}>
              <View style={styles.info}>
                <View style={styles.userImageContainer1}>
                  <View style={styles.userImageContainer2}>
                    <View style={styles.userImageContainer3}>
                      <Image
                        style={styles.userImage}
                        resizeMode="stretch"
                        source={{
                          uri:
                            user.imageUrl === '' || user.imageUrl === undefined
                              ? 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                              : user.urlIpfsImage,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.detail}>
                  <View style={styles.detailInfo}>
                    <Text style={styles.detailInfoName} numberOfLines={2}>
                      {userName}
                    </Text>
                    <Text style={styles.detailInfoNick} numberOfLines={2}>
                      @meganchai
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <BackIcon />
              </TouchableOpacity>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => {}} style={{marginLeft: 8}}>
                  <DetailHorizontalIcon />
                </TouchableOpacity>
                {user.twitter !== '' && (
                  <TouchableOpacity
                    onPress={() => {
                      onGoTwitter();
                    }}
                    style={{marginLeft: 8}}>
                    <TwitterIcon />
                  </TouchableOpacity>
                )}
                {user.instagram !== '' && (
                  <TouchableOpacity
                    onPress={() => {
                      onGoInstagram();
                    }}
                    style={{marginLeft: 8}}>
                    <InstaIcon />
                  </TouchableOpacity>
                )}
                {user.spotify !== '' && (
                  <TouchableOpacity
                    onPress={() => {
                      onGoSpotify();
                    }}
                    style={{marginLeft: 8}}>
                    <SpotiIcon />
                  </TouchableOpacity>
                )}
                {user.tiktok !== '' && (
                  <TouchableOpacity
                    onPress={() => {
                      onGoTikTok();
                    }}
                    style={{marginLeft: 8}}>
                    <MusicIcon />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.followInfoContainer}>
              <View style={styles.followersContainer}>
                <Text style={styles.txtBoldFollow}>{followers}</Text>
                <Text style={styles.txtNormalFollow}>followers</Text>
              </View>
              <View style={styles.followingContainer}>
                <Text style={styles.txtBoldFollow}>{following}</Text>
                <Text style={styles.txtNormalFollow}>following</Text>
              </View>
            </View>
            <View style={styles.actionFollowContainer}>
              <TouchableOpacity style={styles.btnFollowing}>
                <Text style={styles.txtBtnFollowing}>Follow</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.listeningConatiner}>
              <Text style={styles.txtNowListening}>Now Listening</Text>
              <View style={styles.listenItemContainer}>
                <Image
                  style={styles.itemImage}
                  source={require('./../../assets/sample/artist_image_1.png')}
                  resizeMode="cover"
                />
                <View style={styles.itemInfoContainer}>
                  <View>
                    <Text style={styles.itemUserName}>Freak In Me</Text>
                    <Text style={styles.itemUserInfo}>Anuel AA</Text>
                  </View>
                  <View>
                    <PlayIcon />
                    <Text style={[styles.itemUserInfo, {marginTop: 5}]}>
                      3:32
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {renderResourceView()}
          </View>
          <View></View>
        </ScrollView>
      </View>
      {showProfileEdit && (
        <View style={styles.editContainer}>
          <LinearGradient
            colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
            style={styles.editMainContainer}>
            <ScrollView>
              <View style={styles.closeBtn}>
                <TouchableOpacity onPress={() => setShowProfileEdit(false)}>
                  <ColseIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.editContent}>
                <Text style={styles.editTitle}>Edit Profile</Text>
                <View style={styles.editTabList}>
                  {tabList.map(tab => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelTab(tab);
                      }}
                      style={selTab === tab ? styles.tabSel : styles.tab}
                      key={tab}>
                      <Text
                        style={
                          selTab === tab ? styles.tabSelText : styles.tabText
                        }>
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.editTabContent}>
                  {selTab === 'General' ? (
                    <>
                      <View style={styles.editInputGroup}>
                        <Text style={styles.editInputLabel}>Name</Text>
                        <TextInput
                          style={styles.editInputText}
                          value={userName}
                          onChangeText={value => {
                            setUserName(value);
                          }}
                          placeholder="Your Name..."
                          placeholderTextColor="#A7A7A7"
                        />
                      </View>
                      <View style={styles.editInputGroup}>
                        <Text style={styles.editInputLabel}>Description</Text>
                        <TextInput
                          style={{
                            ...styles.editInputText,
                            textAlignVertical: 'top',
                          }}
                          value={description}
                          onChangeText={value => {
                            setDescription(value);
                          }}
                          placeholder="Your Description"
                          placeholderTextColor="#A7A7A7"
                          multiline={true}
                          numberOfLines={3}
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.editInputGroup}>
                        <Text style={styles.editInputLabel}>Twitter</Text>
                        <View style={styles.editSocialInput}>
                          <TextInput
                            style={styles.editSocialInputText}
                            value={twitter}
                            onChangeText={value => {
                              setTwitter(value);
                            }}
                            placeholder="Connect your twitter account"
                            placeholderTextColor="#A7A7A7"
                          />
                          <View style={styles.editSocialIcon}>
                            <TwitterWhiteIcon />
                          </View>
                        </View>
                      </View>
                      <View style={styles.editInputGroup}>
                        <Text style={styles.editInputLabel}>Facebook</Text>
                        <View style={styles.editSocialInput}>
                          <TextInput
                            style={styles.editSocialInputText}
                            value={facebook}
                            onChangeText={value => {
                              setFacebook(value);
                            }}
                            placeholder="Connect your facebook account"
                            placeholderTextColor="#A7A7A7"
                          />
                          <View style={styles.editSocialIcon}>
                            <FacebookWhiteIcon />
                          </View>
                        </View>
                      </View>
                      <View style={styles.editInputGroup}>
                        <Text style={styles.editInputLabel}>Instagram</Text>
                        <View style={styles.editSocialInput}>
                          <TextInput
                            style={styles.editSocialInputText}
                            value={instagram}
                            onChangeText={value => {
                              setInstagram(value);
                            }}
                            placeholder="Connect your Instagram account"
                            placeholderTextColor="#A7A7A7"
                          />
                          <View style={styles.editSocialIcon}>
                            <InstagramWhiteIcon />
                          </View>
                        </View>
                      </View>
                      <View style={styles.editInputGroup}>
                        <Text style={styles.editInputLabel}>TikTok</Text>
                        <View style={styles.editSocialInput}>
                          <TextInput
                            style={styles.editSocialInputText}
                            value={tiktok}
                            onChangeText={value => {
                              setTiktok(value);
                            }}
                            placeholder="Connect your tiktok account"
                            placeholderTextColor="#A7A7A7"
                          />
                          <View style={styles.editSocialIcon}>
                            <TikTokWhiteIcon />
                          </View>
                        </View>
                      </View>
                      <View style={styles.editInputGroup}>
                        <Text style={styles.editInputLabel}>Spotify</Text>
                        <View style={styles.editSocialInput}>
                          <TextInput
                            style={styles.editSocialInputText}
                            value={spotify}
                            onChangeText={value => {
                              setSpotify(value);
                            }}
                            placeholder="Connect your Spotify account"
                            placeholderTextColor="#A7A7A7"
                          />
                          <View style={styles.editSocialIcon}>
                            <SpotifyWhiteIcon />
                          </View>
                        </View>
                      </View>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    onSaveProfile();
                  }}
                  style={{paddingHorizontal: 40}}>
                  <LinearGradient
                    colors={['#F6943D', '#F85B2B']}
                    style={styles.btnEditSave}>
                    <Text style={styles.btnEditSaveText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
};

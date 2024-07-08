import React, {useState, useRef, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
  Image,
  Animated,
  Easing,
} from 'react-native';

import * as RootNavigation from 'navigators/index';
import {RootState} from 'redux/interfaces';
import {RectPlusIcon, RedTrashIcon} from 'assets/svg';
import {styles} from './index.styles';
import {PlayListCard} from 'components/cards/PlayListCard';
import {
  mediaGetLikedPlaylists,
  uploadFileToIPFS,
} from 'helper/playListDaoHelpers';
import {ColseIcon, FailIcon, ImageIcon, SuccessIcon} from 'assets/svg/modal';
import LinearGradient from 'react-native-linear-gradient';

import HttpClient from './../../../../helper/apiClient';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParams} from 'navigators';
import shareActions from 'redux/share/actions';

export const LikedPlaylistPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();
  const {width} = Dimensions.get('window');
  const size_2 = (width - 60) / 2;

  const {user} = useSelector((state: RootState) => state.auth);

  const [likedPlalists, setLikedPlalists] = useState([]);
  const [loadingLikedPlaylists, setLoadingLikedPlaylists] = useState(false);
  const [lastLikedPlaylist, setLastLikedPlaylist] = useState(0);
  const [hasMoreLikedPlaylist, setHasMoreLikedPlaylist] = useState(true);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreatingDialog, setIsCreatingDialog] = useState(false);
  const [isSuccessedDialog, setIsSuccessedDialog] = useState(false);
  const [isFailedDialog, setIsFailedDialog] = useState(false);

  const [selectedThumnail, setSelectedThumnail] = useState(null);
  const [selectedThumnailFileName, setSelectedThumnailFileName] = useState('');
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedCoverFileName, setSelectedCoverFileName] = useState('');

  const [playlist, setPlaylist] = useState({
    id: '',
    Title: '',
    Description: '',
    playListImg: '',
    coverImg: '',
    isPublic: true,
  });

  useEffect(() => {
    loadLikedPlaylists();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLikedPlaylists();
    });
    return unsubscribe;
  }, [navigation]);

  const initPlaylistEditData = () => {
    setPlaylist({
      ...playlist,
      Title: '',
      Description: '',
      playListImg: '',
      coverImg: '',
      isPublic: true,
    });
  };

  const loadLikedPlaylists = async () => {
    if (loadingLikedPlaylists) {
      return;
    }
    try {
      setLoadingLikedPlaylists(true);

      const response = await mediaGetLikedPlaylists(lastLikedPlaylist);

      const shareResponse = await HttpClient.getWithToken(
        '/musicDao/getSharedItems',
        {userId: user.id},
      );

      if (response.success) {
        const data = response.data.playlists || [];
        const playlistsData = data.map(item => {
          return {
            ...item,
            playingStatus: 0,
          };
        });

        setLikedPlalists(playlistsData);
        setHasMoreLikedPlaylist(response.data.hasMore ?? false);
        setLastLikedPlaylist(response.data.lastIndex ?? 0);
      }

      if (shareResponse.data.success) {
        let a = shareResponse.data.data;

        if (a.playlists && a.playlists.length > 0) {
          const sharedPlaylistsData = a.playlists.map(item => {
            return {
              ...item,
              playingStatus: 0,
            };
          });
          setLikedPlalists(prev => [...prev, ...sharedPlaylistsData]);
        }
      }

      setLoadingLikedPlaylists(false);
    } catch (err) {
      setLoadingLikedPlaylists(false);
    }
  };

  const onPickImage = (imageType: string) => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(async image => {
      const arrFileProp = image.path.split('/');
      const fileName = arrFileProp[arrFileProp.length - 1];

      if (imageType === 'thumnail') {
        setSelectedThumnail(image);
        setSelectedThumnailFileName(fileName);
      } else {
        setSelectedCover(image);
        setSelectedCoverFileName(fileName);
      }
    });
  };

  const validate = () => {
    if (!playlist.Title) {
      console.log('Name is required', {variant: 'error'});
      return false;
    } else if (!selectedThumnail) {
      console.log('You need to upload Playlist Thumbnail.', {
        variant: 'error',
      });
      return false;
    } else if (!selectedCover) {
      console.log('You need to upload Cover Image.', {variant: 'error'});
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validate()) {
      return;
    }

    try {
      setIsCreatingDialog(true);

      const thumNailImageUrl = await uploadFileToIPFS(
        selectedThumnail.data,
        selectedThumnail.mime,
      );
      const coverImageUrl = await uploadFileToIPFS(
        selectedCover.data,
        selectedCover.mime,
      );

      let newPlaylist: any = {...playlist};
      newPlaylist.id = undefined;
      newPlaylist.CreatorId = user.id;
      newPlaylist.listImage = thumNailImageUrl;
      newPlaylist.coverImage = coverImageUrl;

      delete newPlaylist.playListImg;
      delete newPlaylist.coverImg;

      const resp = await HttpClient.post(
        '/media/createPlaylist',
        newPlaylist,
        {},
      );

      if (resp.data.success) {
        setIsSuccessedDialog(true);
      } else {
        setIsFailedDialog(true);
      }
    } catch (err) {
      setIsFailedDialog(false);
    } finally {
      setIsCreatingDialog(false);
    }
  };

  const onSharePlayList = itemData => {
    dispatch(
      shareActions.showShareDialog({
        type: 'playlist',
        id: itemData.id || itemData.songId || itemData.Id,
        name:
          itemData.Title || itemData.title || itemData.name || itemData.Name,
      }),
    );
  };

  const onGoPlaylistDetail = (itemID: string) => {
    RootNavigation.push('PlayListDetailPage', {itemID});
  };

  const renderCreatePlaylistDialog = () => {
    return (
      <Modal
        animationType={'slide'}
        visible={showCreateDialog}
        transparent={true}
        style={{backgroundColor: 'transparent'}}>
        <View style={styles.editContainer}>
          <LinearGradient
            colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
            style={styles.editMainContainer}>
            <ScrollView>
              <View style={styles.closeBtn}>
                <TouchableOpacity onPress={() => setShowCreateDialog(false)}>
                  <ColseIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.editContent}>
                <Text style={styles.editTitle}>Create Playlist</Text>
                <View style={styles.editTabContent}>
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>
                      Enter Playlist Name
                    </Text>
                    <TextInput
                      style={styles.editInputText}
                      value={playlist.Title}
                      onChangeText={value => {
                        setPlaylist({
                          ...playlist,
                          Title: value,
                        });
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
                      value={playlist.Description}
                      onChangeText={value => {
                        setPlaylist({
                          ...playlist,
                          Description: value,
                        });
                      }}
                      placeholder="Your Description"
                      placeholderTextColor="#A7A7A7"
                      multiline={true}
                      numberOfLines={5}
                    />
                  </View>
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>
                      Playlist Thumbnail
                    </Text>
                    {selectedThumnail ? (
                      <View style={styles.editImagePreviewContianer}>
                        <View style={styles.editImagePreview}>
                          <View style={styles.editThumnailPreview}>
                            <Image
                              source={{uri: selectedThumnail.path}}
                              style={styles.editImageSelected}
                            />
                            <Text style={styles.editImageSelectedFileName}>
                              {selectedThumnailFileName}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedThumnail(null);
                              setSelectedThumnailFileName('');
                            }}>
                            <RedTrashIcon />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.editInputImage}>
                        <TouchableOpacity
                          onPress={() => {
                            onPickImage('thumnail');
                          }}
                          style={styles.editInputImageAction}>
                          <ImageIcon />
                          <Text style={styles.editInputImageText}>
                            Browse Image
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={styles.editInputImageDesc}>
                      <Text style={styles.editInputImageDescText}>
                        File Supported: PNG, JPG, GIF
                      </Text>
                      <Text style={styles.editInputImageDescText}>
                        Minimum Size: 400x400px
                      </Text>
                    </View>
                  </View>
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editInputLabel}>Cover Image</Text>
                    {selectedCover ? (
                      <View style={styles.editImagePreviewContianer}>
                        <View style={styles.editImagePreview}>
                          <View style={styles.editThumnailPreview}>
                            <Image
                              source={{uri: selectedCover.path}}
                              style={styles.editImageSelected}
                            />
                            <Text style={styles.editImageSelectedFileName}>
                              {selectedCoverFileName}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedCoverFileName('');
                              setSelectedCover(null);
                            }}>
                            <RedTrashIcon />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.editInputImage}>
                        <TouchableOpacity
                          onPress={() => {
                            onPickImage('cover');
                          }}
                          style={styles.editInputImageAction}>
                          <ImageIcon />
                          <Text style={styles.editInputImageText}>
                            Browse Image
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={styles.editInputImageDesc}>
                      <Text style={styles.editInputImageDescText}>
                        File Supported: PNG, JPG, GIF
                      </Text>
                      <Text style={styles.editInputImageDescText}>
                        Minimum Size: 1440x300px
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handleSaveChanges();
                  }}
                  style={{paddingHorizontal: 40}}>
                  <LinearGradient
                    colors={['#F6943D', '#F85B2B']}
                    style={styles.btnEditSave}>
                    <Text style={styles.btnEditSaveText}>Create Playlist</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
    );
  };

  const renderCreatingPlaylistDialog = () => {
    const [spinValue, setSpinValue] = useState(new Animated.Value(0));
    const spin = useMemo(
      () =>
        spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      [spinValue],
    );

    useEffect(() => {
      if (spinValue) {
        const animation = Animated.loop(
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        );
        animation.start();
        return () => {
          animation.stop();
        };
      }
    }, [spinValue]);

    return (
      <Modal
        animationType={'slide'}
        visible={isCreatingDialog}
        transparent={true}
        style={{backgroundColor: 'transparent'}}>
        <View
          style={styles.loadingContainer}
          onTouchEnd={() => {
            setIsCreatingDialog(false);
            setIsSuccessedDialog(true);
          }}>
          <LinearGradient
            colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
            style={styles.loadingMainContainer}>
            <Animated.Image
              style={{transform: [{rotate: spin}]}}
              source={require('assets/images/loading.png')}
            />
            <View style={styles.loadingContent}>
              <Text style={styles.loadingTitle}>Creating Playlist...</Text>
              <Text style={styles.loadingDescription}>
                This will take a moment
              </Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    );
  };

  const renderSuccessCreatedDialog = () => {
    return (
      <Modal
        animationType={'slide'}
        visible={isSuccessedDialog}
        transparent={true}
        style={{backgroundColor: 'transparent'}}>
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
            style={styles.loadingMainContainer}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <View style={{...styles.closeBtn, marginTop: 0}}>
                <TouchableOpacity
                  onPress={() => {
                    setIsSuccessedDialog(false);
                    setShowCreateDialog(false);
                    initPlaylistEditData();
                  }}>
                  <ColseIcon />
                </TouchableOpacity>
              </View>
            </View>
            <SuccessIcon />
            <View style={styles.loadingContent}>
              <Text style={styles.loadingTitle}>Playlist Created</Text>
              <Text style={styles.loadingTitle}>Succesfully</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsSuccessedDialog(false);
                setShowCreateDialog(false);
                initPlaylistEditData();
              }}
              style={{paddingHorizontal: 40}}>
              <LinearGradient
                colors={['#F6943D', '#F85B2B']}
                style={{
                  ...styles.btnEditSave,
                  height: 40,
                  paddingHorizontal: 26,
                  marginTop: 36,
                }}>
                <Text style={styles.btnEditSaveText}>Check the Playlist</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    );
  };

  const renderFailedCreatePlaylistDialog = () => {
    return (
      <Modal
        animationType={'slide'}
        visible={isFailedDialog}
        transparent={true}
        style={{backgroundColor: 'transparent'}}>
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
            style={styles.loadingMainContainer}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <View style={{...styles.closeBtn, marginTop: 0}}>
                <TouchableOpacity onPress={() => setIsFailedDialog(false)}>
                  <ColseIcon />
                </TouchableOpacity>
              </View>
            </View>
            <FailIcon />
            <View style={styles.loadingContent}>
              <Text style={styles.loadingTitle}>Failed</Text>
              <Text style={styles.loadingDescription}>
                Playlist created unfortunatelly, please try again later
              </Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={styles.actionContainer}
        onPress={() => setShowCreateDialog(true)}>
        <RectPlusIcon />
        <Text style={styles.textCreatePlayList}>Create playlist</Text>
      </TouchableOpacity>
      <FlatList
        data={likedPlalists}
        renderItem={({item, index}) => (
          <PlayListCard
            data={item}
            key={index}
            size={size_2}
            marginRight={0}
            marginTop={20}
            onGoToDetail={onGoPlaylistDetail}
            onShare={onSharePlayList}
          />
        )}
        keyExtractor={(item, index) => `playlist-${item?.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
      <>
        {renderCreatePlaylistDialog()}
        {renderCreatingPlaylistDialog()}
        {renderSuccessCreatedDialog()}
        {renderFailedCreatePlaylistDialog()}
      </>
    </View>
  );
};

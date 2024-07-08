import React, {useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
  Animated,
  Easing,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';

import * as RootNavigation from 'navigators/index';
import HttpClient from './../../helper/apiClient';
import {uploadFileToIPFS} from 'helper/playListDaoHelpers';
import actions from 'redux/addplaylist/actions';
import {styles} from './index.styles';

import {ColseIcon, FailIcon, ImageIcon, SuccessIcon} from 'assets/svg/modal';
import {RedTrashIcon, RectGrayPlusIcon, GreenSuccessIcon} from 'assets/svg';
import {RootState} from 'redux/interfaces';
import {mediaGetMyPlaylists, mediaAddSongToPlaylist} from 'helper/userHelpers';
import {SongCard} from 'components/cards/SongCard';

export const AddToPlaylistPage = () => {
  const dispatch = useDispatch();
  const {width} = Dimensions.get('window');
  const size = (width - 60) / 2;

  const {user} = useSelector((state: RootState) => state.auth);
  const {itemData} = useSelector((state: RootState) => state.addToPlaylist);
  const [currentStep, setCurrentStep] = useState(0);
  const [myPlayList, setMyPlayList] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);

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
    loadPlaylists();
  }, []);

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

  const loadPlaylists = async () => {
    const response = await mediaGetMyPlaylists();
    if (response.success) {
      const tMyPlayList = response.data.playlists?.filter(
        playlist => !!playlist.Title?.trim(),
      );

      setMyPlayList(tMyPlayList);
    }
  };

  const onDismiss = () => {
    dispatch(actions.dismissDialog());
  };

  const onPickImage = (imageType: string) => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(async image => {
      const filePath = image.path;
      const arrFileProp = filePath.split('/');
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
      console.log(`Name is required`, {variant: 'error'});
      return false;
    } else if (!selectedThumnail) {
      console.log(`You need to upload Playlist Thumbnail.`, {
        variant: 'error',
      });
      return false;
    } else if (!selectedCover) {
      console.log(`You need to upload Cover Image.`, {variant: 'error'});
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

      const thumNailImageUrl = await uploadFileToIPFS(selectedThumnail.data, selectedThumnail.mime);
      const coverImageUrl = await uploadFileToIPFS(selectedCover.data, selectedCover.mime);

      let newPlaylist: any = {...playlist};
      newPlaylist.id = undefined;
      newPlaylist.CreatorId = user.id;
      newPlaylist.listImage = thumNailImageUrl;
      newPlaylist.coverImage = coverImageUrl;

      delete newPlaylist.playListImg;
      delete newPlaylist.coverImg;

      const resp = await HttpClient.post(
        `/media/createPlaylist`,
        newPlaylist,
        {},
      );

      if (resp.data.success) {
        setIsSuccessedDialog(true);
        await loadPlaylists();
      } else {
        setIsFailedDialog(true);
      }
    } catch (err) {
      setIsFailedDialog(false);
    } finally {
      setIsCreatingDialog(false);
    }
  };

  const onAddToPlaylist = async (playlistData: any) => {
    try {
      setSelectedPlaylist(playlistData);
      const resp = await mediaAddSongToPlaylist({
        id: playlistData.id,
        songs: [itemData.Id],
      });

      if (resp.success) {
        setCurrentStep(1);
      }
    } catch (error) {
      console.log(error);
    }
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
                  style={{paddingHorizontal: 40, marginTop: 50}}>
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

  const renderHome = () => {
    return (
      <LinearGradient
        colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
        style={styles.shareContainer}>
        <View style={styles.closeBtn}>
          <TouchableOpacity
            onPress={() => {
              onDismiss();
            }}>
            <ColseIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Add to Playlist</Text>
          </View>
          <TouchableOpacity
            style={styles.actionContainer}
            onPress={() => setShowCreateDialog(true)}>
            <RectGrayPlusIcon />
            <Text style={styles.textCreatePlayList}>Create playlist</Text>
          </TouchableOpacity>
          <View style={styles.playlistContainer}>
            <FlatList
              data={myPlayList}
              renderItem={({item, index}) => (
                <SongCard
                  key={index}
                  data={item}
                  size={size}
                  marginRight={20}
                  marginTop={40}
                  onAddToPlaylist={onAddToPlaylist}
                />
              )}
              keyExtractor={item => `${item.id}_${item.title}`}
              numColumns={2}
              columnWrapperStyle={{justifyContent: 'space-between'}}
            />
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderSuccess = () => {
    return (
      <LinearGradient
        colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
        style={styles.shareContainer}>
        <View style={styles.closeBtn}>
          <TouchableOpacity
            onPress={() => {
              onDismiss();
            }}>
            <ColseIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.successBody}>
          <GreenSuccessIcon />
          <Text style={styles.successText}>
            Song Successfully {'\n'}Added{' '}
            <Text style={styles.playlistNameText}>
              {'#' + selectedPlaylist.Title}
            </Text>
          </Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.shareView}>
      {currentStep == 0 && renderHome()}
      {currentStep == 1 && renderSuccess()}
      {renderCreatePlaylistDialog()}
      {renderCreatingPlaylistDialog()}
      {renderSuccessCreatedDialog()}
      {renderFailedCreatePlaylistDialog()}
    </View>
  );
};

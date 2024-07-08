import React, {useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as RootNavigation from 'navigators/index';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import {useToast} from 'native-base';

import HttpClient from './../../helper/apiClient';
import {getBase64String, uploadFileToIPFS} from 'helper/playListDaoHelpers';
import appActions from 'redux/app/actions';
import mediaActions from 'redux/media/actions';
import {styles} from './index.styles';

import {ColseIcon, ImageIcon} from 'assets/svg/modal';
import {RedTrashIcon} from 'assets/svg';
import {RootState} from 'redux/interfaces';
import {ContactCard} from 'components/cards/ContactCard';
import {getContactsLoacal} from 'helper/userHelpers';
import {compressMedia} from 'helper/utils';

const mediaOptionGroup = [
  {
    id: '1', // acts as primary key, should be unique and non-empty string
    label: 'Image',
    value: 'image',
    color: 'white',
    labelStyle: {color: 'white'},
    selected: true,
  },
  {
    id: '2',
    label: 'Video',
    value: 'video',
    color: 'white',
    labelStyle: {color: 'white'},
  },
  {
    id: '3',
    label: 'Txt',
    value: 'txt',
    color: 'white',
    labelStyle: {color: 'white'},
  },
];

export const AddSongToNFT = () => {
  const dispatch = useDispatch();

  const {user} = useSelector((state: RootState) => state.auth);
  const toast = useToast();
  const {data} = useSelector((state: RootState) => state.app);
  const {shouldUpdate, mediaProcessData} = useSelector(
    (state: RootState) => state.media,
  );
  const [selectedThumnail, setSelectedThumnail] = useState(null);
  const [selectedThumnailFileName, setSelectedThumnailFileName] = useState('');
  const [name, setName] = useState('');
  const [addedUsers, setAddedUsers] = useState([]);
  const [addedUserName, setAddedUserName] = useState('');
  const [contactUsers, setContactUsers] = useState([]);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [selectedNftType, setSelectedNftType] = useState(0); // 0: Image, 1: Video, 2: Txt

  useEffect(() => {
    loadContact();
  });

  useEffect(() => {
    const mediaName = (mediaProcessData && mediaProcessData.data.name) ?? '';
    const mediaUri = (mediaProcessData && mediaProcessData.data.uri) ?? '';
    const mediaType = (mediaProcessData && mediaProcessData.mediaType) ?? '';

    setName(mediaName);
    getBase64String(mediaUri).then(base64String => {
      setSelectedThumnail({
        path: mediaUri,
        data: base64String,
        type:
          mediaType === 'txt'
            ? 'text/plain'
            : mediaType === 'video'
            ? 'video/mp4'
            : 'image/jpeg',
      });
    });
    setSelectedNftType(mediaType === 'txt' ? 2 : mediaType === 'video' ? 1 : 0);
  }, [shouldUpdate]);

  const loadContact = async () => {
    const contactList = await getContactsLoacal();
    setContactUsers(contactList);
  };

  const onDismiss = () => {
    dispatch(mediaActions.initMediaProcess());
    dispatch(appActions.dismissAddToNFTDialog());
  };

  const onPickImage = async (imageType: string) => {
    if (selectedNftType == 0) {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64: true,
      }).then(async image => {
        const filePath = image.path;
        const arrFileProp = filePath.split('/');
        const fileName = arrFileProp[arrFileProp.length - 1];

        setSelectedThumnail(image);
        setSelectedThumnailFileName(fileName);
        onDismiss();
        RootNavigation.navigate('MediaImageProcessor', {
          mediaName: name,
          mediaUri: image.path,
          mediaType: 'image',
          songId: data.trackId,
          location: data.location,
        });
      });
    } else if (selectedNftType === 1) {
      const result = await launchImageLibrary({mediaType: 'video'});
      let fileType = result.assets[0].type;
      let fileExtension = fileType
        .substr(fileType.lastIndexOf('/') + 1)
        .toLowerCase();

      if (
        fileExtension === 'mp4' ||
        fileExtension === 'mov' ||
        fileExtension === 'avi'
      ) {
        if (result.assets) {
          const videoUri = result.assets[0].uri;
          let base64String;
          base64String = await compressMedia('video', videoUri);
          base64String = await getBase64String(base64String);
          setSelectedThumnail({
            path: videoUri,
            data: base64String,
            type: 'video/' + fileExtension,
          });
          setSelectedThumnailFileName(videoUri);
          onDismiss();

          RootNavigation.navigate('MediaVideoProcessor', {
            mediaName: name,
            mediaUri: videoUri,
            mediaType: 'video',
            songId: data.trackId,
            location: data.location,
          });
        }
      } else {
        toast.show({
          description: 'This file type is not supported on app',
        });
      }
    } else {
      try {
        const pickerResult = await DocumentPicker.pickSingle({
          type: 'text/plain',
        });
        let base64String;
        base64String = await compressMedia('image', pickerResult.uri);
        base64String = await getBase64String(base64String);
        setSelectedThumnail({
          path: pickerResult.uri,
          data: base64String,
          type: 'text/plain',
        });
        setSelectedThumnailFileName(pickerResult.name);
      } catch (e) {}
    }
  };

  const validate = () => {
    if (name === '') {
      return false;
    }

    if (!selectedThumnail) {
      return false;
    }

    return true;
  };

  const handleSaveChanges = async () => {
    if (!validate()) {
      return;
    }

    dispatch(appActions.showLoadingBar());
    try {
      const onlineUrl = await uploadFileToIPFS(
        selectedThumnail.data,
        selectedThumnail.mime,
      );
      addedUsers.push(user.id);

      // convert animated value to number
      mediaProcessData.data.labels.forEach((label, index) => {
        mediaProcessData.data.labels[index].animRatio =
          label.animRatio.__getValue();
        mediaProcessData.data.labels[index].animX = label.animX.__getValue();
        mediaProcessData.data.labels[index].animY = label.animY.__getValue();
      });

      mediaProcessData.data.texts.forEach((text, index) => {
        mediaProcessData.data.texts[index].animRatio =
          text.animRatio.__getValue();
        mediaProcessData.data.texts[index].animX = text.animX.__getValue();
        mediaProcessData.data.texts[index].animY = text.animY.__getValue();
      });

      const params = {
        name: name,
        location: parseInt(data.location.toString()).toString(),
        // location: 9,
        mediaUrl: onlineUrl,
        mediaType:
          selectedNftType == 0
            ? 'image'
            : selectedNftType == 1
            ? 'video'
            : 'txt',
        allowedUsers: addedUsers,
        songNFT: data.trackId,
        arrLabel: mediaProcessData !== null ? mediaProcessData.data.labels : [],
        arrText: mediaProcessData !== null ? mediaProcessData.data.texts : [],
        description: '',
      };

      const resp = await HttpClient.postWithToken(
        `/media/addMediaToSongNFT`,
        params,
        {},
      );

      if (resp.status == 200) {
        onDismiss();
      } else {
      }
    } catch (err) {
      console.log('--- err');
      console.log(err);
    } finally {
    }

    dispatch(appActions.dismissLoadingBar());
  };

  const onSelectedUserFromContact = userId => {
    let currentSelectedUsers = addedUsers;
    if (addedUsers.indexOf(userId) >= 0) {
      const newList = addedUsers.filter(item => item !== userId);
      setAddedUsers(newList);
    } else {
      const newList = currentSelectedUsers;
      newList.push(userId);
      setAddedUsers(newList);
    }

    setRerender(!rerender);
  };

  const onChangedNftType = optionData => {
    const selectedOption = optionData.filter(item => item.selected);
    if (selectedOption[0].value === 'image') {
      setSelectedNftType(0);
      setSelectedThumnailFileName('');
      setSelectedThumnail(null);
    } else if (selectedOption[0].value === 'video') {
      setSelectedNftType(1);
    } else {
      setSelectedNftType(2);
    }
  };

  const onAddUsers = () => {
    setShowAddUserDialog(true);
  };

  const onFinishAddUser = () => {
    let addedUsersName = '';
    addedUsers.forEach((userId, index) => {
      const userInfo = contactUsers.find(item => item.id === userId);

      if (index == 0) {
        addedUsersName = userInfo.name;
      } else {
        addedUsersName = addedUsersName + `, ${userInfo.name}`;
      }
    });

    setAddedUserName(addedUsersName);
    setShowAddUserDialog(false);
  };

  const renderHome = () => {
    return (
      <ScrollView>
        <View style={styles.closeBtn}>
          <TouchableOpacity onPress={() => onDismiss()}>
            <ColseIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.editContent}>
          <Text style={styles.editTitle}>Add to NFT</Text>
          <View style={styles.editTabContent}>
            <View style={styles.editInputGroup}>
              <Text style={styles.editInputLabel}>Enter Your Name</Text>
              <TextInput
                style={styles.editInputText}
                value={name}
                onChangeText={value => {
                  setName(value);
                }}
                placeholder="Your Name..."
                placeholderTextColor="#A7A7A7"
              />
            </View>
            <View style={styles.editInputGroup}>
              <Text style={styles.editInputLabel}>Choose NFT Type</Text>
              <RadioGroup
                radioButtons={mediaOptionGroup}
                onPress={data => {
                  onChangedNftType(data);
                }}
                layout="row"
              />
            </View>
            <View style={styles.editInputGroup}>
              <Text style={styles.editInputLabel}>NFT Data</Text>
              {selectedThumnail ? (
                <View style={styles.editImagePreviewContianer}>
                  <View style={styles.editImagePreview}>
                    <View style={styles.editThumnailPreview}>
                      {selectedThumnail && (
                        <Image
                          source={{uri: selectedThumnail.path}}
                          style={styles.editImageSelected}
                        />
                      )}
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
                      Browse{' '}
                      {selectedNftType == 0
                        ? 'Image'
                        : selectedNftType == 1
                        ? 'Video'
                        : 'Txt'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* <View style={styles.editInputImageDesc}>
                <Text style={styles.editInputImageDescText}>
                  File Supported: PNG, JPG, GIF
                </Text>
                <Text style={styles.editInputImageDescText}>
                  Minimum Size: 400x400px
                </Text>
              </View> */}
            </View>
            <View style={styles.editInputGroup}>
              <Text style={styles.editInputLabel}>Allowed Users</Text>
              <Text style={styles.editInputImageDescText}>{addedUserName}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              onAddUsers();
            }}
            style={{paddingHorizontal: 40, marginTop: 50}}>
            <LinearGradient
              colors={['#F6943D', '#F85B2B']}
              style={styles.btnEditSave}>
              <Text style={styles.btnEditSaveText}>Add Users</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleSaveChanges();
            }}
            style={{paddingHorizontal: 40, marginTop: 20}}>
            <LinearGradient
              colors={['#F6943D', '#F85B2B']}
              style={styles.btnEditSave}>
              <Text style={styles.btnEditSaveText}>Create</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderAddUserDialog = () => {
    return (
      <LinearGradient
        colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
        style={styles.searchContainer}>
        <ScrollView>
          <View>
            <View style={styles.closeBtn}>
              <TouchableOpacity
                onPress={() => {
                  setAddedUsers([]);
                  setShowAddUserDialog(false);
                }}>
                <ColseIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <Text style={styles.title}>Add Users From Contact</Text>
              <View style={styles.contactsContainer}>
                <Text style={styles.subTitle}>Contacts</Text>
              </View>
              {contactUsers.map((itemData, index) => (
                <ContactCard
                  data={itemData}
                  userList={addedUsers}
                  onClicked={onSelectedUserFromContact}
                  key={index}
                />
              ))}
              <TouchableOpacity
                onPress={() => {
                  onFinishAddUser();
                }}
                style={{
                  paddingHorizontal: 40,
                  marginVertical: 50,
                  width: '80%',
                }}>
                <LinearGradient
                  colors={['#F6943D', '#F85B2B']}
                  style={styles.btnEditSave}>
                  <Text style={styles.btnEditSaveText}>Add</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.shareView}>
      {!showAddUserDialog ? renderHome() : renderAddUserDialog()}
    </View>
  );
};

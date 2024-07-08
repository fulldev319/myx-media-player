/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'native-base';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {ColseIcon} from 'assets/svg/modal';

import {styles} from './index.styles';
import actions from 'redux/share/actions';
import {ContactCard} from 'components/cards/ContactCard';
import {getMatchingUsers, musicDaoSharePlayerInside} from 'helper/userHelpers';
import {RootState} from 'redux/interfaces';
import {SearchBar} from 'components/common/SearchBar';

export const SharePage = () => {
  const {itemData} = useSelector((state: RootState) => state.share);
  const toast = useToast();
  const dispatch = useDispatch();

  const [rerender, setRerender] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    getMatchingUsers(searchText, ['urlSlug', 'firstName', 'address']).then(
      async resp => {
        if (resp?.success) {
          const filteredUsers = resp.data;
          setUsers(filteredUsers);
        }
      },
    );
  }, [searchText]);

  const onChangedText = val => {
    setSearchText(val);
  };

  const onSelectedUser = userId => {
    let currentSelectedUsers = selectedUsers;
    if (selectedUsers.indexOf(userId) >= 0) {
      const newList = selectedUsers.filter(item => item !== userId);
      setSelectedUsers(newList);
    } else {
      const newList = currentSelectedUsers;
      newList.push(userId);
      setSelectedUsers(newList);
    }

    setRerender(!rerender);
  };

  const onShareMobile = async () => {
    if (selectedUsers.length === 0) {
      return;
    }

    await musicDaoSharePlayerInside({
      item: itemData,
      destUserIds: selectedUsers,
    });

    setCurrentStep(2);
  };

  const onShareTwitter = () => {
    toast.show({
      description: 'Coming soon',
    });
  };

  const onDismiss = () => {
    dispatch(actions.dismissShareDialog());
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
          <Text style={styles.title}>Share On</Text>
          <View style={styles.actionView}>
            <TouchableOpacity
              style={styles.actionItemContainer}
              onPress={() => onShareTwitter()}>
              <View style={styles.actionItem}>
                <Image source={require('./../../assets/images/twitter.png')} />
              </View>
              <Text style={styles.subTitle}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItemContainer}
              onPress={() => setCurrentStep(1)}>
              <View style={styles.actionItem}>
                <Image source={require('./../../assets/images/twitter.png')} />
              </View>
              <Text style={styles.subTitle}>Mobile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderOnMobile = () => {
    return (
      <LinearGradient
        colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
        style={styles.shareContainer}>
        <ScrollView>
          <View>
            <View style={styles.closeBtn}>
              <TouchableOpacity
                onPress={() => {
                  onDismiss();
                }}>
                <ColseIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <Text style={styles.title}>Share On Mobile</Text>
              <View style={styles.searchBar}>
                <SearchBar
                  value={searchText}
                  txtPlaceholder="Search Contacts"
                  onChangedText={onChangedText}
                />
              </View>
              <View style={styles.contactsContainer}>
                <Text style={styles.subTitle}>Contacts</Text>
              </View>
              {users.map((_itemData, index) => (
                <ContactCard
                  data={_itemData}
                  userList={selectedUsers}
                  onClicked={onSelectedUser}
                  key={`contact-card-${index}`}
                />
              ))}
              <TouchableOpacity
                onPress={() => {
                  onShareMobile();
                }}
                style={{
                  paddingHorizontal: 40,
                  marginVertical: 50,
                  width: '80%',
                }}>
                <LinearGradient
                  colors={['#F6943D', '#F85B2B']}
                  style={styles.btnEditSave}>
                  <Text style={styles.btnEditSaveText}>Share</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
        <View style={styles.body}>
          <Image
            source={require('./../../assets/images/share_success.png')}
            style={styles.successImage}
          />
          <Text style={styles.successText}>You Shared{'\n'}Successfully</Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.shareView}>
      {currentStep === 0 && renderHome()}
      {currentStep === 1 && renderOnMobile()}
      {currentStep === 2 && renderSuccess()}
    </View>
  );
};

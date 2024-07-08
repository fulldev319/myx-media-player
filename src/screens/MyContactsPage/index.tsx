/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StackScreenProps} from '@react-navigation/stack';

import {MyContactCard} from 'components/cards/MyContactCard';
import {ContactCard} from 'components/cards/ContactCard';

import {
  getContactsLoacal,
  getMatchingUsers,
  saveContacts,
} from 'helper/userHelpers';
import appAction from 'redux/app/actions';
import {MainStackParams} from './../../navigators/index';

import {ColseIcon} from 'assets/svg/modal';
import {BackIcon} from 'assets/svg';
import {styles} from './index.styles';
import {RootState} from 'redux/interfaces';
import {SearchBar} from 'components/common/SearchBar';

export const MyContactsPage = ({
  route,
  navigation,
}: StackScreenProps<MainStackParams>) => {
  const dispatch = useDispatch();

  const {loadContacts} = useSelector((state: RootState) => state.app);

  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  useEffect(() => {
    getMatchingUsers(searchText, ['urlSlug', 'firstName', 'address']).then(
      async resp => {
        if (resp?.success) {
          const filteredUsers = resp.data;
          setSearchedUsers(filteredUsers);
        }
      },
    );
  }, [searchText]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadContactsFromLocal();
      setShowSearchDialog(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadContactsFromLocal();
  }, [loadContacts]);

  const loadContactsFromLocal = async () => {
    const savedContacts = await getContactsLoacal();

    setContacts(savedContacts);
  };

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

  const onAddNew = () => {
    dispatch(appAction.showAddMyContactDialog());
  };

  const onAddBySearch = () => {
    setShowSearchDialog(true);
  };

  const isExistedContact = (newContact, currentContacts) => {
    for (var i = 0; i < currentContacts.length; i++) {
      if (
        currentContacts[i].name === newContact.name &&
        currentContacts[i].address === newContact.address
      ) {
        return true;
      }
    }

    return false;
  };

  const onSaveBySearch = async () => {
    if (selectedUsers.length !== 0) {
      const currentContacts = await getContactsLoacal();

      selectedUsers.forEach(userId => {
        searchedUsers.forEach(user => {
          if (user.id === userId) {
            const newData = user;
            if (!isExistedContact(newData, currentContacts)) {
              currentContacts.push(newData);
            }
          }
        });
      });

      await saveContacts(currentContacts);
      await loadContactsFromLocal();
      setShowSearchDialog(false);
    }
  };

  const onDelete = async contact => {
    const newContacts = contacts.filter(
      item => item.name !== contact.name && item.address !== contact.address,
    );
    await saveContacts(newContacts);
    setContacts([]);
    await loadContactsFromLocal();
  };

  const renderHome = () => {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.backBtn}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.title}>My Contacts</Text>
        </View>
        <View style={styles.mainContainer}>
          <ScrollView style={styles.container}>
            {contacts.map((itemData, index) => (
              <MyContactCard
                data={itemData}
                onDelete={onDelete}
                key={`my-contact-card-${index}`}
              />
            ))}
          </ScrollView>
          <View style={styles.actionsContainer}>
            {/* <TouchableOpacity
              onPress={() => {
                onAddNew();
              }}>
              <LinearGradient
                colors={['#F6943D', '#F85B2B']}
                style={styles.btnAddNewContainer}>
                <Text style={styles.btnAddNew}>Create New</Text>
              </LinearGradient>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                onAddBySearch();
              }}>
              <LinearGradient
                colors={['#F6943D', '#F85B2B']}
                style={styles.btnAddNewContainer}>
                <Text style={styles.btnAddNew}>Add by search</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  const renderSearchDialog = () => {
    return (
      <LinearGradient
        colors={['#0B1539ee', '#13162B8A', '#070F2F', '#070F2F']}
        style={styles.searchContainer}>
        <ScrollView>
          <View>
            <View style={styles.closeBtn}>
              <TouchableOpacity
                onPress={() => {
                  setShowSearchDialog(false);
                }}>
                <ColseIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <Text style={styles.title}>Add Contact From Search</Text>
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
              {searchedUsers.map((itemData, index) => (
                <ContactCard
                  data={itemData}
                  userList={selectedUsers}
                  onClicked={onSelectedUser}
                  key={`contact-card-${index}`}
                />
              ))}
              <TouchableOpacity
                onPress={() => {
                  onSaveBySearch();
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

  return <>{!showSearchDialog ? renderHome() : renderSearchDialog()}</>;
};

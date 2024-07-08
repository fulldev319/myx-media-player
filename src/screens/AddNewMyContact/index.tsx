import React, {useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import appActions from 'redux/app/actions';
import {styles} from './index.styles';

import {ColseIcon, ImageIcon} from 'assets/svg/modal';
import {getContactsLoacal, saveContacts} from 'helper/userHelpers';

export const AddNewMyContact = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const onSaveLocal = async () => {
    if (name !== '' && address !== '') {
      const currentContacts = await getContactsLoacal();
      currentContacts.push({name, address});
      await saveContacts(currentContacts);

      dispatch(appActions.loadContacts());
      onDismiss();
    }
  };

  const onDismiss = () => {
    dispatch(appActions.dismissAddMyContactDialog());
  };

  return (
    <View style={styles.shareView}>
      <ScrollView>
        <View style={styles.closeBtn}>
          <TouchableOpacity onPress={() => onDismiss()}>
            <ColseIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.editContent}>
          <Text style={styles.editTitle}>Create New Contact</Text>
          <View style={styles.editTabContent}>
            <View style={styles.editInputGroup}>
              <Text style={styles.editInputLabel}>Enter Contact Name</Text>
              <TextInput
                style={styles.editInputText}
                value={name}
                onChangeText={value => {
                  setName(value);
                }}
                placeholder="Contact Name..."
                placeholderTextColor="#A7A7A7"
              />
            </View>
          </View>
          <View style={styles.editTabContent}>
            <View style={styles.editInputGroup}>
              <Text style={styles.editInputLabel}>Enter Contact Address</Text>
              <TextInput
                style={styles.editInputText}
                value={address}
                onChangeText={value => {
                  setAddress(value);
                }}
                placeholder="Contact Address..."
                placeholderTextColor="#A7A7A7"
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              onSaveLocal();
            }}
            style={{paddingHorizontal: 40, marginTop: 50}}>
            <LinearGradient
              colors={['#F6943D', '#F85B2B']}
              style={styles.btnEditSave}>
              <Text style={styles.btnEditSaveText}>Save Contact</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

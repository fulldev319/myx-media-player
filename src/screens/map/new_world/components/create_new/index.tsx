import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Svg, {Circle, Path} from 'react-native-svg';
import ImagePicker from 'react-native-image-crop-picker';

import {styles} from './index.styles';
import {RedTrash1Icon} from 'assets/svg';
import {ImageIcon} from 'assets/svg/modal';
import {uploadFileToIPFS} from 'helper/playListDaoHelpers';

const FLAG_COLORS = ['#9214f5', '#2f9bff', '#08bb83', '#ff67b2', '#ffa51f', '#ff701f'];

export const CreateNew = ({show, onClose, onContinue}) => {
  const CreateNewSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [600, 600], []);
  const [selectedColor, setSelectedColor] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colour, setColour] = useState('#9214f5');
  const [selectedThumnail, setSelectedThumnail] = useState(null);
  const [selectedThumnailFileName, setSelectedThumnailFileName] = useState('');

  useEffect(() => {
    if (show) {
      CreateNewSheetRef.current?.present();
    } else {
      CreateNewSheetRef.current?.close();
    }
  }, [show]);

  const onSelectColor = (color, index) => {
    setSelectedColor(index);
    setColour(color);
  };

  const onPickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(async image => {
      const arrFileProp = image.path.split('/');
      const fileName = arrFileProp[arrFileProp.length - 1];

      setSelectedThumnail(image);
      setSelectedThumnailFileName(fileName);
    });
  };

  const validate = () => {
    if (!name) {
      Alert.alert('Name is required');
      return false;
    } else if (!description) {
      Alert.alert('Description is required');
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validate()) {
      return;
    }

    const newCountry = {
      name,
      description,
      colour,
    };

    if (selectedThumnail) {
      const thumNailImageUrl = await uploadFileToIPFS(
        selectedThumnail.data,
        selectedThumnail.mime,
      );
      newCountry['image'] = thumNailImageUrl;
    }

    onContinue(newCountry);
  };

  const renderFlagColors = () => {
    return (
      <>
        <Text style={styles.flagColorTxt}>Flag Color</Text>
        <View style={styles.flagContainer}>
          {FLAG_COLORS.map((color, index) => {
            const isSelect = selectedColor === index;
            return (
              <TouchableOpacity
                onPress={() => onSelectColor(color, index)}
                key={index}
                style={[
                  styles.flagColor,
                  {backgroundColor: color},
                  isSelect && styles.selectFlagColor
                ]}
              >
                {isSelect && <CheckIcon />}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity>
            <MoreColorIcon />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderBrowseImage = () => {
    return (
      <View style={styles.countryNameWrap}>
        <Text style={styles.countryName}>Country Image</Text>
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
                <RedTrash1Icon />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.editInputImage}>
            <TouchableOpacity
              onPress={onPickImage}
              style={styles.editInputImageAction}>
              <ImageIcon />
              <Text style={styles.editInputImageText}>
                Browse Image
              </Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
    );
  };

  return (
    <BottomSheetModal
      ref={CreateNewSheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{height: 0}}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={true}
      enableDismissOnClose={true}>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={styles.body}>
          <View style={styles.indicator}></View>
          <Text style={styles.txtNewWorld}>Create New Country</Text>
          <View style={styles.countryNameWrap}>
            <Text style={styles.countryName}>Country Name</Text>
            <TextInput value={name} onChangeText={text => setName(text)} style={styles.txtDesc} />
          </View>
          <View style={styles.countryNameWrap}>
            <Text style={styles.countryName}>Country Description</Text>
            <TextInput value={description} onChangeText={text => setDescription(text)} style={styles.txtDesc} />
          </View>
          {renderBrowseImage()}
          {renderFlagColors()}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.txtBtnCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnContinue} onPress={handleSaveChanges}>
              <Text style={styles.txtBtnCreate}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const CheckIcon = () => (
  <Svg
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="none"
  >
    <Path
      d="M19.99 8.01a1.043 1.043 0 00-1.48 0l-7.76 7.771-3.26-3.27a1.064 1.064 0 10-1.48 1.53l4 4a1.04 1.04 0 001.48 0l8.5-8.5a1.042 1.042 0 000-1.53z"
      fill="#fff"
    />
  </Svg>
);

const MoreColorIcon = () => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
  >
    <Circle cx={16} cy={16} r={15.5} fill="#fff" stroke="#DFE0E1" />
    <Path
      d="M15 13.333c0-2.326-2.2-3.826-2.293-3.886a.667.667 0 00-.747 0c-.093.066-2.293 1.586-2.293 3.886a2.667 2.667 0 005.333 0zm-2.667 1.334A1.334 1.334 0 0111 13.333a3.627 3.627 0 011.333-2.48 3.594 3.594 0 011.334 2.48 1.334 1.334 0 01-1.334 1.334zm7.707-5.22a.666.666 0 00-.747 0C19.2 9.513 17 11.033 17 13.333a2.667 2.667 0 005.333 0c0-2.326-2.2-3.826-2.293-3.886zm-.373 5.22a1.333 1.333 0 01-1.334-1.334 3.625 3.625 0 011.334-2.48A3.594 3.594 0 0121 13.333a1.334 1.334 0 01-1.333 1.334zm-2.96 1.446a.667.667 0 00-.747 0c-.093.067-2.293 1.587-2.293 3.887A2.667 2.667 0 1019 20c0-2.327-2.2-3.827-2.293-3.887zm-.374 5.22A1.334 1.334 0 0115 20a3.627 3.627 0 011.333-2.48A3.595 3.595 0 0117.667 20a1.334 1.334 0 01-1.334 1.333z"
      fill="#FF6651"
    />
  </Svg>
);

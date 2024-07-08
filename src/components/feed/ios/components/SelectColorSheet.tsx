import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Svg, {Circle, Path} from 'react-native-svg';

import {RedTrash1Icon} from 'assets/svg';

const FLAG_COLORS = [
  '#9214f5',
  '#2f9bff',
  '#08bb83',
  '#ff67b2',
  '#ffa51f',
  '#ff701f',
];

const SelectColorSheet = ({show, onClose, onContinue}) => {
  const SelectColorSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [300, 300], []);
  const [selectedColor, setSelectedColor] = useState(0);
  const [colour, setColour] = useState('#9214f5');

  const handleSheetChanges = useCallback((index: number) => {
    // if (index === -1) {
    //   onClose();
    // } else {
    // }
  }, []);

  useEffect(() => {
    if (show) {
      SelectColorSheetRef.current?.present();
    } else {
      SelectColorSheetRef.current?.close();
    }

    return () => {
      SelectColorSheetRef.current?.close();
    };
  }, [show]);

  const onSelectColor = (color, index) => {
    setSelectedColor(index);
    setColour(color);
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
                  isSelect && styles.selectFlagColor,
                ]}>
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

  return (
    <BottomSheetModal
      ref={SelectColorSheetRef}
      index={1}
      backgroundStyle={styles.container}
      handleIndicatorStyle={{height: 0}}
      snapPoints={snapPoints}
      keyboardBehavior={'interactive'}
      keyboardBlurBehavior="restore"
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      onChange={handleSheetChanges}>
      <View style={[StyleSheet.absoluteFill]}>
        <View style={styles.body}>
          <View style={styles.indicator}></View>
          <Text style={styles.txtNewWorld}>Select Country Color</Text>
          {renderFlagColors()}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.txtBtnCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContinue}
              onPress={() => {
                onContinue(colour);
              }}>
              <Text style={styles.txtBtnCreate}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const CheckIcon = () => (
  <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
    <Path
      d="M19.99 8.01a1.043 1.043 0 00-1.48 0l-7.76 7.771-3.26-3.27a1.064 1.064 0 10-1.48 1.53l4 4a1.04 1.04 0 001.48 0l8.5-8.5a1.042 1.042 0 000-1.53z"
      fill="#fff"
    />
  </Svg>
);

const MoreColorIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <Circle cx={16} cy={16} r={15.5} fill="#fff" stroke="#DFE0E1" />
    <Path
      d="M15 13.333c0-2.326-2.2-3.826-2.293-3.886a.667.667 0 00-.747 0c-.093.066-2.293 1.586-2.293 3.886a2.667 2.667 0 005.333 0zm-2.667 1.334A1.334 1.334 0 0111 13.333a3.627 3.627 0 011.333-2.48 3.594 3.594 0 011.334 2.48 1.334 1.334 0 01-1.334 1.334zm7.707-5.22a.666.666 0 00-.747 0C19.2 9.513 17 11.033 17 13.333a2.667 2.667 0 005.333 0c0-2.326-2.2-3.826-2.293-3.886zm-.373 5.22a1.333 1.333 0 01-1.334-1.334 3.625 3.625 0 011.334-2.48A3.594 3.594 0 0121 13.333a1.334 1.334 0 01-1.333 1.334zm-2.96 1.446a.667.667 0 00-.747 0c-.093.067-2.293 1.587-2.293 3.887A2.667 2.667 0 1019 20c0-2.327-2.2-3.827-2.293-3.887zm-.374 5.22A1.334 1.334 0 0115 20a3.627 3.627 0 011.333-2.48A3.595 3.595 0 0117.667 20a1.334 1.334 0 01-1.334 1.333z"
      fill="#FF6651"
    />
  </Svg>
);

export default SelectColorSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
    margin: 24,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 8,
    paddingHorizontal: 24,
  },
  indicator: {
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
    width: 60,
    height: 2,
    alignSelf: 'center',
  },
  topView: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: '#F3F4F5',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtNewWorld: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginVertical: 20,
  },
  flagContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagColorTxt: {
    fontFamily: 'Poppins',
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  flagColor: {
    width: 32,
    height: 32,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 30,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectFlagColor: {
    width: 40,
    height: 40,
    borderWidth: 3.75,
    borderColor: '#d5d6d7',
    borderRadius: 20,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContinue: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6651',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 4,
  },
  btnCancel: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 4,
  },
  txtBtnCreate: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  txtBtnCancel: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.4)',
  },
});

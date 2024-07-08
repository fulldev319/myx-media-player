import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import BottomSheet from '@gorhom/bottom-sheet'
import { hp, wp } from '../global';
import { Colors } from '../res';

const GBottomSheet = (props: any) => {
    const {
        onClose = null
    } = props
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%', '75%', '100%'], []);


    return (
        <View style={Style.container}>
            <BottomSheet
                ref={bottomSheetRef}
                index={2}
                snapPoints={snapPoints}
                onClose={onClose}
                enablePanDownToClose
                detached
                handleIndicatorStyle={Style.handleIndicator}
            >
                {props.children}
            </BottomSheet>
        </View>
    )
}

export default GBottomSheet

const Style = StyleSheet.create({
    container: {
        height: hp(100),
        width: wp(100),
        position: 'absolute'
    },
    handleIndicator: {
        width: wp(18),
        backgroundColor: Colors.color8
    }
})
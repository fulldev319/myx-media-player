import React, { } from 'react'
import { StyleSheet, TouchableOpacity, Modal, View, Dimensions, Text, Platform } from 'react-native'
import { hp, wp } from '../../global'
import { Animation } from '../../animations'
import { Colors } from '../../res'

const CurrentLocationPopUp = (props: any) => {
    const {
        onClose,
        markerXY = { pagey: 0, pagex: 0 },
        data = ''
    } = props
    return (
        <Modal
            animationType='none'
            visible={true}
            transparent={true}
            onDismiss={onClose}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableOpacity style={Style.dropDownModal} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={{
                    ...Style.dropDownContainer,
                    top: markerXY.pagey + hp(-0.8),
                    left: markerXY.pagex + wp(2)
                }}
                    activeOpacity={1}
                >

                    <View style={Style.boxContainer}>
                        <Animation
                            animation={"zoomIn"}
                            duration={200}
                        >
                            <View style={Style.contentBox}>
                                <Text style={Style.description} numberOfLines={3}>{data.ADDRESS}</Text>
                            </View>
                        </Animation>
                    </View>


                </TouchableOpacity>

            </TouchableOpacity>
        </Modal>
    )
}

export default CurrentLocationPopUp

const { width, height } = Dimensions.get('window')

const constantWidth = wp(10)
const Style = StyleSheet.create({
    container: {
        borderWidth: 0.1,
        borderColor: 'white',
        alignSelf: 'center',
    },
    markerImage: {
        width: wp(12),
        height: hp(6)
    },
    dropDownModal: {
        flex: 1,
    },
    dropDownContainer: {
        // paddingVertical: hp(1),
        width: constantWidth
    },
    marker: {
        width: width * 0.1,
        height: width * 0.1 * 1,
        borderRadius: width * 0.1 * 1 / 2,
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: Colors.theme,
    },
    markerOuter: {
        backgroundColor: Colors.white,
        width: constantWidth,
        height: hp(6),
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        borderBottomRightRadius: width * 0.1 * 1 / 2,
        borderBottomLeftRadius: width * 0.1 * 1 / 2,
    },
    boxContainer: {
        alignItems: 'center',
        top: hp(-2)
    },
    contentBox: {
        width: wp(45),
        backgroundColor: Colors.white,
        borderRadius: 15,
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
        justifyContent: 'center'
    },
    heading: {
        alignSelf: 'center',
        color: Colors.black,
        fontSize: wp(4)
    },
    description: {
        alignSelf: 'center',
        color: Colors.grey,
        textAlign: 'justify',
        fontSize: wp(3.5)
    }

})
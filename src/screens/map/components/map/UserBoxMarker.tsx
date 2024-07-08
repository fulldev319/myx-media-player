import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'
import { wp } from '../../global'
import { Colors } from '../../res'

const UserBoxMarker = () => {
    return (
        <View style={Style.container}>

            <View style={Style.boxView}>
                <Image
                    source={{ uri: 'https://picsum.photos/200/300' }}
                    style={Style.boxImage}
                />
            </View>
            <View style={Style.userImageCon}>
                <Image
                    source={{ uri: 'https://picsum.photos/200/300' }}
                    style={Style.userImage}
                />
            </View>
            <View style={[Style.triangle, Style.arrowDown]} />
        </View>
    )
}

export default UserBoxMarker

const { width } = Dimensions.get('window')
const Style = StyleSheet.create({
    container: {
        alignSelf: 'center',
        paddingTop: wp(2),
        paddingLeft: wp(3),
        borderWidth: 0,
        borderColor: 'red'
    },
    boxView: {
        width: wp(24),
        height: wp(26),
        borderRadius: 8,
        backgroundColor: Colors.color3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxImage: {
        width: wp(22),
        height: wp(24),
        borderRadius: 8,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        alignSelf: 'center'
    },
    arrowDown: {
        borderTopWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 0,
        borderLeftWidth: 8,
        borderTopColor: Colors.color3,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },

    userImageCon: {
        width: width * 0.08,
        height: width * 0.08 * 1,
        borderRadius: width * 0.08 * 1 / 2,
        backgroundColor: Colors.black,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0
    },
    userImage: {
        width: width * 0.06,
        height: width * 0.06 * 1,
        borderRadius: width * 0.06 * 1 / 2,
    }
})
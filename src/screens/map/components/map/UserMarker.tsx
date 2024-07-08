import { View, Text, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native'
import React from 'react'
import { hp, wp } from '../../global'
import { Images, Colors, Fonts } from '../../res'
import Entypo from 'react-native-vector-icons/Entypo'

const UserMarker = () => {
    return (
        <View style={Style.container}>
            <ImageBackground
                source={Images.polygonFrame}
                resizeMode='contain'
                style={Style.polygonFrame}
            >
                <View>
                    <Image
                        source={{ uri: 'https://picsum.photos/200/300' }}
                        style={Style.userImage}
                    />
                    <View style={Style.checkCon}>
                        <Entypo name='check' color={Colors.white} size={wp(3)} />
                    </View>
                </View>
                <Text style={Style.name}>Freak In Me</Text>
            </ImageBackground>
        </View>
    )
}

export default UserMarker

const { width } = Dimensions.get('window')
const Style = StyleSheet.create({
    container: {
        borderWidth: 0,
        borderColor: 'red',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    polygonFrame: {
        width: wp(28),
        height: wp(28),
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: wp(2),
    },
    userImage: {
        width: width * 0.12,
        height: width * 0.12 * 1,
        borderRadius: width * 0.12 * 1 / 2,
    },
    checkCon: {
        width: width * 0.045,
        height: width * 0.045 * 1,
        borderRadius: width * 0.045 * 1 / 2,
        backgroundColor: Colors.theme,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    name: {
        color: Colors.white,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: wp(2.4),
        width: wp(16),
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: hp(1)
    }
})
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { hp, wp } from '../../global'
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Fonts } from '../../res';
import Constants from '../../constants/Constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const NowListeningCard = () => {
    return (
        <View style={Style.container}>

            <LinearGradient colors={[Colors.themeRGBA15, Colors.white]}
                style={Style.linearContainer}
                start={{ x: 0, y: 2 }} end={{ x: 0, y: 3 }}
            >
                <Text style={Style.nowListTxt}>Now listening...</Text>
                <View style={Style.innerContainer}>
                    <Image
                        source={{ uri: 'https://picsum.photos/200/300' }}
                        style={Style.playerImage}
                    />
                    <View style={Style.nameTimeCon}>
                        <View>
                            <Text style={Style.name} numberOfLines={1}>Shape of you</Text>
                            <Text style={Style.des} numberOfLines={1}>Ed Sheeran</Text>
                        </View>
                        <Text style={Style.playerTime}>2:45
                            <Text style={{ ...Style.playerTime, color: Colors.blackRGBA20 }}>
                                /4:20
                            </Text>
                        </Text>
                    </View>
                    <TouchableOpacity style={Style.playBtn}>
                        <FontAwesome5 name='play' color={Colors.white} size={wp(3)} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    )
}

export default NowListeningCard

const { width } = Dimensions.get('window')
const Style = StyleSheet.create({
    container: {
        marginTop: wp(6)
    },
    linearContainer: {
        width: '100%',
        borderRadius: 16,
        paddingVertical: wp(3),
        paddingHorizontal: wp(4)
    },
    nowListTxt: {
        color: Colors.theme,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: wp(3.5),
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM
    },
    innerContainer: {
        flexDirection: 'row',
        paddingVertical: wp(2),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    playerImage: {
        width: wp(12),
        height: wp(12),
        borderRadius: 8
    },
    nameTimeCon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        width: wp(63)
    },
    name: {
        color: Colors.color6,
        fontFamily: Fonts.APPFONT_M,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM,
        fontSize: wp(3.5)
    },
    des: {
        color: Colors.color6RGBA60,
        fontFamily: Fonts.APPFONT_R,
        fontSize: wp(3.5)
    },
    playerTime: {
        fontSize: wp(3.5),
        fontFamily: Fonts.APPFONT_R,
        color: Colors.blackRGBA80,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM
    },
    playBtn: {
        width: width * 0.06,
        height: width * 0.06 * 1,
        borderRadius: width * 0.06 * 1 / 2,
        backgroundColor: Colors.theme,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: wp(0.5),
        marginTop: hp(-0.4)
    }
})
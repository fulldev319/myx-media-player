import { View, Text, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native'
import React from 'react'
import { hp, wp } from '../../global'
import { Colors, Fonts, Images } from '../../res'
import { Animation } from '../../animations'
import { Constants } from '../../constants'
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


const BottomPlayer = (props: any) => {
    const {
        visible = true,
    } = props

    return (
        visible &&
        <View style={Style.container}>
            <Animation
                duration={400}
            >
                <ImageBackground
                    source={Images.playerBg}
                    style={Style.playerBg}
                >
                    <Image
                        source={{ uri: 'https://picsum.photos/200/300' }}
                        style={Style.playerImage}
                    />
                    <View style={Style.nameCon}>
                        <Text style={Style.name}>Wonderful Tonight</Text>
                        <Text style={Style.des}>Lil Tecca</Text>
                    </View>
                    <View style={Style.playerProgressOuter}>
                        <Progress.Circle
                            size={wp(8)}
                            indeterminate={false}
                            progress={0.3}
                            borderWidth={0}
                            thickness={2.5}
                            strokeCap='round'
                            color={Colors.white}
                        />
                        <MaterialCommunityIcons name='pause-circle' size={wp(5.5)} color={Colors.white} style={{ position: 'absolute' }} />
                    </View>
                </ImageBackground>
            </Animation>
        </View>
    )
}

export default BottomPlayer

const { width } = Dimensions.get('window')
const Style = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: wp(100),
        paddingTop: hp(0.5),
        overflow: 'hidden',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    playerBg: {
        width: wp(100),
        height: wp(25),
        paddingVertical: wp(4),
        paddingHorizontal: wp(5),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    playerImage: {
        width: wp(12),
        height: wp(12),
        borderRadius: 8
    },
    nameCon: {
        width: wp(62),
        height: wp(12),
        borderColor: '#fff'
    },
    name: {
        color: Colors.white,
        fontSize: wp(3.8),
        fontFamily: Fonts.APPFONT_M,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM
    },
    des: {
        color: Colors.whiteRGBA60,
        fontSize: wp(3.5),
        fontFamily: Fonts.APPFONT_R,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM
    },
    playerProgressOuter: {
        marginTop: wp(1.5),
        borderWidth: 2.5,
        borderColor: Colors.whiteRGBA30,
        width: width * 0.08,
        height: width * 0.08 * 1,
        borderRadius: width * 0.08 * 1 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
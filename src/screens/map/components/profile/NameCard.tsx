import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { wp } from '../../global'
import { Colors, Fonts } from '../../res'
import Constants from '../../constants/Constants'



const NameCard = (props: any) => {
    const {
        data = {
            name: '',
            description: '',
            image: ''
        },
        from = 'Profile'
    } = props
    const { name, description, image } = data

    return (
        <View style={Style.container}>
            <Image
                source={{ uri: image }}
                style={Style.userImage}
            />
            <View style={{ width: from === 'Profile' ? wp(55) : wp(59.6) }}>
                <Text style={Style.name}>{name}</Text>
                <Text style={Style.des}>{description}</Text>
            </View>
            {
                from === 'Profile' ?
                    <TouchableOpacity style={Style.followEditBtn}>
                        <Text style={Style.followEditBtnTxt}>Follow</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{
                        ...Style.followEditBtn, backgroundColor: Colors.white, borderWidth: 1,
                        borderColor: Colors.theme
                    }}>
                        <Text style={{ ...Style.followEditBtnTxt, color: Colors.theme }}>Edit</Text>
                    </TouchableOpacity>
            }
        </View>
    )
}

export default NameCard

const { width, height } = Dimensions.get('window')
const Style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: wp(6)
    },
    userImage: {
        width: width * 0.13,
        height: width * 0.13 * 1,
        borderRadius: width * 0.13 * 1 / 2,
    },
    followEditBtn: {
        backgroundColor: Colors.theme,
        paddingHorizontal: wp(3),
        paddingVertical: wp(0.7),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    followEditBtnTxt: {
        color: Colors.white,
        fontSize: wp(3.5),
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM,
        fontFamily: Fonts.APPFONT_SB
    },
    name: {
        color: Colors.color6,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: wp(3.6),
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM,
    },
    des: {
        color: Colors.color6RGBA60,
        fontFamily: Fonts.APPFONT_R,
        fontSize: wp(3.5),
    }
})
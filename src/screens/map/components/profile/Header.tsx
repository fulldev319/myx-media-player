import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { hp, wp } from '../../global'
import { Colors, Fonts } from '../../res'

const Header = (props: any) => {
    const { from, onBack = null } = props
    return (
        <View style={Style.container}>
            <TouchableOpacity onPress={onBack}>
                <AntDesign name='arrowleft' color={Colors.color6} size={wp(6)} />
            </TouchableOpacity>

            <Text style={Style.headerTitle}>{from === 'Profile' ? 'Profile' : 'My Profile'}</Text>
        </View>
    )
}

export default Header

const Style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingTop: wp(2)
    },
    headerTitle: {
        position: 'absolute',
        alignSelf: 'center',
        fontSize: wp(4.5),
        color: Colors.color6,
        top: wp(2),
        fontFamily: Fonts.APPFONT_M
    }
})
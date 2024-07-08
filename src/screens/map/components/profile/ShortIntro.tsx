import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { wp } from '../../global'
import { Colors, Fonts } from '../../res';
import Constants from '../../constants/Constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import * as Progress from 'react-native-progress';

const ShortIntro = () => {
    return (
        <View style={Style.container}>
            <Text style={Style.heading}>Short Introduction</Text>
            <View style={Style.innerCon}>
                <FontAwesome5 name='play' color={Colors.theme} size={wp(4)} />
                <Progress.Bar
                    progress={0.3}
                    width={wp(65)}
                    color={Colors.theme}
                    unfilledColor={Colors.color6RGBA20}
                    borderWidth={0}
                    height={wp(1.5)}
                />
                <Text style={Style.time}>01:32</Text>
            </View>
        </View>
    )
}

export default ShortIntro

const Style = StyleSheet.create({
    container: {
        marginTop: wp(6)
    },
    heading: {
        color: Colors.color6,
        fontSize: wp(3.5),
        fontFamily: Fonts.APPFONT_SB,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM
    },
    innerCon: {
        borderWidth: 1,
        borderColor: Colors.theme,
        borderRadius: 16,
        marginTop: wp(3),
        height: wp(13),
        paddingHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    time: {
        fontSize: wp(3.2),
        color: Colors.color6,
        fontFamily: Fonts.APPFONT_R,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM
    }
})
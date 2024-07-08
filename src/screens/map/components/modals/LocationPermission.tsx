import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { hp, wp } from '../../global'
import { Colors } from '../../res'
import { Animation } from '../../animations'
import Constants from '../../constants/Constants'

const LocationPermission = (props: any) => {
    const {
        visible = true,
        onAllowPress = null,
        onSkipPress = null
    } = props

    return (
        <SafeAreaView style={Style.container}>
            {
                visible &&
                <Animation
                    duration={400}
                >
                    <View style={{ ...Style.innerContainer, ...Style.shadow }}>
                        <Text style={Style.description}>{`Let ${Constants.APP_NAME} access your location to find the Radios nearby you`}</Text>
                        <View style={Style.allowSkipCon}>
                            <TouchableOpacity style={Style.allowBtn}
                                onPress={onAllowPress}
                            >
                                <Text style={Style.allowTxt}>Allow</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onSkipPress}
                            >
                                <Text style={Style.skipTxt}>Skip</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animation>
            }

        </SafeAreaView>
    )
}

export default LocationPermission

const Style = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: wp(100),
        paddingVertical: hp(2),
        paddingHorizontal: wp(3),
    },
    innerContainer: {
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    shadow: {
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    description: {
        color: Colors.grey,
        fontSize: wp(4),
        width: wp(60),
        lineHeight: hp(3.5)
    },
    allowSkipCon: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    allowBtn: {
        paddingVertical: hp(0.2),
        paddingHorizontal: wp(5),
        borderRadius: 30,
        backgroundColor: Colors.theme,
        marginTop: hp(0.8)
    },
    allowTxt: {
        fontSize: wp(4),
        color: Colors.white,
    },
    skipTxt: {
        color: Colors.grey,
        marginVertical: hp(1),
        ontSize: wp(4),
    }
})
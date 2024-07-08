import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { wp } from '../../global'
import { Colors, Fonts, Images } from '../../res';
import Constants from '../../constants/Constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import * as Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons'

const ShortIntroMyProfile = () => {
    const [showRecorder, setShowRecorder] = useState({
        visible: false,
        recording: false
    })
    const [newRecord, setNewRecord] = useState(false)

    const onUpdatePress = () => setShowRecorder({ visible: true, recording: false })
    const onSavePress = () => {
        setShowRecorder({ visible: false, recording: false })
        setNewRecord(false)
    }
    const onHoldToStartRecord = () => setShowRecorder({ visible: true, recording: true })

    const onPressRecordingMic = () => {
        setShowRecorder({ visible: false, recording: false })
        setNewRecord(true)
    }
    return (
        <View style={Style.container}>
            <View style={Style.headingCon}>
                <Text style={Style.heading}>Short Introduction</Text>
                {
                    newRecord ?
                        <TouchableOpacity onPress={onSavePress}>
                            <Text style={{ ...Style.heading, color: Colors.theme }}>
                                Save
                            </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={onUpdatePress}>
                            <Text style={{ ...Style.heading, color: Colors.theme }}>
                                Update
                            </Text>
                        </TouchableOpacity>
                }
            </View>
            {
                !showRecorder.visible && !showRecorder.recording ?
                    <View style={Style.innerCon}>
                        <FontAwesome5 name='play' color={Colors.theme} size={wp(4)} />
                        <Progress.Bar
                            progress={0.3}
                            width={newRecord ? wp(55) : wp(65)}
                            color={Colors.theme}
                            unfilledColor={Colors.color6RGBA20}
                            borderWidth={0}
                            height={wp(1.5)}
                        />
                        <Text style={Style.time}>01:32</Text>
                        {
                            newRecord &&
                            <TouchableOpacity>
                                <Image
                                    source={Images.refresh}
                                    style={Style.refreshIcon}
                                />
                            </TouchableOpacity>
                        }
                    </View>
                    :
                    showRecorder.visible && !showRecorder.recording ?
                        <TouchableOpacity style={Style.innerCon}
                            onLongPress={onHoldToStartRecord}
                        >
                            <Text style={Style.description}>Hold to start recording</Text>
                            <View style={Style.micIconCon}>
                                <Ionicons name='mic-outline' color={Colors.white} size={wp(6)} />
                            </View>
                        </TouchableOpacity>
                        : showRecorder.visible && showRecorder.recording ?
                            <View style={Style.recordingCon}>
                                <Progress.Bar
                                    progress={0.72}
                                    width={wp(91.50)}
                                    color={Colors.themeRGBA20}
                                    unfilledColor={Colors.white}
                                    borderRadius={16}
                                    borderWidth={0}
                                    height={wp(12.50)}
                                />
                                <View style={Style.recordingInnerCon}>
                                    <Text style={Style.description}>Recording... 7.2 / 10 secs</Text>
                                    <TouchableOpacity style={{ ...Style.micIconCon, backgroundColor: Colors.white, borderColor: Colors.theme, borderWidth: 1 }}
                                        onPress={onPressRecordingMic}
                                    >
                                        <Ionicons name='mic-outline' color={Colors.theme} size={wp(6)} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
            }
        </View>
    )
}

export default ShortIntroMyProfile

const Style = StyleSheet.create({
    container: {
        marginTop: wp(6)
    },
    headingCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    },
    description: {
        color: Colors.color9,
        fontSize: wp(3.5)
    },
    micIconCon: {
        borderRadius: 16,
        backgroundColor: Colors.theme,
        width: wp(10),
        height: wp(10),
        marginRight: wp(-2.5),
        paddingLeft: wp(0.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    recordingCon: {
        borderWidth: 1,
        borderColor: Colors.theme,
        borderRadius: 16,
        marginTop: wp(3),
        height: wp(13),
        overflow: 'hidden'
    },
    recordingInnerCon: {
        position: 'absolute',
        height: wp(12.50),
        width: wp(91.50),
        borderRadius: 16,
        paddingHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    refreshIcon: {
        width: wp(5),
        height: wp(5)
    }
})
import React, { useState, createRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { Colors } from '../../res'
import MarkerPopUp from './MarkerPopUp'

const Marker = (props: any) => {
    var markerViewRef = createRef<any>()
    const { index, data } = props

    const [markerXY, setMarkerXY] = useState({ pagex: 0, pagey: 0 })
    const [markerPopUpVisible, setMarkerPopUpVisible] = useState(false)
    const [markerPressIndex, setMarkerPressIndex] = useState('')
    const [markerPressData, setMarkerPressData] = useState('')

    const onMarkerPress = (index: any, data: any) => {
        if(markerViewRef) {
            //@ts-ignore
            markerViewRef.current.measure((x, y, width, height, pagex, pagey) => {
                setMarkerXY({ pagex, pagey })
                setMarkerPressIndex(index)
                setMarkerPressData(data)
                setMarkerPopUpVisible(true)
            })
        }
    }

    const onCloseMarkerPopUp = () => setMarkerPopUpVisible(false)

    return (
        <View style={Style.container}
            ref={markerViewRef}
        >
            <TouchableOpacity
                style={Style.markerOuter}
                onPress={onMarkerPress.bind(null, index, data)}
                activeOpacity={0.6}
            >
            </TouchableOpacity>

            {
                index === markerPressIndex
                && markerPopUpVisible
                && <MarkerPopUp
                    markerXY={markerXY}
                    data={markerPressData}
                    onClose={onCloseMarkerPopUp}
                />}
        </View >
    )
}

export default Marker

const { width } = Dimensions.get('window')
const Style = StyleSheet.create({
    container: {
        borderWidth: 0.1,
        borderColor: 'white',
        alignSelf: 'center'
    },
    markerOuter: {
        width: width * 0.1,
        height: width * 0.1 * 1,
        borderRadius: width * 0.1 * 1 / 2,
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: Colors.theme,
    },
})

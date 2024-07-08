//@ts-nocheck
import React, { } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps';
import { wp } from '../../global';

import { Colors, Images } from '../../res'

const ShapeSource = (props: any) => {
    const {
        features = []
    } = props
    return (
        <MapboxGL.ShapeSource
            ref={global.shapeSource}
            shape={{
                type: 'FeatureCollection', features: [...features]
            }}


            id="symbolLocationSource"
            hitbox={{ width: 18, height: 18 }}
            onPress={async point => {
                if(point.features[0].properties.cluster) {
                    // when user click on cluster
                } else {
                    // if the user clicks ind¿
                    // console.log(point.features[0])
                }
            }}
            clusterRadius={50}
            clusterMaxZoom={14}
            cluster
        >
            <MapboxGL.SymbolLayer
                id="pointCount"
                style={layerStyles.clusterCount}
            />
            <MapboxGL.CircleLayer
                id="clusteredPoints"
                belowLayerID="pointCount"
                filter={['has', 'point_count']}
                style={{
                    circlePitchAlignment: 'map',
                    circleColor: Colors.color2,
                    circleRadius: [
                        'step',
                        ['get', 'point_count'],
                        25,
                        100,
                        25,
                        250,
                        30,
                        750,
                        40,
                    ],
                    circleOpacity: 1,
                    circleStrokeWidth: 0,
                    circleStrokeColor: '#fff',
                }}
            />
            <MapboxGL.SymbolLayer
                id="singlePoint"
                filter={['!', ['has', 'point_count']]}
                style={{
                    iconImage: Images.circleMarker,
                    iconSize: 0.1,
                    iconHaloColor: 'black',
                    iconHaloWidth: 10,
                    iconColor: 'white',
                    iconHaloColor: 'black',
                    iconHaloWidth: 400,
                    iconAllowOverlap: true,
                }}
            />


        </MapboxGL.ShapeSource>
    )
}

export default ShapeSource

const layerStyles = {
    singlePoint: {
        circleColor: 'green',
        circleOpacity: 0.84,
        circleStrokeWidth: 2,
        circleStrokeColor: 'white',
        circleRadius: 5,
        circlePitchAlignment: 'map',
    },
    clusteredPoints: {},
    clusterCount: {
        textField: '{point_count}',
        textSize: wp(4),
        textColor: Colors.white,
        textPitchAlignment: 'map',
    },
}
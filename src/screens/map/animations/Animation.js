import React from 'react'
import * as Animatable from 'react-native-animatable';

const Animation = (props) => {
    const {
        animation = 'zoomIn',
        duration = 200
    } = props
    return (
        <Animatable.View
            animation={animation}
            useNativeDriver={true}
            duration={duration}
        >
            {props.children}
        </Animatable.View>
    )
}

export default Animation

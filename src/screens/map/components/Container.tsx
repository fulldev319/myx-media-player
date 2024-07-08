import React from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import { Colors } from '../res'
import { Animation } from '../animations'

const Container = (props: any) => {
    const {
        showAnimation = true,
        animationType = "slideInRight",
        statusBarColor = Colors.color1,
        statusBarStyle = "light-content",
        style = null
    } = props
    return (
        // <ScrollView
        //     showsVerticalScrollIndicator={false}
        //     contentContainerStyle={{ flexGrow: 1 }}
        // >
        <View style={{ ...Styles.container, ...style }}>
            <Animation
                animation={showAnimation ? animationType : null}
            >
                <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarColor} />
                {props.children}
            </Animation>
        </View>
        // </ScrollView>
    )
}

export default Container

const Styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.backgroundColor,
        flex: 1
    }
})



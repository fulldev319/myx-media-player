import { View, StyleSheet } from 'react-native'
import React from 'react'
import Header from './Header'
import { wp } from '../../global'
import NameCard from './NameCard'
import NowListeningCard from './NowListeningCard'
import ShortIntro from './ShortIntro'
import FavMusic from './FavMusic'
import { ScrollView } from 'react-native-gesture-handler'
import ShortIntroMyProfile from './ShortIntroMyProfile'

const Profile = (props: any) => {
    const {
        data = {
            name: 'Alenea Tyson',
            description: 'In mi quis sagittis sit euismod',
            image: 'https://picsum.photos/200/300'
        },
        from = 'Profile',
        onBack = null
    } = props

    return (
        // <ScrollView
        //     showsVerticalScrollIndicator={false}
        //     contentContainerStyle={{ flexGrow: 1, paddingBottom: wp(12) }}
        // >
        <View style={Style.container}>
            <Header
                from={from}
                onBack={onBack}
            />
            <NameCard
                data={data}
                from={from}
            />
            <NowListeningCard />
            {from === 'Profile' ?
                <ShortIntro />
                : <ShortIntroMyProfile />}
            <FavMusic />
        </View>
        // </ScrollView>
    )
}

export default Profile

const Style = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4)
    }
})
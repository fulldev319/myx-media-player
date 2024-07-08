import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { hp, wp } from '../../global'
import { Colors, Fonts, Images } from '../../res';
import Constants from '../../constants/Constants';
import { FlatList } from 'react-native-gesture-handler';


const FavMusic = () => {
    const [data, setData] = useState([
        {
            songName: 'Freak In Me',
            artistName: 'Anuel AA',
            image: 'https://picsum.photos/200/300',
            plays: '235',
            id: '1'
        },
        {
            songName: 'Freak In Me',
            artistName: 'Anuel AA',
            image: 'https://picsum.photos/200/300',
            plays: '235',
            id: '2'
        },
        {
            songName: 'Freak In Me',
            artistName: 'Anuel AA',
            image: 'https://picsum.photos/200/300',
            plays: '235',
            id: '3'
        },
        {
            songName: 'Freak In Me',
            artistName: 'Anuel AA',
            image: 'https://picsum.photos/200/300',
            plays: '235',
            id: '4'
        }
    ])

    const renderCards = ({ item }: any) => {
        return (
            <View style={Style.cardContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={Style.itemImage}
                />
                <Text style={Style.name}
                    numberOfLines={1}
                >
                    {item.songName}
                </Text>
                <Text style={Style.des}
                    numberOfLines={1}
                >
                    {item.artistName}
                </Text>
                <View style={Style.playsCon}>
                    <Image
                        source={Images.playGrey}
                        style={Style.playIcon}
                    />
                    <Text numberOfLines={1}
                        style={Style.playsTxt}
                    >
                        {item.plays} Plays
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={Style.container}>
            <Text style={Style.heading}>Favourite Musics</Text>
            <FlatList
                data={data}
                renderItem={renderCards}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={Style.listContainer}
                horizontal
            />
        </View>
    )
}

export default FavMusic

const Style = StyleSheet.create({
    container: {
        marginTop: wp(6),
        width: wp(100)
    },
    heading: {
        color: Colors.color6,
        fontSize: wp(3.5),
        fontFamily: Fonts.APPFONT_SB,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM
    },
    listContainer: {
        marginTop: wp(3),
        paddingRight: wp(5)
    },
    cardContainer: {
        marginRight: wp(2),
        width: wp(30)
    },
    itemImage: {
        width: wp(30),
        height: wp(30),
        borderRadius: 8
    },
    name: {
        color: Colors.color6,
        fontSize: wp(3.5),
        fontFamily: Fonts.APPFONT_SB,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM,
        marginTop: hp(0.5),
        width: wp(30)
    },
    des: {
        color: Colors.color6RGBA60,
        fontSize: wp(3),
        fontFamily: Fonts.APPFONT_R,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM,
        width: wp(30)
    },
    playsCon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: wp(1.5),
    },
    playIcon: {
        width: wp(5),
        height: wp(5),
    },
    playsTxt: {
        color: Colors.color6RGBA60,
        fontFamily: Fonts.APPFONT_R,
        marginBottom: Constants.FONTFAMILY_MARGINBOTTOM,
        fontSize: wp(3),
        marginLeft: wp(1),
        width: wp(22)
    }
})
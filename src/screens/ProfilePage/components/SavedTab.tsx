import {SongItem} from 'components/cards/SongItem';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {BookMarkItem} from './BookMarkItem';

const demoData = [
  {
    Image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZc6gcQhyIpo9bdZOndCOdryuAHKOWztJWA&usqp=CAU',
    Artist: 'Farel',
    Name: 'Party with me 🎉👻',
    Description: 'id pharetra ipsum sus...',
  },
  {
    Image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZc6gcQhyIpo9bdZOndCOdryuAHKOWztJWA&usqp=CAU',
    Artist: 'Farel',
    Name: 'Party with me 🎉👻',
    Description: 'id pharetra ipsum sus...',
  },
  {
    Image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZc6gcQhyIpo9bdZOndCOdryuAHKOWztJWA&usqp=CAU',
    Artist: 'Farel',
    Name: 'Party with me 🎉👻',
    Description: 'id pharetra ipsum sus...',
  },
  {
    Image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZc6gcQhyIpo9bdZOndCOdryuAHKOWztJWA&usqp=CAU',
    Artist: 'Farel',
    Name: 'Party with me 🎉👻',
    Description: 'id pharetra ipsum sus...',
  },
  {
    Image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZc6gcQhyIpo9bdZOndCOdryuAHKOWztJWA&usqp=CAU',
    Artist: 'Farel',
    Name: 'Party with me 🎉👻',
    Description: 'id pharetra ipsum sus...',
  },
  {
    Image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZc6gcQhyIpo9bdZOndCOdryuAHKOWztJWA&usqp=CAU',
    Artist: 'Farel',
    Name: 'Party with me 🎉👻',
    Description: 'id pharetra ipsum sus...',
  },
  {
    Image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZc6gcQhyIpo9bdZOndCOdryuAHKOWztJWA&usqp=CAU',
    Artist: 'Farel',
    Name: 'Party with me 🎉👻',
    Description: 'id pharetra ipsum sus...',
  },
  {
    Image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyZc6gcQhyIpo9bdZOndCOdryuAHKOWztJWA&usqp=CAU',
    Artist: 'Farel',
    Name: 'Party with me 🎉👻',
    Description: 'id pharetra ipsum sus...',
  },
];

export const SavedTab = () => {
  const [songList, setSongList] = useState(demoData);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Saved Songs</Text>
      <ScrollView>
        <View style={styles.container}>
          {songList.length > 0 &&
            songList.map((item, index) => (
              <BookMarkItem key={index} item={item} />
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 21,
    paddingTop: 12,
  },
  container: {
    display: 'flex',
    paddingBottom: 120,
  },
  title: {
    paddingLeft: 12,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

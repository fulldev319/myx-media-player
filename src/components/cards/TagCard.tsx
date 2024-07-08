import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const TagCard = ({data, style = {}}) => {
  return (
    <TouchableOpacity style={[styles.container, style]}>
      <View style={styles.layout}>
        <Text style={styles.symbol}>#</Text>
        <Text style={styles.name}>
            {data.item.name}
        </Text>
        <Text style={styles.meta}>{`${data.item.count} posts`}</Text>
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    layout: {
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderRadius: 10,
        height: 72,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    symbol: {
        fontSize: 20,
        color: '#FFFFFF',
        opacity: 0.4
    },
    name: {
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 16,
        marginRight: 'auto'
    },
    meta: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.6
    } 
});
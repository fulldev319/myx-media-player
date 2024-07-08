import AsyncStorage from '@react-native-async-storage/async-storage';

const GetData = (key: any) => {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.getItem(key).then((data) => {
            data != null ? resolve(JSON.parse(data))
                : resolve(null);
        })
            .catch((error) => {
                console.log('error while reading data from AsyncStorage =>', error)
                reject('')
            })
    })
};

export default GetData;

import AsyncStorage from '@react-native-async-storage/async-storage';

const SetData = async (key: any, value: any) => {
    return new Promise(async (resolve, reject) => {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue).then(() => resolve(''))
            .catch((error) => {
                console.log('Error while saving data in AsyncStorage =>', error)
                reject(error)
            })
    })
};

export default SetData;

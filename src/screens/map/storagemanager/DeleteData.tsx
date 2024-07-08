import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteData = (key: any) => {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.removeItem(key).then(() => resolve(''))
            .catch((error) => {
                console.log('error while deleting data from AsyncStorage =>', error)
                reject('')
            })
    })
};

export default DeleteData;

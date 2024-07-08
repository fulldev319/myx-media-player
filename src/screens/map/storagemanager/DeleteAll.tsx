import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteAll = () => {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.clear().then(() => resolve(''))
            .catch((error) => {
                console.log('error while deleting data from AsyncStorage =>', error)
                reject('')
            })
    })
};

export default DeleteAll;

import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'

class DownloadServicesClass {

    deleteFile = (path: any) => {
        return new Promise((resolve, reject) => {
            const { fs } = RNFetchBlob;
            fs.unlink(path).then(() => resolve(''))
                .catch((error) => {
                    console.log('error while deleting file =>', error)
                    reject('')
                })
        })
    }

    makeDirectory = (path: any) => {
        return new Promise(async (resolve, reject) => {
            RNFS.exists(path).then((res) => {
                if(res) {
                    resolve('')
                }
                else {
                    RNFS.mkdir(path).then(() => {
                        resolve('done')
                    })
                        .catch((error) => {
                            console.log('Error while making Directory FileManager =>', error)
                            reject('')
                        })
                }
            })
                .catch((error) => {
                    console.log('Error while checking Exists makeDirectory FileManager =>', error)
                    reject('')
                })
        })
    }


}


const DownloadServices = new DownloadServicesClass()
export default DownloadServices

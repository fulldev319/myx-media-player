
import RNFetchBlob from 'rn-fetch-blob'
class DownloadServicesClass {

    downloadEmoji = (emojiCode: any) => {
        return new Promise((resolve, reject) => {
            const { config, fs } = RNFetchBlob;
            var image_URL = `https://emojiapi.dev/api/v1/${emojiCode}/400.png`
            let options = {
                fileCache: true
            };
            config(options)
                .fetch('GET', image_URL)
                .then(res => {
                    resolve(res)
                })
                .catch((error) => {
                    console.log('error while downloading file =>', error)
                    reject('')
                })
        })
    }


}


const DownloadServices = new DownloadServicesClass()
export default DownloadServices
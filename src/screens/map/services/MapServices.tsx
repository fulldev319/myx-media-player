import {PermissionsAndroid, Platform} from 'react-native';
import {SetData, Keys} from '../storagemanager';
import Geolocation from 'react-native-geolocation-service';

class MapServicesClass {
  locationPermission = () => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('--- location check');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          SetData(Keys.LOCATION_PERMISSION, 'granted')
            .then(() => {
              resolve('granted');
            })
            .catch(() => resolve('granted'));
        } else {
          resolve('denied');
        }
      } catch (error) {
        console.log('error while getting user location permission =>', error);
        reject('');
      }
    });
  };

  getCurrentLocation = () => {
    return new Promise(async (resolve, reject) => {
      // if (Platform.OS === 'ios') {
      //   await Geolocation.requestAuthorization('whenInUse');
      // }

      Geolocation.getCurrentPosition(
        position => {
          if (position) {
            resolve(position);
          }
        },
        error => {
          reject('');
          console.log('error while getting current location ->', error);
        },
        {timeout: 50000},
      );
    });
  };
}

const MapServices = new MapServicesClass();
export default MapServices;

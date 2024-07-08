/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Buffer} from 'buffer';
import {NativeBaseProvider} from 'native-base';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {store, persistor} from './redux/store';
import {LogBox} from 'react-native';
import {Auth} from 'screens/Auth';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthContextProvider} from 'contexts/AuthContext';
import {SpotifyContextProvider} from 'contexts/SpotifyContext';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Constants} from 'screens/map/constants';
import {GiphySDK} from '@giphy/react-native-sdk';
import Config from 'react-native-config';
global.Buffer = Buffer;

const App = () => {
  MapboxGL.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN);
  GiphySDK.configure({apiKey: Config.IOS_GIPHY_API_KEY});
  LogBox.ignoreAllLogs(true);

  SplashScreen.hide();

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <SpotifyContextProvider>
          <PersistGate loading={null} persistor={persistor}>
            <GestureHandlerRootView style={{flex: 1}}>
              {/* <BottomSheetModalProvider> */}
              <AuthContextProvider>
                <Auth />
              </AuthContextProvider>
              {/* </BottomSheetModalProvider> */}
            </GestureHandlerRootView>
          </PersistGate>
        </SpotifyContextProvider>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;

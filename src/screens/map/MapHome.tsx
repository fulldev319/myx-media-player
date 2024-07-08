import React, {useState, useEffect, useCallback} from 'react';
import {
  Container,
  MapView,
  FantasyMapView,
  MarkerView,
  LocationPermission,
  Loader,
  RadioMarker,
  ListeningMarker,
  MapBottomBar,
  MapTopBar,
  BottomSheet,
  Profile,
} from './components';
import {geoData} from './assets';
import {MapServices} from './services';
import {GetData, Keys, SetData} from './storagemanager';
import {Platform, StyleSheet} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MapFilterSheet} from 'components/map/filter_sheet';
import {MapYourFriend} from 'components/map/your_friends';
import {MapLiveRadio} from 'components/map/live_radio';
import {MapCreateNewRaio} from 'components/map/create_new_radio';
import RadioDetailSheet from 'components/map/radio_detail';
import {LocationDetail} from 'components/map/location_detail';
import {LetExploreSheet} from 'components/map/let_expore';
import {
  apiGetMapFriends,
  apiGetMapMemories,
  apiGetMapRadios,
  apiGetMapFeaturedRadios,
} from 'helper/mapHelper';
import {
  MUSIC_BRANCH,
  PlayerTheme,
  Track,
  useTracks,
} from 'contexts/TrackContext';
import {useAuth} from 'contexts/AuthContext';
import MemoryMarker from './components/map/MemoryMarker';
import {RootState} from 'redux/interfaces';
import {useSelector} from 'react-redux';
import {GeneralFeedView} from 'components/feed/ios';
import {CountryDetail} from './new_world/components/country_detail';

const MapHomePage = () => {
  const navigation = useNavigation();
  const {setCurFeedTab} = useAuth();
  const {
    setPlayerTheme,
    playlistId,
    curTrack,
    playTrackList,
    playTrack,
    togglePlayer,
  } = useTracks();

  const {mapSetting} = useSelector((state: RootState) => state.map);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState([
    -9.079503536971345, -27.5017771713921,
  ]);
  const [loader, setLoader] = useState(true);
  const [showMapFilter, setShowMapFilter] = useState(false);
  const [showMapFriends, setShowMapFriends] = useState(false);
  const [showMapLiveRadio, setShowMapLiveRadio] = useState(false);
  const [showRadioDetail, setShowRadioDetail] = useState(false);
  const [showLocationDetail, setShowLocationDetail] = useState(false);
  const [showNewWorld, setShowNewWorld] = useState(false);
  const [showMapCreateNewRadio, setShowMapCreateNewRadio] = useState(false);
  const [featuresData, setFeaturesData] = useState('');
  const [showGeneralFeed, setShowGeneralFeed] = useState(false);

  const [arrNearFriends, setArrNearFriends] = useState([]);
  const [arrNearRadios, setArrNearRadios] = useState([]);
  const [arrMemories, setArrMemories] = useState([]);
  const [arrFeaturedRadios, setArrFeaturedRadios] = useState([]);
  const [selectedNormalRadio, setSelectedNormalRadio] = useState(null);

  const forceUpdate = React.useReducer(bool => !bool)[1];
  const [zoomLevel, setZoomLevel] = useState(14.1);
  const [bottomSheet, setBottomSheet] = useState({
    visible: false,
    data: {},
  });
  const [bottomPlayer, setBottomPlayer] = useState({
    visible: true,
    data: {},
  });

  useFocusEffect(
    useCallback(() => {
      setPlayerTheme(PlayerTheme.Light);
      setShowGeneralFeed(true);

      return () => {
        setPlayerTheme(PlayerTheme.Dark);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      // const clean =
      //   Platform.OS === 'android'
      //     ? getLocationPermission()
      //     : getCurrentLocation();
      const clean = Platform.OS === 'android' && getLocationPermission();
      return () => clean;
    }, []),
  );

  useEffect(() => {
    const cleanUp = setCordinatesData();
    return () => cleanUp;
  }, []);

  const getCurrentLocation = () => {
    MapServices.getCurrentLocation()
      .then((res: any) => {
        if (res) {
          const {coords} = res;
          const {latitude, longitude} = coords;
          setCurrentLocation([latitude, longitude]);
          setLoader(false);
        } else {
          setLoader;
        }
      })
      .catch(() => setLoader(false));
  };

  const getLocationPermission = () => {
    GetData(Keys.LOCATION_PERMISSION).then(data => {
      console.log(`location permission status`, data);
      if (data && data === 'denied') {
        setShowPermissionModal(true);
        setLoader(false);
      } else if (data && data === 'granted') {
        getCurrentLocation();
      } else if (!data) {
        MapServices.locationPermission().then(res => {
          if (res === 'denied') {
            SetData(Keys.LOCATION_PERMISSION, 'denied');
            setShowPermissionModal(true);
            setLoader(false);
          } else if (res === 'granted') {
            getCurrentLocation();
          }
        });
      }
    });
  };

  const getNearFriends = async (currentLocation, distance) => {
    const res = await apiGetMapFriends(null, 100, currentLocation, distance);
    if (res.sucess) {
      setArrNearFriends(res.data);
    }
  };

  const getNearRadios = async (currentLocation, distance) => {
    const res = await apiGetMapRadios(null, 100, currentLocation, distance);
    if (res.success) {
      setArrNearRadios(res.data);
    }
  };

  const getMemories = async (currentLocation, distance) => {
    const res = await apiGetMapMemories(null, 100, currentLocation, distance);
    if (res.success) {
      setArrMemories(res.data);
    }
  };

  const getFeaturedRadios = async (currentLocation, distance) => {
    const res = await apiGetMapFeaturedRadios(
      null,
      100,
      currentLocation,
      distance,
    );
    if (res.success) {
      setArrFeaturedRadios(res.data);
    }
  };

  const onSkipPress = () => setShowPermissionModal(false);
  const onAllowPress = () => {
    MapServices.locationPermission().then(data => {
      if (data === 'denied') {
        SetData(Keys.LOCATION_PERMISSION, 'neverAskAgain');
        setShowPermissionModal(false);
        setLoader(false);
      } else {
        setShowPermissionModal(false);
        getCurrentLocation();
      }
    });
  };

  const setCordinatesData = () => {
    const data: any = [];
    geoData.map(element => {
      data.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [element.LONGITUDE, element.LATITUDE],
        },
        properties: {
          address: element.ADDRESS,
        },
      });
    });
    setFeaturesData(data);
    setLoader(false);
  };

  const togglePlay = (
    data,
    musicBranch: MUSIC_BRANCH = MUSIC_BRANCH.MAP_RADIO_TRACK,
  ) => {
    let newTrack: Track = {id: '', image: '', artists: [], title: ''};
    const currentTime = new Date();
    newTrack.id = currentTime.getTime().toString();
    newTrack.previewUrl = data.animationUrl;
    newTrack.title = data.title;
    newTrack.artists = ['Listening Radio'];
    newTrack.url = data.animationUrl;
    newTrack.image =
      'https://thumbs.dreamstime.com/b/forest-panorama-rays-sunlight-scenic-fresh-green-deciduous-trees-sun-casting-its-light-foliage-53826213.jpg';

    if (curTrack?.id === newTrack?.id) {
      togglePlayer();
    } else if (newTrack && playlistId && playlistId === musicBranch) {
      playTrack(newTrack);
    } else {
      playTrackList([newTrack], newTrack?.id, musicBranch);
    }
  };

  const onRegionDidChange = async (data: any) => {
    const {properties} = data;
    const {zoomLevel, visibleBounds} = properties;

    const centerX = (visibleBounds[0][0] + visibleBounds[1][0]) / 2;
    const centerY = (visibleBounds[0][1] + visibleBounds[1][1]) / 2;

    setZoomLevel(zoomLevel.toFixed(1));
    forceUpdate();

    await getNearFriends([centerX, centerY], (25 - zoomLevel) * 10);
    await getNearRadios([centerX, centerY], (25 - zoomLevel) * 10);
    await getMemories([centerX, centerY], (25 - zoomLevel) * 10);
    await getFeaturedRadios([centerX, centerY], (25 - zoomLevel) * 10);
  };

  const onPressListeningMarker = (data: any) => {
    setBottomSheet({
      visible: true,
      data: data,
    });
  };

  const onCloseBottomSheet = () => {
    setBottomSheet({visible: false, data: {}});
  };

  const onGoToLocation = location => {
    setCurrentLocation(location);
  };

  const renderMapFilterSheet = () => {
    return (
      <MapFilterSheet
        show={showMapFilter}
        onClose={() => setShowMapFilter(false)}
      />
    );
  };

  const renderMapFriendsSheet = () => {
    return (
      <MapYourFriend
        show={showMapFriends}
        onClose={() => setShowMapFriends(false)}
        onLocation={onGoToLocation}
        navigation={navigation}
      />
    );
  };

  const renderMapFriends = () => {
    return arrNearFriends.map((element, index) => {
      return (
        <MarkerView
          coordinate={[element.location[0], element.location[1]]}
          key={index}>
          <ListeningMarker
            data={element}
            onPress={onPressListeningMarker.bind(null, element)}
          />
        </MarkerView>
      );
    });
  };

  const renderMapRadios = () => {
    return arrNearRadios.map((element, index) => {
      return (
        <MarkerView
          coordinate={[element.location[0], element.location[1]]}
          key={index}>
          <RadioMarker
            data={element}
            type={'normal'}
            onPress={data => {
              // togglePlay(data);
              setShowMapLiveRadio(true);
              setSelectedNormalRadio(data.id);
            }}
          />
        </MarkerView>
      );
    });
  };

  const renderMapFeaturedRadios = () => {
    return arrFeaturedRadios.map((element, index) => {
      return (
        <MarkerView
          coordinate={[element.location[0], element.location[1]]}
          key={index}>
          <RadioMarker
            data={element}
            type={'featured'}
            onPress={data => {
              togglePlay(data);
            }}
          />
        </MarkerView>
      );
    });
  };

  const renderLiveRadioBottomSheet = () => {
    return (
      <MapLiveRadio
        show={showMapLiveRadio}
        onClose={() => setShowMapLiveRadio(false)}
        radio={selectedNormalRadio}
      />
    );
  };

  const renderExploreSheet = () => {
    return (
      <LetExploreSheet
        show={showNewWorld}
        onClose={() => setShowNewWorld(false)}
        onGoToExplore={() => {
          setShowNewWorld(false);
          setTimeout(() => {
            navigation.navigate('NewWorldPage');
          }, 500);
        }}
      />
    );
  };

  const renderMemoryMakers = () => {
    return arrMemories.map((element, index) => {
      return (
        <MarkerView
          coordinate={[element.location[0], element.location[1]]}
          key={index}>
          <MemoryMarker data={element} onPress={() => {}} />
        </MarkerView>
      );
    });
  };

  const renderCreateRadioBottomSheet = () => {
    return (
      <MapCreateNewRaio
        show={showMapCreateNewRadio}
        onClose={() => setShowMapCreateNewRadio(false)}
      />
    );
  };

  const renderRadioDetailSheet = () => {
    return (
      <RadioDetailSheet
        show={showRadioDetail}
        radios={arrNearRadios}
        onClose={() => setShowRadioDetail(false)}
      />
    );
  };

  const renderLocationDetailSheet = () => {
    return (
      <LocationDetail
        show={showLocationDetail}
        onClose={() => setShowLocationDetail(false)}
      />
    );
  };

  return (
    <Container style={styles.root}>
      {loader ? (
        <Loader />
      ) : Platform.OS === 'android' ? (
        <MapView
          centerCoordinate={currentLocation}
          zoomLevel={14}
          onRegionDidChange={onRegionDidChange}>
          {/* {zoomLevel > 13.8 ? ( */}
          {mapSetting?.friends && renderMapFriends()}
          {mapSetting?.radios && renderMapRadios()}
          {mapSetting?.memories && renderMemoryMakers()}
          {mapSetting?.artists && renderMapFeaturedRadios()}
        </MapView>
      ) : (
        <FantasyMapView />
      )}
      {Platform.OS === 'android' && <MapTopBar />}
      {Platform.OS === 'android' ? (
        <MapBottomBar
          playerVisible={false}
          onShowFilter={() => {
            setShowMapFilter(true);
          }}
          onShowFriends={() => {
            // setShowMapFriends(true);
            setShowNewWorld(true);
          }}
          onShowNewRadio={() => setShowMapCreateNewRadio(true)}
        />
      ) : (
        <GeneralFeedView
          show={showGeneralFeed}
          onClose={() => setShowGeneralFeed(false)}
          onCountryDetail={country => {
            navigation.navigate('NewWorldPage', {countryDetail: country});
          }}
        />
      )}
      {showPermissionModal && (
        <LocationPermission
          onAllowPress={onAllowPress}
          onSkipPress={onSkipPress}
        />
      )}
      {bottomSheet.visible && (
        <BottomSheet onClose={onCloseBottomSheet}>
          <Profile from={'Profile'} onBack={onCloseBottomSheet} />
        </BottomSheet>
      )}
      {/* {renderBack()} */}
      {renderMapFriendsSheet()}
      {renderMapFilterSheet()}
      {renderCreateRadioBottomSheet()}
      {renderLiveRadioBottomSheet()}
      {renderRadioDetailSheet()}
      {renderLocationDetailSheet()}
      {renderExploreSheet()}
    </Container>
  );
};

export default MapHomePage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#e6e4e0',
  },
});

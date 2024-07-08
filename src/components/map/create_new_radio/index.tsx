/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useToast} from 'native-base';
import {useSelector} from 'react-redux';
import {styles} from './index.styles';
import {SCREEN_HEIGHT} from 'helper/utils';
import ToggleSwitch from 'toggle-switch-react-native';
import {apiGetFollowings} from 'helper/userHelpers';
import {apiGetOwnedPlayList, apiGetPlayList} from 'helper/trackHelpers';
import {apiCreateRadio} from 'helper/radioHelpers';
import {getDefaultAvatar} from 'helper/userHelpers';
import {RootState} from 'redux/interfaces';
import CloseGrayIcon from 'assets/svg/CloseGrayIcon';
import SearchGrayIcon from 'assets/svg/SearchGrayIcon';
import MusicGrayIcon from 'assets/svg/MusicGrayIcon';
import ClockGrayIcon from 'assets/svg/ClockGrayIcon';
import RedCheckIcon from 'assets/svg/RedCheckIcon';
import {useFocusEffect} from '@react-navigation/native';
import {MapServices} from 'screens/map/services';
import {GetData, Keys, SetData} from 'screens/map/storagemanager';
import {LocationPermission} from 'screens/map/components';

export const MapCreateNewRaio = ({show, onClose}) => {
  const toast = useToast();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [SCREEN_HEIGHT - 100, SCREEN_HEIGHT - 100],
    [],
  );

  const {user} = useSelector((state: RootState) => state.auth);

  const [stepRadio, setStepRadio] = useState(0);
  const [radioTitle, setRadioTitle] = useState('');
  const [isOpenForAudioReq, setIsOpenForAudioReq] = useState(false);
  const [radioSearchValue, setRadioSearchValue] = useState('');

  const [hosts, setHosts] = useState([]);
  const [selectedHosts, setSelectedHosts] = useState([]);
  const [hostsLastId, setHostsLastId] = useState(undefined);
  const [hostsHasMore, setHostsHasMore] = useState(true);
  const [hostsLoading, setHostsLoading] = useState(false);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(null);
  const [selectedPlaylistDetailedData, setSelectedPlaylistDetailedData] =
    useState<any>(null);
  const [playlistDetailLoading, setPlaylistDetailLoading] =
    useState<boolean>(false);
  const [playlistsLastId, setPlaylistsLastId] = useState(undefined);
  const [playlistsHasMore, setPlaylistsHasMore] = useState(true);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [loadingCreateNew, setLoadingCreateNew] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    LONGITUDE: 0,
    LATITUDE: 0,
  });

  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      if (stepRadio === 1) {
        getHostList();
      } else if (stepRadio === 2) {
        getOwnPlaylists();
      } else if (stepRadio === 3) {
        getSelectedPlaylistDetails();
      }
    } else {
      setStepRadio(0);
      setRadioTitle('');
      setRadioSearchValue('');
      setSelectedHosts([]);
      setSelectedPlaylistId(null);
      setIsOpenForAudioReq(false);
    }
  }, [show, stepRadio]);

  useFocusEffect(
    useCallback(() => {
      const clean =
        Platform.OS === 'android'
          ? getLocationPermission()
          : getCurrentLocation();
      return () => clean;
    }, []),
  );

  const getCurrentLocation = () => {
    MapServices.getCurrentLocation()
      .then((res: any) => {
        if (res) {
          const {coords} = res;
          const {latitude, longitude} = coords;
          setCurrentLocation({LONGITUDE: longitude, LATITUDE: latitude});
        }
      })
      .catch(() => {});
  };

  const getLocationPermission = () => {
    GetData(Keys.LOCATION_PERMISSION).then(data => {
      console.log(`location permission status`, data);
      if (data && data === 'denied') {
        setShowPermissionModal(true);
      } else if (data && data === 'granted') {
        getCurrentLocation();
      } else if (!data) {
        MapServices.locationPermission().then(res => {
          if (res === 'denied') {
            SetData(Keys.LOCATION_PERMISSION, 'denied');
            setShowPermissionModal(true);
          } else if (res === 'granted') {
            getCurrentLocation();
          }
        });
      }
    });
  };

  const onSkipPress = () => setShowPermissionModal(false);
  const onAllowPress = () => {
    MapServices.locationPermission().then(data => {
      if (data === 'denied') {
        SetData(Keys.LOCATION_PERMISSION, 'neverAskAgain');
        setShowPermissionModal(false);
      } else {
        setShowPermissionModal(false);
        getCurrentLocation();
      }
    });
  };

  const getHostList = () => {
    if (!hostsHasMore || hostsLoading) {
      return;
    }

    setHostsLoading(true);
    apiGetFollowings(user.id, hostsLastId)
      .then(res => {
        if (res.success) {
          setHosts(prev => [...prev, ...res.data]);
          setHostsHasMore(res.hasMore);
          setHostsLastId(res.lastId);
        } else {
          setHostsHasMore(false);
        }
      })
      .finally(() => {
        setHostsLoading(false);
      });
  };

  const getOwnPlaylists = () => {
    if (!playlistsHasMore || playlistsLoading) {
      return;
    }
    setPlaylistsLoading(true);

    apiGetOwnedPlayList(user.id, playlistsLastId)
      .then(res => {
        if (res.success) {
          setPlaylists(prev => [...prev, ...res.data]);
          setPlaylistsHasMore(res.hasMore);
          setPlaylistsLastId(res.lastId);
        } else {
          setPlaylistsHasMore(false);
        }
      })
      .finally(() => {
        setPlaylistsLoading(false);
      });
  };

  const getSelectedPlaylistDetails = () => {
    setPlaylistDetailLoading(true);
    if (selectedPlaylistId) {
      apiGetPlayList(selectedPlaylistId)
        .then(res => {
          if (res.success) {
            setSelectedPlaylistDetailedData(res.data);
          }
        })
        .finally(() => {
          setPlaylistDetailLoading(false);
        });
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    } else {
    }
  }, []);

  const handleHostSelection = hostId => {
    if (selectedHosts.includes(hostId)) {
      setSelectedHosts([...selectedHosts.filter(item => item !== hostId)]);
    } else {
      setSelectedHosts([...selectedHosts, hostId]);
    }
  };

  const handleCreateRadio = async () => {
    const param = {
      title: radioTitle,
      openRequests: isOpenForAudioReq,
      cohosts: selectedHosts,
      location: [currentLocation.LONGITUDE, currentLocation.LATITUDE],
      playlist: selectedPlaylistId,
    };

    try {
      setLoadingCreateNew(true);
      const res = await apiCreateRadio(param);
      if (res.success) {
        onClose();

        toast.show({
          render: () => {
            return (
              <View style={styles.toast}>
                <Text style={styles.toastTxt}>Success creating new radio!</Text>
              </View>
            );
          },
        });
      }
    } catch (error) {
    } finally {
      setLoadingCreateNew(false);
    }
  };

  const renderRadioFirstPart = () => {
    return (
      <View>
        <View style={styles.root}>
          <TextInput
            value={radioTitle}
            onChangeText={value => setRadioTitle(value)}
            placeholder={'Radio Title'}
            placeholderTextColor="#01010130"
            style={styles.radioTitleText}
          />
          <Text style={styles.radioTitle}>Radio Title</Text>
        </View>
        <View style={styles.audioRequest}>
          <Text style={styles.audioRequestText}>Open for Audio Request</Text>
          <ToggleSwitch
            isOn={isOpenForAudioReq}
            onColor="#fe4c37"
            offColor="grey"
            size="medium"
            onToggle={isOn => setIsOpenForAudioReq(isOn)}
          />
        </View>
      </View>
    );
  };

  const renderRadioSecondPart = () => {
    return (
      <View>
        {selectedHosts && selectedHosts.length > 0 && (
          <View>
            <Text style={styles.hostText}>
              {`Co-Hosts(${selectedHosts.length})`}
            </Text>
            <ScrollView style={styles.hostScroll} horizontal>
              {selectedHosts.map(item => {
                const hostData = hosts.find(elem => elem.id === item);
                return (
                  <View style={styles.hostContainer}>
                    <Image
                      source={
                        hostData.image !== ''
                          ? {
                              uri: hostData.image,
                            }
                          : getDefaultAvatar()
                      }
                      style={styles.hostImage}
                    />
                    <Text style={styles.hostNameText}>{hostData.name}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedHosts([
                          ...selectedHosts.filter(item1 => item1 !== item),
                        ]);
                      }}>
                      <CloseGrayIcon />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View style={styles.searchBar}>
          <TouchableOpacity>
            <SearchGrayIcon />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            onChangeText={val => setRadioSearchValue(val)}
            value={radioSearchValue}
            placeholder={'Search here...'}
            placeholderTextColor="#01010140"
          />
        </View>
        <ScrollView style={styles.secondScrollView}>
          {hosts && hosts.length > 0 ? (
            hosts.map((item, index) => {
              return (
                <View style={styles.secondScrollContainer}>
                  <View style={styles.secondScrollInfoContainer}>
                    <Image
                      source={
                        item.image !== ''
                          ? {
                              uri: item.image,
                            }
                          : getDefaultAvatar()
                      }
                      style={styles.secondeHostImage}
                    />
                    <View style={styles.secondTextContainer}>
                      <Text style={styles.secondHostName}>{item.name}</Text>
                      <Text
                        style={{
                          fontWeight: '400',
                          fontSize: 10,
                          color: '#01010160',
                          marginTop: 4,
                        }}>
                        {item.handle}
                      </Text>
                    </View>
                  </View>
                  {selectedHosts.includes(item.id) ? (
                    <TouchableOpacity
                      style={{
                        borderColor: '#FF6651',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderRadius: 16,
                        height: 31,
                        width: 61,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => handleHostSelection(item.id)}>
                      <Text
                        style={{
                          color: '#FF6651',
                          fontSize: 10,
                          fontWeight: '600',
                        }}>
                        Added
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#FF6651',
                        borderRadius: 16,
                        height: 31,
                        width: 61,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => handleHostSelection(item.id)}>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: '600',
                        }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          ) : hostsLoading ? (
            <View style={{width: '100%', alignItems: 'center', marginTop: 32}}>
              <ActivityIndicator size="large" color="#777777" />
            </View>
          ) : (
            <View style={{width: '100%', alignItems: 'center'}}>
              <Text style={{fontSize: 12, fontWeight: '500', color: '#010101'}}>
                No Data
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderRadioThirdPart = () => {
    return (
      <View>
        <View style={styles.searchBar}>
          <TouchableOpacity>
            <SearchGrayIcon />
          </TouchableOpacity>
          <TextInput
            style={{height: 18, flex: 1, marginLeft: 13}}
            onChangeText={val => setRadioSearchValue(val)}
            value={radioSearchValue}
            placeholder={'Search here...'}
            placeholderTextColor="#01010140"
          />
        </View>
        <ScrollView style={{height: 330, width: '100%', marginTop: 22}}>
          <View>
            {playlists && playlists.length > 0 ? (
              playlists.map((item, index) => {
                return (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <View style={styles.imageContainer}>
                        <View style={styles.imageBg01} />
                        <View style={styles.imageBg02} />
                        <Image
                          style={styles.image}
                          source={{uri: item.image}}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={{flex: 1, marginStart: 12}}>
                        <Text
                          style={{
                            fontWeight: '400',
                            fontSize: 10,
                            color: '#010101',
                          }}>
                          {'PLAYLISTS'}
                        </Text>
                        <Text
                          style={{
                            fontWeight: '600',
                            fontSize: 14,
                            color: '#010101',
                            marginVertical: 4,
                          }}>
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            fontWeight: '400',
                            fontSize: 12,
                            color: '#01010160',
                          }}>
                          {`${item.trackNumber || 0} songs • ${
                            item.artistNumber || 0
                          } artists`}
                        </Text>
                      </View>
                    </View>
                    {item.id === selectedPlaylistId ? (
                      <TouchableOpacity
                        onPress={() => setSelectedPlaylistId(null)}>
                        <RedCheckIcon />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setSelectedPlaylistId(item.id)}
                        style={{
                          backgroundColor: 'rgba(1, 1, 1, 0.1)',
                          borderRadius: 50,
                          height: 24,
                          width: 24,
                          borderWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    )}
                  </View>
                );
              })
            ) : playlistsLoading ? (
              <View
                style={{width: '100%', alignItems: 'center', marginTop: 32}}>
                <ActivityIndicator size="large" color="#777777" />
              </View>
            ) : (
              <View style={{width: '100%', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 12, fontWeight: '500', color: '#010101'}}>
                  No Data
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderRadioLastPart = () => {
    return (
      <>
        {playlistDetailLoading || !selectedPlaylistDetailedData ? (
          <View style={{width: '100%', alignItems: 'center', marginTop: 32}}>
            <ActivityIndicator size="large" color="#777777" />
          </View>
        ) : (
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderStyle: 'solid',
              borderRadius: 16,
              alignItems: 'center',
              marginTop: 32,
              paddingVertical: 16,
              paddingHorizontal: 32,
            }}>
            <Image
              source={
                selectedPlaylistDetailedData.image
                  ? {
                      uri: selectedPlaylistDetailedData.image,
                    }
                  : getDefaultAvatar()
              }
              style={{width: 40, height: 40, borderRadius: 50}}
            />
            <Text
              style={{
                fontSize: 32,
                fontWeight: '600',
                color: '#010101',
                marginTop: 20,
              }}>
              {selectedPlaylistDetailedData.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#01010160',
                marginTop: 8,
              }}>
              {selectedPlaylistDetailedData.description}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 16,
                alignItems: 'center',
              }}>
              <MusicGrayIcon />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: '#01010190',
                  marginLeft: 6.5,
                  marginRight: 18,
                }}>
                {`${selectedPlaylistDetailedData.trackNumber || 0} songs`}
              </Text>
              <ClockGrayIcon />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: '#01010190',
                  marginLeft: 6.5,
                }}>
                {`${selectedPlaylistDetailedData.artistNumber || 0} mins`}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      backgroundStyle={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 0,
      }}
      handleIndicatorStyle={{
        backgroundColor: '#D9D9D9',
        marginTop: 8,
      }}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      onChange={handleSheetChanges}>
      <View style={{flex: 1, paddingHorizontal: 16}}>
        <View style={{alignItems: 'center', marginTop: 24}}>
          <Text style={{fontSize: 12, fontWeight: '600', color: '#FF6651'}}>
            {stepRadio === 3 ? 'Summary' : `Step ${stepRadio + 1} of 3`}
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: '#010101',
              marginVertical: 8,
            }}>
            {stepRadio === 0
              ? 'Start New Radio'
              : stepRadio === 1
              ? 'Adding Co-Host'
              : stepRadio === 2
              ? 'Select Playlist'
              : 'All Set Up!'}
          </Text>
          <Text style={{fontSize: 14, fontWeight: '400', color: '#01010160'}}>
            Tortor vitae vestibulum sociis sagittis.
          </Text>
        </View>
        {stepRadio === 0
          ? renderRadioFirstPart()
          : stepRadio === 1
          ? renderRadioSecondPart()
          : stepRadio === 2
          ? renderRadioThirdPart()
          : renderRadioLastPart()}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '103%',
            paddingLeft: 24,
            paddingVertical: 12,
            paddingBottom: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
          }}>
          {stepRadio === 3 ? (
            <TouchableOpacity
              style={{
                height: 53,
                width: '100%',
                borderRadius: 40,
                backgroundColor: '#FF6651',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={loadingCreateNew}
              onPress={handleCreateRadio}>
              {loadingCreateNew ? (
                <View style={{width: '100%', alignItems: 'center'}}>
                  <ActivityIndicator size="large" color="#777777" />
                </View>
              ) : (
                <Text style={{fontSize: 14, fontWeight: '500', color: '#fff'}}>
                  Start Radio Now
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={{
                  height: 53,
                  width: 163,
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: '#FF6651',
                  borderStyle: 'solid',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() =>
                  setStepRadio(prev => (prev === 0 ? 0 : prev - 1))
                }>
                <Text
                  style={{fontSize: 14, fontWeight: '500', color: '#FF6651'}}>
                  Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 53,
                  width: 163,
                  borderRadius: 40,
                  backgroundColor:
                    stepRadio === 2 && !selectedPlaylistId
                      ? 'rgba(0, 0, 0, 0.2)'
                      : '#FF6651',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={stepRadio === 2 && !selectedPlaylistId}
                onPress={() =>
                  setStepRadio(prev => (prev === 3 ? 3 : prev + 1))
                }>
                <Text style={{fontSize: 14, fontWeight: '500', color: '#fff'}}>
                  Continue
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {showPermissionModal && (
          <LocationPermission
            onAllowPress={onAllowPress}
            onSkipPress={onSkipPress}
          />
        )}
      </View>
    </BottomSheetModal>
  );
};

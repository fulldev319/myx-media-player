import {isEmpty} from 'lodash';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Config from 'react-native-config';
import Svg, {Path, Circle, Defs, LinearGradient, Stop} from 'react-native-svg';

import {hp, wp} from '../../global';
import {socket} from 'screens/Auth';
import {
  apiGetMap,
  apiGetMyCountries,
  apiGetCountryRegions,
  apiGetTakenAreas,
} from 'helper/mapHelper';
import {MarkerView} from '.';
import {FlagUpIcon, FlagDownIcon} from 'assets/svg';
import CellsJSON from './resources/cells_geojson.json';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/interfaces';

const MapView = (props: any) => {
  const {
    scrollEnabled = true,
    centerCoordinate = [0.7261275565767278, 0.001836132759919451],
    showSuccess,
    showPinLocation,
    isRefresh,
    setCurrentLocation,
    showCountryLocation,
  } = props;

  const mapRef = useRef(null);
  const {mapSize} = useSelector((state: RootState) => state.map);
  const [currentCoordinates, setCurrentCoordinates] = useState([]);
  const [isInArea, setIsInArea] = useState(false);
  const [flagScale, setFlagScale] = useState(1);

  const [countryId, setCountryId] = useState();
  const [myCountries, setMyCountries] = useState([]);

  const [layers, setLayers] = useState([]); // country border layer
  const [regionLayers, setRegionLayers] = useState([]); // region layer
  const [takenLayers, setTakenLayers] = useState([]); // taken layer

  useEffect(() => {
    loadTakenAreas();
    loadCountryData();
    loadMyCountryData();
  }, [isRefresh, showPinLocation]);

  useEffect(() => {
    if (socket) {
      const updateMapRegionHander = data => {
        const index = layers.findIndex(item => item.id == data.id);
        const features = getShapeById(data.id);
        const shape = {
          type: 'FeatureCollection',
          features,
        };

        let currentFocusingCountry = -1;
        CellsJSON.features.foreach(feature => {
          const areaInfo = feature.geometry.coordinates[0];
          const isInArea = isPointInArea(currentCoordinates, areaInfo);

          if (isInArea) {
            currentFocusingCountry = feature.properties.country;
          }
        });

        if (currentFocusingCountry === -1) return;

        const color =
          data.colour.length > 7 ? data.colour.substring(0, 7) : data.colour;

        const newLayer = {
          id: data.id,
          color: color,
          shape,
        };

        if (index === -1) {
          setLayers([...layers, newLayer]);
        } else {
          layers[index] = newLayer;
        }
      };

      socket.on('regionUpdate', updateMapRegionHander);
      return () => {
        socket.removeListener('regionUpdate', updateMapRegionHander);
      };
    }
  }, [socket, layers, currentCoordinates]);

  const getShapeById = id => {
    return CellsJSON.features.filter(feature => feature.properties.id == id);
  };

  const loadRegionData = async () => {
    let hasMore = false;
    let lastId = 0;
    do {
      const res = await apiGetCountryRegions(countryId, 10, lastId);

      if (res.success) {
        const newLayer = res.data.map(item => {
          const regionCoordinates = item.polygon[0].map((coorItem, index) => {
            return [coorItem.x, Number(coorItem.y.toFixed(2))];
          });

          const feature = {
            type: 'Feature',
            geometry: {type: 'Polygon', coordinates: [regionCoordinates]},
            properties: {id: item.region},
          };

          const shape = {
            type: 'FeatureCollection',
            features: [feature],
          };

          return {
            id: item.region,
            color: item.colour,
            shape,
          };
        });
        setRegionLayers(prev => [...prev, ...newLayer]);
        hasMore = res.hasMore;
        lastId = res.lastId;
      }
    } while (hasMore);
  };

  const loadCountryData = async () => {
    let hasMore = false;
    let lastId = 0;
    do {
      const res = await apiGetMap(10, lastId);

      if (res.success) {
        const newLayer = res.data.map(item => {
          const {latitude, longitude} = item;
          const regionCoordinates = item.boundary[0].map(coorItem => {
            return [coorItem.x + latitude, coorItem.y + longitude];
          });

          const feature = {
            type: 'Feature',
            geometry: {type: 'Polygon', coordinates: [regionCoordinates]},
            properties: {id: item.country},
          };

          const shape = {
            type: 'FeatureCollection',
            features: [feature],
          };

          return {
            id: item.country,
            color: '#8bc34a',
            shape,
          };
        });

        setLayers(prev => [...prev, ...newLayer]);
        hasMore = res.hasMore;
        lastId = res.lastId;
      }
    } while (hasMore);
  };

  const loadMyCountryData = async () => {
    let hasMore = false;
    let lastId = 0;
    do {
      const res = await apiGetMyCountries(10, lastId);

      if (res.success) {
        setMyCountries(prev => [...prev, ...res.data]);
        hasMore = res.hasMore;
        lastId = res.lastId;
      }
    } while (hasMore);
  };

  const loadTakenAreas = async () => {
    let hasMore = false;
    let lastId = 0;
    let layerIndex = 0;
    do {
      const res = await apiGetTakenAreas(10, lastId);

      if (res.success) {
        const {step_lat, step_lon} = res;
        const features = res.data.map((item, index) => {
          const {latitude, longitude} = item;

          const regionCoordinates = [
            [latitude - step_lat, longitude + step_lon],
            [latitude - step_lat, longitude - step_lon],
            [latitude + step_lat, longitude - step_lon],
            [latitude + step_lat, longitude + step_lon],
          ];

          return {
            type: 'Feature',
            geometry: {type: 'Polygon', coordinates: [regionCoordinates]},
            properties: {id: index},
          };
        });

        const shape = {
          type: 'FeatureCollection',
          features,
        };

        const newLayer = {
          id: layerIndex,
          color: '#ff8484',
          shape,
        };

        setTakenLayers(prev => [...prev, newLayer]);
        hasMore = res.hasMore;
        lastId = res.lastId;
        layerIndex++;
      }
    } while (hasMore);
  };

  const onRegionIsChanging = data => {
    const {properties} = data;
    setTimeout(() => {
      const scale = 1 + (properties.zoomLevel - 6.5526) * 0.4;
      setFlagScale(scale);
    }, 20);
  };

  const onRegionDidChange = async data => {
    const {properties} = data;
    const {zoomLevel, visibleBounds} = properties;

    const centerX = (visibleBounds[0][0] + visibleBounds[1][0]) / 2;
    const centerY = (visibleBounds[0][1] + visibleBounds[1][1]) / 2;

    const currentPoint = [centerX, centerY];
    if (showPinLocation) setCurrentLocation(currentPoint);
    setCurrentCoordinates(currentPoint);

    if (zoomLevel > 10.5) {
      // check if any country is focusing

      layers.forEach(layer => {
        layer.shape?.features.forEach(feature => {
          const areaInfo = feature.geometry.coordinates[0];
          const isInArea = isPointInArea(currentPoint, areaInfo);

          if (isInArea) {
            setCountryId(feature.properties.id);
            setIsInArea(true);
          }
        });
      });
    } else {
      setCountryId(null);
      setRegionLayers([]);
      setIsInArea(false);
    }
  };

  const isPointInArea = (point, vs) => {
    var x = point[0],
      y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  const renderLayers = useMemo(() => {
    return layers.map((item, index) => {
      const nowDate = new Date();
      return (
        <MapboxGL.ShapeSource
          key={item.id}
          id={`selectedNYC_${item.id}_${index}_${nowDate.getTime().toString()}`}
          shape={item.shape}>
          <MapboxGL.FillLayer
            id={`selectedNYCFill_${item.id}_${index}_${nowDate
              .getTime()
              .toString()}`}
            style={{
              fillAntialias: true,
              fillOpacity: 1,
              fillOutlineColor: 'rgba(0, 0, 0, 0.4)',
              fillColor: item.color,
            }}
          />
        </MapboxGL.ShapeSource>
      );
    });
  }, [layers]);

  const renderTakenLayers = useMemo(() => {
    return takenLayers.map((item, index) => {
      const nowDate = new Date();
      return (
        <MapboxGL.ShapeSource
          key={item.id}
          id={`selectedNYC_${item.id}_${index}_${nowDate.getTime().toString()}`}
          shape={item.shape}>
          <MapboxGL.FillLayer
            id={`selectedNYCFill_${item.id}_${index}_${nowDate
              .getTime()
              .toString()}`}
            style={{
              fillAntialias: true,
              fillOpacity: 1,
              fillOutlineColor: 'transparent',
              fillColor: item.color,
            }}
          />
        </MapboxGL.ShapeSource>
      );
    });
  }, [takenLayers]);

  const renderRegionLayers = useMemo(() => {
    return regionLayers.map((item, index) => {
      const nowDate = new Date();
      return (
        <MapboxGL.ShapeSource
          key={item.id}
          id={`selectedNYC_region_${item.id}_${index}_${nowDate
            .getTime()
            .toString()}`}
          shape={item.shape}>
          <MapboxGL.FillLayer
            id={`selectedNYCFill_region_${item.id}_${index}_${nowDate
              .getTime()
              .toString()}`}
            style={{
              fillAntialias: true,
              fillOpacity: 1,
              fillOutlineColor: item.color,
              fillColor: 'red',
            }}
          />
        </MapboxGL.ShapeSource>
      );
    });
  }, [regionLayers]);

  const renderMyCountries = useMemo(() => {
    return myCountries.map((item, index) => {
      const nowDate = new Date();
      return (
        <MarkerView
          key={`my_countries_${item.country}_${nowDate.getTime().toString()}`}
          coordinate={[item.latitude, item.longitude]}>
          <FlagIcon color={item.colour} flagScale={flagScale} />
        </MarkerView>
      );
    });
  }, [myCountries, flagScale]);

  const renderPickFlag = useMemo(() => {
    if ((!showPinLocation && !showSuccess) || isEmpty(currentCoordinates))
      return;
    return (
      <MarkerView coordinate={currentCoordinates}>
        <View style={Style.flag}>
          {showSuccess ? <FlagDownIcon /> : <FlagUpIcon />}
        </View>
      </MarkerView>
    );
  }, [showPinLocation, currentCoordinates]);

  const renderCountryButton = useMemo(() => {
    if (!isInArea) return;
    return (
      <MarkerView coordinate={currentCoordinates}>
        <TouchableOpacity
          style={Style.countryButton}
          onPress={() => loadRegionData()}>
          <Text style={{color: 'white'}}>{'Enter Country'}</Text>
        </TouchableOpacity>
      </MarkerView>
    );
  }, [isInArea]);

  return (
    <View style={Style.container}>
      <MapboxGL.MapView
        rotateEnabled={false}
        style={Style.container}
        zoomEnabled={true}
        scrollEnabled={scrollEnabled}
        ref={ref => {
          //@ts-ignore
          global.mapRef = ref;
          mapRef.current = ref;
        }}
        styleURL={Config.MAPBOX_FANTASY_STYLE_URL}
        onRegionIsChanging={onRegionIsChanging}
        onRegionDidChange={onRegionDidChange}>
        <MapboxGL.Camera
          zoomLevel={isEmpty(showCountryLocation) ? 6.5 : 8}
          centerCoordinate={
            isEmpty(showCountryLocation)
              ? centerCoordinate
              : showCountryLocation
          }
          maxBounds={{
            ne: [-mapSize?.lat || 0, mapSize?.lat || 0],
            sw: [-mapSize?.long || 0, mapSize?.long || 0],
          }}
        />
        {renderMyCountries}
        {renderPickFlag}
        {renderCountryButton}
        {renderRegionLayers}
        {showPinLocation && renderTakenLayers}
        {renderLayers}
        {props.children}
      </MapboxGL.MapView>
    </View>
  );
};

export default MapView;

const FlagIcon = ({color, flagScale}) => (
  <Svg
    width={27 * flagScale}
    height={40 * flagScale}
    viewBox="0 0 37 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path d="M2.4 4.4v65.4h2.4V4.4H2.4z" fill="#fff" />
    <Circle cx={3.6} cy={4.40078} r={3.6} fill="#FF6651" />
    <Path
      d="M12.426 8.4H3.6v17.2h8.826c3.44 0 6.74 1.368 9.174 3.8a12.974 12.974 0 009.174 3.8H37V16h-6.226c-3.44 0-6.74-1.366-9.174-3.8a12.974 12.974 0 00-9.174-3.8z"
      fill="url(#paint0_linear_101_2600)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_101_2600"
        x1={3.59998}
        y1={33.2009}
        x2={37.2}
        y2={33.2009}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor={color} />
        <Stop offset={0.385417} stopColor={color} />
        <Stop offset={0.53125} stopColor={color} />
        <Stop offset={0.666667} stopColor={color} />
        <Stop offset={1} stopColor={color} />
      </LinearGradient>
    </Defs>
  </Svg>
);

const Style = StyleSheet.create({
  container: {
    height: hp(100),
    width: wp(100),
  },
  flag: {
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  countryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: 150,
    left: 10,
    flexDirection: 'row',
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

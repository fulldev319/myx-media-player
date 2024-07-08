import {MapSettingType, MapSizeType, RootState} from 'redux/interfaces';
import actions from './actions';

export type RootMapState = RootState['map'];

interface Action extends RootMapState {
  type: string;
  payload: any;
}

interface State extends RootMapState {
  mapSetting: MapSettingType;
  mapSize: MapSizeType;
}

const initialState: State = {
  mapSetting: {
    radios: true,
    friends: true,
    artists: true,
    memories: true,
  },
  mapSize: {
    lat: 0,
    long: 0,
  },
};

export default function mapReducer(
  state: RootState['map'] = initialState,
  action: Action,
) {
  const {type, payload} = action;
  switch (type) {
    case actions.SET_MAP_SETTING:
      return {
        ...state,
        mapSetting: payload,
      };
    case actions.SET_MAP_SIZE:
      return {
        ...state,
        mapSize: payload,
      };
    default:
      return state;
  }
}

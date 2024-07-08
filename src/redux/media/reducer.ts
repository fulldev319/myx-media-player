import {RootState} from 'redux/interfaces';
import actions from './actions';

export type RootMediaState = RootState['media'];

interface Action extends RootMediaState {
  type: string;
  payload: any;
}

const initialState = {
  mediaPlayerVisible: false,
  // mediaIsPlaying: false,
  selectedMedia: null,
  selectedMediaId: null,
  mediaPlayList: [],
  // playerAction: 'None',
  mediaProcessData: null,
  shouldUpdate: false,
};

export default function mediaReducer(
  state: RootState['media'] = initialState,
  action: Action,
) {
  const {type, payload} = action;

  switch (type) {
    case actions.SELECT_MEDIA:
      return {...state, selectedMedia: payload};

    case actions.SELECT_MEDIA_ID:
      return {...state, selectedMediaId: payload};

    case actions.MEDIA_PLAY_LIST:
      return {...state, mediaPlayList: payload};

    // case actions.MEDIA_IS_PLAYING:
    //   return { ...state, mediaIsPlaying: payload };

    case actions.MEDIA_PLAYER_VISIBLE:
      return {...state, mediaPlayerVisible: payload};

    // case actions.PLAYER_ACTION:
    //   return { ...state, playerAction: payload };

    case actions.INIT_MEDIA_PROCESS:
      return {...state, mediaProcessData: null};
    case actions.SAVE_MEDIA_PROCESS:
      return {...state, mediaProcessData: payload};

    case actions.UPDATE_MEDIA_PROCESS:
      return {...state, shouldUpdate: !state.shouldUpdate};
    default:
      return state;
  }
}

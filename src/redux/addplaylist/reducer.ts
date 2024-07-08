import {RootState} from 'redux/interfaces';
import actions from './actions';

export type RootShareState = RootState['addToPlaylist'];

interface State extends RootShareState {
  showAddToPlaylist: false;
  itemData: any;
}

interface Action extends RootShareState {
  type: string;
  payload: any;
}

const initialState: State = {
  showAddToPlaylist: false,
  itemData: null,
};

export default function authReducer(
  state: RootState['addToPlaylist'] = initialState,
  action: Action,
) {
  const {type, payload} = action;

  switch (type) {
    case actions.SHOW_ADD_PLAYLIST_DIALOG:
      return {
        ...state,
        showAddToPlaylist: true,
        itemData: payload,
      };
    case actions.DISMISS_ADD_PLAYLIST_DIALOG:
      return {
        ...state,
        showAddToPlaylist: false,
        itemData: null,
      };
    default:
      return state;
  }
}

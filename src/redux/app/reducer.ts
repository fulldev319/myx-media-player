import {RootState} from 'redux/interfaces';
import actions from './actions';

export type RootAppState = RootState['app'];

interface State extends RootAppState {
  loading: boolean;
  showDialogAddToNFT: boolean;
  showMagicSearch: boolean;
  showAddPlayList: boolean;
  showEditPlayList: boolean;
}

interface Action extends RootAppState {
  type: string;
  payload: any;
}

const initialState: State = {
  loading: false,
  showDialogAddToNFT: false,
  showMagicSearch: false,
  showAddPlayList: false,
  showEditPlayList: false,
  showDialogAddMyContact: false,
  loadContacts: false,
  snakeSuccessMessage: '',
  data: null,
};

export default function appReducer(
  state: RootState['app'] = initialState,
  action: Action,
) {
  const {type, payload} = action;

  switch (type) {
    case actions.SHOW_LOADING_BAR:
      return {
        ...state,
        loading: true,
      };
    case actions.DISMISS_LOADING_BAR:
      return {
        ...state,
        loading: false,
      };
    case actions.SHOW_DIALOG_ADD_TO_NFT:
      return {
        ...state,
        data: payload,
        showDialogAddToNFT: true,
      };
    case actions.DISMISS_DIALOG_ADD_TO_NFT:
      return {
        ...state,
        showDialogAddToNFT: false,
      };
    case actions.SHOW_DIALOG_MAGIC_SEARCH:
      return {
        ...state,
        data: payload,
        showMagicSearch: true,
      };
    case actions.DISMISS_DIALOG_MAGIC_SEARCH:
      return {
        ...state,
        showMagicSearch: false,
      };
    case actions.SHOW_DIALOG_ADD_PLAYLIST:
      return {
        ...state,
        showAddPlayList: true,
      };
    case actions.DISMISS_DIALOG_ADD_PLAYLIST:
      return {
        ...state,
        showAddPlayList: false,
      };
    case actions.SHOW_DIALOG_EDIT_PLAYLIST:
      return {
        ...state,
        data: payload,
        showEditPlayList: true,
      };
    case actions.DISMISS_DIALOG_EDIT_PLAYLIST:
      return {
        ...state,
        showEditPlayList: false,
      };
    case actions.SHOW_DIALOG_ADD_MY_CONTACT:
      return {
        showDialogAddMyContact: true,
      };
    case actions.DISMISS_DIALOG_ADD_MY_CONTACT:
      return {
        showDialogAddMyContact: false,
      };
    case actions.LOAD_CONTACTS:
      return {
        loadContacts: !state.loadContacts,
      };
    case actions.SET_SNAKE_SUCCESS_MESSAGE:
      return {
        ...state,
        snakeSuccessMessage: payload,
      };
    default:
      return state;
  }
}

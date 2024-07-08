import {RootState} from 'redux/interfaces';
import actions from './actions';

export type RootShareState = RootState['share'];

interface State extends RootShareState {
  showShare: false;
  itemData: any;
}

interface Action extends RootShareState {
  type: string;
  payload: any;
}

const initialState: State = {
  showShare: false,
  itemData: null,
};

export default function authReducer(
  state: RootState['share'] = initialState,
  action: Action,
) {
  const {type, payload} = action;

  switch (type) {
    case actions.SHOW_SHARE_DIALOG:
      return {
        ...state,
        showShare: true,
        itemData: payload,
      };
    case actions.DISMISS_SHARE_DIALOG:
      return {
        ...state,
        showShare: false,
        itemData: null,
      };
    default:
      return state;
  }
}

import {RootState} from 'redux/interfaces';
import actions from './actions';

export type RootAuthState = RootState['auth'];

interface State extends RootAuthState {
  loading: boolean;
  isLoggedIn: boolean;
  user: any;
}

interface Action extends RootAuthState {
  type: string;
  payload: any;
}

const initialState: State = {
  loading: false,
  isLoggedIn: false,
  user: {id: ''},
  countries: [],
  onboarding: false,
};

export default function authReducer(
  state: RootState['auth'] = initialState,
  action: Action,
) {
  const {type, payload} = action;

  switch (type) {
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: payload.userData,
        countries: payload.countryData,
        onboarding: payload.onboarding,
        isLoggedIn: true,
        error: null,
      };
    case actions.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
      };
    case actions.LOGIN_REQUEST_WITH_METAMASK_WALLET:
      return {
        ...state,
        loading: true,
      };
    case actions.UPDATE_PROFILE:
      return {
        ...state,
        user: {...state.user, ...payload},
      };
    default:
      return state;
  }
}

import {RootState} from 'redux/interfaces';
import actions from './actions';

export type RootProfileState = RootState['profile'];

interface State extends RootProfileState {
  taggedRequestCount: any;
}

interface Action extends RootProfileState {
  type: string;
  payload: any;
}

const initalState: State = {
  taggedRequestCount: 0,
};

export default function profileReducer(
  state: RootState['profile'] = initalState,
  action: Action,
) {
  const {type, payload} = action;

  switch (type) {
    case actions.REFRESH_TAGGED_REQUEST_COUNT_SUCCESS:
      return {
        taggedRequestCount: payload,
      };
    case actions.REFRESH_TAGGED_REQUEST_COUNT_FAILED:
      return {
        ...state,
      };
    default:
      return state;
  }
}

import {all} from 'redux-saga/effects';

import authSagas from './auth/saga';
import chatSagas from './chats/saga';
import profileSagas from './profile/saga';

export default function* rootSaga() {
  yield all([authSagas(), chatSagas(), profileSagas()]);
}

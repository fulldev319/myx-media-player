import {signInWithMetaMaskWallet} from 'helper/authHelpers';
import {setToken} from 'helper/storageHelper';
import {put, call, takeEvery} from 'redux-saga/effects';

import actions from './actions';

function* loginRequestWithMetaMaskWalletHandler(payload: any) {
  try {
    const params = payload.payload;
    const response = yield call(
      signInWithMetaMaskWallet,
      params.address,
      params.signature,
    );

    if (response && response.isSignedIn) {
      yield call(setToken, response?.accessToken);
      yield put(actions.loginSuccess(response.userData));
    } else {
      yield put(
        actions.loginFailure(
          response ? response.message : 'Response is not valid',
        ),
      );
    }
  } catch (err) {
    console.log(err);
    yield put(actions.loginFailure('Network error'));
  }
}

export default function* authSagas() {
  yield takeEvery(
    actions.LOGIN_REQUEST_WITH_METAMASK_WALLET,
    loginRequestWithMetaMaskWalletHandler,
  );
}

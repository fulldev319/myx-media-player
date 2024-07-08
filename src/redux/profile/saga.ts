import {apiGetTaggedRequest} from 'helper/userHelpers';
import {put, call, takeEvery} from 'redux-saga/effects';

import actions from './actions';

function* refreshTaggedRequestCount(payload: any) {
  try {
    const userId = payload.payload;
    const res = yield call(apiGetTaggedRequest, userId);

    if (res.success) {
      yield put(actions.refreshTaggedRequestCountSuccess(res.totalRequest));
    } else {
      yield put(actions.refreshTaggedRequestCountFailure());
    }
  } catch (err) {
    console.log(err);
    yield put(actions.refreshTaggedRequestCountFailure());
  }
}

export default function* profileSaga() {
  yield takeEvery(
    actions.REFRESH_TAGGED_REQUEST_COUNT,
    refreshTaggedRequestCount,
  );
}

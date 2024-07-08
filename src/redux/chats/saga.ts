import {getAllChats, uploadChatFile} from 'helper/chatHelpers';
import {put, call, takeEvery} from 'redux-saga/effects';

import actions from './actions';

function* getAllChatsRequestHandler(payload: any) {
  try {
    const response = yield call(getAllChats, payload.payload);
    // console.log(response);
    yield put(
      actions.getAllChatsSuccess({
        ...response,
        data: response.data
          .filter(chat => !!chat)
          .sort((a, b) => (b.lastMessageDate || 0) - (a.lastMessageDate || 0)),
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(actions.getAllChatsFailed(err));
  }
}

function* uploadFileRequestHandler(payload: any) {
  try {
    const response = yield call(uploadChatFile, payload.payload);
    yield put(actions.uploadChatFileSuccess(response.data));
  } catch (err) {
    yield put(actions.uploadChatFileFailed(err));
  }
}

function* searchChat(payload: any) {
  const {searchText, chatList} = payload.payload;
  const lowerSearchText = searchText.toLowerCase();
  if (searchText !== '') {
    const searchedData = chatList.filter(chat => {
      return (
        chat.users.userFrom.name.toLowerCase().includes(lowerSearchText) ||
        chat.users.userTo.name.toLowerCase().includes(lowerSearchText) ||
        (chat.lastMessage &&
          chat.lastMessage.toLowerCase().includes(lowerSearchText))
      );
    });

    yield put(actions.successSearchChat(searchedData));
  } else {
    yield put(actions.successSearchChat(chatList));
  }
}

export default function* chatSagas() {
  yield takeEvery(actions.GET_ALL_CHATS_REQUEST, getAllChatsRequestHandler);
  yield takeEvery(actions.UPLOAD_CHAT_FILE_REQUEST, uploadFileRequestHandler);
  yield takeEvery(actions.SEARCH_CHAT, searchChat);
}

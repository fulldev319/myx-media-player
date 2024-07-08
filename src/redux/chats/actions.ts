const actions = {
  SET_CURRENT_CHAT: 'SET_CURRENT_CHAT',
  GET_ALL_CHATS_REQUEST: 'GET_ALL_CHATS_REQUEST',
  GET_ALL_CHATS_SUCCESS: 'GET_ALL_CHATS_SUCCESS',
  GET_ALL_CHATS_FAILED: 'GET_ALL_CHATS_FAILED',
  UPLOAD_CHAT_FILE_REQUEST: 'UPLOAD_CHAT_FILE_REQUEST',
  UPLOAD_CHAT_FILE_SUCCESS: 'UPLOAD_CHAT_FILE_SUCCESS',
  UPLOAD_CHAT_FILE_CLEAN: 'UPLOAD_CHAT_FILE_CLEAN',
  UPLOAD_CHAT_FILE_FAILED: 'UPLOAD_CHAT_FILE_FAILED',
  SEARCH_CHAT: 'SEARCH_CHAT',
  SUCCESS_SEARCH_CHAT: 'SUCCESS_SEARCH_CHAT',

  getAllChatsRequest: payload => ({
    type: actions.GET_ALL_CHATS_REQUEST,
    payload,
  }),
  getAllChatsSuccess: payload => ({
    type: actions.GET_ALL_CHATS_SUCCESS,
    payload,
  }),
  getAllChatsFailed: err => ({
    type: actions.GET_ALL_CHATS_FAILED,
    err,
  }),
  setCurrentChat: payload => ({
    type: actions.SET_CURRENT_CHAT,
    payload,
  }),
  uploadChatFileRequest: payload => ({
    type: actions.UPLOAD_CHAT_FILE_REQUEST,
    payload,
  }),
  uploadChatFileSuccess: payload => ({
    type: actions.UPLOAD_CHAT_FILE_SUCCESS,
    payload,
  }),
  uploadChatFileClean: () => ({
    type: actions.UPLOAD_CHAT_FILE_CLEAN,
  }),
  uploadChatFileFailed: err => ({
    type: actions.UPLOAD_CHAT_FILE_FAILED,
    err,
  }),
  searchChat: payload => ({
    type: actions.SEARCH_CHAT,
    payload,
  }),
  successSearchChat: payload => ({
    type: actions.SUCCESS_SEARCH_CHAT,
    payload,
  }),
};

export default actions;

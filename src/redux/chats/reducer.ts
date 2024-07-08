import actions from './actions';

const initialState = {
  allChats: {
    loading: false,
    data: [],
    searchedData: [],
    error: null,
  },
  uploadFile: {
    loading: false,
    data: null,
    error: null,
  },
  currentChat: null,
};

// Return the state
const reducer = (state = initialState, action) => {
  const {type, payload, err} = action;
  switch (type) {
    case actions.GET_ALL_CHATS_REQUEST:
      return {
        ...state,
        allChats: {
          ...state.allChats,
          loading: true,
          error: null,
        },
      };
    case actions.GET_ALL_CHATS_SUCCESS:
      return {
        ...state,
        allChats: {
          ...state.allChats,
          loading: false,
          data: payload,
          searchedData: payload.data,
          error: null,
        },
      };
    case actions.GET_ALL_CHATS_FAILED:
      return {
        ...state,
        allChats: {
          ...state.allChats,
          loading: false,
          data: null,
          searchedData: [],
          error: err,
        },
      };
    case actions.UPLOAD_CHAT_FILE_REQUEST:
      return {
        ...state,
        uploadFile: {
          ...state.uploadFile,
          loading: true,
          error: null,
        },
      };
    case actions.UPLOAD_CHAT_FILE_SUCCESS:
      return {
        ...state,
        uploadFile: {
          ...state.uploadFile,
          loading: false,
          data: payload,
          error: null,
        },
      };
    case actions.UPLOAD_CHAT_FILE_CLEAN:
      return {
        ...state,
        uploadFile: {
          ...state.uploadFile,
          loading: false,
          data: null,
          error: null,
        },
      };
    case actions.UPLOAD_CHAT_FILE_FAILED:
      return {
        ...state,
        uploadFile: {
          ...state.uploadFile,
          loading: false,
          data: null,
          error: err,
        },
      };
    case actions.SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: payload,
      };
    case actions.SEARCH_CHAT:
      return {
        ...state,
        ...payload,
      };
    case actions.SUCCESS_SEARCH_CHAT:
      return {
        ...state,
        allChats: {
          ...state.allChats,
          searchedData: payload,
        },
      };
    default:
      return {...state};
  }
};

export default reducer;

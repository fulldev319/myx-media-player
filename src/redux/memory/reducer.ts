import actions from './actions';

const initialState = {
  tagFriends: [],
  mediaData: [],
  mediaUrls: [],
};

const reducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case actions.ADD_TAG_FRIEND:
      const currentTagFriends1 = state.tagFriends;
      currentTagFriends1.push(payload);

      return {
        ...state,
        tagFriends: currentTagFriends1,
      };
    case actions.REMOVE_TAG_FRIEND:
      const currentTagFriends2 = state.tagFriends;
      const newTagFriends = currentTagFriends2.filter(
        friend => friend.name !== payload.name,
      );

      return {
        ...state,
        tagFriends: newTagFriends,
      };
    case actions.CLEAR_TAG_FRIEND:
      return {...state, tagFriends: []};
    case actions.ADD_MEDIA_DATA:
      return {
        ...state,
        mediaData: [...state.mediaData, payload],
      };
    case actions.REMOVE_MEDIA_DATA:
      const currentData = state.mediaData;
      const filteredData = currentData.filter(media => media.id !== payload.id);

      return {
        ...state,
        mediaData: filteredData,
      };
    case actions.CLEAR_MEDIA_DATA:
      return {...state, mediaData: []};
    case actions.ADD_MEDIA_URL:
      return {
        ...state,
        mediaUrls: [...state.mediaUrls, payload],
      };
    case actions.CLEAR_MEDIA_URL:
      return {...state, mediaUrls: []};
    default:
      return {...state};
  }
};

export default reducer;

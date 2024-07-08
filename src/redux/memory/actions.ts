const actions = {
  ADD_TAG_FRIEND: 'ADD_TAG_FRIEND',
  REMOVE_TAG_FRIEND: 'REMOVE_TAG_FRIEND',
  CLEAR_TAG_FRIEND: 'CLEAR_TAG_FRIEND',
  ADD_MEDIA_DATA: 'ADD_MEDIA_DATA',
  REMOVE_MEDIA_DATA: 'REMOVE_MEDIA_DATA',
  CLEAR_MEDIA_DATA: 'CLEAR_MEDIA_DATA',
  ADD_MEDIA_URL: 'ADD_MEDIA_URL',
  CLEAR_MEDIA_URL: 'CLEAR_MEDIA_URL',

  addTagFriend: payload => ({
    type: actions.ADD_TAG_FRIEND,
    payload,
  }),
  removeTagFriend: payload => ({
    type: actions.REMOVE_TAG_FRIEND,
    payload,
  }),
  clearTagFriend: () => ({
    type: actions.CLEAR_TAG_FRIEND,
  }),
  addMediaData: payload => ({
    type: actions.ADD_MEDIA_DATA,
    payload,
  }),
  removeMediaData: payload => ({
    type: actions.REMOVE_MEDIA_DATA,
    payload,
  }),
  clearMediaData: () => ({
    type: actions.CLEAR_MEDIA_DATA,
  }),
  addMediaUrl: payload => ({
    type: actions.ADD_MEDIA_URL,
    payload,
  }),
  clearMediaUrl: () => ({
    type: actions.CLEAR_MEDIA_URL,
  }),
};

export default actions;

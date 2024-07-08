const actions = {
  MEDIA_PLAY_LIST: 'MEDIA_PLAY_LIST',
  SELECT_MEDIA: 'MEDIA_SELECT_MEDIA',
  SELECT_MEDIA_ID: 'MEDIA_SELECT_ID',
  MEDIA_PLAYER_VISIBLE: 'MEDIA_PLAYER_VISIBLE',
  INIT_MEDIA_PROCESS: 'INIT_MEDIA_PROCESS',
  SAVE_MEDIA_PROCESS: 'SAVE_MEDIA_PROCESS',
  UPDATE_MEDIA_PROCESS: 'UPDATE_MEDIA_PROCESS',
  // MEDIA_IS_PLAYING: 'MEDIA_IS_PLAYING',
  // PLAYER_ACTION: 'MEDIA_PLAYER_ACTION',

  setMediaPlayList: payload => ({
    type: actions.MEDIA_PLAY_LIST,
    payload,
  }),
  selectMedia: payload => ({
    type: actions.SELECT_MEDIA,
    payload,
  }),
  setSelectedMediaId: payload => ({
    type: actions.SELECT_MEDIA_ID,
    payload,
  }),
  setMediaPlayerVisible: payload => ({
    type: actions.MEDIA_PLAYER_VISIBLE,
    payload,
  }),
  initMediaProcess: () => ({
    type: actions.INIT_MEDIA_PROCESS,
  }),
  saveMediaProcess: payload => ({
    type: actions.SAVE_MEDIA_PROCESS,
    payload,
  }),
  updateMediaProcessStatus: () => ({
    type: actions.UPDATE_MEDIA_PROCESS,
  }),
  // setMediaIsPlaying: payload => ({
  //   type: actions.MEDIA_IS_PLAYING,
  //   payload,
  // }),
  // setPlayerAction: payload => ({
  //   type: actions.PLAYER_ACTION,
  //   payload,
  // }),
};

export default actions;

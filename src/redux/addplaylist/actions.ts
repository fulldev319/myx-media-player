const actions = {
  SHOW_ADD_PLAYLIST_DIALOG: 'SHOW_ADD_PLAYLIST_DIALOG',
  DISMISS_ADD_PLAYLIST_DIALOG: 'DISMISS_ADD_PLAYLIST_DIALOG',

  showDialog: itemData => ({
    type: actions.SHOW_ADD_PLAYLIST_DIALOG,
    payload: itemData,
  }),
  dismissDialog: () => ({
    type: actions.DISMISS_ADD_PLAYLIST_DIALOG,
  }),
};

export default actions;

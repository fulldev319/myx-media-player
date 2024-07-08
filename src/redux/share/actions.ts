const actions = {
  SHOW_SHARE_DIALOG: 'SHOW_SHARE_DIALOG',
  DISMISS_SHARE_DIALOG: 'DISMISS_SHARE_DIALOG',

  showShareDialog: itemData => ({
    type: actions.SHOW_SHARE_DIALOG,
    payload: itemData,
  }),
  dismissShareDialog: () => ({
    type: actions.DISMISS_SHARE_DIALOG,
  }),
};

export default actions;

const actions = {
  SHOW_LOADING_BAR: 'SHOW_LOADING_BAR',
  DISMISS_LOADING_BAR: 'DISMISS_LOADING_BAR',
  SHOW_DIALOG_ADD_TO_NFT: 'SHOW_DIALOG_ADD_TO_NFT',
  DISMISS_DIALOG_ADD_TO_NFT: 'DISMISS_DIALOG_ADD_TO_NFT',
  SHOW_DIALOG_MAGIC_SEARCH: 'SHOW_DIALOG_MAGIC_SEARCH',
  DISMISS_DIALOG_MAGIC_SEARCH: 'DISMISS_DIALOG_MAGIC_SEARCH',
  SHOW_DIALOG_ADD_PLAYLIST: 'SHOW_DIALOG_ADD_PLAYLIST',
  DISMISS_DIALOG_ADD_PLAYLIST: 'DISMISS_DIALOG_ADD_PLAYLIST',
  SHOW_DIALOG_EDIT_PLAYLIST: 'SHOW_DIALOG_EDIT_PLAYLIST',
  DISMISS_DIALOG_EDIT_PLAYLIST: 'DISMISS_DIALOG_EDIT_PLAYLIST',
  SHOW_DIALOG_ADD_MY_CONTACT: 'SHOW_DIALOG_ADD_MY_CONTACT',
  DISMISS_DIALOG_ADD_MY_CONTACT: 'DISMISS_DIALOG_ADD_MY_CONTACT',
  LOAD_CONTACTS: 'LOAD_CONTACTS',
  SET_SNAKE_SUCCESS_MESSAGE: 'SET_SNAKE_SUCCESS_MESSAGE',

  showLoadingBar: () => ({
    type: actions.SHOW_LOADING_BAR,
  }),
  dismissLoadingBar: () => ({
    type: actions.DISMISS_LOADING_BAR,
  }),
  showAddToNFTDialog: (location, trackId) => ({
    type: actions.SHOW_DIALOG_ADD_TO_NFT,
    payload: {location, trackId},
  }),
  dismissAddToNFTDialog: () => ({
    type: actions.DISMISS_DIALOG_ADD_TO_NFT,
  }),
  showMagicSearchDialog: search => ({
    type: actions.SHOW_DIALOG_MAGIC_SEARCH,
    payload: {search},
  }),
  dismissMagicSearchDialog: () => ({
    type: actions.DISMISS_DIALOG_MAGIC_SEARCH,
  }),
  showAddPlayListDialog: () => ({
    type: actions.SHOW_DIALOG_ADD_PLAYLIST,
  }),
  dismissAddPlayListDialog: () => ({
    type: actions.DISMISS_DIALOG_ADD_PLAYLIST,
  }),
  showEditPlayListDialog: playlist => ({
    type: actions.SHOW_DIALOG_EDIT_PLAYLIST,
    payload: {playlist},
  }),
  dismissEditPlayListDialog: () => ({
    type: actions.DISMISS_DIALOG_EDIT_PLAYLIST,
  }),
  showAddMyContactDialog: () => ({
    type: actions.SHOW_DIALOG_ADD_MY_CONTACT,
  }),
  dismissAddMyContactDialog: () => ({
    type: actions.DISMISS_DIALOG_ADD_MY_CONTACT,
  }),
  loadContacts: () => ({
    type: actions.LOAD_CONTACTS,
  }),
  setSnakeSuccessMessage: message => ({
    type: actions.SET_SNAKE_SUCCESS_MESSAGE,
    payload: message,
  }),
};

export default actions;

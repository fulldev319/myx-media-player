const actions = {
  SET_MAP_SETTING: 'SET_MAP_SETTING',
  SET_MAP_SIZE: 'SET_MAP_SIZE',

  setMapSetting: (payload: any) => ({
    type: actions.SET_MAP_SETTING,
    payload,
  }),

  setMapSize: (payload: any) => ({
    type: actions.SET_MAP_SIZE,
    payload,
  }),
};

export default actions;

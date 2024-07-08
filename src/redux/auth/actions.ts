const actions = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGIN_REQUEST_WITH_METAMASK_WALLET: 'LOGIN_REQUEST_WITH_METAMASK_WALLET',
  UPDATE_PROFILE: 'UPDATE_PROFILE',

  loginSuccess: (payload: any) => ({
    type: actions.LOGIN_SUCCESS,
    payload,
  }),
  loginFailure: (error: string) => ({
    type: actions.LOGIN_FAILURE,
    error,
  }),
  loginRequestWithMetaMaskWallet: (payload: any) => ({
    type: actions.LOGIN_REQUEST_WITH_METAMASK_WALLET,
    payload: payload,
  }),
  updateProfileRequest: (payload: any) => ({
    type: actions.UPDATE_PROFILE,
    payload,
  }),
};

export default actions;

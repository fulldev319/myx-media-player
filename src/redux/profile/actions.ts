const actions = {
  REFRESH_TAGGED_REQUEST_COUNT: 'REFRESH_TAGGED_REQUEST_COUNT',
  REFRESH_TAGGED_REQUEST_COUNT_SUCCESS: 'REFRESH_TAGGED_REQUEST_COUNT_SUCCESS',
  REFRESH_TAGGED_REQUEST_COUNT_FAILED: 'REFRESH_TAGGED_REQUEST_COUNT_FAILED',

  refreshTaggedRequestCount: (userId: string) => ({
    type: actions.REFRESH_TAGGED_REQUEST_COUNT,
    payload: userId,
  }),
  refreshTaggedRequestCountSuccess: data => ({
    type: actions.REFRESH_TAGGED_REQUEST_COUNT_SUCCESS,
    payload: data,
  }),
  refreshTaggedRequestCountFailure: () => ({
    type: actions.REFRESH_TAGGED_REQUEST_COUNT_FAILED,
  }),
};

export default actions;

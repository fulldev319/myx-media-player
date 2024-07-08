import HttpClient from './apiClient';

export async function apiGetDebate(debate = 1) {
  const params = {
    debate,
  };
  try {
    const response = await HttpClient.getWithToken('fiction/debate', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetDebateThreads(
  id = 1,
  vote = 'yes',
  limit = 10,
  offset = 0,
) {
  const params = {
    id,
    vote,
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken(
      'fiction/debateThreads',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetEmolikes(
  debate = 1,
  is_debate = true,
  limit = 10,
  offset = 0,
) {
  const params = {
    debate,
    is_debate,
    limit,
    offset,
  };

  try {
    const response = await HttpClient.getWithToken('fiction/emolikes', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostHideContent(userTo) {
  const params = {
    userTo,
  };
  try {
    const response = await HttpClient.postWithToken('user/hideContent', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostCreateDebate(params) {
  try {
    const response = await HttpClient.postWithToken(
      'fiction/createDebate',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostVote(params) {
  try {
    const response = await HttpClient.postWithToken('fiction/vote', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

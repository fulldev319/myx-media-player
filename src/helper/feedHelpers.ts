import HttpClient from './apiClient';

export async function apiGetFollowingFeed(params: {offset?: string}) {
  try {
    const response = await HttpClient.getWithToken('/feed/following', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetPublicFeed(params: {offset?: string}) {
  try {
    const response = await HttpClient.getWithToken('/feed/public', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetPublicFeedV2(params: {
  pageNumber?: number;
  genres?: string[];
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/feed/publicV2', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFollowingFeedV2(params: {
  pageNumber?: number;
  genres?: string[];
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/feed/followingV2', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetLoadMorePubilcFeedV2(params: {
  trackId: string;
  offset?: string;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken(
      '/feed/loadMorePublic',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetLoadMoreFollowingFeedV2(params: {
  trackId: string;
  offset?: string;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken(
      '/feed/loadMoreFollowing',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetRelatedPublicTracks(params: {
  trackId: string;
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.get('/feed/relatedPublicTracks', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

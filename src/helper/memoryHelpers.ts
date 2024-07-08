import HttpClient from './apiClient';

export async function apiSubmitMemory(
  permission,
  mediaTypes,
  mediaUrls,
  durations,
  formats,
  labelArr,
  songId,
  user,
  caption,
  tagged,
  location,
) {
  try {
    const params = {
      permission,
      mediaTypes,
      mediaUrls,
      durations,
      formats,
      labelArr,
      songId,
      priviUser: user,
      caption,
      text: mediaTypes[0] === 'text' ? mediaUrls[0] : '',
      tagged,
      location,
    };
    console.log(params);
    const response = await HttpClient.postWithToken('/memory/create', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFeedDetail(params: {memoryId: string}) {
  try {
    const response = await HttpClient.getWithToken('/memory/get', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiCommentMemory(params: {postId: string; text: string}) {
  try {
    const response = await HttpClient.postWithToken('/memory/comment', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMemoryComments(params: {
  postId: string;
  lastId?: string;
}) {
  try {
    const response = await HttpClient.getWithToken('/memory/comments', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMemoryEmoji(memoryId: string, lastId?: string) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/memory/emojis?memoryId=${memoryId}` + endUrl,
      {},
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiAddMemoryEmoji(params: {
  memoryId: string;
  emoji: string;
  mediaUrl: string;
}) {
  try {
    const response = await HttpClient.postWithToken('/memory/addEmoji', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMemoryTagged(params: {
  memoryId: string;
  offset?: string;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken(
      `/memory/taggedUsers`,
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMemoryTaggedUser(memoryId, lastId) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/memory/taggedUsers?memoryId=${memoryId}` + endUrl,
      {},
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiLikeMemory(params: {postId: string}) {
  try {
    const response = await HttpClient.postWithToken('/memory/like', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiDislikeMemory(params: {postId: string}) {
  try {
    const response = await HttpClient.postWithToken('/memory/dislike', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiSaveMemory(params: {memoryId: string}) {
  try {
    const response = await HttpClient.postWithToken('/memory/save', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiUnsaveMemory(params: {memoryId: string}) {
  try {
    const response = await HttpClient.postWithToken('/memory/unsave', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSearchTags(search: string) {
  try {
    const response = await HttpClient.get('/memory/tags', {search});
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiAcceptTaggedRequest(params) {
  try {
    const response = await HttpClient.postWithToken(
      '/user/acceptTagRequest',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiRemoveTaggedRequest(params) {
  try {
    const response = await HttpClient.postWithToken(
      '/user/rejectTagRequest',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFriendMemories(params: {
  trackId: string;
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.get('/memory/friends', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

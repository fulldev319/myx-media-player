import HttpClient from './apiClient';

export async function apiPublishStory(
  permission,
  mediaType,
  mediaUrl,
  duration,
  format,
  labelArr,
) {
  try {
    const params = {
      permission,
      mediaType,
      mediaUrl,
      duration,
      format,
      labelArr,
    };

    const response = await HttpClient.postWithToken('/story/create', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetStoriesWithUser(userId, lastId) {
  try {
    const response = await HttpClient.get(
      `/story/feed?userId=${userId}&lastId=${lastId}`,
      {},
    );
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiUpdateStoryBySeen(storyId) {
  try {
    const response = await HttpClient.postWithToken(`/story/markAsSeen`, {
      storyId,
    });
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

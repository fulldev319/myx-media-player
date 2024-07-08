import HttpClient from './apiClient';

export async function apiCreateEmoLikes(emoji = 0, url = '', debate = 0) {
  try {
    const response = await HttpClient.postWithToken('emolikes/create', {
      emoji,
      url,
      debate,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetEmoLikes(limit = 10, offset = null, userId) {
  try {
    const response = await HttpClient.getWithToken('/emolikes/owned', {
      limit,
      offset,
      userId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetEmojies(limit = 10, offset = null) {
  try {
    const response = await HttpClient.getWithToken('/emolikes/emojis', {
      limit,
      offset,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiSearchEmojies(query = '', limit = 10, offset = null) {
  try {
    const response = await HttpClient.getWithToken('/emolikes/searchEmojis', {
      query,
      limit,
      offset,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

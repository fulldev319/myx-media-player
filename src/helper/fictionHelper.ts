import HttpClient from './apiClient';

export async function apiCreateDebate(
  url = '',
  length = 0,
  keywords = [],
  country = '2',
  description = '',
  tags = [],
  transcription = '',
  mediaUrls = [],
  mediaTypes = [],
) {
  try {
    const response = await HttpClient.postWithToken('/fiction/createDebate', {
      url,
      length,
      keywords,
      country,
      isModulated: true,
      description,
      tags,
      transcription,
      mediaUrls,
      mediaTypes,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFictionDebates(params: {
  country?: string;
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/fiction/debates', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFictionTrendingDebates(params: {
  country?: string;
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken(
      '/fiction/trendingDebates',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFictionMyEmoji(params: {
  offset?: number;
  limit?: number;
  userId?: string;
}) {
  try {
    const response = await HttpClient.getWithToken(
      '/fiction/myEmolikes',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiSaveSnipAudio(debate, start, end) {
  try {
    const response = await HttpClient.postWithToken('/fiction/snipAudio', {
      debate,
      start,
      end,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiAddEmolikeToDebate(debate, url, emolikeId) {
  try {
    const param = {
      comment: debate,
      url,
      emolike_id: emolikeId,
    };

    const response = await HttpClient.postWithToken('/fiction/emolike', param);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSnipAudios(limit = 10, offset = null) {
  try {
    const response = await HttpClient.getWithToken('/fiction/mySnippedAudios', {
      limit,
      offset,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFictionTrendingMedias(params: {
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken(
      '/fiction/trendingMedia',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiDownloadedAudio(audioId) {
  try {
    const response = await HttpClient.postWithToken('/fiction/download', {
      audioId,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMyPostingCountries(params: {
  offset?: number;
  limit?: number;
  userId?: string;
}) {
  try {
    const response = await HttpClient.getWithToken(
      '/fiction/myPostingCountries',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostCountryFollow(params: {country?: number}) {
  try {
    const response = await HttpClient.postWithToken('/fiction/follow', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostCountryUnFollow(params: {country?: number}) {
  try {
    const response = await HttpClient.postWithToken(
      '/fiction/unfollow',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiSaveDebate(audioId) {
  try {
    const response = await HttpClient.postWithToken('/fiction/save', {
      audioId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiUnSaveDebate(audioId) {
  try {
    const response = await HttpClient.postWithToken('/fiction/unsave', {
      audioId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

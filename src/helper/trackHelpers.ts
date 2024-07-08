import HttpClient from './apiClient';

export async function apiGetTrendingMusic(offset = 0) {
  try {
    const endUrl = offset ? `?offset=${offset}` : '';
    const response = await HttpClient.getWithToken(
      '/track/trending' + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTrendingPlaylist(offset = 0) {
  try {
    const endUrl = offset ? `?offset=${offset}&limit=5` : '?limit=5';
    const response = await HttpClient.getWithToken(
      '/playlist/trending' + endUrl,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetRecentRelease(offset = 0) {
  try {
    const url = offset
      ? `/track/recent?offset=${offset}&limit=20`
      : '/track/recent?limit=20';
    const response = await HttpClient.getWithToken(url, {});
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTopArtist(offset = 0) {
  try {
    const endUrl = offset ? `?offset=${offset}` : '';
    const response = await HttpClient.getWithToken('/artist/trending' + endUrl);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiTrackGet(trackId): Promise<any> {
  try {
    const response = await HttpClient.getWithToken('/track/get/', {
      trackId: trackId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiTrackGetUrl(trackId): Promise<any> {
  try {
    const response = await HttpClient.getWithToken('/track/getUrl/', {
      trackId: trackId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTrackMemories(lastId, songId): Promise<any> {
  try {
    const response = await HttpClient.getWithToken(
      lastId
        ? `/track/memories?songId=${songId}&lastId=${lastId}`
        : `/track/memories?songId=${songId}`,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetPlayList(playlistId): Promise<any> {
  try {
    const response = await HttpClient.getWithToken('/playlist/get', {
      playlistId: playlistId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetPlayListTracks(playlistId, lastId): Promise<any> {
  try {
    const response = await HttpClient.getWithToken('/playlist/tracks', {
      playlistId: playlistId,
      offset: lastId,
      limit: 10,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSearchTracks(search: string, lastId?: any) {
  try {
    const response = await HttpClient.get('/track/search', {
      search,
      lastId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetAllTracks(search: string, offset?: any) {
  try {
    const offsetUrl = offset
      ? offset.map((item, index) => `offset=${item}`).join('&')
      : '';

    const endUrl =
      search.length > 0
        ? offset
          ? `?search=${search}&${offsetUrl}`
          : `?search=${search}`
        : offset
        ? `?${offsetUrl}`
        : '';
    console.log({search});
    console.log({endUrl});
    const response = await HttpClient.get('/track/all' + endUrl, {});
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetRecentSearch(offset?: any) {
  try {
    const response = await HttpClient.get('/track/recentSearches', {});
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiRemoveRecentSerch(term) {
  try {
    const params = {
      term,
    };

    const response = await HttpClient.postWithToken(
      '/track/removeSearch',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetRecentTracks(search: string, offset?: any) {
  try {
    const offsetUrl = offset
      ? offset.map((item, index) => `offset=${item}`).join('&')
      : '';

    const endUrl =
      search.length > 0
        ? offset
          ? `?search=${search}&${offsetUrl}`
          : `?search=${search}`
        : offset
        ? `?${offsetUrl}`
        : '';

    const response = await HttpClient.get(
      '/track/recentListening' + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSavedTracks(search: string, offset?: any) {
  try {
    const offsetUrl = offset
      ? offset.map((item, index) => `offset=${item}`).join('&')
      : '';

    const endUrl =
      search.length > 0
        ? offset
          ? `?search=${search}&${offsetUrl}`
          : `?search=${search}`
        : offset
        ? `?${offsetUrl}`
        : '';

    const response = await HttpClient.get('/track/saved' + endUrl, {});
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiCreatePlayList(title, description, image, permission) {
  try {
    const params = {
      title,
      description,
      image,
      permission,
    };

    const response = await HttpClient.postWithToken('/playlist/create', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiEditPlayList(
  playlistId,
  title,
  description,
  image,
  permission,
) {
  try {
    const params = {
      playlistId,
      title,
      description,
      image,
      permission,
    };

    const response = await HttpClient.postWithToken('/playlist/edit', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiRemovePlayList(playlistId) {
  try {
    const params = {
      playlistId,
    };

    const response = await HttpClient.postWithToken('/playlist/remove', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetOwnedPlayList(userId, lastId) {
  try {
    const params = {
      userId,
      lastId,
    };

    const response = await HttpClient.getWithToken('/playlist/owned', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiAddTrackToPlayList(trackId, playlistId) {
  try {
    const params = {
      trackId,
      playlistId,
    };

    const response = await HttpClient.postWithToken(
      '/playlist/addTrack',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiRemoveTrackFromPlayList(trackId, playlistId) {
  try {
    const params = {
      trackId,
      playlistId,
    };

    const response = await HttpClient.postWithToken(
      '/playlist/removeTrack',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

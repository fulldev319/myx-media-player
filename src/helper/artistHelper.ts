import HttpClient from './apiClient';

export async function apiGetArtistInfo(artistId) {
  try {
    const response = await HttpClient.getWithToken(
      '/artist/get?artistId=' + artistId,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetArtistPlaylist(artistId, lastId = null, limit) {
  try {
    const endUrl = lastId ? `&lastId=${lastId}&limit=${5}` : '';
    const response = await HttpClient.getWithToken(
      '/artist/playlists?artistId=' + artistId + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetArtistTracks(artistId, lastId = null, limit) {
  try {
    const endUrl = lastId
      ? `&offset=${lastId[0]}&offset=${lastId[1]}&limit=${10}`
      : '&limit=10';
    const response = await HttpClient.getWithToken(
      '/artist/tracks?artistId=' + artistId + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetArtistRecentTracks(artistId, lastId = null, limit) {
  try {
    const endUrl = lastId ? `&lastId=${lastId}&limit=${10}` : '&limit=10';
    const response = await HttpClient.getWithToken(
      '/artist/recent?artistId=' + artistId + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiFollowArtist(artistId) {
  try {
    const response = await HttpClient.postWithToken('/artist/follow', {
      artistId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiUnFollowArtist(artistId) {
  try {
    const response = await HttpClient.postWithToken('/artist/unfollow', {
      artistId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

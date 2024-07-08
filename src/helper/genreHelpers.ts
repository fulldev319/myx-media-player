import HttpClient from './apiClient';

export async function apiGetGenres(lastId = null, limit = 30) {
  try {
    const endUrl = lastId ? `&offset=${lastId[0]}&offset=${lastId[1]}` : '';
    const response = await HttpClient.getWithToken(
      `/genre/get?limit=${limit}` + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGengreLike(genreIds) {
  try {
    const response = await HttpClient.postWithToken(`/genre/like`, {
      genreIds,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetGenreArtists(genre) {
  try {
    const response = await HttpClient.getWithToken(
      `/genre/artists?genre=${genre}&limit=5`,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetGenreTracks(genre) {
  try {
    const response = await HttpClient.getWithToken(
      `/genre/tracks?genre=${genre}&limit=5`,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSearchGenres(
  search = '',
  lastId = null,
  limit = 30,
) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/genre/search?limit=${limit}` + `&search=${search}` + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

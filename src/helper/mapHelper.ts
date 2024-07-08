import HttpClient from './apiClient';

export async function apiGetMapFriends(
  lastId = null,
  limit = 30,
  location = null,
  distance = 100,
) {
  try {
    const endUrl = lastId
      ? location
        ? `&offset=${lastId}&location=${location[0]}&location=${location[1]}&distance=${distance}`
        : `&offset=${lastId}`
      : location
      ? `&location=${location[0]}&location=${location[1]}&distance=${distance}`
      : '';

    const response = await HttpClient.getWithToken(
      `/map/friends?limit=${limit}` + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMapRadios(
  lastId = null,
  limit = 30,
  location = null,
  distance = 100,
) {
  try {
    const endUrl = lastId
      ? location
        ? `&offset=${lastId}&location=${location[0]}&location=${location[1]}&distance=${distance}`
        : `&offset=${lastId}`
      : location
      ? `&location=${location[0]}&location=${location[1]}&distance=${distance}`
      : '';

    const response = await HttpClient.getWithToken(
      `/map/radios?limit=${limit}` + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMapFeatureCollections(
  location = [1, 1],
  distance = 100000,
  limit = 10,
  offset = 0,
) {
  const params = {
    location,
    distance,
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken('fantasy/get', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMapCountryColor(
  country = 0,
  limit = 10000,
  offset = 0,
) {
  const params = {
    country,
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken('fantasy/country', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostFictionCreate(params = {}) {
  try {
    const response = await HttpClient.postWithToken('fiction/create', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetRegionOfCountry(
  country = 0,
  limit = 10,
  offset = 0,
) {
  const params = {
    country,
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken(
      'fiction/countryRegions',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetAllCountries(
  limit = 10,
  offset = 0,
  wheels = false,
) {
  const params = {
    limit,
    offset,
    wheels,
  };
  try {
    const response = await HttpClient.getWithToken(
      'fiction/trendingCountries',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSearchCountries(
  query = '',
  limit = 10,
  offset = 0,
) {
  const params = {
    query,
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken('fiction/search', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetCountryDetail(country = 0) {
  const params = {
    country,
  };
  try {
    const response = await HttpClient.getWithToken('fiction/country', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetCitizens(country = 0, limit = 10, offset = 0) {
  const params = {
    country,
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken('fiction/citizens', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostJoinCountry(country = 0, colour = '#ffffff') {
  const params = {
    country,
    colour,
  };
  try {
    const response = await HttpClient.postWithToken('fiction/join', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostUndoJoinCountry(country = 0) {
  const params = {
    country,
  };
  try {
    const response = await HttpClient.postWithToken('fiction/leave', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMyCountries(limit = 10, offset = 0) {
  const params = {
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken(
      'fiction/myCountries',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMap(limit = 10, offset = 0) {
  const params = {
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken('fiction/map', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetCountryRegions(
  country = 0,
  limit = 10,
  offset = 0,
) {
  const params = {
    country,
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken(
      'fiction/countryRegions',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTakenAreas(limit = 10, offset = 0) {
  const params = {
    limit,
    offset,
  };
  try {
    const response = await HttpClient.getWithToken(
      'fiction/takenAreas',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

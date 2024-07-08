import HttpClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultAvatar from './../assets/images/default_profile.png';
import defaultBackground from 'assets/images/artist_detail_bg.png';
import spotifyClient from './spotifyClient';

export const getDefaultAvatar = () => {
  return defaultAvatar;
};

export const getDefaultBackground = () => {
  return defaultBackground;
};

export async function getMatchingUsers(
  searchValue: string,
  properties: string[],
  lastValue: string = '',
): Promise<any> {
  try {
    let url = '/user/matchingUsers';
    if (searchValue) {
      url += `?value=${searchValue}`;
    }

    properties.forEach((prop, index) => {
      if (index > 0 || searchValue) {
        url += `&properties=${prop}`;
      } else if (index === 0) {
        url += `?properties=${prop}`;
      }
    });
    if (lastValue) {
      url += `&lastValue=${lastValue}`;
    }
    const response = await HttpClient.getWithToken(url);
    return response?.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function apiGetRecentInteractedUsers(params: {
  offset?: string;
  limit?: number;
}) {
  try {
    const response = await HttpClient.get('/user/recentInteracted', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetUserRecentListening(params: {
  userId: string;
  offset?: string;
  limit?: number;
}) {
  try {
    const endUrl = params.offset ? `&offset=${params.offset}` : '&offset=0';
    const response = await HttpClient.getWithToken(
      `/user/recentListening?user=${params.userId}` + endUrl,
      {},
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoSharePlayerInside(payload: Object): Promise<any> {
  try {
    const response = await HttpClient.post(
      '/musicDao/sharePlayerInside',
      payload,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaAddSongToPlaylist(payload): Promise<any> {
  try {
    const response = await HttpClient.post(
      '/media/addSongsToPlaylist',
      payload,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaGetMyPlaylists(lastId?: string) {
  try {
    const config = {
      lastId,
    };
    const response = await HttpClient.getWithToken(
      '/media/getMyPlaylists',
      config,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export const saveLikedSongsLocal = async songs => {
  const strData = JSON.stringify(songs);

  await AsyncStorage.setItem('saved_liked_songs', strData);
};

export const getLikedSongsLocal = async () => {
  const savedData = await AsyncStorage.getItem('saved_liked_songs');

  if (savedData) {
    const data = JSON.parse(savedData);
    return data;
  } else {
    return null;
  }
};

export const saveTopPlaylistLocal = async songs => {
  const strData = JSON.stringify(songs);

  await AsyncStorage.setItem('saved_top_playlist', strData);
};

export const getTopPlaylistLocal = async () => {
  const savedData = await AsyncStorage.getItem('saved_top_playlist');

  if (savedData) {
    const data = JSON.parse(savedData);
    return data;
  } else {
    return null;
  }
};

export const savePlayedSongLocal = async song => {
  let savedData = await getRecentPlayedSongLocal();

  if (savedData) {
    if (savedData.length > 0) {
      let isExistedSong = false;

      savedData.forEach(savedItem => {
        if (savedItem.id === song.id) {
          isExistedSong = true;
          return;
        }
      });

      if (isExistedSong) {
        return;
      }
    }
  } else {
    savedData = [];
  }

  savedData.push(song);
  const strData = JSON.stringify(savedData);
  await AsyncStorage.setItem('saved_recent_played', strData);
};

export const getRecentPlayedSongLocal = async () => {
  const savedData = await AsyncStorage.getItem('saved_recent_played');

  if (savedData) {
    const data = JSON.parse(savedData);
    return data;
  } else {
    return [];
  }
};

export const clearRecentPlayedSongLocal = async () => {
  await AsyncStorage.removeItem('saved_recent_played');
};

export const saveContacts = async contacts => {
  const strData = JSON.stringify(contacts);

  await AsyncStorage.setItem('saved_contacts', strData);
};

export const getContactsLoacal = async () => {
  const savedData = await AsyncStorage.getItem('saved_contacts');

  if (savedData) {
    const data = JSON.parse(savedData);
    return data;
  } else {
    return [];
  }
};

export async function apiUpdateProfileImage(profileImage) {
  try {
    const params = {
      profileImage,
    };

    const response = await HttpClient.postWithToken(
      '/user/editProfileImage/',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiUpdateWallpaperImage(wallPaperImage) {
  try {
    const params = {
      wallPaperImage,
    };

    const response = await HttpClient.postWithToken(
      '/user/editWallpaper/',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiEditProfileInfo(username, handle, description) {
  try {
    const params = {
      username,
      handle,
      description,
    };

    const response = await HttpClient.postWithToken('/user/edit', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiMakeProfilePrivate(isPrivate: boolean) {
  try {
    const params = {
      isPrivate,
    };

    const response = await HttpClient.postWithToken('/user/permission', params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetUserInfo(userId: string) {
  try {
    const response = await HttpClient.getWithToken('/user/info', {
      userId: userId,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiSendFollowRequest(friendId: string): Promise<any> {
  try {
    const response = await HttpClient.postWithToken('/user/follow', {
      followingId: friendId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFollowers(
  userId: string,
  lastId: any,
  query: string = '',
) {
  try {
    const response = await HttpClient.getWithToken(`/user/followers`, {
      limit: 10,
      offset: lastId,
      userId: userId,
      query: query,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetFollowings(
  userId: string,
  lastId: any,
  query: string = '',
) {
  try {
    const response = await HttpClient.getWithToken(`/user/followings`, {
      limit: 10,
      offset: lastId,
      userId: userId,
      query: query,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTrendingPeople(lastId = null) {
  try {
    const endUrl = lastId ? `?offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      '/user/trending' + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMatchingUsers(search: string, lastId?: any) {
  try {
    console.log('log start user', search, lastId);
    const response = await HttpClient.getWithToken('/user/searchUsers', {
      search,
      lastId,
    });
    console.log('log mach user', response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSearchUsers(search: string, lastId?: any) {
  try {
    const response = await HttpClient.get('/user/search', {
      search,
      lastId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetCreatedMemories(params: {
  userId: string;
  lastId?: string;
  mediaType: string;
  pageSize?: number;
}) {
  try {
    const response = await HttpClient.get('/user/memories', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTaggedMemories(params: {
  userId: string;
  offset?: string[];
  limit?: number;
}) {
  try {
    const response = await HttpClient.get('/user/tags', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetContacts(lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId[0]}&offset=${lastId[1]}` : '';
    const response = await HttpClient.getWithToken(
      '/user/suggestions?limit=10' + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiFollowPeople(followingId, lastId = null) {
  try {
    const endUrl = lastId ? `?offset=${lastId}` : '';
    const response = await HttpClient.postWithToken('/user/follow' + endUrl, {
      followingId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiUnFollowPeople(following) {
  try {
    const response = await HttpClient.postWithToken('/user/unfollow', {
      following,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiRemoveFollowPeople(following) {
  try {
    const response = await HttpClient.postWithToken('/user/removeFollower', {
      followerId: following,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiEditUserProfile(data) {
  try {
    const response = await HttpClient.postWithToken('/user/edit', data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiEditUserProfileImage(data) {
  try {
    const response = await HttpClient.postWithToken(
      '/user/editProfileImage',
      data,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetUserListening(userId: string) {
  try {
    const response = await HttpClient.getWithToken('/user/listening', {
      userId,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetActivity(lastId = null) {
  try {
    const endUrl = lastId ? `?lastId=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      '/user/activity' + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetTaggedRequest(userId, lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      `/user/tagRequests?userId=${userId}&limit=10&type=all` + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function spotifyGetMe(token) {
  try {
    const response = await spotifyClient.getWithToken('/me', {}, token);
    // console.log('spotifyGetMe response', response);
    if (!response) {
      throw new Error('user is not registerd');
    }
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMostInteract(lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(
      '/user/mostInteracted?limit=10' + endUrl,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSavedMusic(lastId = null) {
  try {
    const endUrl = lastId ? `&offset=${lastId}` : '';
    const response = await HttpClient.getWithToken(`/user/savedMusics`, {
      limit: 10,
      offset: lastId,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSlambookRooms(params: {
  offset?: string;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken(
      '/user/slambookRooms',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMyAudios(
  limit = 10,
  offset = 0,
  type = 'all',
  userId,
) {
  const params = {
    limit,
    offset,
    type,
    userId,
  };
  try {
    const response = await HttpClient.getWithToken(`fiction/myAudios`, params);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

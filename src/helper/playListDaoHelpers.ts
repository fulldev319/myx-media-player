import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import HttpClient from './apiClient';
import {getToken, setToken} from './storageHelper';
import {getURLfromCID, processSongUrl} from './utils';
import FormData from 'form-data';
import {decode} from 'base64-arraybuffer';
import Config from 'react-native-config';
import * as RootNavigation from 'navigators/index';
import RNFS from 'react-native-fs';
FormData.prototype[Symbol.toStringTag] = 'FormData';

export async function mediaGetPlaylists(
  lastId?: string,
  search?: string,
  userId?: string,
) {
  try {
    const config = {
      lastId,
      search,
      userId,
    };

    const response = await HttpClient.getWithToken(
      '/media/getPlaylists',
      config,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaGetTopPlaylists() {
  try {
    const response = await HttpClient.get('/media/getTopPlaylists', {
      orderType: 'songCount',
    });
    const resp = response.data;

    if (resp.success) {
      const data = resp.data.playlists || [];
      const playlistsData = data.map((item: any) => {
        const songs: any[] = [];
        let duration = 0;
        if (item.listSongs && item.listSongs.length > 0) {
          for (let i = 0; i < item.listSongs?.length; i++) {
            const s = item.listSongs[i];
            if (s?.animationUrl || s.AnimationURL) {
              s.url = processSongUrl(s);
            } else if (s?.newFileCID && s?.metadata?.properties?.name) {
              s.url = `${getURLfromCID(s.newFileCID)}/${
                s.metadata.properties.name
              }`;
            } else {
              s.url = '';
            }

            if (s?.Duration || s?.duration) {
              s.mediaDuration = s?.Duration ?? Number(s?.duration);
            } else if (s?.metadata?.properties?.duration) {
              s.mediaDuration = s?.metadata?.properties?.duration;
            } else {
              s.mediaDuration = 0;
            }
            duration += s.mediaDuration;

            songs.push({
              ...s,
              ImageUrl: s.Image,
            });
          }
        }
        return {
          ...item,
          duration,
          playingStatus: 0,
          songs,
        };
      });

      return playlistsData;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaGetPlayListDetail(playListID: string) {
  try {
    const response = await HttpClient.get(
      `/media/getPlaylist/${playListID}`,
      {},
    );

    const res = response.data;
    if (res.success) {
      return res.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaLikePlayList(
  userId: string,
  id: string,
  type: string,
) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.post(
      '/musicDao/playlist/like',
      {
        userId,
        id,
        type,
      },
      {},
    )
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log({err});
        reject(err);
      });
  });
  return promise;
}

export async function mediaGetSongsForArtist(artistId: string) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.getWithToken('/musicDao/getPlayerUserSongs', {
      userId: artistId,
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log({err});
        reject(err);
      });
  });
  return promise;
}

export async function mediaFollowArtist(
  userId: string,
  artistId: string,
  isFollowing: boolean,
) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.post(
      '/musicDao/artist/like',
      {
        userId: userId,
        id: artistId,
        type: isFollowing ? 'dislike' : 'like',
      },
      {},
    )
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log({err});
        reject(err);
      });
  });
  return promise;
}

export async function mediaGetUserPlaylists(userAdress, lastId?: string) {
  try {
    const config = {
      params: {
        lastId,
      },
    };
    const response = await HttpClient.get(
      `/media/getUserPlaylists/${userAdress}`,
      config,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaGetLikedPlaylists(lastId?: number) {
  try {
    const config = {
      lastId,
    };
    const response = await HttpClient.getWithToken(
      '/media/getLikedPlaylists',
      config,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaGetPlayerLikedArtists(lastId?: number) {
  try {
    const config = {
      lastId,
    };
    const response = await HttpClient.getWithToken(
      '/musicDao/getPlayerLikedArtists',
      config,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaGetPlayerLikedAlbums(lastId?: number) {
  try {
    const config = {
      params: {
        lastId,
      },
    };
    const response = await HttpClient.get(
      '/musicDao/getPlayerLikedAlbums',
      config,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

const IPFS_UPLOAD_URL = Config.REACT_APP_IPFS_UPLOAD_URL ?? '';
const IPFS_PREFIX = Config.REACT_APP_IPFS_PREFIX ?? '';

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  console.log('arrayBufferToBase64');
  const bytes = new Uint8Array(buffer);
  console.log('Byte Length', bytes.byteLength);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
};

export const uploadFileToIPFS = async (base64String: string, type: string) => {
  try {
    if (!IPFS_UPLOAD_URL) {
      return;
    }
    const token = await getToken();
    const content = arrayBufferToBase64(decode(base64String));
    console.log('IPFS Uploading...');
    const response = await axios.post(
      IPFS_UPLOAD_URL,
      {
        content,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const imageUrl = `${IPFS_PREFIX}/${response.data}`;
    console.log('Uploaded to IPFS, ', imageUrl);
    return imageUrl;
  } catch (e) {
    console.log('-- error', e);
    const {response} = e;
    const {request, ...errorObject} = response; // take everything but 'request'

    if (errorObject.status == 403 || errorObject.status == 401) {
      setToken('');
      RootNavigation.navigate('SignUpWalletPage', {});
    }
  }
};

export const getBase64String = async (uri: string) => {
  const base64Data = await RNFS.readFile(uri, 'base64');
  return base64Data;
};

export const makeAutoPlaySongsList = orignSongs => {
  let returnSongs: any[] = [];
  if (orignSongs?.length > 0) {
    for (let i = 0; i < orignSongs?.length; i++) {
      const s = orignSongs[i];
      let url = '';
      if (
        s?.metadataMedia?.newFileCID &&
        s?.metadataMedia.metadata?.properties?.name
      ) {
        url = `${getURLfromCID(s.metadataMedia.newFileCID)}/${
          s.metadataMedia.metadata.properties.name
        }`;
      } else if (s?.newFileCID && s?.metadata?.properties?.name) {
        url = `${getURLfromCID(s.newFileCID)}/${s.metadata.properties.name}`;
      } else {
        url = processSongUrl(s);
      }
      let mediaDuration = 0;
      if (s?.Duration || s?.duration) {
        mediaDuration = s?.Duration ?? Number(s?.duration);
      } else if (s?.metadata?.properties?.duration) {
        mediaDuration = s?.metadata?.properties?.duration;
      }

      returnSongs.push({
        ...s,
        url,
        mediaDuration,
        ImageUrl: s.Image,
      });
    }
  }
  return returnSongs;
};

export const makeAutoArtistSongsList = originSongs => {
  let newSongs: any[] = [];
  if (originSongs.length > 0) {
    for (let i = 0; i < originSongs.length; i++) {
      const s = originSongs[i];
      if (s?.AnimationUrl || s?.AnimationURL) {
        s.url = processSongUrl(s);
      } else if (s?.newFileCID && s?.metadata?.properties?.name) {
        s.url = `${getURLfromCID(s.newFileCID)}/${s.metadata.properties.name}`;
      } else {
        s.url = '';
      }

      if (s?.Duration || s?.duration) {
        s.mediaDuration = s?.Duration ?? Number(s?.duration);
      } else if (s?.metadata?.properties?.duration) {
        s.mediaDuration = s?.metadata?.properties?.duration;
      } else {
        s.mediaDuration = 0;
      }

      const songData = {
        ...s,
        ImageUrl: s.Image ?? '',
      };
      newSongs.push(songData);
    }
  }

  return newSongs;
};

export async function apiGetSearchPlaylists(search: string, lastId?: any) {
  try {
    const response = await HttpClient.get(`/playlist/search`, {search, lastId});
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
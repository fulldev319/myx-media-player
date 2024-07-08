import HttpClient from './apiClient';

export async function musicDaoLikeSongNFT(
  userId: string,
  id: string,
  type: string,
) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.post(
      '/musicDao/song/like',
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

export async function musicDaoGetAlbumsOfArtist(
  artistId: string,
  lastId?: string,
  getAll: boolean = false,
): Promise<any> {
  try {
    const response = await HttpClient.getWithToken(
      `/musicDao/getAlbumsOfArtist/${artistId}?lastId=${lastId}`,
      {
        getAll,
      },
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPlayerGenreSongs(
  id: string,
  params,
): Promise<any> {
  try {
    const response = await HttpClient.get(
      `/musicDao/getPlayerGenreSongs/${id}`,
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoUpdateSongViewCount(
  songId: string,
): Promise<any> {
  try {
    const response = await HttpClient.postWithToken(
      '/musicDao/updteSongViewCount',
      {
        songId,
      },
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoUpdateRecentlySong(userId, song) {
  try {
    const response = await HttpClient.post(
      '/musicDao/song/updateRecentlySongAndListeningCount',
      {
        data: {
          songId: song.id,
          userId: userId,
          isPublic: song.isPublic ?? false,
        },
      },
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

import HttpClient from './apiClient';

export async function loginWithSpotify(
  username: string,
  handle: string,
  spotifyId: string,
  uri: string,
  profileImage: string,
  product: string,
) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.post(
      '/user/login',
      {
        username,
        handle,
        spotifyId,
        uri,
        profileImage,
        product,
      },
      {},
    )
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
  return promise;
}

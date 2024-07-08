import HttpClient from './apiClient';

export async function getAllMediasOfUser() {
  const promise = new Promise((resolve, reject) => {
    HttpClient.getWithToken('/media/getAllMediasOfUser')
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

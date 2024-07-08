import HttpClient from './apiClient';

export async function loadNftList(
  songId,
  location,
  nftType,
  pageNum,
  pageSize,
) {
  try {
    const params = {
      songNFT: songId,
      location,
      type: nftType,
      pageNum,
      pageSize: pageSize,
    };

    const response = await HttpClient.postWithToken(
      '/media/getSongNFTMediasByType/' + songId,
      params,
    );

    console.log('--- response get song by type');
    console.log(params);
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

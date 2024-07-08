import HttpClient from './apiClient';

export async function apiGetForYou(params: {offset?: number; limit?: number}) {
  try {
    const response = await HttpClient.getWithToken(
      '/fiction/forYouFeed',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

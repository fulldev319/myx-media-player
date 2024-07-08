import HttpClient from './apiClient';

export async function apiGetTiktokVideo(params: {
  user: string;
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/tiktok/videos', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

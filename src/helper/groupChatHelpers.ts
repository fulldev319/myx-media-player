import HttpClient from './apiClient';

export async function apiGetGroupChats(params: {
  bubble: number;
  limit: number;
  offset?: string;
}) {
  try {
    const response = await HttpClient.getWithToken('/groups/chat', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

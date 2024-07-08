import HttpClient from './apiClient';

export async function apiGetGroupAll(params: {
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/groups/all', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetMyGroupAll(params: {
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/groups/mine', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostCreateBubble(params: {
  group: number;
  name: string;
  description: string;
  image: string;
  tags: string[];
  is_private: boolean;
  x: number;
  y: number;
  radius: number;
}) {
  try {
    const response = await HttpClient.postWithToken(
      '/groups/createBubble',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetGroupsBubbles(params: {
  group: number;
  limit: number;
  offset: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/groups/bubbles', params);

    return response;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetGroupsBubble(params: {bubble: number}) {
  try {
    const response = await HttpClient.getWithToken('/groups/bubble', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostUpdateBubblePositions(params) {
  try {
    const response = await HttpClient.postWithToken(
      '/groups/updateBubblePositions',
      params,
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetSearchGroupAll(params: {
  query: string;
  friends: string;
  offset?: number;
  limit?: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/groups/search', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostUpdateBubbleInfo(params) {
  try {
    const response = await HttpClient.postWithToken(
      '/groups/updateBubbleInfo',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostJoinRequest(params: {group: string}) {
  try {
    const response = await HttpClient.postWithToken(
      '/groups/joinRequest',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostCancelRequest(params: {group: string}) {
  try {
    const response = await HttpClient.postWithToken(
      '/groups/cancelRequest',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiPostLeaveGroup(params: {group: string}) {
  try {
    const response = await HttpClient.postWithToken('/groups/leave', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetGroupsDebates(params: {
  bubble: number;
  member?: number;
  limit: number;
  offset: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/groups/debates', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetGroupsMembers(params: {
  group: number;
  type?: string;
  limit: number;
  offset: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/groups/members', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetGroupsPost(params: {
  audio_id: number;
  bubble: number;
}) {
  try {
    const response = await HttpClient.getWithToken('/groups/post', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

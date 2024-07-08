import HttpClient from './apiClient';

export async function getAllChats(payload) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.getWithToken('/chat/chats', payload)
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        reject(err);
      });
  });
  return promise;
}

export async function uploadChatFile(payload) {
  const {endpointName, room, from, to, formData} = payload;
  const promise = new Promise((resolve, reject) => {
    HttpClient.postWithToken(`/chat/${endpointName}/${room}/${from}/${to}`, {
      mediaUrl: formData,
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        reject(err);
      });
  });
  return promise;
}

export async function startChat(payload) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.postWithToken('/chat/create', payload)
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        reject(err);
      });
  });
  return promise;
}

export async function setLastView(payload) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.postWithToken('/chat/lastView', payload)
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        reject(err);
      });
  });
  return promise;
}

export async function getChatMessages(payload) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.getWithToken('/chat/messages', payload)
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        reject(err);
      });
  });
  return promise;
}

export async function apiGetFriends(userId: string): Promise<any> {
  try {
    const response = await HttpClient.get(`/user/friends/${userId}`, {});
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetUserCounters(userId: any): Promise<any> {
  try {
    const response = await HttpClient.getWithToken(
      `/user/counters/${userId}`,
      {},
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiChatAccepRequest(roomId) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.postWithToken('/chat/acceptRequest', {roomId})
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        reject(err);
      });
  });
  return promise;
}

export async function apiChatRejectRequest(roomId) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.postWithToken('/chat/rejectRequest', {roomId})
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        reject(err);
      });
  });
  return promise;
}

export async function apiGetChatRequests(
  offset = undefined,
  limit = undefined,
) {
  const promise = new Promise((resolve, reject) => {
    HttpClient.getWithToken('/chat/requests', {offset, limit})
      .then(res => {
        resolve(res.data);
      })
      .catch(async err => {
        reject(err);
      });
  });
  return promise;
}

export async function apiShareTrack(room, from, to, data) {
  try {
    const res = await HttpClient.postWithToken(
      `/chat/share/${room}/${from}/${to}`,
      data,
    );
    return res?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

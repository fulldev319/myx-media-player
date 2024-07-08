import HttpClient from './apiClient';

export async function apiCreateRadio(payload): Promise<any> {
  try {
    const response = await HttpClient.post('/radio/create', payload, {});
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetRadioData(radio) {
  try {
    const params = {
      radio,
    };

    const response = await HttpClient.getWithToken('/radio/get', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetRadioQueue(radio, offset, limit = 10) {
  try {
    const params = {
      radio,
      offset,
      limit,
    };

    const response = await HttpClient.getWithToken('/radio/queue', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiSendAudioRequest(radio, audio, duration) {
  try {
    const params = {
      radio,
      audio,
      duration,
    };

    const response = await HttpClient.postWithToken(
      '/radio/sendAudioRequest',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetAudioRequests(radio, offset, limit = 10) {
  try {
    const params = {
      radio,
      offset,
      limit,
    };

    const response = await HttpClient.getWithToken(
      '/radio/audioRequests',
      params,
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function apiGetListeners(radio, offset, limit = 10) {
  try {
    const params = {
      radio,
      offset,
      limit,
    };

    const response = await HttpClient.getWithToken('/radio/listeners', params);

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

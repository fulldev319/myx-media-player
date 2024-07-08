import axios, {AxiosInstance} from 'axios';

import * as RootNavigation from 'navigators/index';
import {setToken} from './storageHelper';

class SpotifyClient {
  spotifyClient: AxiosInstance;

  constructor() {
    const spotifyClient = axios.create({
      baseURL: 'https://api.spotify.com/v1',
    });
    this.spotifyClient = spotifyClient;
  }

  post(apiEndpoint: string, params: any, config?: any) {
    // console.log(`-- api called : ${Config.SERVER_URL + apiEndpoint}`);
    // console.log({params});
    return this.spotifyClient.post(apiEndpoint, params, config);
  }

  get(apiEndpoint: string, params: any = {}) {
    // console.log(`-- api called : ${Config.SERVER_URL + apiEndpoint}`);
    // console.log({params});
    return this.spotifyClient.get(apiEndpoint, {params});
  }

  async getWithToken(apiEndpoint: string, params: any = {}, token) {
    this.spotifyClient.interceptors.request.use(async request => {
      request!.headers!.Authorization = `Bearer ${token}`;
      return request;
    });
    try {
      const response = await this.spotifyClient.get(apiEndpoint, {params});
      return response;
    } catch (error) {
      const {response} = error;
      const {request, ...errorObject} = response; // take everything but 'request'

      if (errorObject.status === 403 || errorObject.status === 401) {
        setToken('');
        RootNavigation.navigate('LoginNavigator', {});
      }
    }
  }

  async postWithToken(apiEndpoint: string, params = {}, config = {}, token) {
    this.spotifyClient.interceptors.request.use(async request => {
      request!.headers!.Authorization = `Bearer ${token}`;
      return request;
    });

    try {
      return this.spotifyClient.post(apiEndpoint, params, config);
    } catch (error) {
      const {response} = error;
      console.log({error});
      const {request, ...errorObject} = response; // take everything but 'request'

      if (errorObject.status === 403 || errorObject.status === 401) {
        setToken('');
        RootNavigation.navigate('LoginNavigator', {});
      }
    }
  }
}

export default new SpotifyClient();

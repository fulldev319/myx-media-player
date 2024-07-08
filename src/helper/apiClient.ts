import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

import * as RootNavigation from 'navigators/index';
import Config from 'react-native-config';
import {getToken, setToken} from './storageHelper';

class HttpClient {
  httpClient: AxiosInstance;

  constructor(baseURL: string) {
    const httpClient = axios.create({
      baseURL,
    });
    this.httpClient = httpClient;
  }

  post(apiEndpoint: string, params: any, config?: any) {
    // console.log(`-- api called : ${Config.SERVER_URL + apiEndpoint}`);
    // console.log({params});
    return this.httpClient.post(apiEndpoint, params, config);
  }

  get(apiEndpoint: string, params: any = {}) {
    // console.log(`-- api called : ${Config.SERVER_URL + apiEndpoint}`);
    // console.log({params});
    return this.httpClient.get(apiEndpoint, {params});
  }

  async getWithToken(apiEndpoint: string, params: any = {}) {
    this.httpClient.interceptors.request.use(async request => {
      // console.log(`-- api called : ${Config.SERVER_URL + apiEndpoint}`);
      const token = await getToken();
      // console.log({token});
      request!.headers!.Authorization = `Bearer ${token}`;
      return request;
    });
    try {
      const response = await this.httpClient.get(apiEndpoint, {params});
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

  async postWithToken(apiEndpoint: string, params = {}, config = {}) {
    this.httpClient.interceptors.request.use(async request => {
      const token = await getToken();
      request!.headers!.Authorization = `Bearer ${token}`;
      return request;
    });

    try {
      return this.httpClient.post(apiEndpoint, params, config);
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

  async deleteWithToken(apiEndpoint: string, params: any) {
    this.httpClient.interceptors.request.use(async request => {
      const token = await getToken();
      request!.headers!.Authorization = `Bearer ${token}`;
      return request;
    });
    return this.httpClient.delete(apiEndpoint, params);
  }
}

export default new HttpClient(Config.SERVER_URL);

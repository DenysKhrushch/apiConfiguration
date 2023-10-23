// npm install --save-dev @types/axios

import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import authInterceptor from './authInterceptor';
import errorResponseInterceptor from './errorResponseInterceptor';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface AxiosBuilder {
  build(): AxiosInstance;
}

const axiosBuilder: AxiosBuilder = {
  build(): AxiosInstance {
    const axios: AxiosInstance = Axios.create({
      baseURL: BASE_URL,
      auth: false,
    });

    axios.interceptors.request.use(authInterceptor as (config: AxiosRequestConfig) => AxiosRequestConfig);
    axios.interceptors.response.use(
        (response: AxiosResponse) => response,
        errorResponseInterceptor as (error: any) => Promise<any>
  );

    return axios;
  },
};

export default axiosBuilder;

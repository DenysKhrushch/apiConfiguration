import { AxiosRequestConfig } from 'axios';

const authInterceptor = (request: AxiosRequestConfig): AxiosRequestConfig => {
  const authToken: string | null = localStorage.getItem('authToken');
  const domain: string | null = localStorage.getItem('domain');

  if (authToken !== null) {
    request.headers.Authorization = authToken;
    request.headers.Accept = 'application/json';

    if (authToken.includes('Bearer') && domain !== null) {
      request.params = {
        ...request.params,
        domain,
      };
    }
  }

  request.params = {
    ...request.params,
    autoclose: true,
  };

  return request;
};

export default authInterceptor;

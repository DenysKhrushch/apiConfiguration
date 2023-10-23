import { AxiosError, AxiosResponse } from 'axios';
import ForbiddenError from './ForbiddenError';
import UnauthorizedError from './UnauthorizedError';

interface ErrorResponse {
  headers: Record<string, string>;
  data: any;
  status: number;
}

export default (error: AxiosError): Promise<never> => {
  const response: AxiosResponse<ErrorResponse> | undefined = error.response;

  if (response != null) {
    const { headers, data, status } = response;
    const message = headers['al-error-message'];

    if (status === 401) {
      return Promise.reject(new UnauthorizedError(message));
    }

    if (status === 403) {
      return Promise.reject(ForbiddenError.strictlyConfidential());
    }

    if (data instanceof Blob && data.type === 'application/json') {
      return new Promise<never>((_, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (reader.result != null) {
            try {
              const jsonData = JSON.parse(reader.result.toString());

              if (
                  jsonData.message != null &&
                  jsonData.message.includes('Resource is marked as private')
              ) {
                return reject(
                    ForbiddenError.strictlyConfidential(jsonData.message)
                );
              }

              return reject(new Error(message));
            } catch {
              return reject(new Error('Cannot parse response body as a JSON.'));
            }
          }

          return reject(new Error('Cannot parse response body as a JSON.'));
        };

        reader.readAsText(data);
      });
    }

    if (message != null) {
      if (message.includes('Resource is marked as private')) {
        return Promise.reject(ForbiddenError.strictlyConfidential(message));
      }

      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error('Unknown error occurred.'));
  }

  return Promise.reject(error);
};
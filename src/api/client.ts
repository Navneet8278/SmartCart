import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic retry for failed GET requests (up to 2 attempts with linear backoff)
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error?.config;
    if (!config) {
      return Promise.reject(error);
    }
    if (!config.retryCount) {
      config.retryCount = 0;
    }
    if (config.retryCount < 2 && config.method === 'get') {
      config.retryCount += 1;
      await new Promise(resolve =>
        setTimeout(() => resolve(null), config.retryCount * 500),
      );
      return apiClient(config);
    }
    return Promise.reject(error);
  },
);

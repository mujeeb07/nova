// import  axios, {
//     type AxiosError, 
//     type AxiosResponse, 
//     type InternalAxiosRequestConfig 
// } from 'axios';

// interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// interface QueueItem {
//   resolve: (value?: unknown) => void;
//   reject: (reason?: unknown) => void;
// }

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, 
// });

// let isRefreshing = false;
// let failedQueue: QueueItem[] = [];

// const processQueue = (error: Error | AxiosError | null, token: string | null = null): void => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => response.data,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as CustomAxiosRequestConfig;

//     if (!originalRequest) {
//       return Promise.reject(error);
//     }

//     if (
//       error.response?.status === 401 && 
//       !originalRequest._retry && 
//       !originalRequest.url?.includes('/login') && 
//       !originalRequest.url?.includes('/refresh')
//     ) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => apiClient(originalRequest))
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;
//       console.log("axios post url:", apiClient);
//       try {
//         await axios.post(
//           `${apiClient.defaults.baseURL}/api/v1/auth/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         isRefreshing = false;
//         processQueue(null);

//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         isRefreshing = false;
//         processQueue(refreshError as AxiosError, null);

//         console.error('Refresh token expired or invalid. Logging out...');
//         const err = refreshError as AxiosError;
//         console.log("Error:", err)
//         return Promise.reject(err.response?.data || err.message);
//       }
//     }

//     return Promise.reject(error.response?.data || error.message);
//   }
// );

// export default apiClient;


import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Normalized error so callers can still tell 403 from 500 from a network failure.
export interface ApiError {
  status?: number;
  code?: string;
  message: string;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Bare client for the refresh call: no interceptors (so no loop) but the SAME
// baseURL, so the refresh path is built exactly like every other request.
const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

// The auth store registers its logout here. This file never clears state itself.
let onAuthFailure: () => void = () => {};
export const setAuthFailureHandler = (fn: () => void): void => {
  onAuthFailure = fn;
};

// One shared refresh promise replaces isRefreshing + failedQueue.
let refreshPromise: Promise<void> | null = null;

const refreshSession = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/api/v1/auth/refresh') // this project's baseURL has no /api/v1 prefix; every call spells it out
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const AUTH_PATHS = ['/login', '/register', '/refresh', '/logout', '/otp'];

const normalizeError = (error: AxiosError<any>): ApiError => ({
  status: error.response?.status,
  code: error.response?.data?.error?.code,
  message:
    error.response?.data?.error?.message ?? // { error: { message } } shape
    error.response?.data?.message ??        // { success:false, message } shape (this backend)
    error.message,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
    const status = error.response?.status;
    const isAuthEndpoint = AUTH_PATHS.some((p) => originalRequest?.url?.includes(p));

    // Only a 401 on a non-auth endpoint, not yet retried, triggers a refresh.
    // 403 (valid session, no permission) must never refresh or log out.
    if (!originalRequest || status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(normalizeError(error));
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
      return apiClient(originalRequest);
    } catch (refreshError) {
      const refreshStatus = (refreshError as AxiosError).response?.status;

      // Log out only when the server definitively rejected the refresh token.
      // Network errors, timeouts and 5xx should NOT end the session.
      if (refreshStatus === 401 || refreshStatus === 403) {
        onAuthFailure();
      }
      return Promise.reject(normalizeError(refreshError as AxiosError));
    }
  }
);

export default apiClient;
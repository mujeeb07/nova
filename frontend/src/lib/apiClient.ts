import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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

const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

let onAuthFailure: () => void = () => {};
export const setAuthFailureHandler = (fn: () => void): void => {
  onAuthFailure = fn;
};

let refreshPromise: Promise<void> | null = null;

const refreshSession = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/api/v1/auth/refresh')
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
    error.response?.data?.error?.message ?? 
    error.response?.data?.message ??
    error.message,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
    const status = error.response?.status;
    const isAuthEndpoint = AUTH_PATHS.some((p) => originalRequest?.url?.includes(p));

    if (!originalRequest || status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(normalizeError(error));
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
      return apiClient(originalRequest);
    } catch (refreshError) {
      const refreshStatus = (refreshError as AxiosError).response?.status;

      if (refreshStatus === 401 || refreshStatus === 403) {
        onAuthFailure();
      }
      return Promise.reject(normalizeError(refreshError as AxiosError));
    }
  }
);

export default apiClient;
  import axios, { AxiosError } from "axios";
  import type {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";
  import toast from "react-hot-toast";
  import { queryClient } from "@/shared/lib/react-query";
  import { tokenStorage } from "@/shared/lib/utils/tokenStorage";
  import { tokenExpiredStore } from "@/shared/lib/store/tokenExpiredStore";

  export interface ApiErrorResponse {
    message?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
    errorCode?: string;
    errorMessage?: string;
    isSuccess?: boolean;
  }

  export const setTokenExpiredHandler = (handler: () => void) => {
    tokenExpiredStore.getState().setHandler(handler);
  };

  export const resetTokenExpiredState = () => {
    tokenExpiredStore.getState().resetState();
  };

  export const clear401Error = () => {
    tokenExpiredStore.getState().clear401Error();
  };

  export const clearXsrfToken = () => {
    tokenStorage.remove();
  };

  export const httpClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_URL as string,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    xsrfCookieName: 'COOKIE_NAME_THAT_DOES_NOT_EXIST', 
    xsrfHeaderName: 'HEADER_NAME_THAT_DOES_NOT_EXIST',
  });
    
  export const getBackendErrorMessage = (error: AxiosError): string => {
    if (error.code === 'ERR_CANCELED' || error.message === 'canceled') return "";
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        return "İnternet bağlantınızı yoxlayın";
      }
      return "";
    }

    if (!error.response?.data) return "Xəta baş verdi. Sistemlə əlaqə qurula bilmədi.";

    const data = error.response.data as ApiErrorResponse;
    
    if (data.errorMessage) return data.errorMessage;
    
    if (data.message) return data.message;
    if (data.error) return data.error;

    if (data.errors) {
      const errorKeys = Object.keys(data.errors);
      if (errorKeys.length > 0) {
        const firstValue = data.errors[errorKeys[0]!];
        if (Array.isArray(firstValue)) return String(firstValue[0]);
        if (typeof firstValue === "string") return firstValue;
      }
    }

    return `Xəta baş verdi (${error.response?.status || 'naməlum'})`;
  };

  httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const isSessionExpired = tokenExpiredStore.getState().getHas401ErrorForAuthMe();
      const isAuthRequest = 
        config.url?.includes('/auth/signin') || 
        config.url?.includes('/auth/logout');

      if (isSessionExpired && !isAuthRequest) {
        return Promise.reject(new axios.CanceledError('Session expired'));
      }

      if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        const isSignInRequest = config.url?.includes('/auth/signin');
        
        if (!isSignInRequest) {
          const token = tokenStorage.get();
          
          if (token) {
            config.headers['X-XSRF-TOKEN'] = token;
          }
        }
      }
      
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  httpClient.interceptors.response.use(
    (response: AxiosResponse) => {
      const newToken = response.headers['x-xsrf-token'];
      
      if (newToken) {
        tokenStorage.set(newToken);
      }
      
      return response;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
      if (axios.isCancel(error)) return Promise.reject(error);

      const errorStatus = error.response?.status;

      if (errorStatus === 401) {
        queryClient.cancelQueries({ queryKey: ["auth"] });

        const isLoginPage =
          window.location.pathname.includes("/login") ||
          window.location.pathname.includes("/auth/renew-password");
        
        const store = tokenExpiredStore.getState();
        
        if (!isLoginPage) {
          store.setHas401ForAuthMe(true);
        }

        const showModal = store.showModalHandler;
        const canShow = store.getCanShowModal();
        if (showModal && canShow && !isLoginPage) {
          store.markModalShown();
          showModal();
        } else if (!showModal || isLoginPage) {
          tokenStorage.remove();
        }
        return Promise.reject(error);
      }

      if (errorStatus === 403) {
        const errorData = error.response?.data;
        if (errorData?.errorCode === 'antiforgery_invalid') {
          tokenStorage.remove();
          toast.error('Təhlükəsizlik nişanı yenilənir...');
          tokenExpiredStore.getState().setCsrfInvalid(true);
        } else {
          toast.error("İcazəniz yoxdur");
        }
        return Promise.reject(error);
      }

      const message = getBackendErrorMessage(error);
      if (message) toast.error(message);
      return Promise.reject(error);
    }
  );

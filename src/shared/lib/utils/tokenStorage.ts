
const XSRF_TOKEN_KEY = 'xsrf-token';

export const tokenStorage = {
  get: (): string | null => {
    return localStorage.getItem(XSRF_TOKEN_KEY);
  },

  set: (token: string): void => {
    localStorage.setItem(XSRF_TOKEN_KEY, token);
  },

  remove: (): void => {
    localStorage.removeItem(XSRF_TOKEN_KEY);
  },

  exists: (): boolean => {
    return !!localStorage.getItem(XSRF_TOKEN_KEY);
  },

  clearToken: (): void => {
    localStorage.removeItem(XSRF_TOKEN_KEY);
    document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },
};  
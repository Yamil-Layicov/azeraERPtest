
export const APP_CONFIG = {
  TITLE: "Azera Holding - ESD"
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: "token",
  REFRESH_TOKEN_KEY: "refresh_token",
  TOKEN_EXPIRY_BUFFER_SECONDS: 60,
} as const;

export const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

export const DATE_FORMATS = {
  DATE: "dd.MM.yyyy",          
  DATE_TIME: "dd.MM.yyyy HH:mm",
  TIME: "HH:mm",
  ISO: "yyyy-MM-dd",
} as const;

export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 10,
  PAGE_RANGE: 3,
  DEFAULT_PAGE: 1,
} as const;

export const FILE_CONFIG = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ["image/jpeg", "image/png", "application/pdf"] as const,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png"] as const,
} as const;

export const API_CONFIG = {
  TIMEOUT: 30000, 
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const APP_TITLE = APP_CONFIG.TITLE;
export const authKeywords = { accessToken: AUTH_CONFIG.TOKEN_KEY };
export const LOCAL_STORAGE_KEYS = STORAGE_KEYS;
export const DATE_FORMAT = DATE_FORMATS.DATE;
export const DATE_TIME_FORMAT = DATE_FORMATS.DATE_TIME;
export const TIME_FORMAT = DATE_FORMATS.TIME;
export const ITEMS_PER_PAGE = PAGINATION_CONFIG.ITEMS_PER_PAGE;
export const PAGINATION_RANGE = PAGINATION_CONFIG.PAGE_RANGE;
export const MAX_FILE_SIZE_MB = FILE_CONFIG.MAX_SIZE_MB;
export const MAX_FILE_SIZE_BYTES = FILE_CONFIG.MAX_SIZE_BYTES;
export const ALLOWED_FILE_TYPES = FILE_CONFIG.ALLOWED_TYPES;
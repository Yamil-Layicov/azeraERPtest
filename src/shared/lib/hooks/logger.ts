// shared/lib/logger.ts
export const logger = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
    //Next Sentry.captureException(error);
  },
  warn: (message: string) => {
    if (import.meta.env.DEV) {
      console.warn(message);
    }
  }
};
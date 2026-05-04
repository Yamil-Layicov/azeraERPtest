import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { ROUTES } from '@/app/routes/consts';
import type { LoginFormValues, LoginResponseType } from '../model/schema';
import { AUTH_KEYS } from './useUser';
import { AUTH_CONFIG } from '@/shared/config/consts';
import { resetTokenExpiredState, clear401Error, type ApiErrorResponse } from '@/shared/api/httpClient';
import type { AxiosError } from 'axios';
import { logger } from '@/shared/lib/hooks/logger';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<LoginResponseType, AxiosError, LoginFormValues>({
    mutationFn: (payload) => authService.login(payload),

    onSuccess: async (data) => {
      resetTokenExpiredState();
      clear401Error();

      const maybeToken = data.result?.token ?? null;
      if (maybeToken) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, maybeToken);
      }

      try {
        await authService.getAntiForgery();
      } catch (e) {
         logger.error('[CSRF] Anti-forgery token alınamadı', e);
      }

      queryClient.removeQueries({ queryKey: ['auth'] });

      // /me cache warm-up only: prefetchQuery does not block navigation on failure.
      // Dashboard's useUser() will retry/fetch again if this request fails.
      await queryClient.prefetchQuery({
        queryKey: AUTH_KEYS.ME,
        queryFn: () => authService.getMe(),
      });

      navigate(ROUTES.DASHBOARD.LINK, { replace: true });
    },

    onError: (error, variables) => {
      const errorCode = (error.response?.data as ApiErrorResponse)?.errorCode;

      if (errorCode === 'ldap.pwd_expired') {
        navigate(
          `${ROUTES.AUTH.RENEW_PASSWORD.LINK}?username=${encodeURIComponent(variables.username)}`,
          { replace: true }
        );
        return;
      }

      // toast yox — caller (LoginPage) özü handle edir
    },
  });
};

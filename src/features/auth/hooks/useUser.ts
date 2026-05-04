import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../api/authService";
import type { MeResponseType } from "../model/schema";
import { useIdle } from "@/shared/lib/hooks/useIdle";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/app/routes/consts";
import { useTokenExpired } from "@/shared/lib/contexts/TokenExpiredContext";
import { useStore } from "zustand";
import { tokenExpiredStore } from "@/shared/lib/store/tokenExpiredStore";

export const AUTH_KEYS = {
  ME: ["auth", "me"] as const,
};

export const useUser = () => {
  const isIdle = useIdle(1000 * 60 * 30);
  const location = useLocation();
  const { isModalOpen } = useTokenExpired();
  const queryClient = useQueryClient();

  const isSessionLocked = useStore(tokenExpiredStore, (s) => s.getHas401ErrorForAuthMe());

  const isAuthRoute =
    location.pathname === ROUTES.AUTH.LOGIN.LINK ||
    location.pathname === ROUTES.AUTH.UNAUTHORIZED.LINK;

  const cachedData = queryClient.getQueryData<MeResponseType>(AUTH_KEYS.ME);
  const hasCachedData = cachedData?.isSuccess === true && cachedData?.result?.user;

  return useQuery<MeResponseType, AxiosError>({
    queryKey: AUTH_KEYS.ME,
    queryFn: ({ signal }) => authService.getMe(signal),

    // Kilit varsa veya auth sayfasındaysak sorgu tamamen kapalıdır
    enabled: !isAuthRoute && !isModalOpen && !isSessionLocked,
    placeholderData: isAuthRoute && hasCachedData ? cachedData : undefined,

    staleTime: 1000 * 60 * 1, 
    gcTime: 1000 * 60 * 30, 
    refetchInterval: isIdle || isModalOpen || isSessionLocked ? false : 1000 * 60 * 1,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: !isModalOpen && !isSessionLocked,

    retry: (failureCount, error) => {
      // İptal edilen veya 401/403 alan istekleri asla tekrar deneme
      if (axios.isCancel(error)) return false;

      const status = error.response?.status;
      if (status && [401, 403].includes(status)) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

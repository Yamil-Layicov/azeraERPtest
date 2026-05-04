import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { AUTH_KEYS } from '../hooks/useUser';
import { ROUTES } from '@/app/routes/consts';
import { tokenExpiredStore } from '@/shared/lib/store/tokenExpiredStore';

export const PublicOnlyRoutes = () => {
  const isSessionExpired = tokenExpiredStore.getState().getHas401ErrorForAuthMe();

  const { data, isLoading, isError } = useQuery({
    queryKey: AUTH_KEYS.ME,
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !isSessionExpired, 
  });

  if (isLoading) return null;
  if (isError) return <Outlet />;

  const isAuthenticated = !!data?.result?.user;

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD.LINK} replace />;
  }

  return <Outlet />;
};
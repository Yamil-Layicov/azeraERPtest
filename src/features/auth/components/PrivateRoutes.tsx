import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useTokenExpired } from '@/shared/lib/contexts/TokenExpiredContext';
import { resetTokenExpiredState } from '@/shared/api/httpClient';
import { ROUTES } from '@/app/routes/consts';
import { Loading } from '@/shared/ui/loading';
import type { MeResponseType } from '../model/schema'; 

interface PrivateRoutesProps {
  allowedRoles?: string[];
  requiredPermission?: string;
  requiredPermissionsAny?: string[];
}

export const PrivateRoutes = ({
  allowedRoles = [],
  requiredPermission,
  requiredPermissionsAny = [],
}: PrivateRoutesProps) => {
  const { data, isLoading, isError } = useUser();
  const response = data as MeResponseType | undefined;
  const { isModalOpen } = useTokenExpired();
  const location = useLocation();

  useEffect(() => {
    resetTokenExpiredState();
  }, [location.pathname]);

  if (isLoading) {
    return <Loading />;
  }

  if (isModalOpen) {
    return <Outlet />;
  }

  const user = response?.result?.user;
  const permissions = user?.permissions || [];
  const isSuccess = response?.isSuccess;

  if (isError || !isSuccess || !user) {
    return <Navigate to={ROUTES.AUTH.LOGIN.LINK} state={{ from: location }} replace />;
  }

 
  const isAdmin = user.username?.toLowerCase() === 'admin' || permissions.includes('*');

  if (isAdmin) {
    return <Outlet />;
  }

  if (allowedRoles.length > 0) {
    const hasRole = user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return <Navigate to={ROUTES.AUTH.UNAUTHORIZED.LINK} replace />;
    }
  }

  if (requiredPermission) {
    const hasPermission = permissions.includes(requiredPermission);
    if (!hasPermission) {
      return <Navigate to={ROUTES.AUTH.UNAUTHORIZED.LINK} replace />;
    }
  }

  if (requiredPermissionsAny.length > 0) {
    const hasAnyPermission = requiredPermissionsAny.some((permission) =>
      permissions.includes(permission),
    );
    if (!hasAnyPermission) {
      return <Navigate to={ROUTES.AUTH.UNAUTHORIZED.LINK} replace />;
    }
  }

  return <Outlet />;
};
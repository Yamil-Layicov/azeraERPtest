import { useUser } from './useUser';
import { PERMISSIONS } from '@/shared/consts/permissions';
import type { MeResponseType } from '../model/schema';

export const usePermission = (requiredPermission: string): boolean => {
  const { data } = useUser();
  const response: MeResponseType | undefined = data as MeResponseType | undefined;
  
  const user = response?.result?.user;
  const userPermissions = user?.permissions || [];

  if (!user) return false;

  
  if (userPermissions.includes(PERMISSIONS.ADMIN_ALL)) {
    return true;
  }

  return userPermissions.includes(requiredPermission);
};
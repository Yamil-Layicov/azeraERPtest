import { useUser } from "./useUser";
import { STATIC_NAVIGATION, type StaticMenuItem } from "@/shared/consts/navigation";
import type { MenuItem } from "@/shared/types/navigation";
import type { MeResponseType } from "../model/schema";
import { PERMISSIONS } from "@/shared/consts/permissions";

export const useAppNavigation = (): MenuItem[] => {
  const { data: response } = useUser();
  const typedResponse = response as MeResponseType | undefined;
  const user = typedResponse?.result?.user;
  const userPermissions = user?.permissions || [];

  const staticItems = (user && user.roles)
    ? filterMenuByPermission(STATIC_NAVIGATION, user.roles, userPermissions)
    : [];

  return staticItems;
};

function filterMenuByPermission(
  items: StaticMenuItem[], 
  userRoles: string[], 
  userPermissions: string[]
): MenuItem[] {
    return items.reduce<MenuItem[]>((acc, item) => {
        const isAdmin = userPermissions.includes(PERMISSIONS.ADMIN_ALL) || userPermissions.includes("*");
        
        let hasAccess = false;
        
        const checkRoleMatch = (allowedRoles: string[]) => {
            return allowedRoles.some(allowed => 
                userRoles.some(userRole => 
                    userRole === allowed || userRole.startsWith(`${allowed}.`)
                )
            );
        };

        if (isAdmin) {
            hasAccess = true;
        } else {
            const roleMatch = item.allowedRoles && item.allowedRoles.length > 0 
                ? checkRoleMatch(item.allowedRoles) 
                : true;

            const permissionMatch = item.requiredPermissionsAny && item.requiredPermissionsAny.length > 0
                ? item.requiredPermissionsAny.some((permission) => userPermissions.includes(permission))
                : item.requiredPermission
                  ? userPermissions.includes(item.requiredPermission)
                  : true;

            hasAccess = roleMatch && permissionMatch;
        }

        if (hasAccess) {
            const filteredChildren = item.children 
                ? filterMenuByPermission(item.children, userRoles, userPermissions) 
                : undefined;

            if (item.type === 'collapse' && item.children && item.children.length > 0 && (!filteredChildren || filteredChildren.length === 0)) {
                return acc; 
            }

            acc.push({ 
                ...item, 
                children: filteredChildren 
            } as MenuItem);
        }
        
        return acc;
    }, []);
}
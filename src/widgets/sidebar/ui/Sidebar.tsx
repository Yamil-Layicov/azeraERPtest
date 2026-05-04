import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import styles from "./Sidebar.module.css";
import { useAppNavigation } from "@/features/auth/hooks/useAppNavigation";
import type { SidebarItem, SidebarProps } from "../model";
import { getIconComponent, externalLink } from "../model";

export const Sidebar = ({ isCollapsed = false }: SidebarProps) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const location = useLocation();

  const rawMenuItems = useAppNavigation();

  const toPathWithoutLeadingSlash = (path: string): string =>
    path.startsWith("/") ? path.slice(1) : path;

  const getLocationPathForMatch = (pathname: string): string => {
    if (pathname.startsWith("/app/")) return pathname.slice(5);
    if (pathname === "/app") return "";
    return pathname.startsWith("/") ? pathname.slice(1) : pathname;
  };

  const pathsMatch = (
    menuPath: string | undefined,
    locationPath: string,
  ): boolean => {
    if (!menuPath || !locationPath) return false;
    return toPathWithoutLeadingSlash(menuPath) === locationPath;
  };

  const mapMenuItem = (item: any): SidebarItem => ({
    name: item.title,
    icon: item.icon || "QuestionMarkCircleIcon",
    path: item.path ?? undefined,
    isExternal: false,
    submenu: item.children?.map((child: any) => mapMenuItem(child)),
  });

  const menuItems: SidebarItem[] = rawMenuItems.map(mapMenuItem);

  const findParentMenuPath = (
    items: SidebarItem[],
    targetPath: string,
    parentPath?: string,
  ): string[] | null => {
    for (const item of items) {
      const menuKey = parentPath ? `${parentPath}::${item.name}` : item.name;
      if (pathsMatch(item.path, targetPath)) {
        return parentPath ? [parentPath, menuKey] : [menuKey];
      }
      if (item.submenu) {
        const result = findParentMenuPath(item.submenu, targetPath, menuKey);
        if (result) return [menuKey, ...result];
      }
    }
    return null;
  };

  useEffect(() => {
    if (isCollapsed) return;
    const currentPath = getLocationPathForMatch(location.pathname);
    const menuPath = findParentMenuPath(
      [...menuItems, externalLink],
      currentPath,
    );
    if (menuPath && menuPath.length > 0) {
      setOpenMenus((prev) => {
        const isAlreadyOpen = menuPath.every((key) => prev.includes(key));
        if (isAlreadyOpen) return prev;
        return menuPath;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- menuItems, findParentMenuPath, getLocationPathForMatch
  }, [location.pathname, isCollapsed]);

  const handleMenuClick = (menuName: string, parentPath?: string) => {
    if (isCollapsed) return;
    const menuKey = parentPath ? `${parentPath}::${menuName}` : menuName;

    setOpenMenus((prev) => {
      if (prev.includes(menuKey)) {
        return prev.filter((key) => !key.startsWith(menuKey));
      }
      let newMenus: string[] = [];
      if (parentPath) {
        const parentParts = parentPath.split("::");
        newMenus = [...parentParts, menuKey];
      } else {
        newMenus = [menuKey];
      }
      return [...new Set(newMenus)];
    });
  };

  const currentPathForMatch = getLocationPathForMatch(location.pathname);

  const isSubMenuActiveRecursive = (
    submenu?: SidebarItem[],
    currentPath: string = currentPathForMatch,
  ): boolean => {
    if (!submenu) return false;
    return submenu.some((sub) => {
      if (pathsMatch(sub.path, currentPath)) return true;
      return isSubMenuActiveRecursive(sub.submenu, currentPath);
    });
  };

  const renderMenuItem = (
    item: SidebarItem,
    index: number,
    parentPath?: string,
  ): React.ReactNode => {
    const IconComponent = getIconComponent(item.icon);
    const menuKey = parentPath ? `${parentPath}::${item.name}` : item.name;
    const isActive = item.path
      ? pathsMatch(item.path, currentPathForMatch)
      : false;
    const isSubMenuActive = isSubMenuActiveRecursive(item.submenu);
    const isMenuOpen = !isCollapsed && openMenus.includes(menuKey);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isInSubmenu = !!parentPath;
    const shouldShowText = isInSubmenu || !isCollapsed;

    return (
      <li
        key={`${item.name}-${index}`}
        className={`
          ${isMenuOpen ? styles.menuItemOpen : ""}
          ${item.isSeparator ? styles.menuItemSeparator : ""}
        `}
      >
        {hasSubmenu ? (
          <>
            <button
              className={`${styles.navItem} ${isSubMenuActive ? styles.active : ""}`}
              onClick={() => handleMenuClick(item.name, parentPath)}
              title={item.name}
            >
              <div className={styles.navItemContent}>
                <IconComponent className={styles.icon} />
                {shouldShowText && (
                  <span className={styles.labelText}>{item.name}</span>
                )}
              </div>
              {shouldShowText && (
                <ChevronDownIcon
                  className={`${styles.arrowIcon} ${isMenuOpen ? styles.arrowOpen : ""}`}
                />
              )}
            </button>

            <ul
              className={`${styles.submenu} ${isMenuOpen ? styles.submenuOpen : ""}`}
            >
              {item.submenu!.map((subItem, subIndex) =>
                renderMenuItem(subItem, subIndex, menuKey),
              )}
            </ul>
          </>
        ) : item.isExternal ? (
          <a
            href={item.path || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navItem}
            title={item.name}
          >
            <div className={styles.navItemContent}>
              <IconComponent className={styles.icon} />
              {shouldShowText && (
                <span className={styles.labelText}>{item.name}</span>
              )}
            </div>
          </a>
        ) : (
          <Link
            to={
              item.path
                ? item.path.startsWith("/")
                  ? item.path
                  : `/${item.path}`
                : "#"
            }
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            title={item.name}
          >
            <div className={styles.navItemContent}>
              <IconComponent className={styles.icon} />
              {shouldShowText && (
                <span className={styles.labelText}>{item.name}</span>
              )}
            </div>
          </Link>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""}`}
    >
      <nav className={styles.navContainer}>
        <ul className={styles.navList}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </ul>
        <ul className={styles.bottomNavList}>
          {renderMenuItem(externalLink, 0)}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

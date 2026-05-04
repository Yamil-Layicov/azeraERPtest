export type MenuItemType = 'item' | 'collapse';

export interface MenuItem {
  title: string;
  icon?: string | null; 
  type?: MenuItemType;
  path?: string | null; 
  children?: MenuItem[] | null; 
}

export interface NavigationData {
  menu: MenuItem[];
}
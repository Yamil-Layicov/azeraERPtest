import type { ComponentType, SVGProps } from "react";

export type HeroIcon = ComponentType<SVGProps<SVGSVGElement> & { title?: string, titleId?: string, className?: string }>;

export interface SidebarProps {
  isCollapsed?: boolean;
}

export interface SidebarItem {
  name: string;
  icon: string; 
  path?: string;
  submenu?: SidebarItem[];
  isExternal?: boolean;
  isSeparator?: boolean;
}

export type IconMapType = Record<string, HeroIcon>;
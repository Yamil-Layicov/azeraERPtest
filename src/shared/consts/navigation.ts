import { ROUTES, ROLES, type TRolesKeyword } from "@/app/routes/consts";
import type { MenuItem } from "@/shared/types/navigation";
import { PERMISSIONS } from "./permissions";

export interface StaticMenuItem extends MenuItem {
  allowedRoles?: TRolesKeyword[];
  requiredPermission?: string;
  requiredPermissionsAny?: string[];
  children?: StaticMenuItem[];
}

export const STATIC_NAVIGATION: StaticMenuItem[] = [
  {
    title: "Ana səhifə",
    path: ROUTES.DASHBOARD.LINK,
    icon: "HomeIcon",
    type: "item",
  },
  {
    title: "CRM",
    icon: "CRMIcon",
    type: "collapse",
    allowedRoles: [ROLES.ADMIN, ROLES.CRM],
    children: [
      {
        title: "Müştərilər",
        icon: "UsersIcon",
        type: "collapse",
        children: [
          {
            title: "Əlavə et",
            path: ROUTES.CRM.CUSTOMERS.CREATE_USER.LINK,
            icon: "PlusIcon",
            type: "item",
            requiredPermission: "User.Create",
          },
          {
            title: "Bütün Siyahı",
            path: ROUTES.CRM.CUSTOMERS.ALL_LIST.LINK,
            icon: "ListIcon",
            type: "item",
          },
        ],
      },
      {
        title: "Loyallıq",
        icon: "DevicePhoneMobileIcon",
        type: "collapse",
        children: [
          {
            title: "Idarəetmə Paneli",
            path: ROUTES.CRM.ROYALITY_MANAGEMENT.PATH,
            icon: "ChartBarIcon",
            type: "item",
          },
          {
            title: "Bildirişlər",
            path: ROUTES.CRM.NOTIFICATIONS.PATH,
            icon: "NotificationIcon",
            type: "item",
          },
        ],
      },
    ],
  },

  {
    title: "Maliyyə",
    icon: "MoneyIcon",
    type: "collapse",
    children: [
      {
        title: "Əlavə et",
        path: ROUTES.KASSA.ADD_KASSA.LINK,
        icon: "PlusIcon",
        type: "item",
        allowedRoles: [ROLES.FINANCE, ROLES.ADMIN],
      },
      {
        title: "Bütün Siyahı",
        path: ROUTES.KASSA.ALL_LIST.LINK,
        icon: "ListIcon",
        type: "item",
        allowedRoles: [ROLES.FINANCE, ROLES.ADMIN],
      },
      {
        title: "Kassa",
        path: ROUTES.KASSA.KASSA_PAGE.LINK,
        icon: "CashIcon",
        type: "item",
        allowedRoles: [ROLES.FINANCE, ROLES.ADMIN],
      },
      {
        title: "Təsdiq gözləyən",
        path: ROUTES.KASSA.PENDING_APPROVAL.LINK,
        icon: "CheckCircleIcon",
        type: "item",
        allowedRoles: [ROLES.FINANCE, ROLES.ADMIN],
      },
      {
        title: "Hesabat",
        path: ROUTES.KASSA.REPORT.LINK,
        icon: "PieChartIcon",
        type: "item",
        allowedRoles: [ROLES.FINANCE, ROLES.ADMIN],
      },
    ],
  },

  {
    title: "Təhcizat",
    icon: "ShoppingBagIcon",
    type: "collapse",
    allowedRoles: [ROLES.ADMIN, ROLES.PROCUREMENT],
    children: [
      {
        title: "Tələblər",
        icon: "DocumentTextIcon",
        type: "collapse",
        children: [
          {
            title: "Tələblərim",
            path: ROUTES.SATINALMA.PR.LIST.LINK,
            icon: "ClipboardDocumentListIcon",
            type: "item",
          },
          {
            title: "Tələb İdarəsi",
            path: ROUTES.SATINALMA.PR.ALL.LINK,
            icon: "PresentationChartBarIcon",
            type: "item",
            allowedRoles: [ROLES.ADMIN],
          },
        ],
      },
      {
        title: "Satınalma",
        icon: "ShoppingCartIcon",
        type: "collapse",
        children: [
          {
            title: "Təklif Sorğuları",
            path: ROUTES.SATINALMA.RFQ.LIST.LINK,
            icon: "MegaphoneIcon",
            type: "item",
          },
        ],
      },
    ],
  },

  {
    title: "Təsərrüfat",
    icon: "WarehouseIcon",
    type: "collapse",
    allowedRoles: [ROLES.HOUSEHOLD, ROLES.ADMIN],
    children: [
      {
        title: "Nomenklatura",
        path: ROUTES.TESERRUFAT.NOMENATURE.PATH,
        icon: "ListIcon",
        type: "item",
      },
      {
        title: "Anbar",
        icon: "ArchiveBoxIcon",
        type: "collapse",
        children: [
          {
            title: "Anbar siyahısı",
            path: ROUTES.TESERRUFAT.ANBAR.ALL.LINK,
            icon: "AssetsIcon",
            type: "item",
          },
          {
            title: "Gələn Tələblər",
            path: ROUTES.TESERRUFAT.ANBAR.GELENLER.LINK,
            icon: "InboxArrowDownIcon",
            type: "item",
          },
          {
            title: "Anbar məhsulları",
            path: ROUTES.TESERRUFAT.INVENTAR.LIST.LINK,
            icon: "InventoryIcon",
            type: "item",
          },
          // {
          //   title: "Anbar Deyişələr",
          //   path: ROUTES.TESERRUFAT.ANBAR.CHANGES.LINK,
          //   icon: "ArchiveBoxIcon",
          //   type: "item",
          // },
        ],
      },
      {
        title: "İnventar",
        icon: "WrenchIcon",
        type: "collapse",
        children: [
          {
            title: "Aktivlər",
            path: ROUTES.TESERRUFAT.IS_SIFARISLERI.LIST.LINK,
            icon: "AssetsIcon",
            type: "item",
          },
          {
            title: "Q-aktivler",
            path: ROUTES.TESERRUFAT.Q_AKTIVLER.LINK,
            icon: "ArchiveBoxIcon",
            type: "item",
          },
        ],
      },
      {
        title: "Kontragentlər",
        path: ROUTES.TESERRUFAT.KONTRAGENTS.PATH,
        icon: "UsersIcon",
        type: "item",
      },
      {
        title: "Rəylər",
        path: ROUTES.REYLER.LIST.LINK,
        icon: "ChatBubbleLeftRightIcon",
        type: "item",
      },
    ],
  },
  {
    title: "İnsan resursları",
    icon: "UsersIcon",
    type: "collapse",
    allowedRoles: [ROLES.HR, ROLES.ADMIN],
    children: [
      {
        title: "Struktur",
        path: ROUTES.KADRLAR.DEPARTMENTS.LINK,
        icon: "BuildingIcon",
        type: "item",
        requiredPermission: "Company.View",
      },
      {
        title: "Yeni işçi",
        path: ROUTES.KADRLAR.ADD_EMPLOYEE.LINK,
        icon: "PlusIcon",
        type: "item",
        requiredPermissionsAny: ["Employee.Create", "Employee.View"],
      },
      {
        title: "Axtarış",
        path: ROUTES.KADRLAR.EMPLOYEES.LINK,
        icon: "SearchIcon",
        type: "item",
        requiredPermission: "Employee.View",
      },
      {
        title: "Ştat Cədvəli",
        path: ROUTES.KADRLAR.STAFF_TABLE.LINK,
        icon: "TableIcon",
        type: "item",
        requiredPermission: "Node.View",
      },
      {
        title: "Davamiyyət",
        path: ROUTES.KADRLAR.DAVAMIYYET_TABEL.LINK,
        icon: "CalendarDaysIcon",
        type: "item",
        requiredPermission: "Attendance.View",
      },
      {
        title: "Hesabat",
        path: ROUTES.KADRLAR.HESABAT.LINK,
        icon: "PieChartIcon",
        type: "item",
        requiredPermission: "Report.View",
      },
    ],
  },

  {
    title: "Təhlükəsizlik",
    icon: "SecurityIcon",
    type: "collapse",
    allowedRoles: [ROLES.SECURITY, ROLES.ADMIN],
    requiredPermission: "Security.View",
    children: [
      {
        title: "İstifadəçilər",
        path: ROUTES.TEHLUKESIZLIK.USERS.LINK,
        icon: "SecurityUserIcon",
        type: "item",
        requiredPermission: "Security.View",
      },
      {
        title: "Rollar",
        path: ROUTES.TEHLUKESIZLIK.ROLLAR.LINK,
        icon: "SecurityRoleIcon",
        type: "item",
        requiredPermission: "Security.View",
      },
    ],
  },

  {
    title: "Tənzimləmələr",
    icon: "SettingsIcon",
    type: "collapse",
    allowedRoles: [ROLES.ADMIN, ROLES.SETTINGS],
    children: [
      {
        title: "Köməkçi cədvəll..",
        icon: "TableIcon",
        type: "collapse",
        allowedRoles: [ROLES.ADMIN, ROLES.SETTINGS],
        requiredPermission: PERMISSIONS.SETTING.REFERENCE_DATA,
        children: [
          {
            title: "Enum tipləri",
            path: ROUTES.SETTINGS.HELPER_TABLES.ENUM_TYPES.LINK,
            icon: "EnumTypeIcon",
            type: "item",
          },
          {
            title: "Ölkələr",
            path: ROUTES.SETTINGS.HELPER_TABLES.COUNTRIES.LINK,
            icon: "GlobeIcon",
            type: "item",
          },
          {
            title: "İmtiyazlar",
            path: ROUTES.SETTINGS.HELPER_TABLES.PRIVILEGES.LINK,
            icon: "MedalIcon",
            type: "item",
          },
          {
            title: "Xüsusi rütbələr",
            path: ROUTES.SETTINGS.HELPER_TABLES.SPECIAL_RANKS.LINK,
            icon: "BadgeIcon",
            type: "item",
          },
          {
            title: "Dövlət təltifləri",
            path: ROUTES.SETTINGS.HELPER_TABLES.STATE_AWARDS.LINK,
            icon: "StateAwardIcon",
            type: "item",
          },
          {
            title: "Vəzifələr",
            path: ROUTES.KADRLAR.POSITIONS.LINK,
            icon: "BriefcaseIcon",
            type: "item",
          },
        ],
      },
      {
        title: "Active Directory",
        path: ROUTES.SETTINGS.ACTIVE_DIRECTORY.LINK,
        icon: "ActiveDirectoryIcon",
        type: "item",
        allowedRoles: [ROLES.ADMIN, ROLES.SETTINGS],
        requiredPermission: PERMISSIONS.SETTING.ACTIVE_DIRECTORY,
      },
      {
        title: "Qeyri iş günləri",
        path: ROUTES.SETTINGS.NONWORKING_DAYS.LINK,
        icon: "XCircleIcon",
        type: "item",
        allowedRoles: [ROLES.ADMIN, ROLES.SETTINGS],
        requiredPermission: PERMISSIONS.SETTING.NON_WORKING_DAYS,
      },
      {
        title: "Yeniliklər",
        path: ROUTES.SETTINGS.NOTIFICATIONS.LINK,
        icon: "NotificationIcon",
        type: "item",
        allowedRoles: [ROLES.ADMIN, ROLES.SETTINGS],
        requiredPermission: PERMISSIONS.SETTING.NOTIFICATIONS,
      },
    ],
  },
];

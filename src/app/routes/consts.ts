export const ROLES = {
  ADMIN: "Admin",
  HR: "HR",
  FINANCE: "Finance",
  SECURITY: "Security",
  SETTINGS: "Settings",
  HOUSEHOLD: "Household",
  CRM: "Crm",
  PROCUREMENT: "Procurement",
} as const;

export type TRolesKeyword = (typeof ROLES)[keyof typeof ROLES];

export interface RouteConfig {
  PATH: string;
  LINK: string;
}

const createRoute = (path: string): RouteConfig => ({
  PATH: path,
  LINK: `/${path}`,
});

export const ROUTES = {
  DASHBOARD: createRoute("dashboard"),

  AUTH: {
    LOGIN: createRoute("login"),
    UNAUTHORIZED: createRoute("unauthorized"),
    FORGOT_PASSWORD: createRoute("auth/forgot-password"),
    RENEW_PASSWORD: createRoute("auth/renew-password"),
  },
  
  // --- KASSA (FINANCE) ---
  KASSA: {
    ADD_KASSA: createRoute("finance/cash-operation-create"),
    EDIT_KASSA: createRoute("finance/cash-operation-edit/:id"),
    ALL_LIST: createRoute("finance/cash-operations"),
    KASSA_PAGE: createRoute("finance/cashbox"),
    PENDING_APPROVAL: createRoute("finance/cash-operation-approval"),
    REPORT: createRoute("finance/finance-report"),
  },
  // --- CRM (Household / Admin / Crm) ---
  CRM: {
    CUSTOMERS: {
      ALL_LIST: createRoute("crm/customers/all-users"),
      CREATE_USER: createRoute("crm/customers/create-user"),
    },
    ROYALITY_MANAGEMENT: createRoute("crm/royality-menagmeent"),
    NOTIFICATIONS: createRoute("crm/royality-menagmeent/notifications"),
  },

  // --- KADRLAR (HR) ---
  KADRLAR: {
    DEPARTMENTS: createRoute("personnel/departments"),
    EMPLOYEES: createRoute("personnel/employees"),
    ADD_EMPLOYEE: createRoute("personnel/add-employee"),
    CREATE_EMPLOYEE: createRoute("personnel/create-employee"),
    EDIT_EMPLOYEE: createRoute("personnel/edit-employee/:id"),
    DETAILS: createRoute("personnel/details-employee/:id"),
    POSITIONS: createRoute("personnel/positions"),
    STAFF_TABLE: createRoute("personnel/staff-table"),
    DAVAMIYYET_TABEL: createRoute("personnel/attendance"),
    HESABAT: createRoute("personnel/personnel-report"),
  },

  // --- TEHLUKESIZLIK (ADMIN) ---
  TEHLUKESIZLIK: {
    USERS: createRoute("security/users"),
    ROLLAR: createRoute("security/roles"),
    PERMISSIONS: createRoute("security/permissions"),
  },

  // --- TEHCIZAT (SUPPLY) ---
  SATINALMA: {
    PR: {
      LIST: createRoute("tehcizat/pr/list"),
      ALL: createRoute("tehcizat/pr/all"),
      ADD: createRoute("tehcizat/pr/add"),
    },
    RFQ: {
      LIST: createRoute("tehcizat/satinalma/rfq/list"),
      DETAIL: createRoute("tehcizat/satinalma/rfq/detail/:id"),
    },
  },

  // --- TESERRUFAT (WAREHOUSE & CMMS) ---
  TESERRUFAT: {
    NOMENATURE: createRoute("teserrufat/nomenclature"),
    ANBAR: {
      ALL: createRoute("teserrufat/anbar/all"),
      STOK: createRoute("teserrufat/anbar/stock/levels"),
      HEREKET: createRoute("teserrufat/anbar/stock/movements"),
      SAYIM: createRoute("teserrufat/anbar/stock/audit"),
      GELENLER: createRoute("teserrufat/anbar/incoming-requests"),
      ADD: createRoute("teserrufat/anbar/add"),
      CHANGES: createRoute("teserrufat/anbar/anbar-changes"),
      TRANSFER: createRoute("teserrufat/anbar/anbar-transfer"),
    },
    INVENTAR: {
      LIST: createRoute("teserrufat/teserrufat/inventory/list"),
      ADD: createRoute("teserrufat/teserrufat/inventory/add"),
      ADD_ACTIVE: createRoute("teserrufat/inventarlar/actives/add"),
      ACTIVE_DETAIL: createRoute("teserrufat/inventarlar/actives/detail/:id"),
    },
    Q_AKTIVLER: createRoute("reyestr/unit-reyester"),
    IS_SIFARISLERI: {
      LIST: createRoute("teserrufat/teserrufat/work-orders"),
    },
    KONTRAGENTS: createRoute("teserrufat/kontragents"),
    ADD_KONTRAGENTS: createRoute("teserrufat/add-kontragents"),
  },

  // --- RƏYLƏR (REVIEWS) ---
  REYLER: {
    LIST: createRoute("reviews/list"),
  },

  REYESTR: {
    UNIT: createRoute("reyestr/unit-reyester"),
  },

  // --- TƏNZIMLƏMƏLƏR / Köməkçi cədvəllər ---
  SETTINGS: {
    HELPER_TABLES: {
      ENUM_TYPES: createRoute("settings/helper-tables/enum-types"),
      ENUM_VALUES: createRoute(
        "settings/helper-tables/enum-types/values/:enumTypeId",
      ),
      COUNTRIES: createRoute("settings/helper-tables/countries"),
      CITIES: createRoute("settings/helper-tables/cities"),
      PRIVILEGES: createRoute("settings/helper-tables/privileges"),
      SPECIAL_RANKS: createRoute("settings/helper-tables/special-ranks"),
      STATE_AWARDS: createRoute("settings/helper-tables/state-awards"),
    },
    ACTIVE_DIRECTORY: createRoute("settings/active-directory"),
    NONWORKING_DAYS: createRoute("settings/nonworking-days"),
    NOTIFICATIONS: createRoute("settings/notifications"),
  },

  // --- PROFILE ---
  PROFILE: {
    SETTINGS: createRoute("user-profile/settings"),
  },
} as const;

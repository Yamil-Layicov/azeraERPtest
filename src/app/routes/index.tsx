import { lazy, Suspense } from "react";
import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { PrivateRoutes } from "@/features/auth/components/PrivateRoutes";
import { PublicOnlyRoutes } from "@/features/auth/components/PublicOnlyRoutes";
// import { Layout } from "@/widgets/layout/ui";
import { RouteErrorBoundary } from "@/shared/ui/RouteErrorBoundary";
import { Loading } from "@/shared/ui/loading";
import { ErrorBoundary } from "@/shared/lib/utils/ErrorBoundary";
import { ROUTES } from "./consts";
import { PERMISSIONS } from "@/shared/consts/permissions";
// Yuxarıdakı normal importu sil, bunu əlavə et:
const Layout = lazy(() =>
  import("@/widgets/layout/ui").then((m) => ({ default: m.Layout })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found-page").then((m) => ({ default: m.NotFoundPage })),
);
const UnauthorizedPage = lazy(() =>
  import("@/pages/unauthorized-page").then((m) => ({
    default: m.UnauthorizedPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/pages/login-page").then((m) => ({ default: m.LoginPage })),
);
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/forgot-password/ui/ForgotPasswordPage"),
);
const RenewPasswordPage = lazy(
  () => import("@/pages/auth/renew-password/ui/RenewPasswordPage"),
);
const DashboardPage = lazy(() =>
  import("@/pages/dashboard-page").then((m) => ({ default: m.DashboardPage })),
);

const AddKassaPage = lazy(() =>
  import("@/pages/maliyye/add-kassa").then((m) => ({
    default: m.AddKassaPage,
  })),
);
const AllListPage = lazy(() =>
  import("@/pages/maliyye/all-list").then((m) => ({ default: m.AllListPage })),
);
const KassaPage = lazy(() =>
  import("@/pages/maliyye/kassa").then((m) => ({ default: m.KassaPage })),
);
const PendingApprovalPage = lazy(() =>
  import("@/pages/maliyye/pending-approval").then((m) => ({
    default: m.PendingApprovalPage,
  })),
);
const ReportPage = lazy(() =>
  import("@/pages/maliyye/report").then((m) => ({ default: m.ReportPage })),
);

const DepartmentsPage = lazy(() =>
  import("@/pages/kadrlar/departments").then((m) => ({
    default: m.DepartmentsPage,
  })),
);
const EmployeesPage = lazy(() =>
  import("@/pages/kadrlar/employees").then((m) => ({
    default: m.EmployeesPage,
  })),
);
const PositionsPage = lazy(() =>
  import("@/pages/kadrlar/positions").then((m) => ({
    default: m.PositionsPage,
  })),
);
const StaffTablePage = lazy(() =>
  import("@/pages/kadrlar/staff-table").then((m) => ({
    default: m.StaffTablePage,
  })),
);
const CreateEmployeePage = lazy(() =>
  import("@/pages/kadrlar/create-employee").then((m) => ({
    default: m.CreateEmployeePage,
  })),
);
const AddEmployeePage = lazy(() =>
  import("@/pages/kadrlar/add-employee").then((m) => ({
    default: m.EmployeeDetailsPage,
  })),
);
const EditEmployeePage = lazy(() =>
  import("@/pages/kadrlar/edit-employee").then((m) => ({
    default: m.EditEmployeePage,
  })),
);
const EmployeeDetailsPage = lazy(() =>
  import("@/pages/kadrlar/details-employee").then((m) => ({
    default: m.EmployeeDetailsPage,
  })),
);
const AttendancePage = lazy(() =>
  import("@/pages/kadrlar/attendance").then((m) => ({
    default: m.AttendancePage,
  })),
);
const AnbarsPage = lazy(() =>
  import("@/pages/teserrufat/anbar/anbar-list/ui/Anbars").then(
    (m) => ({
      default: m.default,
    }),
  ),
);

// const PersonnelReportPage = lazy(() =>
//   import("@/pages/kadrlar/report").then((m) => ({
//     default: m.PersonnelReportPage,
//   })),
// );

const UsersPage = lazy(() =>
  import("@/pages/tehlukesizlik/users").then((m) => ({ default: m.UsersPage })),
);
const RolesPage = lazy(() =>
  import("@/pages/tehlukesizlik/roles").then((m) => ({ default: m.RolesPage })),
);
const PersonnelReportPage = lazy(() =>
  import("@/pages/kadrlar/report").then((m) => ({
    default: m.PersonnelReportPage,
  })),
);

const IncomingRequestsPage = lazy(() =>
  import("@/pages/teserrufat/anbar/incoming-requests").then((m) => ({
    default: m.default,
  })),
);
const AnbarAddPage = lazy(() =>
  import("@/pages/teserrufat/anbar/anbar-products/add/ui/AnbarAddPage").then(
    (m) => ({
      default: m.default,
    }),
  ),
);
const InventarListPage = lazy(() =>
  import("@/pages/teserrufat/anbar/anbar-products/list").then((m) => ({
    default: m.InventarListPage,
  })),
);
const WorkOrderListPage = lazy(() =>
  import("@/pages/teserrufat/inventarlar/actives/ui").then((m) => ({
    default: m.default,
  })),
);
const AddActiveInventoryPage = lazy(() =>
  import("@/pages/teserrufat/inventarlar/actives/add/ui/AddActiveInventoryPage").then(
    (m) => ({
      default: m.default,
    }),
  ),
);
const ActiveInventoryDetailPage = lazy(() =>
  import("@/pages/teserrufat/inventarlar/actives/ui/detail/ActiveInventoryDetailPage").then(
    (m) => ({
      default: m.default,
    }),
  ),
);
const Nomenclature = lazy(() =>
  import("@/pages/teserrufat/nomenclature/ui/Nomenclature").then((m) => ({
    default: m.default,
  })),
);

const ReviewsPage = lazy(() =>
  import("@/pages/teserrufat/rey").then((m) => ({ default: m.ReviewsPage })),
);
const UnitReyesterPage = lazy(() =>
  import("@/pages/teserrufat/inventarlar/reyestr/unit-reyester/ui/UnitReyester").then(
    (m) => ({
      default: m.default,
    }),
  ),
);

// --- TEHCIZAT (SUPPLY) ---
const PRListPage = lazy(() =>
  import("@/pages/tehcizat/pr/list").then((m) => ({
    default: m.default,
  })),
);
const PRManagementPage = lazy(() =>
  import("@/pages/tehcizat/pr/management/PRManagementPage").then((m) => ({
    default: m.default,
  })),
);

const RFQPage = lazy(
  () => import("@/pages/tehcizat/sale-mennagment/rfq/ui/RFQPage"),
);
const RFQDetailPage = lazy(
  () => import("@/pages/tehcizat/sale-mennagment/rfq/ui/detail/RFQDetailPage"),
);

const ProfileSettingsPage = lazy(
  () => import("@/pages/user-profile/settings/ProfileSettingsPage"),
);
const EnumTypesPage = lazy(() =>
  import("@/pages/settings/helper-tables/enum-types").then((m) => ({
    default: m.EnumTypesPage,
  })),
);
const EnumValuesPage = lazy(() =>
  import("@/pages/settings/helper-tables/enum-values").then((m) => ({
    default: m.EnumValuesPage,
  })),
);
const CountriesPage = lazy(() =>
  import("@/pages/settings/helper-tables/countries").then((m) => ({
    default: m.CountriesPage,
  })),
);
const CitiesPage = lazy(
  () => import("@/pages/settings/helper-tables/cities/ui/CitiesPage"),
);
const PrivilegesPage = lazy(() =>
  import("@/pages/settings/helper-tables/privileges").then((m) => ({
    default: m.PrivilegesPage,
  })),
);
const SpecialRanksPage = lazy(() =>
  import("@/pages/settings/helper-tables/special-ranks").then((m) => ({
    default: m.SpecialRanksPage,
  })),
);
const StateAwardsPage = lazy(() =>
  import("@/pages/settings/helper-tables/state-awards").then((m) => ({
    default: m.default,
  })),
);
const ActiveDirectoryPage = lazy(() =>
  import("@/pages/settings/active-directory").then((m) => ({
    default: m.default,
  })),
);
const KontragentsPage = lazy(() =>
  import("@/pages/teserrufat/kontragents/ui/Kontragents").then((m) => ({
    default: m.default,
  })),
);
const AddKontragentsPage = lazy(() =>
  import("@/pages/teserrufat/add-kontragents").then((m) => ({
    default: m.default,
  })),
);
const AnbarChangesPage = lazy(() =>
  import("@/pages/teserrufat/anbar/anbar-changes/ui/AnbarChanges").then((m) => ({
    default: m.default,
  })),
);

import {
  TokenExpiredProvider,
  TokenExpiredHandler,
} from "@/shared/lib/contexts/TokenExpiredContext";
const NotificationsWeb = lazy(
  () => import("@/pages/settings/notifications/ui/Notifications"),
);
const AllUsers = lazy(() =>
  import("@/pages/crm/customers/all-users/ui/AllUsers").then((m) => ({
    default: m.default,
  })),
);
const CreateUser = lazy(() =>
  import("@/pages/crm/customers/create-user/ui/AddUser").then((m) => ({
    default: m.AddUser,
  })),
);
const RoyalityManagement = lazy(() =>
  import("@/pages/crm/royality-menagmeent/royality-control/ui/RoyalityMenagment").then(
    (m) => ({
      default: m.RoyalityMenagment,
    }),
  ),
);
const Notifications = lazy(() =>
  import("@/pages/crm/royality-menagmeent/notifications/ui/Notifications").then(
    (m) => ({
      default: m.default,
    }),
  ),
);
const NonworkingDaysPage = lazy(() =>
  import("@/pages/settings/nonworking-days/ui/NonworkingDays").then((m) => ({
    default: m.default,
  })),
);
const AnbarTransferPage = lazy(() =>
  import("@/pages/teserrufat/anbar/anbarTransfer/ui/AnbarTransfer").then((m) => ({
    default: m.default,
  })),
);

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      errorElement={<RouteErrorBoundary />}
      element={
        <TokenExpiredProvider>
          <TokenExpiredHandler />
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </TokenExpiredProvider>
      }
    >
      <Route index element={<Navigate to={ROUTES.AUTH.LOGIN.LINK} replace />} />

      <Route element={<PublicOnlyRoutes />}>
        <Route path={ROUTES.AUTH.LOGIN.PATH} element={<LoginPage />} />
        <Route
          path={ROUTES.AUTH.FORGOT_PASSWORD.PATH}
          element={<ForgotPasswordPage />}
        />
        <Route
          path={ROUTES.AUTH.RENEW_PASSWORD.PATH}
          element={<RenewPasswordPage />}
        />
      </Route>

      <Route
        path={ROUTES.AUTH.UNAUTHORIZED.PATH}
        element={<UnauthorizedPage />}
      />

      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route
            path={ROUTES.DASHBOARD.PATH}
            element={<DashboardPage />}
            handle={{ breadCrumb: "" }}
          />

          <Route element={<PrivateRoutes requiredPermission="Company.View" />}>
            <Route
              path={ROUTES.KADRLAR.DEPARTMENTS.PATH}
              element={<DepartmentsPage />}
              handle={{ breadCrumb: "Struktur", parentCrumb: "Kadrlar" }}
            />
          </Route>

          <Route element={<PrivateRoutes requiredPermission="Employee.View" />}>
            <Route
              path={ROUTES.KADRLAR.EMPLOYEES.PATH}
              element={<EmployeesPage />}
              handle={{ breadCrumb: "İşçilər", parentCrumb: "Kadrlar" }}
            />
          </Route>

          <Route
            element={
              <PrivateRoutes
                requiredPermissionsAny={["Employee.Create", "Employee.View"]}
              />
            }
          >
            <Route
              path={ROUTES.KADRLAR.ADD_EMPLOYEE.PATH}
              element={<AddEmployeePage />}
              handle={{ breadCrumb: "Yeni işçi", parentCrumb: "Kadrlar" }}
            />
          </Route>
          <Route
            element={<PrivateRoutes requiredPermission="Employee.Create" />}
          >
            <Route
              path={ROUTES.KADRLAR.CREATE_EMPLOYEE.PATH}
              element={<CreateEmployeePage />}
              handle={{ breadCrumb: "Yeni", parentCrumb: "Kadrlar" }}
            />
          </Route>

          <Route
            path={ROUTES.KADRLAR.DETAILS.PATH}
            element={<EmployeeDetailsPage />}
            handle={{ breadCrumb: "Ətraflı", parentCrumb: "İşçilər" }}
          />

          <Route
            element={<PrivateRoutes requiredPermission="Employee.Update" />}
          >
            <Route
              path={ROUTES.KADRLAR.EDIT_EMPLOYEE.PATH}
              element={<EditEmployeePage />}
              handle={{ breadCrumb: "Redaktə", parentCrumb: "Kadrlar" }}
            />
          </Route>

          <Route
            element={
              <PrivateRoutes
                requiredPermission={PERMISSIONS.SETTING.REFERENCE_DATA}
              />
            }
          >
            <Route
              path={ROUTES.KADRLAR.POSITIONS.PATH}
              element={<PositionsPage />}
              handle={{ breadCrumb: "Vəzifələr", parentCrumb: "Tənzimləmələr" }}
            />
          </Route>

          {/* Ştat Cədvəli -> Node.View */}
          <Route element={<PrivateRoutes requiredPermission="Node.View" />}>
            <Route
              path={ROUTES.KADRLAR.STAFF_TABLE.PATH}
              element={<StaffTablePage />}
              handle={{ breadCrumb: "Ştat Cədvəli", parentCrumb: "Kadrlar" }}
            />
          </Route>

          {/* Davamiyyət -> Attendance.View */}
          <Route
            element={<PrivateRoutes requiredPermission="Attendance.View" />}
          >
            <Route
              path={ROUTES.KADRLAR.DAVAMIYYET_TABEL.PATH}
              element={<AttendancePage />}
              handle={{ breadCrumb: "Davamiyyət", parentCrumb: "Kadrlar" }}
            />
          </Route>

          {/* Hesabat -> Report.View */}
          <Route element={<PrivateRoutes requiredPermission="Report.View" />}>
            <Route
              path={ROUTES.KADRLAR.HESABAT.PATH}
              element={<PersonnelReportPage />}
              handle={{ breadCrumb: "Hesabat", parentCrumb: "Kadrlar" }}
            />
          </Route>

          <Route element={<PrivateRoutes />}>
            <Route
              path={ROUTES.KASSA.ADD_KASSA.PATH}
              element={<AddKassaPage />}
              handle={{ breadCrumb: "Əlavə et", parentCrumb: "Maliyyə" }}
            />
            <Route
              path={ROUTES.KASSA.EDIT_KASSA.PATH}
              element={<AddKassaPage />}
              handle={{ breadCrumb: "Redaktə et", parentCrumb: "Maliyyə" }}
            />
            <Route
              path={ROUTES.KASSA.ALL_LIST.PATH}
              element={<AllListPage />}
              handle={{ breadCrumb: "Bütün Siyahı", parentCrumb: "Maliyyə" }}
            />
            <Route
              path={ROUTES.KASSA.KASSA_PAGE.PATH}
              element={<KassaPage />}
              handle={{ breadCrumb: "Kassa", parentCrumb: "Maliyyə" }}
            />
            <Route
              path={ROUTES.KASSA.PENDING_APPROVAL.PATH}
              element={<PendingApprovalPage />}
              handle={{ breadCrumb: "Təsdiq Gözləyir", parentCrumb: "Maliyyə" }}
            />
            <Route
              path={ROUTES.KASSA.REPORT.PATH}
              element={<ReportPage />}
              handle={{ breadCrumb: "Hesabat", parentCrumb: "Maliyyə" }}
            />
          </Route>
        </Route>
      </Route>

      {/* BACKEND MENU ROUTES - Təhlükəsizlik */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route
            path={ROUTES.TEHLUKESIZLIK.USERS.PATH}
            element={<UsersPage />}
            handle={{
              breadCrumb: "İstifadəçilər",
              parentCrumb: "Təhlükəsizlik",
            }}
          />
          <Route
            path={ROUTES.TEHLUKESIZLIK.ROLLAR.PATH}
            element={<RolesPage />}
            handle={{ breadCrumb: "Rollar", parentCrumb: "Təhlükəsizlik" }}
          />
        </Route>
      </Route>

      {/* SATINALMA ROUTES */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route
            path={ROUTES.SATINALMA.PR.LIST.PATH}
            element={<PRListPage />}
            handle={{
              breadCrumb: "Mənim Tələblərim",
              parentCrumb: "Satınalma",
            }}
          />
          <Route
            path={ROUTES.SATINALMA.PR.ALL.PATH}
            element={<PRManagementPage />}
            handle={{ breadCrumb: "Tələb İdarəsi", parentCrumb: "Satınalma" }}
          />
        </Route>
      </Route>

      {/* ANBAR & TESERRUFAT ROUTES */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          {/* Anbar */}

          <Route
            path={ROUTES.TESERRUFAT.ANBAR.ALL.PATH}
            element={<AnbarsPage />}
            handle={{ breadCrumb: "Anbarlar", parentCrumb: "Anbar" }}
          />
          <Route
            path={ROUTES.TESERRUFAT.ANBAR.GELENLER.PATH}
            element={<IncomingRequestsPage />}
            handle={{ breadCrumb: "Gələn Tələblər", parentCrumb: "Anbar" }}
          />
          <Route
            path={ROUTES.TESERRUFAT.ANBAR.ADD.PATH}
            element={<AnbarAddPage />}
            handle={{ breadCrumb: "Əlavə et", parentCrumb: "Anbar" }}
          />
          <Route
            path={ROUTES.TESERRUFAT.ANBAR.CHANGES.PATH}
            element={<AnbarChangesPage />}
            handle={{ breadCrumb: "Anbar Deyişələr", parentCrumb: "Anbar" }}
          />

          {/* Satınalma (Purchasing) RFQ */}
          <Route
            path={ROUTES.SATINALMA.RFQ.LIST.PATH}
            element={<RFQPage />}
            handle={{
              breadCrumb: "Təklif Sorğuları",
              parentCrumb: "Satınalma",
            }}
          />
          <Route
            path={ROUTES.SATINALMA.RFQ.DETAIL.PATH}
            element={<RFQDetailPage />}
            handle={{
              breadCrumb: "Sorğu Detalları",
              parentCrumb: "Təklif Sorğuları",
            }}
          />
          {/* Kontragents */}
          <Route
            path={ROUTES.TESERRUFAT.KONTRAGENTS.PATH}
            element={<KontragentsPage />}
            handle={{ breadCrumb: "Kontragents", parentCrumb: "Təsərrüfat" }}
          />
          <Route
            path={ROUTES.TESERRUFAT.ADD_KONTRAGENTS.PATH}
            element={<AddKontragentsPage />}
            handle={{ breadCrumb: "Əlavə Et", parentCrumb: "Kontragents" }}
          />
          {/* Təsərrüfat / CMMS */}
          <Route
            path={ROUTES.TESERRUFAT.INVENTAR.LIST.PATH}
            element={<InventarListPage />}
            handle={{
              breadCrumb: "Aktivlərin İnventarı",
              parentCrumb: "Təsərrüfat",
            }}
          />
          <Route
            path={ROUTES.TESERRUFAT.IS_SIFARISLERI.LIST.PATH}
            element={<WorkOrderListPage />}
            handle={{ breadCrumb: "İş Sifarişləri", parentCrumb: "Təsərrüfat" }}
          />
          <Route
            path={ROUTES.TESERRUFAT.INVENTAR.ADD_ACTIVE.PATH}
            element={<AddActiveInventoryPage />}
            handle={{
              breadCrumb: "Yeni aktiv əlavə et",
              parentCrumb: "Təsərrüfat",
            }}
          />
          <Route
            path={ROUTES.TESERRUFAT.INVENTAR.ACTIVE_DETAIL.PATH}
            element={<ActiveInventoryDetailPage />}
            handle={{
              breadCrumb: "Detallar",
              parentCrumb: "Təsərrüfat",
            }}
          />
          <Route
            path={ROUTES.TESERRUFAT.NOMENATURE.PATH}
            element={<Nomenclature />}
            handle={{ breadCrumb: "Nomenclature", parentCrumb: "Təsərrüfat" }}
          />
          <Route
            path={ROUTES.TESERRUFAT.ANBAR.TRANSFER.PATH}
            element={<AnbarTransferPage />}
            handle={{ breadCrumb: "Anbar Transfer", parentCrumb: "Anbar" }}
          />
        </Route>
      </Route>

      {/* RƏYLƏR ROUTES */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route
            path={ROUTES.REYLER.LIST.PATH}
            element={<ReviewsPage />}
            handle={{ breadCrumb: "Rəy", parentCrumb: "Rəylər" }}
          />
        </Route>
      </Route>

      {/* REYESTR ROUTES */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route
            path={ROUTES.REYESTR.UNIT.PATH}
            element={<UnitReyesterPage />}
            handle={{ breadCrumb: "Vahid Reyestri", parentCrumb: "Reyestr" }}
          />
        </Route>
      </Route>

      {/* TƏNZIMLƏMƏLƏR / Köməkçi cədvəllər */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route
            path={ROUTES.SETTINGS.HELPER_TABLES.ENUM_TYPES.PATH}
            element={<EnumTypesPage />}
            handle={{
              breadCrumb: "Enum tipləri",
              parentCrumb: "Köməkçi cədvəllər",
            }}
          />
          <Route
            path={ROUTES.SETTINGS.HELPER_TABLES.ENUM_VALUES.PATH}
            element={<EnumValuesPage />}
            handle={{
              breadCrumb: "Enum dəyərləri",
              parentCrumb: "Enum tipləri",
            }}
          />
          <Route
            path={ROUTES.SETTINGS.HELPER_TABLES.COUNTRIES.PATH}
            element={<CountriesPage />}
            handle={{ breadCrumb: "Ölkələr", parentCrumb: "Köməkçi cədvəllər" }}
          />
          <Route
            path={ROUTES.SETTINGS.HELPER_TABLES.CITIES.PATH}
            element={<CitiesPage />}
            handle={{
              breadCrumb: "Şəhərlər",
              parentCrumb: "Köməkçi cədvəllər",
            }}
          />
          <Route
            path={ROUTES.SETTINGS.HELPER_TABLES.PRIVILEGES.PATH}
            element={<PrivilegesPage />}
            handle={{
              breadCrumb: "İmtiyazlar",
              parentCrumb: "Köməkçi cədvəllər",
            }}
          />
          <Route
            path={ROUTES.SETTINGS.HELPER_TABLES.SPECIAL_RANKS.PATH}
            element={<SpecialRanksPage />}
            handle={{
              breadCrumb: "Xüsusi rütbələr",
              parentCrumb: "Köməkçi cədvəllər",
            }}
          />
          <Route
            path={ROUTES.SETTINGS.HELPER_TABLES.STATE_AWARDS.PATH}
            element={<StateAwardsPage />}
            handle={{
              breadCrumb: "Dövlət təltifləri",
              parentCrumb: "Köməkçi cədvəllər",
            }}
          />
          <Route
            path={ROUTES.SETTINGS.ACTIVE_DIRECTORY.PATH}
            element={<ActiveDirectoryPage />}
            handle={{
              breadCrumb: "Active Directory",
              parentCrumb: "Tənzimləmələr",
            }}
          />
          {/* CRM ROUTES */}
          <Route
            path={ROUTES.CRM.CUSTOMERS.ALL_LIST.PATH}
            element={<AllUsers />}
            handle={{ breadCrumb: "Müşteriler", parentCrumb: "CRM" }}
          />
          <Route
            path={ROUTES.CRM.CUSTOMERS.CREATE_USER.PATH}
            element={<CreateUser />}
            handle={{
              breadCrumb: "Yeni istifadəçi",
              parentCrumb: "Müştərilər",
            }}
          />
          <Route
            path={ROUTES.CRM.ROYALITY_MANAGEMENT.PATH}
            element={<RoyalityManagement />}
            handle={{
              breadCrumb: "Idarəetmə Paneli",
              parentCrumb: "Royallig tetbiqi",
            }}
          />
          <Route
            path={ROUTES.CRM.NOTIFICATIONS.PATH}
            element={<Notifications />}
            handle={{ breadCrumb: "Xəbərlər", parentCrumb: "Royallig tetbiqi" }}
          />
        </Route>
      </Route>

      <Route
        element={
          <PrivateRoutes
            requiredPermission={PERMISSIONS.SETTING.NON_WORKING_DAYS}
          />
        }
      >
        <Route element={<Layout />}>
          <Route
            path={ROUTES.SETTINGS.NONWORKING_DAYS.PATH}
            element={<NonworkingDaysPage />}
            handle={{
              breadCrumb: "İş günləri",
              parentCrumb: "Tənzimləmələr",
            }}
          />
        </Route>
      </Route>
      <Route
        element={
          <PrivateRoutes
            requiredPermission={PERMISSIONS.SETTING.NOTIFICATIONS}
          />
        }
      >
        <Route element={<Layout />}>
          <Route
            path={ROUTES.SETTINGS.NOTIFICATIONS.PATH}
            element={<NotificationsWeb />}
            handle={{
              breadCrumb: "Xəbərlər",
              parentCrumb: "Tənzimləmələr",
            }}
          />
        </Route>
      </Route>

      {/* PROFILE ROUTES - Herkese açık (authenticated kullanıcılar için) */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route
            path={ROUTES.PROFILE.SETTINGS.PATH}
            element={<ProfileSettingsPage />}
            handle={{
              breadCrumb: "Tənzimləmələr",
              parentCrumb: "Profil",
            }}
          />
        </Route>
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
  {
    basename: "/app",
  },
);

import { useEffect, useReducer, useMemo } from "react";
import { useTablePagination } from "@/shared/lib/hooks";
import {
  useRootCompaniesLookup,
  useCompaniesLookup,
} from "@/features/kadrlar/departments";
import { useEnumItemsByCode } from "@/features/lookups/hooks/useEnumItemsByCode";
import {
  useNodeGet,
  type NodeGetRequest,
} from "@/features/kadrlar/staff-table";
import {
  staffTableReducer,
  initialState,
} from "../model/staffTableReducer";

export function useStaffTable() {
  const [state, dispatch] = useReducer(staffTableReducer, initialState);

  const rootCompaniesQuery = useRootCompaniesLookup(false);
  const rootCompaniesOptions = rootCompaniesQuery.data ?? [];
  const isLoadingCompanies = rootCompaniesQuery.isFetching || rootCompaniesQuery.isLoading;
  const { data: companiesOptions = [] } = useCompaniesLookup();
  const { rawData: staffCategoriesList = [] } = useEnumItemsByCode("StaffCategories", true);

  const {
    currentPage,
    selectedRowCount,
    handlePageChange,
    handleRowCountChange,
  } = useTablePagination([]);

  // Auto-select company if only one option available
  useEffect(() => {
    if (rootCompaniesQuery.isSuccess && rootCompaniesOptions.length === 1) {
      const single = rootCompaniesOptions[0];
      if (single && (!state.selectedCompany || state.selectedCompany.id !== single.id)) {
        dispatch({ type: "SET_SELECTED_COMPANY", payload: single });
      }
    }
  }, [rootCompaniesQuery.isSuccess, rootCompaniesOptions.length, state.selectedCompany?.id]);

  useEffect(() => {
    if (rootCompaniesQuery.isSuccess && !state.isRootCompaniesLoaded) {
      dispatch({ type: "SET_ROOT_COMPANIES_LOADED", payload: true });
    }
  }, [rootCompaniesQuery.isSuccess, state.isRootCompaniesLoaded]);

  const loadRootCompanies = async () => {
    if (rootCompaniesQuery.isFetching) return;
    if ((rootCompaniesQuery.data?.length ?? 0) > 0) return;
    await rootCompaniesQuery.refetch();
  };

  const pageSize = Number(selectedRowCount?.id) || 10;

  const nodeParams: NodeGetRequest = useMemo(
    () => {
      const searchParams = state.searchParams;
      
      // Convert isMain: "main" → true, "substitute" → false
      const isMainValue = searchParams?.isMain === undefined || searchParams?.isMain === null
        ? null
        : searchParams.isMain === "main" || searchParams.isMain === "1"
          ? true
          : false;
      
      // Convert isActive: "1" → true, "0" → false
      const isActiveValue = searchParams?.isActive === undefined || searchParams?.isActive === null
        ? null
        : searchParams.isActive === "1" || searchParams.isActive === 1
          ? true
          : false;
      
      // Convert isHead: "1" → true, "0" → false
      const isHeadValue = searchParams?.isLeader === undefined || searchParams?.isLeader === null
        ? null
        : searchParams.isLeader === "1" || searchParams.isLeader === 1
          ? true
          : false;
      
      return {
        pageSize,
        pageIndex: currentPage - 1,
        isDesc: state.isDesc,
        orderBy: state.orderBy || "employeeName",
        rootCompanyId: state.selectedCompany?.id ? String(state.selectedCompany.id) : null,
        fullname: searchParams?.employee?.trim() || null,
        subCompanyId: searchParams?.departmentId ? String(searchParams.departmentId) : null,
        positionId: searchParams?.positionId ? String(searchParams.positionId) : null,
        staffCategoriesCode: searchParams?.staffCategoriesCode
          ? String(searchParams.staffCategoriesCode)
          : null,
        isMain: isMainValue,
        isActive: isActiveValue,
        isHead: isHeadValue,
      };
    },
    [pageSize, currentPage, state.isDesc, state.orderBy, state.selectedCompany?.id, state.searchParams]
  );

  const { data: nodeData, isLoading, isFetching, refetch } = useNodeGet(
    nodeParams,
    true
  );

  const paginatedData = nodeData?.result?.data || [];
  const totalCount = nodeData?.result?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Create lookup maps
  const companiesMap = useMemo(
    () => new Map(companiesOptions.map((o) => [String(o.id), o.fullName || o.label || ""])),
    [companiesOptions]
  );
  
  const positionMap = useMemo(() => new Map<string, string>(), []);

  const staffCategoryMap = useMemo(
    () => new Map(staffCategoriesList.map((o: any) => [String(o.value), o.label || ""])),
    [staffCategoriesList]
  );

  return {
    // State
    state,
    dispatch,
    
    // Data
    rootCompaniesOptions,
    isLoadingCompanies,
    loadRootCompanies,
    companiesOptions,
    companiesMap,
    positionMap,
    staffCategoryMap,
    
    // Table data
    paginatedData,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    
    // Pagination
    currentPage,
    selectedRowCount,
    pageSize,
    handlePageChange,
    handleRowCountChange,
    
    // Actions
    refetch,
  };
}

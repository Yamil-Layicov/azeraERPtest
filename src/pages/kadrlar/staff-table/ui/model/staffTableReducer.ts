import type { Option } from "@/shared/types";
import type { NodeEntry } from "@/features/kadrlar/staff-table";
import type { StaffSearchFilters } from "../components/search-modal/StaffSearchModal";

// ============================================================================
// STATE MANAGEMENT - useReducer
// ============================================================================

export interface StaffTableState {
  // UI State
  selectedOperation: Option | null;
  isSearchModalOpen: boolean;
  isRootCompaniesLoaded: boolean;
  
  // Form State
  isFormOpen: boolean;
  selectedItem: NodeEntry | null;
  
  // Table State
  selectedCompany: Option | null;
  orderBy: string | null;
  isDesc: boolean;
  searchParams: StaffSearchFilters | null;
}

export type StaffTableAction =
  | { type: "SET_SELECTED_OPERATION"; payload: Option | null }
  | { type: "SET_SEARCH_MODAL_OPEN"; payload: boolean }
  | { type: "SET_ROOT_COMPANIES_LOADED"; payload: boolean }
  | { type: "SET_FORM_OPEN"; payload: boolean }
  | { type: "SET_SELECTED_ITEM"; payload: NodeEntry | null }
  | { type: "SET_SELECTED_COMPANY"; payload: Option | null }
  | { type: "SET_ORDER_BY"; payload: string | null }
  | { type: "SET_IS_DESC"; payload: boolean }
  | { type: "SET_SEARCH_PARAMS"; payload: StaffSearchFilters | null }
  | { type: "RESET_SORTING" }
  | { type: "CLOSE_FORM" }
  | { type: "OPEN_FORM_FOR_EDIT"; payload: NodeEntry }
  | { type: "OPEN_FORM_FOR_CREATE" };

export const initialState: StaffTableState = {
  selectedOperation: null,
  isSearchModalOpen: false,
  isRootCompaniesLoaded: false,
  isFormOpen: false,
  selectedItem: null,
  selectedCompany: null,
  orderBy: null,
  isDesc: true,
  searchParams: null,
};

export function staffTableReducer(
  state: StaffTableState,
  action: StaffTableAction
): StaffTableState {
  switch (action.type) {
    case "SET_SELECTED_OPERATION":
      return { ...state, selectedOperation: action.payload };
    
    case "SET_SEARCH_MODAL_OPEN":
      return { ...state, isSearchModalOpen: action.payload };
    
    case "SET_ROOT_COMPANIES_LOADED":
      return { ...state, isRootCompaniesLoaded: action.payload };
    
    case "SET_FORM_OPEN":
      return { ...state, isFormOpen: action.payload };
    
    case "SET_SELECTED_ITEM":
      return { ...state, selectedItem: action.payload };
    
    case "SET_SELECTED_COMPANY":
      return {
        ...state,
        selectedCompany: action.payload,
        orderBy: null,
        isDesc: true,
      };
    
    case "SET_ORDER_BY":
      return { ...state, orderBy: action.payload };
    
    case "SET_IS_DESC":
      return { ...state, isDesc: action.payload };
    
    case "SET_SEARCH_PARAMS":
      return { ...state, searchParams: action.payload };
    
    case "RESET_SORTING":
      return { ...state, orderBy: null, isDesc: true };
    
    case "CLOSE_FORM":
      return {
        ...state,
        isFormOpen: false,
        selectedItem: null,
      };
    
    case "OPEN_FORM_FOR_EDIT":
      return {
        ...state,
        selectedItem: action.payload,
        isFormOpen: true,
      };
    
    case "OPEN_FORM_FOR_CREATE":
      return {
        ...state,
        selectedItem: null,
        isFormOpen: true,
      };
    
    default:
      return state;
  }
}

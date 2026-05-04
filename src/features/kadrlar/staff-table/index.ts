// Public API for staff-table feature
export { staffTableService } from "./api";
export { 
  useStaffTable, 
  useNodeGet,
  useGetNodeById,
  useInactiveStatusLookup,
  useDeactivateNode,
  useActivateNode,
  useSetNodeActive,
  useDeleteNode,
  useCreateNode,
  useCreateStaffTable, 
  useUpdateStaffTable, 
  useDeleteStaffTable,
  STAFF_TABLE_QUERY_KEYS 
} from "./hooks";
export type {
  StaffTableEntry,
  GetStaffTableRequest,
  GetStaffTableResponse,
  StaffTableResult,
  CreateStaffTableRequest,
  UpdateStaffTableRequest,
  NodeGetRequest,
  NodeGetResponse,
  NodeEntry,
  NodeGetResult,
} from "./model";

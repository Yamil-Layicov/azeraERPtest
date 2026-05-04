// Public API for employees feature
export { employeesService } from "./api";
export { 
  useEmployees, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee,
  useGetEmployeeById,
  EMPLOYEES_QUERY_KEYS 
} from "./hooks";
export type {
  EmployeeEntry,
  GetEmployeesRequest,
  GetEmployeesResponse,
  EmployeesResult,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "./model";

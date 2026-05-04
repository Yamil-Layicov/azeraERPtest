// Public API for create-employee feature
export { createEmployeeService } from "./api";
export { useCreateEmployee, CREATE_EMPLOYEE_QUERY_KEYS } from "./hooks";
export type {
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  UpdateEmployeeRequest,
} from "./model";

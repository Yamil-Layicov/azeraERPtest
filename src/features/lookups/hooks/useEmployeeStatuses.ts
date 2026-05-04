import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";
import type { Option } from "@/shared/types";

export const EMPLOYEE_STATUS_QUERY_KEY = ["lookups", "employeeStatus"] as const;

export const useEmployeeStatuses = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: EMPLOYEE_STATUS_QUERY_KEY,
    queryFn: ({ signal }) => lookupsService.getEmployeeStatus(signal),
    enabled,
  });

  const options: Option[] = (() => {
    const raw = query.data?.result ?? query.data?.data;
    return mapEnumItemsToOptions(raw);
  })();

  return {
    ...query,
    options,
  };
};

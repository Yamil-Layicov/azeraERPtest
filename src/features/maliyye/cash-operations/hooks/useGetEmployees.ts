import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api";

export const EMPLOYEES_QUERY_KEY = (rootCompanyId: string) =>
  ["employees", rootCompanyId] as const;

/** getNodes ilə eyni mənbədən məlumat gətirir; cavab result.data formatında uyğunlaşdırılır */
export const useGetEmployees = (
  rootCompanyId: string | undefined,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEY(rootCompanyId ?? ""),
    queryFn: async ({ signal }) => {
      if (!rootCompanyId) throw new Error("rootCompanyId is required");
      const res = await cashOperationsService.getNodes(
        { rootCompanyId, pageIndex: 0 },
        signal,
      );
      const data = Array.isArray(res.result) ? res.result : (res.result as any)?.data || [];
      return {
        ...res,
        result: { data },
      };
    },
    enabled: (options?.enabled ?? false) && !!rootCompanyId,
  });
};

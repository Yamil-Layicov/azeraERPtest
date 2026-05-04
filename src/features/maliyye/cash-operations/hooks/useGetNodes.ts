import { useQuery } from "@tanstack/react-query";
import { cashOperationsService } from "../api";

export const NODES_QUERY_KEY = (rootCompanyId?: string) =>
  ["nodes", rootCompanyId] as const;

export const useGetNodes = (
  rootCompanyId?: string,
  options?: { enabled?: boolean; pageIndex?: number; value?: string },
) => {
  const { enabled, pageIndex = 0, value } = options ?? {};

  return useQuery({
    queryKey: NODES_QUERY_KEY(rootCompanyId),
    queryFn: ({ signal }) => {
      if (!rootCompanyId) throw new Error("rootCompanyId is required");
      return cashOperationsService.getNodes(
        { rootCompanyId, pageIndex, value },
        signal,
      );
    },
    enabled: (enabled ?? true) && !!rootCompanyId,
  });
};

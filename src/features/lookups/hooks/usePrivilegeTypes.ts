import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";
import type { Option } from "@/shared/types";

export const usePrivilegeTypes = (enabled: boolean) => {
  const query = useQuery({
    queryKey: ["lookups", "privilegeTypes"],
    queryFn: ({ signal }) => lookupsService.getPrivilegeTypes(signal),
    enabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const options: Option[] = useMemo(() => {
    const raw = query.data?.result ?? query.data?.data;
    return mapEnumItemsToOptions(raw);
  }, [query.data]);

  return {
    ...query,
    options,
    rawData: query.data?.result ?? query.data?.data ?? [],
  };
};

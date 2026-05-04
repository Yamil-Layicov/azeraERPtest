import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";
import type { Option } from "@/shared/types";

export const LOOKUPS_QUERY_KEYS = {
  stateAwardsByType: (typeCode: string) => ["lookups", "stateAwardsByType", typeCode] as const,
};

export const useStateAwardsByType = (typeCode: string | null | undefined, enabled: boolean) => {
  const query = useQuery({
    queryKey: LOOKUPS_QUERY_KEYS.stateAwardsByType(typeCode ?? ""),
    queryFn: ({ signal }) => lookupsService.getStateAwardsByType(typeCode!, signal),
    enabled: enabled && !!typeCode,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    refetchOnMount: false,
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

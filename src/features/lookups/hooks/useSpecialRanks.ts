import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";
import type { GroupedOption } from "@/shared/types";

export const useSpecialRanks = (enabled: boolean, organCode?: string) => {
  // Kurum isimlerini çekmek için doğrudan useQuery kullanıyoruz (Hook 1)
  const organsQuery = useQuery({
    queryKey: ["lookups", "enumByCode", "Organs"],
    queryFn: ({ signal }) => lookupsService.getEnumItemsByTypeCode("Organs", signal),
    enabled: enabled && !organCode,
    staleTime: 0,
    gcTime: 0,
  });

  // Özel rütbeleri çekmek için (Hook 2)
  const ranksQuery = useQuery({
    queryKey: ["lookups", "specialRanks", organCode ?? "all"],
    queryFn: ({ signal }) => lookupsService.getSpecialRanks(organCode, signal),
    enabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  // Verileri eşleştirmek için (Hook 3)
  const groupedOptions: GroupedOption[] = useMemo(() => {
    const rawRanks = ranksQuery.data?.result ?? ranksQuery.data?.data;

    if (!rawRanks || !Array.isArray(rawRanks)) return [];

    // If specific organ selected, backend can return flat list.
    if (organCode) {
      const first = rawRanks[0] as any;
      if (first && Array.isArray(first.options)) {
        return rawRanks.map((group: any) => ({
          label: String(group.label ?? ""),
          options: mapEnumItemsToOptions(group.options),
        }));
      }
      return [{ label: "", options: mapEnumItemsToOptions(rawRanks) }];
    }

    const rawOrgans = organsQuery.data?.result ?? organsQuery.data?.data;
    const organOptions = mapEnumItemsToOptions(rawOrgans);

    return rawRanks.map((group: any) => {
      // Kod ile kurum ismini eşleştiriyoruz
      const organ = organOptions.find(o => String(o.id) === group.label);
      
      return {
        label: organ ? organ.fullName : group.label,
        options: mapEnumItemsToOptions(group.options),
      };
    });
  }, [ranksQuery.data, organsQuery.data, organCode]);

  return {
    isLoading: ranksQuery.isLoading || organsQuery.isLoading,
    refetch: () => {
      organsQuery.refetch();
      ranksQuery.refetch();
    },
    groupedOptions,
  };
};

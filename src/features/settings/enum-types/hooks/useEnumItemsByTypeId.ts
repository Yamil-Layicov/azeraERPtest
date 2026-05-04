import { useQuery } from "@tanstack/react-query";
import { enumTypesService } from "../api";

export const useEnumItemsByTypeId = (enumTypeId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["enumItems", enumTypeId],
    queryFn: ({ signal }) => enumTypesService.getEnumItemsByEnumTypeId(enumTypeId!, signal),
    enabled: enabled && !!enumTypeId,
  });
};

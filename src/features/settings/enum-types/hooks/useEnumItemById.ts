import { useQuery } from "@tanstack/react-query";
import { enumTypesService } from "../api";

export const useEnumItemById = (id: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["enumItem", id],
    queryFn: ({ signal }) => enumTypesService.getEnumItemById(id!, signal),
    enabled: enabled && !!id,
  });
};

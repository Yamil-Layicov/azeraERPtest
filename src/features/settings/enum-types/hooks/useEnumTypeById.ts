import { useQuery } from "@tanstack/react-query";
import { enumTypesService } from "../api";

export const useEnumTypeById = (id: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["enumType", id],
    queryFn: ({ signal }) => enumTypesService.getEnumTypeById(id!, signal),
    enabled: enabled && !!id,
  });
};

import { useQuery } from "@tanstack/react-query";
import { enumTypesService } from "../api";

export const useEnumTypes = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["enumTypes"],
    queryFn: ({ signal }) => enumTypesService.getEnumTypes(signal),
    enabled,
  });
};

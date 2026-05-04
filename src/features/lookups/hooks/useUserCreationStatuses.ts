import { useQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";
import type { Option } from "@/shared/types";

export const USER_CREATION_STATUS_QUERY_KEY = ["lookups", "userCreationRequestStatus"] as const;

export const useUserCreationStatuses = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: USER_CREATION_STATUS_QUERY_KEY,
    queryFn: ({ signal }) => lookupsService.getUserCreationRequestStatus(signal),
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

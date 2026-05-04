import { useInfiniteQuery } from "@tanstack/react-query";
import { lookupsService } from "../api";
import { mapEnumItemsToOptions } from "../lib/mapEnumItemsToOptions";
import { useMemo } from "react";

export const usePositions = (searchValue: string = "", enabled: boolean = true) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["lookups", "positions", searchValue],
    queryFn: ({ pageParam = 0, signal }) => 
      lookupsService.getPositions(pageParam, searchValue, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { pageIndex, pageSize, totalCount } = lastPage.result;
      const loadedCount = (pageIndex + 1) * pageSize;
      return loadedCount < totalCount ? pageIndex + 1 : undefined;
    },
    enabled,
  });

  const options = useMemo(() => {
    const allData = data?.pages.flatMap((page) => page.result.data) ?? [];
    return mapEnumItemsToOptions(allData);
  }, [data]);

  return {
    options,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    refetch,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { specialRanksService } from "../api/specialRanksService";
import type { SpecialRank } from "../model/types";

export const SPECIAL_RANKS_QUERY_KEYS = {
  all: ["special-ranks"] as const,
  list: (params: any) => [...SPECIAL_RANKS_QUERY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...SPECIAL_RANKS_QUERY_KEYS.all, "detail", id] as const,
};

export const useSpecialRanks = (enabled: boolean = true) => {
  return useQuery({
    queryKey: SPECIAL_RANKS_QUERY_KEYS.list({ all: true }),
    queryFn: ({ signal }) => specialRanksService.getSpecialRanks(signal),
    enabled,
  });
};

export const useSpecialRankById = (id: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: SPECIAL_RANKS_QUERY_KEYS.detail(id!),
    queryFn: ({ signal }) => specialRanksService.getById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 0,
  });
};

export const useCreateSpecialRank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SpecialRank>) => specialRanksService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPECIAL_RANKS_QUERY_KEYS.all });
    },
  });
};

export const useUpdateSpecialRank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SpecialRank> & { id: number }) => specialRanksService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPECIAL_RANKS_QUERY_KEYS.list({ all: true }) });
    },
  });
};

export const useDeleteSpecialRank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => specialRanksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPECIAL_RANKS_QUERY_KEYS.all });
    },
  });
};

export const useSetActiveSpecialRank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      specialRanksService.setActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPECIAL_RANKS_QUERY_KEYS.all });
    },
  });
};

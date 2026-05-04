import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stateAwardsService } from "../api/stateAwardsService";
import type { StateAward } from "../model/types";

export const STATE_AWARDS_QUERY_KEYS = {
  all: ["state-awards"] as const,
  list: (params: any) => [...STATE_AWARDS_QUERY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...STATE_AWARDS_QUERY_KEYS.all, "detail", id] as const,
};

export const useStateAwards = (enabled: boolean = true) => {
  return useQuery({
    queryKey: STATE_AWARDS_QUERY_KEYS.list({ all: true }),
    queryFn: ({ signal }) => stateAwardsService.getStateAwards(signal),
    enabled,
  });
};

export const useStateAwardById = (id: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: STATE_AWARDS_QUERY_KEYS.detail(id!),
    queryFn: ({ signal }) => stateAwardsService.getById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 0,
  });
};

export const useCreateStateAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<StateAward>) => stateAwardsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATE_AWARDS_QUERY_KEYS.all });
    },
  });
};

export const useUpdateStateAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<StateAward> & { id: string }) => stateAwardsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATE_AWARDS_QUERY_KEYS.list({ all: true }) });
    },
  });
};

export const useDeleteStateAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stateAwardsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATE_AWARDS_QUERY_KEYS.all });
    },
  });
};

export const useSetActiveStateAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      stateAwardsService.setActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATE_AWARDS_QUERY_KEYS.all });
    },
  });
};

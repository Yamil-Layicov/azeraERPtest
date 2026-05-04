import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { privilegesService } from "../api/privilegesService";
import type { Privilege } from "../model/types";

export const PRIVILEGES_QUERY_KEYS = {
  all: ["privileges"] as const,
  list: (params: any) => [...PRIVILEGES_QUERY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...PRIVILEGES_QUERY_KEYS.all, "detail", id] as const,
};

export const usePrivileges = (enabled: boolean = true) => {
  return useQuery({
    queryKey: PRIVILEGES_QUERY_KEYS.list({ all: true }),
    queryFn: ({ signal }) => privilegesService.getPrivileges(signal),
    enabled,
  });
};

export const usePrivilegeById = (id: number | string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: PRIVILEGES_QUERY_KEYS.detail(String(id!)),
    queryFn: ({ signal }) => privilegesService.getById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 0,
  });
};

export const useCreatePrivilege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Privilege>) => privilegesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRIVILEGES_QUERY_KEYS.all });
    },
  });
};

export const useUpdatePrivilege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Privilege> & { id: number }) => privilegesService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRIVILEGES_QUERY_KEYS.all });
    },
  });
};

export const useDeletePrivilege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => privilegesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRIVILEGES_QUERY_KEYS.all });
    },
  });
};

export const useSetActivePrivilege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number | string; isActive: boolean }) =>
      privilegesService.setActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRIVILEGES_QUERY_KEYS.all });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { staffTableService } from "../api";
import type { 
  GetStaffTableRequest, 
  GetStaffTableResponse,
  CreateStaffTableRequest,
  NodeGetRequest,
  NodeGetResponse,
  NodeEntry,
  DeactivateNodeRequest,
  CreateNodeRequest,
} from "../model";
import type { Option } from "@/shared/types";

const STAFF_TABLE_BASE_KEY = ["staff-table"] as const;

export const STAFF_TABLE_QUERY_KEYS = {
  all: STAFF_TABLE_BASE_KEY,
  list: (params: GetStaffTableRequest) => [...STAFF_TABLE_BASE_KEY, "list", params] as const,
  nodeList: (params: NodeGetRequest) => [...STAFF_TABLE_BASE_KEY, "nodeList", params] as const,
  nodeDetail: (id: string) => [...STAFF_TABLE_BASE_KEY, "nodeDetail", id] as const,
  inactiveStatusLookup: [...STAFF_TABLE_BASE_KEY, "inactiveStatusLookup"] as const,
  detail: (id: string) => [...STAFF_TABLE_BASE_KEY, "detail", id] as const,
};

export const useStaffTable = (params: GetStaffTableRequest) => {
  return useQuery<GetStaffTableResponse, AxiosError>({
    queryKey: STAFF_TABLE_QUERY_KEYS.list(params),
    queryFn: ({ signal }) => staffTableService.getStaffTable(params, signal),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useNodeGet = (params: NodeGetRequest, enabled: boolean = true) => {
  return useQuery<NodeGetResponse, AxiosError>({
    queryKey: STAFF_TABLE_QUERY_KEYS.nodeList(params),
    queryFn: ({ signal }) => staffTableService.getNodeList(params, signal),
    enabled,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });
};

export const useGetNodeById = (id: string | null, enabled: boolean = true) => {
  return useQuery<NodeEntry, AxiosError>({
    queryKey: STAFF_TABLE_QUERY_KEYS.nodeDetail(id!),
    queryFn: ({ signal }) => staffTableService.getNodeById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 dakika cache'de tut
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false, // Mount olduğunda refetch yapma
    refetchOnWindowFocus: false, // Window focus olduğunda refetch yapma
  });
};

export const useInactiveStatusLookup = () => {
  return useQuery<Option[], AxiosError>({
    queryKey: STAFF_TABLE_QUERY_KEYS.inactiveStatusLookup,
    queryFn: ({ signal }) => staffTableService.getInactiveStatusLookup(signal),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useDeactivateNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeactivateNodeRequest) => staffTableService.deactivateNode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_TABLE_QUERY_KEYS.all });
    },
  });
};

export const useActivateNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffTableService.activateNode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_TABLE_QUERY_KEYS.all });
    },
  });
};

export const useSetNodeActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, isActive }: { nodeId: string; isActive: boolean }) =>
      staffTableService.setNodeActive(nodeId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_TABLE_QUERY_KEYS.all });
    },
  });
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffTableService.deleteNode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_TABLE_QUERY_KEYS.all });
    },
  });
};

export const useCreateNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNodeRequest) => staffTableService.createNode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_TABLE_QUERY_KEYS.all });
    },
  });
};

export const useCreateStaffTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStaffTableRequest) => staffTableService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_TABLE_QUERY_KEYS.all });
    },
  });
};

export const useUpdateStaffTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateStaffTableRequest> }) =>
      staffTableService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_TABLE_QUERY_KEYS.all });
    },
  });
};

export const useDeleteStaffTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffTableService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_TABLE_QUERY_KEYS.all });
    },
  });
};

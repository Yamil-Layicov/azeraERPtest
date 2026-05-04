import { useQuery } from '@tanstack/react-query';
import { positionsService } from '../api/positionsService';
import { POSITIONS_QUERY_KEYS } from './usePositions';
import type { PositionEntry } from '../model/types';
import type { AxiosError } from 'axios';

export const useGetPositionById = (id: string | null, enabled: boolean = true) => {
  return useQuery<PositionEntry, AxiosError>({
    queryKey: [...POSITIONS_QUERY_KEYS.all, 'detail', id],
    queryFn: ({ signal }) => positionsService.getById(id!, signal),
    enabled: enabled && !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });
};

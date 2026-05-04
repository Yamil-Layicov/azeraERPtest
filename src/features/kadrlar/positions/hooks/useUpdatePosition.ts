import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { positionsService } from '../api/positionsService';
import { POSITIONS_QUERY_KEYS } from './usePositions';
import type { UpdatePositionRequest, PositionEntry } from '../model/types';
import type { AxiosError } from 'axios';

export const useUpdatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation<PositionEntry, AxiosError, UpdatePositionRequest>({
    mutationFn: async (payload: UpdatePositionRequest) => {
      return await positionsService.update(payload);
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...POSITIONS_QUERY_KEYS.all, "list"] });
      toast.success('Vəzifə uğurla yeniləndi');
    },
    
    onError: () => {
      // Error mesajı global interceptor'da gösteriliyor
    }
  });
};

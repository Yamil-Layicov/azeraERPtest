import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { positionsService } from '../api/positionsService';
import { POSITIONS_QUERY_KEYS } from './usePositions';
import type { CreatePositionRequest, PositionEntry } from '../model/types';
import type { AxiosError } from 'axios';

export const useCreatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation<PositionEntry, AxiosError, CreatePositionRequest>({
    mutationFn: async (payload: CreatePositionRequest) => {
      return await positionsService.create(payload);
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSITIONS_QUERY_KEYS.all });
      toast.success('Vəzifə uğurla əlavə edildi');
    },
    
    onError: () => {
      // Error mesajı global interceptor'da gösteriliyor
    }
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { positionsService } from '../api/positionsService';
import { POSITIONS_QUERY_KEYS } from './usePositions';
import type { AxiosError } from 'axios';
import type { DeletePositionResponse } from '../model/types';

export const useDeletePosition = () => {
  const queryClient = useQueryClient();

  return useMutation<DeletePositionResponse, AxiosError, string>({
    mutationFn: async (id: string) => {
      return await positionsService.delete(id);
    },
    
    onSuccess: (data) => {
      if (data && !data.isSuccess && data.errorMessage) {
        toast.error(data.errorMessage);
        return;
      }
      queryClient.invalidateQueries({ queryKey: POSITIONS_QUERY_KEYS.all });
      toast.success('Vəzifə uğurla silindi');
    },
    
    onError: (error: AxiosError) => {
      const data = error?.response?.data as { errorMessage?: string } | undefined;
      const errorMessage = data?.errorMessage || error?.message || "Xəta baş verdi";
      toast.error(errorMessage);
    }
  });
};

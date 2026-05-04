import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { authService } from '../api/authService';
import { AUTH_KEYS } from './useUser';

export const useChangeUserNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nodeId: string) => {
      await authService.changeUserNode(nodeId);
    },
    
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.ME });
      
      try {
        await queryClient.fetchQuery({
          queryKey: AUTH_KEYS.ME,
          queryFn: ({ signal }) => authService.getMe(signal),
        });
      } catch {
        await queryClient.refetchQueries({ 
          queryKey: AUTH_KEYS.ME,
        });
      }
      
      toast.success('Node uğurla dəyişdirildi');
    },
    
    onError: () => {
      toast.error('Node dəyişdirilərkən xəta baş verdi');
    }
  });
};

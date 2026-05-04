import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { authService } from '../api/authService';
import { AUTH_KEYS } from './useUser';

export const useRefreshPerInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authService.refreshPerInfo();
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
      
      toast.success('Məlumatlar uğurla yeniləndi');
    },
    
    onError: () => {
      toast.error('Məlumatları yeniləmə zamanı xəta baş verdi');
    }
  });
};

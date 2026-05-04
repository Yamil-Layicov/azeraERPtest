import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { authService } from '../api/authService';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    
    onSettled: () => {
      queryClient.clear();
      window.location.replace("/app/login"); 
    },
    
    onError: () => {
      toast.error("Çıxış zamanı xəta oldu");
    }
  });
};
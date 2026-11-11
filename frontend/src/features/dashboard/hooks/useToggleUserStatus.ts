import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';

const updateUserStatusApi = async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
  const response = await apiClient.patch(`/api/v1/super-admin/users/${userId}/status`, {
    status: isActive,
  });
  return response.data
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });   
    },
  });
};

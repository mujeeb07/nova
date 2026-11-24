import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient';

// 
const ENTITY_CONFIG = {
  user:     { path: 'users',             queryKey: ['users'] },
  vendor:   { path: 'vendors',           queryKey: ['vendors'] },
  delivery: { path: 'delivery-partners', queryKey: ['delivery-partners'] },
  admin:    { path: 'admins',            queryKey: ['admins'] },
} as const;

export type StatusEntity = keyof typeof ENTITY_CONFIG;

interface ToggleStatusParams {
  id: string;
  isActive: boolean;
}

export const useToggleStatus = (entity: StatusEntity) => {
  const queryClient = useQueryClient();
  const { path, queryKey } = ENTITY_CONFIG[entity];

  return useMutation({
    mutationFn: async ({ id, isActive }: ToggleStatusParams) => {
      const response = await apiClient.patch(
        `/api/v1/super-admin/${path}/${id}/status`,
        { status: isActive }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
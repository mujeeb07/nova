import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/apiClient'; 

interface ToggleVendorStatusParams {
    vendorId: string;
    isActive: boolean;
}

const updateVendorStatusApi = async ({ 
    vendorId, 
    isActive
}: ToggleVendorStatusParams) => {
  const response = await apiClient.patch(
        `/api/v1/super-admin/vendors/${vendorId}/status`, 
        {
            status: isActive,
        }
    );
  return response.data
};

export const useToggleVendorStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateVendorStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });   
    },
  });
};
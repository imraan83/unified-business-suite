import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { PurchaseItem } from '@/types';

type SalesItem = PurchaseItem; // Reuse same structure

type SalesOrder = {
  id: string;
  so_number: string;
  customer_name: string;
  items: SalesItem[];
  total_amount: number;
  order_date: string;
  status: 'Draft' | 'Pending' | 'In-Progress' | 'Paid' | 'Completed';
  notes: string;
  created_at: string;
};

export function useSalesOrders() {
  return useQuery({
    queryKey: ['salesOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Omit<SalesOrder, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('sales_orders')
        .insert(order)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      toast.success('Sales Order created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create sales order: ' + error.message);
    },
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });
}

export function generateSONumber() {
  const year = new Date().getFullYear();
  const count = Math.floor(Math.random() * 1000); // Placeholder
  return `SO-${year}-${count.toString().padStart(3, '0')}`;
}


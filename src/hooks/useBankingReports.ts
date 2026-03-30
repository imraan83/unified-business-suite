import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BankingKpis, MonthlyDepositsWithdrawals } from '@/types';

export const useBankingReports = () => {
  const kpisQuery = useQuery<BankingKpis>({
    queryKey: ['banking', 'kpis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banking_kpis')
        .select('*')
        .single();
      if (error) throw error;
      return data!;
    },
  });

  const monthlyDwQuery = useQuery<MonthlyDepositsWithdrawals[]>({
    queryKey: ['banking', 'monthly_dw'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_deposits_withdrawals')
        .select('*')
        .order('month', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  return {
    kpis: kpisQuery.data,
    monthlyDw: monthlyDwQuery.data,
    isLoading: kpisQuery.isLoading || monthlyDwQuery.isLoading,
    error: kpisQuery.error || monthlyDwQuery.error,
    refetch: () => {
      kpisQuery.refetch();
      monthlyDwQuery.refetch();
    },
  };
};


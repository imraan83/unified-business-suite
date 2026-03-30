import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface MonthlyPL {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  sales_income: number;
  service_income: number;
  materials_expense: number;
  salaries_expense: number;
  rent_expense: number;
  utilities_expense: number;
}

interface CashFlow {
  month: string;
  inflow: number;
  outflow: number;
  total_inflow: number;
  total_outflow: number;
  sales_inflow: number;
  service_inflow: number;
  materials_outflow: number;
  salaries_outflow: number;
  rent_outflow: number;
}

interface Kpis {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  inventory_value: number;
  avg_prod_efficiency: number | null;
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
}

interface InventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  unit_cost: number;
  unit: string | null;
  category: string | null;
  reorder_level: number | null;
  total_value: number;
  stock_status: string;
}

interface ProductionEfficiency {
  month: string;
  month_year: string;
  avg_output: number;
  avg_input: number;
  avg_efficiency: number;
  total_output: number;
  total_input: number;
  overall_efficiency: number;
}

export const useReports = () => {
  const kpisQuery = useQuery<Kpis>({
    queryKey: ['reports', 'kpis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .single();
      if (error) throw error;
      return data!;
    },
  });

  const monthlyPLQuery = useQuery<MonthlyPL[]>({
    queryKey: ['reports', 'monthly_pl'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_pl_detailed')
        .select('*')
        .order('month_year', { ascending: false })
        .limit(12);
      if (error) throw error;
      return data || [];
    },
  });

  const cashFlowQuery = useQuery<CashFlow[]>({
    queryKey: ['reports', 'cash_flow'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_flow_by_category')
        .select('*')
        .order('month_year', { ascending: false })
        .limit(12);
      if (error) throw error;
      return data || [];
    },
  });

  const inventoryQuery = useQuery<InventoryItem[]>({
    queryKey: ['reports', 'inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_valuation')
        .select('*')
        .order('total_value', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const productionEfficiencyQuery = useQuery<ProductionEfficiency[]>({
    queryKey: ['reports', 'production_efficiency'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('production_efficiency_trends')
        .select('*')
        .order('month_year', { ascending: false })
        .limit(12);
      if (error) throw error;
      return data || [];
    },
  });

  return {
    kpis: kpisQuery.data,
    monthlyPL: monthlyPLQuery.data,
    cashFlow: cashFlowQuery.data,
    inventory: inventoryQuery.data,
    productionEfficiency: productionEfficiencyQuery.data,
    isLoading: kpisQuery.isLoading || monthlyPLQuery.isLoading || cashFlowQuery.isLoading || inventoryQuery.isLoading || productionEfficiencyQuery.isLoading,
    error: kpisQuery.error || monthlyPLQuery.error || cashFlowQuery.error || inventoryQuery.error || productionEfficiencyQuery.error,
    refetch: () => {
      kpisQuery.refetch();
      monthlyPLQuery.refetch();
      cashFlowQuery.refetch();
      inventoryQuery.refetch();
      productionEfficiencyQuery.refetch();
    },
  };
};



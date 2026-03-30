export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  cost: number;
  price: number;
  reorder_level: number;
  qty_on_hand: number;
  warehouse: string;
  status: string;
  created_at: string;
}

export interface WorkOrder {
  id: string;
  product_name: string;
  quantity: number;
  start_date: string;
  due_date: string;
  status: string;
  progress: number;
  bill_of_materials: any[];
  routing_steps: any[];
  priority: string;
  notes: string;
  created_at: string;
}

export interface PurchaseItem {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_name: string;
  items: PurchaseItem[];
  total_amount: number;
  order_date: string;
  delivery_date: string;
  status: string;
  notes: string;
  created_at: string;
}

export interface SalesItem {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface SalesOrder {
  id: string;
  so_number: string;
  customer_name: string;
  items: SalesItem[];
  total_amount: number;
  order_date: string;
  status: string;
  notes: string;
  created_at: string;
}

// Banking Types
export interface Customer {
  id: string;
  name: string;
  cnic: string;
  account_type: 'current' | 'savings' | 'islamic';
  phone?: string;
  email?: string;
  created_at: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  manager?: string;
}

export interface Account {
  id: string;
  customer_id: string;
  branch_id: string;
  balance: number;
  status: string;
  account_number: string;
  opened_at: string;
}

export interface BankingTransaction {
  id: string;
  account_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  date: string;
  channel: 'ATM' | 'Online' | 'Branch' | 'Mobile';
  reference?: string;
  description?: string;
}

export interface Loan {
  id: string;
  customer_id: string;
  loan_type: string;
  principal_amount: number;
  interest_rate: number | null;
  status: string;
  issued_date: string;
  maturity_date?: string;
}

export interface IslamicFinancing {
  id: string;
  customer_id: string;
  contract_type: 'Murabaha' | 'Ijarah' | 'Musharakah' | 'Istisna';
  amount: number;
  profit_rate: number | null;
  start_date: string;
  end_date?: string;
  status: string;
}

export interface AmlFlag {
  id: string;
  transaction_id: string;
  risk_level: 'low' | 'medium' | 'high';
  flagged_reason: string;
  flagged_at: string;
}

export interface BankingKpis {
  total_deposits: number;
  total_withdrawals: number;
  active_accounts: number;
  total_loans: number;
  total_islamic_financing: number;
  high_risk_flags: number;
  total_cash_reserves: number;
  liquidity_ratio: number;
}

export interface MonthlyDepositsWithdrawals {
  month: string;
  deposits: number;
  withdrawals: number;
  net_flow: number;
}


// Reports types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description?: string;
}

export interface MonthlyPL {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface CashFlow {
  month: string;
  inflow: number;
  outflow: number;
}

export interface Kpis {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  inventory_value: number;
  avg_prod_efficiency: number | null;
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  date: string;
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  date: string;
}


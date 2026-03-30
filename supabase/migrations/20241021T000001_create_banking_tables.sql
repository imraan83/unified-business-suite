/* Banking Reports Migration
   Run in Supabase SQL Editor */

-- Customers
create table if not exists customers (

  id uuid default gen_random_uuid() primary key,
  name text not null,
  cnic text unique not null,
  account_type text check (account_type in ('current', 'savings', 'islamic')) not null,
  phone text,
  email text,
  created_at timestamp with time zone default now()
);

-- Branches
create table if not exists branches (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  city text not null,
  manager text
);

-- Accounts
create table if not exists accounts (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) on delete cascade,
  branch_id uuid references branches(id),
  balance numeric(15,2) default 0,
  status text default 'active' check (status in ('active', 'inactive', 'frozen')),
  account_number text unique,
  opened_at timestamp with time zone default now()
);

-- Transactions
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references accounts(id) on delete cascade,
  type text not null check (type in ('deposit', 'withdrawal', 'transfer')),
  amount numeric(12,2) not null,
  date timestamp with time zone default now(),
  channel text check (channel in ('ATM', 'Online', 'Branch', 'Mobile')),
  reference text,
  description text
);

-- Loans
create table if not exists loans (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) on delete cascade,
  loan_type text check (loan_type in ('personal', 'home', 'car', 'islamic')),
  principal_amount numeric(12,2) not null,
  interest_rate numeric(5,2),
  status text default 'active',
  issued_date timestamp with time zone default now(),
  maturity_date timestamp with time zone
);

-- Islamic Financing
create table if not exists islamic_financing (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) on delete cascade,
  contract_type text check (contract_type in ('Murabaha', 'Ijarah', 'Musharakah', 'Istisna')),
  amount numeric(12,2) not null,
  profit_rate numeric(5,2),
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone,
  status text default 'active'
);

-- AML Flags
create table if not exists aml_flags (
  id uuid default gen_random_uuid() primary key,
  transaction_id uuid references transactions(id),
  risk_level text check (risk_level in ('low', 'medium', 'high')),
  flagged_reason text,
  flagged_at timestamp with time zone default now()
);

-- Enable RLS for banking tables manually (safer)
alter table customers enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table loans enable row level security;
alter table islamic_financing enable row level security;
alter table branches enable row level security;
alter table aml_flags enable row level security;

-- Policies
create policy "Authenticated read" on customers for select using (auth.role() = 'authenticated');
create policy "Authenticated read" on accounts for select using (auth.role() = 'authenticated');
create policy "Authenticated read" on transactions for select using (auth.role() = 'authenticated');
create policy "Authenticated read" on loans for select using (auth.role() = 'authenticated');
create policy "Authenticated read" on islamic_financing for select using (auth.role() = 'authenticated');
create policy "Authenticated read" on branches for select using (true);
create policy "Authenticated read" on aml_flags for select using (auth.role() = 'authenticated');

-- Indexes
create index idx_transactions_date on transactions(date);
create index idx_transactions_type on transactions(type);
create index idx_loans_status on loans(status);
create index idx_accounts_balance on accounts(balance);
create index idx_islamic_financing_status on islamic_financing(status);

-- Views for Reports
create or replace view banking_kpis as
select 
  (select coalesce(sum(amount), 0) from transactions where type = 'deposit') as total_deposits,
  (select coalesce(sum(amount), 0) from transactions where type = 'withdrawal') as total_withdrawals,
  (select count(*) from accounts where status = 'active') as active_accounts,
  (select coalesce(sum(principal_amount), 0) from loans where status = 'active') as total_loans,
  (select coalesce(sum(amount), 0) from islamic_financing where status = 'active') as total_islamic_financing,
  (select count(*) from aml_flags where risk_level = 'high') as high_risk_flags,
  (select coalesce(sum(balance), 0) from accounts) as total_cash_reserves,
  100.0 as liquidity_ratio;

-- Monthly Deposits vs Withdrawals
create or replace view monthly_deposits_withdrawals as
select 
  to_char(date_trunc('month', date), 'Mon YY') as month,
  coalesce(sum(case when type = 'deposit' then amount else 0 end), 0) as deposits,
  coalesce(sum(case when type = 'withdrawal' then amount else 0 end), 0) as withdrawals,
  coalesce(sum(case when type = 'deposit' then amount else 0 end), 0) - coalesce(sum(case when type = 'withdrawal' then amount else 0 end), 0) as net_flow
from transactions
group by date_trunc('month', date)
order by date_trunc('month', date) desc limit 12;

-- Other views similar...
comment on view banking_kpis is 'Main banking KPIs';


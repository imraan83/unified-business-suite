-- Create reports tables for analytics
-- Run in Supabase SQL Editor

-- Enable RLS extension if needed
-- create extension if not exists "uuid-ossp";

-- Transactions table
create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  type text check (type in ('income', 'expense')) not null,
  category text not null,
  amount numeric(12,2) not null,
  date timestamp with time zone default now(),
  description text,
  created_at timestamp with time zone default now()
);

-- RLS policies
alter table transactions enable row level security;
create policy "Users can view transactions" on transactions for select using (true);
-- create policy "Users can insert transactions" on transactions for insert with check (true);

-- Assets
create table if not exists assets (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  value numeric(12,2) not null,
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table assets enable row level security;
create policy "Public read assets" on assets for select using (true);

-- Liabilities
create table if not exists liabilities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  amount numeric(12,2) not null,
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table liabilities enable row level security;
create policy "Public read liabilities" on liabilities for select using (true);

-- Inventory
create table if not exists inventory (
  id uuid default uuid_generate_v4() primary key,
  item_name text not null,
  quantity numeric(10,2) not null default 0,
  unit_cost numeric(10,2) not null,
  valuation_date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table inventory enable row level security;
create policy "Public read inventory" on inventory for select using (true);

-- Production
create table if not exists production (
  id uuid default uuid_generate_v4() primary key,
  output_units numeric(10,2) not null,
  input_units numeric(10,2) not null,
  date timestamp with time zone default now(),
  efficiency numeric(5,2) generated always as ((output_units / nullif(input_units, 0)) * 100) stored,
  created_at timestamp with time zone default now()
);

alter table production enable row level security;
create policy "Public read production" on production for select using (true);

-- Indexes
create index if not exists "idx_transactions_date_type" on transactions (date, type);
create index if not exists "idx_inventory_val_date" on inventory (valuation_date);
create index if not exists "idx_production_date" on production (date);

-- Aggregation Views
create or replace view monthly_pl as 
  select 
    date_trunc('month', t.date)::date as month,
    coalesce(sum(case when t.type = 'income' then t.amount else 0 end), 0) as revenue,
    coalesce(sum(case when t.type = 'expense' then t.amount else 0 end), 0) as expenses,
    coalesce(sum(case when t.type = 'income' then t.amount else 0 end), 0) - coalesce(sum(case when t.type = 'expense' then t.amount else 0 end), 0) as profit
  from transactions t 
  group by 1 
  order by 1 desc;

create or replace view kpis as 
  select 
    (select coalesce(sum(amount), 0) from transactions where type = 'income') as total_revenue,
    (select coalesce(sum(amount), 0) from transactions where type = 'expense') as total_expenses,
    (select coalesce(sum(case when type = 'income' then amount else 0 end) - sum(case when type = 'expense' then amount else 0 end), 0) from transactions) as net_profit,
    (select coalesce(sum(quantity * unit_cost), 0) from inventory) as inventory_value,
    (select avg(efficiency) from production) as avg_prod_efficiency;

create or replace view cash_flow as 
  select 
    date_trunc('month', date)::date as month,
    coalesce(sum(case when type = 'income' then amount else 0 end), 0) as inflow,
    coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as outflow
  from transactions 
  group by 1 
  order by 1 desc;

create or replace view balance_sheet as 
  select 
    (select coalesce(sum(value), 0) from assets) as total_assets,
    (select coalesce(sum(amount), 0) from liabilities) as total_liabilities,
    (select coalesce(sum(value), 0) from assets) - (select coalesce(sum(amount), 0) from liabilities) as equity;

-- Realtime publication
alter publication supabase_realtime add table transactions, production, inventory;

-- Grant realtime to public
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all functions in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;

comment on schema public is 'Reports tables, views for business analytics. Run this migration in Supabase SQL Editor.';

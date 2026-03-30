-- Seed demo data for Reports module
-- Run after migration in Supabase SQL Editor
-- Clear tables first if needed: truncate cascade;

-- Transactions (matching chart data PKR)
insert into transactions (type, category, amount, date, description) values
('income', 'Sales', 42000, '2024-01-15', 'Jan sales'),
('expense', 'COGS', 25000, '2024-01-20', 'Jan COGS'),
('income', 'Sales', 48000, '2024-02-15', 'Feb sales'),
('expense', 'COGS', 28000, '2024-02-20', 'Feb COGS'),
('income

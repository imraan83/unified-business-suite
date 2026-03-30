-- Seed Banking Data
-- Run after migration

-- Branches
insert into branches (name, city) values 
('Lahore Main', 'Lahore'),
('Karachi Central', 'Karachi'),
('Islamabad Branch', 'Islamabad'),
('Faisalabad Branch', 'Faisalabad');

-- Customers
insert into customers (name, cnic, account_type, phone) values 
('Ahmed Khan', '35202-1234567-1', 'savings', '0300-1234567'),
('Fatima Ali', '35202-7654321-0', 'current', '0311-7654321'),
('Muhammad Iqbal', '35202-1111111-9', 'islamic', '0322-1111111'),
('Ayesha Siddiqui', '35202-2222222-8', 'savings', '0333-2222222');

-- Accounts
insert into accounts (customer_id, branch_id, balance, account_number) values 
((select id from customers limit 1), (select id from branches limit 1), 150000.00, 'ACC001'),
((select id from customers limit 1 offset 1), (select id from branches limit 1 offset 1), 250000.00, 'ACC002'),
((select id from customers limit 1 offset 2), (select id from branches limit 1 offset 2), 180000.00, 'ACC003'),
((select id from customers limit 1 offset 3), (select id from branches limit 1 offset 3), 320000.00, 'ACC004');

-- Transactions (sample data)
insert into transactions (account_id, type, amount, date, channel) values 
((select id from accounts limit 1), 'deposit', 50000, '2024-09-01', 'Branch'),
((select id from accounts limit 1), 'withdrawal', 20000, '2024-09-05', 'ATM'),
((select id from accounts limit 1 offset 1), 'deposit', 100000, '2024-09-10', 'Online'),
((select id from accounts limit 1 offset 1), 'transfer', 30000, '2024-09-15', 'Mobile'),
((select id from accounts limit 1 offset 2), 'deposit', 75000, '2024-09-20', 'Branch');

-- Loans
insert into loans (customer_id, loan_type, principal_amount, interest_rate, status, issued_date) values 
((select id from customers limit 1), 'personal', 500000, 12.5, 'active', '2024-08-01'),
((select id from customers limit 1 offset 1), 'home', 2000000, 10.5, 'active', '2024-07-15'),
((select id from customers limit 1 offset 2), 'islamic', 800000, null, 'active', '2024-08-20');

-- Islamic Financing
insert into islamic_financing (customer_id, contract_type, amount, profit_rate, start_date) values 
((select id from customers limit 1 offset 1), 'Murabaha', 600000, 8.5, '2024-09-01'),
((select id from customers limit 1 offset 2), 'Ijarah', 450000, 9.0, '2024-08-15'),
((select id from customers limit 1 offset 3), 'Musharakah', 1200000, 7.5, '2024-07-01');

-- AML Flags (example)
insert into aml_flags (transaction_id, risk_level, flagged_reason) values 
((select id from transactions limit 1 offset 3), 'high', 'Large transfer without verification'),
((select id from transactions limit 1 offset 4), 'medium', 'Unusual pattern');


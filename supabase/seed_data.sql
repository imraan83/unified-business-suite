-- Sample data for Reports & Analytics module

-- Sample transactions
INSERT INTO transactions (type, category, amount, date, description) VALUES
('income', 'Product Sales', 42000.00, '2024-01-15', 'January product sales'),
('income', 'Service Revenue', 8000.00, '2024-01-20', 'January service income'),
('expense', 'Raw Materials', 15000.00, '2024-01-10', 'January raw material purchase'),
('expense', 'Salaries', 8000.00, '2024-01-25', 'January payroll'),
('expense', 'Rent', 3000.00, '2024-01-01', 'January office rent'),
('expense', 'Utilities', 500.00, '2024-01-15', 'January electricity bill'),

('income', 'Product Sales', 48000.00, '2024-02-15', 'February product sales'),
('income', 'Service Revenue', 9000.00, '2024-02-20', 'February service income'),
('expense', 'Raw Materials', 17000.00, '2024-02-10', 'February raw material purchase'),
('expense', 'Salaries', 8500.00, '2024-02-25', 'February payroll'),
('expense', 'Rent', 3000.00, '2024-02-01', 'February office rent'),
('expense', 'Marketing', 2000.00, '2024-02-15', 'February advertising'),

('income', 'Product Sales', 55000.00, '2024-03-15', 'March product sales'),
('income', 'Service Revenue', 10000.00, '2024-03-20', 'March service income'),
('expense', 'Raw Materials', 18000.00, '2024-03-10', 'March raw material purchase'),
('expense', 'Salaries', 9000.00, '2024-03-25', 'March payroll'),
('expense', 'Rent', 3000.00, '2024-03-01', 'March office rent'),
('expense', 'Utilities', 600.00, '2024-03-15', 'March electricity bill'),

('income', 'Product Sales', 51000.00, '2024-04-15', 'April product sales'),
('income', 'Service Revenue', 9500.00, '2024-04-20', 'April service income'),
('expense', 'Raw Materials', 19000.00, '2024-04-10', 'April raw material purchase'),
('expense', 'Salaries', 9200.00, '2024-04-25', 'April payroll'),
('expense', 'Rent', 3000.00, '2024-04-01', 'April office rent'),
('expense', 'Maintenance', 1500.00, '2024-04-15', 'Equipment maintenance'),

('income', 'Product Sales', 62000.00, '2024-05-15', 'May product sales'),
('income', 'Service Revenue', 11000.00, '2024-05-20', 'May service income'),
('expense', 'Raw Materials', 20000.00, '2024-05-10', 'May raw material purchase'),
('expense', 'Salaries', 9500.00, '2024-05-25', 'May payroll'),
('expense', 'Rent', 3000.00, '2024-05-01', 'May office rent'),
('expense', 'Shipping', 2500.00, '2024-05-15', 'Shipping costs'),

('income', 'Product Sales', 68000.00, '2024-06-15', 'June product sales'),
('income', 'Service Revenue', 12000.00, '2024-06-20', 'June service income'),
('expense', 'Raw Materials', 21000.00, '2024-06-10', 'June raw material purchase'),
('expense', 'Salaries', 9800.00, '2024-06-25', 'June payroll'),
('expense', 'Rent', 3000.00, '2024-06-01', 'June office rent'),
('expense', 'Taxes', 4000.00, '2024-06-15', 'Quarterly taxes');

-- Sample assets
INSERT INTO assets (name, value, asset_type, purchase_date) VALUES
('Office Building', 500000.00, 'Property', '2020-01-15'),
('Machinery Equipment', 120000.00, 'Equipment', '2021-03-22'),
('Computer Systems', 45000.00, 'Equipment', '2022-05-10'),
('Office Furniture', 15000.00, 'Equipment', '2021-08-05'),
('Company Vehicle', 35000.00, 'Vehicle', '2022-01-20');

-- Sample liabilities
INSERT INTO liabilities (name, amount, liability_type, due_date) VALUES
('Bank Loan', 100000.00, 'Long-term', '2025-12-31'),
('Accounts Payable', 25000.00, 'Short-term', '2024-06-30'),
('Tax Payable', 8000.00, 'Tax', '2024-07-15'),
('Accrued Expenses', 5000.00, 'Other', '2024-06-15');

-- Sample inventory
INSERT INTO inventory (item_name, quantity, unit_cost, unit, category) VALUES
('Steel Rods', 1000.000, 15.50, 'kg', 'Raw Materials'),
('Plastic Granules', 2500.000, 8.75, 'kg', 'Raw Materials'),
('Electronic Components', 5000.000, 2.30, 'pcs', 'Raw Materials'),
('Finished Product A', 500.000, 45.00, 'pcs', 'Finished Goods'),
('Finished Product B', 300.000, 65.00, 'pcs', 'Finished Goods'),
('Work in Process', 800.000, 25.00, 'pcs', 'WIP');

-- Sample production data
INSERT INTO production (output_units, input_units, date, process_type) VALUES
(1200.00, 1500.00, '2024-01-15'::timestamp, 'Assembly Line'),
(1350.00, 1600.00, '2024-02-15', 'Assembly Line'),
(1500.00, 1700.00, '2024-03-15', 'Assembly Line'),
(1420.00, 1650.00, '2024-04-15', 'Assembly Line'),
(1680.00, 1800.00, '2024-05-15', 'Assembly Line'),
(1750.00, 1850.00, '2024-06-15', 'Assembly Line');
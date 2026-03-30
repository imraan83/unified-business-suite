-- Create views for Reports & Analytics module

-- Monthly P&L view (aggregated by month)
CREATE OR REPLACE VIEW monthly_pl AS
SELECT 
    to_char(date, 'Mon') as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as revenue,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as profit
FROM transactions
GROUP BY to_char(date, 'Mon'), EXTRACT(MONTH FROM date)
ORDER BY EXTRACT(MONTH FROM date);

-- Cash Flow view (inflow/outflow by month)
CREATE OR REPLACE VIEW cash_flow AS
SELECT 
    to_char(date, 'Mon') as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as inflow,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as outflow
FROM transactions
GROUP BY to_char(date, 'Mon'), EXTRACT(MONTH FROM date)
ORDER BY EXTRACT(MONTH FROM date);

-- KPIs view (aggregated metrics)
CREATE OR REPLACE VIEW kpis AS
SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'income') as total_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense') as total_expenses,
    (SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) FROM transactions) as net_profit,
    (SELECT COALESCE(SUM(quantity * unit_cost), 0) FROM inventory) as inventory_value,
(SELECT COALESCE(AVG((output_units / NULLIF(input_units, 0)) * 100), 0) FROM production WHERE input_units > 0) as avg_prod_efficiency;

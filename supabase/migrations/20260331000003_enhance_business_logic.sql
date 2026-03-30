-- Enhance business logic calculations for Reports & Analytics module

-- Update KPIs view to include liabilities and equity calculations
CREATE OR REPLACE VIEW kpis AS
SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'income') as total_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense') as total_expenses,
    (SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) FROM transactions) as net_profit,
    (SELECT COALESCE(SUM(quantity * unit_cost), 0) FROM inventory) as inventory_value,
    (SELECT COALESCE(SUM(value), 0) FROM assets) as total_assets,
    (SELECT COALESCE(SUM(amount), 0) FROM liabilities) as total_liabilities,
    (SELECT COALESCE(SUM(value), 0) FROM assets) - (SELECT COALESCE(SUM(amount), 0) FROM liabilities) as total_equity,
(SELECT COALESCE(AVG((output_units / NULLIF(input_units, 0)) * 100), 0) FROM production WHERE input_units > 0) as avg_prod_efficiency;

-- Create a view for detailed monthly P&L with categories
CREATE OR REPLACE VIEW monthly_pl_detailed AS
SELECT 
    to_char(date, 'YYYY-MM') as month_year,
    to_char(date, 'Mon') as month,
    EXTRACT(MONTH FROM date) as month_num,
    EXTRACT(YEAR FROM date) as year,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as net_profit,
    -- Income by category
    SUM(CASE WHEN type = 'income' AND category ILIKE '%sale%' THEN amount ELSE 0 END) as sales_income,
    SUM(CASE WHEN type = 'income' AND category ILIKE '%service%' THEN amount ELSE 0 END) as service_income,
    -- Expenses by category
    SUM(CASE WHEN type = 'expense' AND category ILIKE '%material%' THEN amount ELSE 0 END) as materials_expense,
    SUM(CASE WHEN type = 'expense' AND category ILIKE '%salary%' THEN amount ELSE 0 END) as salaries_expense,
    SUM(CASE WHEN type = 'expense' AND category ILIKE '%rent%' THEN amount ELSE 0 END) as rent_expense,
    SUM(CASE WHEN type = 'expense' AND category ILIKE '%util%' THEN amount ELSE 0 END) as utilities_expense
FROM transactions
GROUP BY to_char(date, 'YYYY-MM'), to_char(date, 'Mon'), EXTRACT(MONTH FROM date), EXTRACT(YEAR FROM date)
ORDER BY year DESC, month_num DESC;

-- Create a view for inventory valuation details
CREATE OR REPLACE VIEW inventory_valuation AS
SELECT 
    i.*,
    (i.quantity * i.unit_cost) as total_value,
    CASE 
        WHEN i.quantity <= COALESCE(i.reorder_level, 0) THEN 'LOW'
        ELSE 'OK'
    END as stock_status
FROM inventory i
ORDER BY (i.quantity * i.unit_cost) DESC;

-- Create a view for production efficiency trends
CREATE OR REPLACE VIEW production_efficiency_trends AS
SELECT 
to_char(date, 'YYYY-MM') as month_year,
to_char(date, 'Mon') as month,
    AVG(output_units) as avg_output,
    AVG(input_units) as avg_input,
AVG((output_units / NULLIF(input_units, 0)) * 100) as avg_efficiency,
    SUM(output_units) as total_output,
    SUM(input_units) as total_input,
    CASE 
        WHEN SUM(input_units) > 0 
        THEN (SUM(output_units)::DECIMAL / SUM(input_units)) * 100 
        ELSE 0 
    END as overall_efficiency
FROM production
GROUP BY month_year, month
ORDER BY month_year DESC;

-- Create a view for cash flow by category
CREATE OR REPLACE VIEW cash_flow_by_category AS
SELECT 
    to_char(date, 'YYYY-MM') as month_year,
    to_char(date, 'Mon') as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_inflow,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_outflow,
    -- Inflow by category
    SUM(CASE WHEN type = 'income' AND category ILIKE '%sale%' THEN amount ELSE 0 END) as sales_inflow,
    SUM(CASE WHEN type = 'income' AND category ILIKE '%service%' THEN amount ELSE 0 END) as service_inflow,
    -- Outflow by category
    SUM(CASE WHEN type = 'expense' AND category ILIKE '%material%' THEN amount ELSE 0 END) as materials_outflow,
    SUM(CASE WHEN type = 'expense' AND category ILIKE '%salary%' THEN amount ELSE 0 END) as salaries_outflow,
    SUM(CASE WHEN type = 'expense' AND category ILIKE '%rent%' THEN amount ELSE 0 END) as rent_outflow
FROM transactions
GROUP BY to_char(date, 'YYYY-MM'), to_char(date, 'Mon')
ORDER BY month_year DESC;

-- Create indexes for better performance on the new views
CREATE INDEX IF NOT EXISTS idx_monthly_pl_detailed_month ON monthly_pl_detailed(month_num, year);
CREATE INDEX IF NOT EXISTS idx_inventory_valuation_value ON inventory_valuation(total_value);
CREATE INDEX IF NOT EXISTS idx_production_efficiency_trends_month ON production_efficiency_trends(month_year);
CREATE INDEX IF NOT EXISTS idx_cash_flow_by_category_month ON cash_flow_by_category(month_year);
-- BusinessVerse AI - Supabase PostgreSQL Seed Dataset
-- Created: 2026-07-05
-- Description: Generates realistic mock data (Suppliers, Employees, 100 Products, 250 Customers, 500 Sales, etc.) for testing.

-- 1. SEED DEFAULT USER & BUSINESS
INSERT INTO users (id, name, email, role, avatar_url)
VALUES ('b00c8a32-1b11-4770-8bde-7d9a8cbe5321', 'Mahalakshmi', 'admin@businessverse.ai', 'owner', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin');

INSERT INTO businesses (id, owner_id, name, industry, location, business_type)
VALUES ('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'b00c8a32-1b11-4770-8bde-7d9a8cbe5321', 'BusinessVerse Sandbox Retailer', 'Retail & Distribution', 'San Francisco, CA', 'SME Storefront');

INSERT INTO settings (business_id, theme, language, currency, notification_preferences)
VALUES ('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'dark', 'en', 'USD', '{"email": true, "sms": true}'::jsonb);

-- 2. SEED DEPARTMENTS
INSERT INTO departments (id, business_id, name, manager_id) VALUES 
('d001-sales-biz-id-uuid-key', 'c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Sales & Front Store', 'b00c8a32-1b11-4770-8bde-7d9a8cbe5321'),
('d002-supply-biz-id-uuid-key', 'c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Logistics & Warehouse', 'b00c8a32-1b11-4770-8bde-7d9a8cbe5321'),
('d003-finance-biz-id-uuid-key', 'c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Finance HQ', 'b00c8a32-1b11-4770-8bde-7d9a8cbe5321');

-- 3. SEED 25 EMPLOYEES
INSERT INTO employees (business_id, department_id, name, role, salary, attendance_rate, performance_score, productivity_rate)
SELECT 
    'c00d8b43-2c22-5881-9cef-8eab9dcf6432',
    (CASE WHEN i % 3 = 0 THEN 'd001-sales-biz-id-uuid-key'::uuid 
          WHEN i % 3 = 1 THEN 'd002-supply-biz-id-uuid-key'::uuid
          ELSE 'd003-finance-biz-id-uuid-key'::uuid END),
    'Employee Name ' || i,
    (CASE WHEN i % 3 = 0 THEN 'Sales Representative' 
          WHEN i % 3 = 1 THEN 'Logistics Courier'
          ELSE 'Finance Analyst' END),
    (3000.0 + random() * 4000.0)::numeric(12,2),
    (90.0 + random() * 10.0)::numeric(5,2),
    (6.0 + random() * 4.0)::numeric(3,1),
    (85.0 + random() * 25.0)::numeric(5,2)
FROM generate_series(1, 25) s(i);

-- 4. SEED 12 SUPPLIERS
INSERT INTO suppliers (id, business_id, company, contact_name, contact_email, contact_phone, lead_time_days, rating)
SELECT 
    uuid_generate_v4(),
    'c00d8b43-2c22-5881-9cef-8eab9dcf6432',
    'Supplier Corp ' || i,
    'Representative ' || i,
    'contact@supplier' || i || '.com',
    '+1 555-01' || lpad(i::text, 2, '0'),
    (2 + floor(random() * 10))::int,
    (3.5 + random() * 1.5)::numeric(3,2)
FROM generate_series(1, 12) s(i);

-- 5. SEED 100 PRODUCTS
INSERT INTO products (id, business_id, supplier_id, name, sku, price, cost, category, minimum_stock, maximum_stock)
SELECT 
    uuid_generate_v4(),
    'c00d8b43-2c22-5881-9cef-8eab9dcf6432',
    (SELECT id FROM suppliers ORDER BY random() LIMIT 1),
    'Corporate Product Item ' || i,
    'PROD-SKU-' || lpad(i::text, 3, '0') || '-SME',
    (40.0 + random() * 460.0)::numeric(10,2),
    (15.0 + random() * 180.0)::numeric(10,2),
    (ARRAY['Electronics', 'Furniture', 'Apparel', 'Grocery', 'Health'])[floor(random()*5)+1],
    15,
    500
FROM generate_series(1, 100) s(i);

-- 6. SEED INVENTORY RECORD FOR EACH PRODUCT
INSERT INTO inventory (product_id, current_quantity, incoming_qty, outgoing_qty, reserved_qty, status)
SELECT 
    id,
    (40 + floor(random() * 400))::int,
    (floor(random() * 20))::int,
    0,
    0,
    'in_stock'
FROM products;

-- Seed inventory transactions
INSERT INTO inventory_transactions (inventory_id, type, quantity, description)
SELECT 
    id,
    'intake',
    100,
    'Initial stock replenishment audit.'
FROM inventory;

-- 7. SEED 250 CUSTOMERS
INSERT INTO customers (id, business_id, name, email, phone, city, lifetime_value, retention_score)
SELECT 
    uuid_generate_v4(),
    'c00d8b43-2c22-5881-9cef-8eab9dcf6432',
    'Client Account ' || i,
    'client' || i || '@domain.com',
    '+1 555-02' || lpad(i::text, 2, '0'),
    (ARRAY['San Francisco', 'New York', 'Austin', 'Seattle', 'Chicago'])[floor(random()*5)+1],
    (150.0 + random() * 4000.0)::numeric(12,2),
    (70 + floor(random() * 30))::int
FROM generate_series(1, 250) s(i);

-- 8. SEED 500 ORDERS & CONNECTED SALES
-- We seed orders placed over the last 365 days to populate charts
DO $$
DECLARE
    order_id_var UUID;
    customer_id_var UUID;
    amt DECIMAL(12, 2);
    disc DECIMAL(12, 2);
    tx DECIMAL(12, 2);
    prof DECIMAL(12, 2);
    order_date TIMESTAMP WITH TIME ZONE;
BEGIN
    FOR i IN 1..500 LOOP
        -- Fetch random customer
        SELECT id INTO customer_id_var FROM customers ORDER BY random() LIMIT 1;
        
        -- Formulate variables
        amt := (60.0 + random() * 800.0)::numeric(12, 2);
        disc := (random() * 20.0)::numeric(12, 2);
        tx := (amt * 0.08)::numeric(12, 2);
        prof := (amt - (amt * 0.45) - disc)::numeric(12, 2); -- 45% COGS margin
        
        -- Generate date spreading over last 365 days
        order_date := NOW() - (i * 17 || ' hours')::interval;
        
        order_id_var := uuid_generate_v4();
        
        -- Insert order
        INSERT INTO orders (id, business_id, customer_id, total_amount, discount, tax, status, created_at, updated_at)
        VALUES (order_id_var, 'c00d8b43-2c22-5881-9cef-8eab9dcf6432', customer_id_var, amt, disc, tx, 'completed', order_date, order_date);
        
        -- Insert sale
        INSERT INTO sales (order_id, revenue, discount, tax, profit, payment_status, created_at, updated_at)
        VALUES (order_id_var, amt, disc, tx, prof, 'paid', order_date, order_date);
        
        -- Insert invoice
        INSERT INTO invoices (sale_id, invoice_number, status, due_at, created_at, updated_at)
        VALUES (
            uuid_generate_v4(),
            order_id_var,
            'INV-NO-' || lpad(i::text, 4, '0'),
            'paid',
            order_date + '14 days'::interval,
            order_date,
            order_date
        );
        
        -- Seed mock delivery run
        INSERT INTO deliveries (order_id, employee_id, status, distance_miles, delivery_time_mins, customer_rating, created_at, updated_at)
        VALUES (
            order_id_var,
            (SELECT id FROM employees WHERE role = 'Logistics Courier' ORDER BY random() LIMIT 1),
            'delivered',
            (2.0 + random() * 15.0)::numeric(6,2),
            (15 + floor(random() * 45))::int,
            (4.0 + random() * 1.0)::numeric(2,1),
            order_date,
            order_date + '1 hour'::interval
        );
    END LOOP;
END;
$$;

-- 9. SEED EXPENSES, PAYMENTS, & CAMPAIGNS
INSERT INTO expenses (business_id, category, amount, description, status, incurred_at) VALUES
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Rent', 6000.00, 'Monthly office rent.', 'approved', NOW() - '15 days'::interval),
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Wages', 30400.00, 'Monthly staff payroll distribution.', 'approved', NOW() - '5 days'::interval),
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Utilities', 1200.00, 'Power and web connections bills.', 'approved', NOW() - '20 days'::interval);

INSERT INTO marketing_campaigns (business_id, name, budget, clicks, conversions, roi, leads) VALUES
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Q2 Google Ads Funnel', 1500.00, 24000, 1850, 4.25, 4500),
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Social Local Targeting', 800.00, 12000, 620, 2.80, 1500);

-- 10. SEED BUSINESS HEALTH INDEX
INSERT INTO business_health (business_id, overall_score, finance_score, sales_score, inventory_score, customer_score, employee_score, marketing_score)
VALUES ('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 92, 94, 95, 88, 92, 90, 89);

-- 11. SEED AI RECOMMENDATIONS & INSIGHTS
INSERT INTO ai_recommendations (business_id, department, priority, recommendation, reason, confidence, expected_impact, status) VALUES
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Warehouse', 'warning', 'Increase safety stock buffers to 1.20x.', 'Prevent Q4 seasonal demand stockouts during November holiday periods.', 94, 'Fulfillment restored to 98%', 'pending'),
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'Sales', 'info', 'Adjust pricing multiplier to 1.15x.', 'Moderate markup optimizes consumer capture retention.', 92, 'Monthly Revenue +9%', 'pending');

INSERT INTO notifications (business_id, type, priority, title, description) VALUES
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'system', 'info', 'Operational Sync Completed', 'All 8 neural nodes have successfully reconciled metrics with the Postgres core.'),
('c00d8b43-2c22-5881-9cef-8eab9dcf6432', 'inventory', 'warning', 'Low Inventory warning', 'Product item 12 current stock is near the minimum threshold.');

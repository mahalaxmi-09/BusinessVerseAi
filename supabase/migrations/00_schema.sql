-- BusinessVerse AI - Supabase PostgreSQL Schema Migration
-- Created: 2026-07-05
-- Description: Enterprise-grade normalized database schema with RLS, Triggers, and Indexes.

-- 1. EXTENSIONS & FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. CREATE TABLES

-- USERS TABLE (Linked to auth.users in Supabase)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'manager', 'viewer')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- BUSINESSES TABLE
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- DEPARTMENTS TABLE
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- EMPLOYEES TABLE
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(150) NOT NULL,
    salary DECIMAL(12, 2) NOT NULL CHECK (salary >= 0),
    attendance_rate DECIMAL(5, 2) DEFAULT 100.00 CHECK (attendance_rate >= 0 AND attendance_rate <= 100),
    performance_score DECIMAL(3, 1) DEFAULT 5.0 CHECK (performance_score >= 1.0 AND performance_score <= 10.0),
    productivity_rate DECIMAL(5, 2) DEFAULT 100.00 CHECK (productivity_rate >= 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- SUPPLIERS TABLE
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    company VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    lead_time_days INT NOT NULL CHECK (lead_time_days >= 0),
    rating DECIMAL(3, 2) CHECK (rating >= 1.0 AND rating <= 5.0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- PRODUCTS TABLE
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    cost DECIMAL(10, 2) NOT NULL CHECK (cost >= 0),
    category VARCHAR(100) NOT NULL,
    minimum_stock INT NOT NULL DEFAULT 10 CHECK (minimum_stock >= 0),
    maximum_stock INT NOT NULL DEFAULT 1000 CHECK (maximum_stock >= minimum_stock),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT sku_business_unique UNIQUE(sku, business_id)
);

-- INVENTORY TABLE
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE NOT NULL,
    current_quantity INT NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
    incoming_qty INT DEFAULT 0 CHECK (incoming_qty >= 0),
    outgoing_qty INT DEFAULT 0 CHECK (outgoing_qty >= 0),
    reserved_qty INT DEFAULT 0 CHECK (reserved_qty >= 0),
    available_qty INT GENERATED ALWAYS AS (current_quantity + incoming_qty - outgoing_qty - reserved_qty) STORED,
    status VARCHAR(50) DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- INVENTORY TRANSACTIONS
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('intake', 'checkout', 'adjustment', 'return')),
    quantity INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- CUSTOMERS TABLE
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100),
    lifetime_value DECIMAL(12, 2) DEFAULT 0.00 CHECK (lifetime_value >= 0),
    retention_score INT DEFAULT 100 CHECK (retention_score >= 0 AND retention_score <= 100),
    last_purchase_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount >= 0),
    discount DECIMAL(12, 2) DEFAULT 0.00 CHECK (discount >= 0),
    tax DECIMAL(12, 2) DEFAULT 0.00 CHECK (tax >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- SALES TABLE
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
    revenue DECIMAL(12, 2) NOT NULL CHECK (revenue >= 0),
    discount DECIMAL(12, 2) DEFAULT 0.00 CHECK (discount >= 0),
    tax DECIMAL(12, 2) DEFAULT 0.00 CHECK (tax >= 0),
    profit DECIMAL(12, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- INVOICES TABLE
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE UNIQUE NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'overdue', 'paid', 'cancelled')),
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- EXPENSES TABLE
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    description TEXT,
    status VARCHAR(50) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'declined')),
    incurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- PAYMENTS TABLE
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    method VARCHAR(50) NOT NULL CHECK (method IN ('cash', 'card', 'bank_transfer', 'ach')),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- DELIVERIES TABLE
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL, -- Driver
    vehicle VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'failed')),
    distance_miles DECIMAL(6, 2) CHECK (distance_miles >= 0),
    delivery_time_mins INT CHECK (delivery_time_mins >= 0),
    customer_rating DECIMAL(2, 1) CHECK (customer_rating >= 1.0 AND customer_rating <= 5.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- MARKETING CAMPAIGNS TABLE
CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    budget DECIMAL(12, 2) NOT NULL CHECK (budget >= 0),
    clicks INT DEFAULT 0 CHECK (clicks >= 0),
    conversions INT DEFAULT 0 CHECK (conversions >= 0),
    roi DECIMAL(8, 2) DEFAULT 0.00,
    leads INT DEFAULT 0 CHECK (leads >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(50) DEFAULT 'info' CHECK (priority IN ('critical', 'warning', 'info')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- BUSINESS HEALTH INDEX TABLE
CREATE TABLE business_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE UNIQUE NOT NULL,
    overall_score INT NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    finance_score INT NOT NULL CHECK (finance_score >= 0 AND finance_score <= 100),
    sales_score INT NOT NULL CHECK (sales_score >= 0 AND sales_score <= 100),
    inventory_score INT NOT NULL CHECK (inventory_score >= 0 AND inventory_score <= 100),
    customer_score INT NOT NULL CHECK (customer_score >= 0 AND customer_score <= 100),
    employee_score INT NOT NULL CHECK (employee_score >= 0 AND employee_score <= 100),
    marketing_score INT NOT NULL CHECK (marketing_score >= 0 AND marketing_score <= 100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- SIMULATION HISTORY TABLE
CREATE TABLE simulation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    scenario VARCHAR(255) NOT NULL,
    inputs JSONB NOT NULL,
    outputs JSONB NOT NULL,
    prediction TEXT,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- FORECAST RESULTS TABLE
CREATE TABLE forecast_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    revenue_forecast JSONB NOT NULL,
    sales_forecast JSONB NOT NULL,
    inventory_forecast JSONB NOT NULL,
    customer_forecast JSONB NOT NULL,
    confidence_score DECIMAL(5, 2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- REPORTS ARCHIVES
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('weekly', 'monthly', 'executive', 'health', 'forecast', 'simulation')),
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- AI CONVERSATIONS MEMORY
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    summary TEXT,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- AI RECOMMENDATIONS TABLE
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    department VARCHAR(100) NOT NULL,
    priority VARCHAR(50) CHECK (priority IN ('critical', 'warning', 'info')),
    recommendation TEXT NOT NULL,
    reason TEXT NOT NULL,
    confidence INT CHECK (confidence >= 0 AND confidence <= 100),
    expected_impact VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ACTIVITY LOGS TABLE
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(100) NOT NULL CHECK (type IN ('login', 'simulation', 'ai_query', 'forecast_request', 'business_update')),
    action TEXT NOT NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- SETTINGS TABLE
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE UNIQUE NOT NULL,
    theme VARCHAR(50) DEFAULT 'dark',
    language VARCHAR(50) DEFAULT 'en',
    currency VARCHAR(10) DEFAULT 'USD',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. TRIGGERS SETUP
-- Set up auto-timestamp triggers on updated_at fields
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_modtime BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_modtime BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_modtime BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_modtime BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_modtime BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_modtime BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_modtime BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_modtime BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_modtime BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_modtime BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_modtime BEFORE UPDATE ON business_health FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_recs_modtime BEFORE UPDATE ON ai_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. B-TREE INDEXING
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);

-- Foreign Key Indexes for Join Optimizations
CREATE INDEX idx_departments_biz ON departments(business_id);
CREATE INDEX idx_employees_biz ON employees(business_id);
CREATE INDEX idx_suppliers_biz ON suppliers(business_id);
CREATE INDEX idx_products_biz ON products(business_id);
CREATE INDEX idx_inventory_prod ON inventory(product_id);
CREATE INDEX idx_customers_biz ON customers(business_id);
CREATE INDEX idx_orders_biz ON orders(business_id);
CREATE INDEX idx_sales_order ON sales(order_id);
CREATE INDEX idx_invoices_sale ON invoices(sale_id);
CREATE INDEX idx_expenses_biz ON expenses(business_id);
CREATE INDEX idx_payments_biz ON payments(business_id);
CREATE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_marketing_biz ON marketing_campaigns(business_id);
CREATE INDEX idx_notifications_biz ON notifications(business_id);
CREATE INDEX idx_health_biz ON business_health(business_id);
CREATE INDEX idx_simulation_biz ON simulation_history(business_id);
CREATE INDEX idx_forecast_biz ON forecast_results(business_id);
CREATE INDEX idx_reports_biz ON reports(business_id);
CREATE INDEX idx_ai_convs_biz ON ai_conversations(business_id);
CREATE INDEX idx_ai_recs_biz ON ai_recommendations(business_id);
CREATE INDEX idx_settings_biz ON settings(business_id);

-- Created at indexes for timeline queries
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_sales_created ON sales(created_at DESC);
CREATE INDEX idx_expenses_created ON expenses(created_at DESC);

-- 5. ROW LEVEL SECURITY (RLS) ACTIVATION
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR TENANT ISOLATION
-- Businesses Policy: Owners can access their business metadata
CREATE POLICY tenant_isolation_biz ON businesses FOR ALL USING (owner_id = auth.uid());

-- Helper function to fetch current user's business ids
CREATE OR REPLACE FUNCTION get_user_businesses()
RETURNS TABLE (biz_id UUID) AS $$
BEGIN
    RETURN QUERY SELECT id FROM businesses WHERE owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generic Tenant Policies based on matching business_id to owner
CREATE POLICY tenant_isolation_dept ON departments FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_emp ON employees FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_supp ON suppliers FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_prod ON products FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_cust ON customers FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_ord ON orders FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_exp ON expenses FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_pay ON payments FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_mkt ON marketing_campaigns FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_notif ON notifications FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_health ON business_health FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_sim ON simulation_history FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_fore ON forecast_results FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_rep ON reports FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_conv ON ai_conversations FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_rec ON ai_recommendations FOR ALL USING (business_id IN (SELECT get_user_businesses()));
CREATE POLICY tenant_isolation_sett ON settings FOR ALL USING (business_id IN (SELECT get_user_businesses()));

-- Indirect Policies (Joined Keys Isolation)
CREATE POLICY tenant_isolation_inv ON inventory FOR ALL USING (
    product_id IN (
        SELECT id FROM products WHERE business_id IN (SELECT get_user_businesses())
    )
);

CREATE POLICY tenant_isolation_inv_txn ON inventory_transactions FOR ALL USING (
    inventory_id IN (
        SELECT id FROM inventory WHERE product_id IN (
            SELECT id FROM products WHERE business_id IN (SELECT get_user_businesses())
        )
    )
);

CREATE POLICY tenant_isolation_sales ON sales FOR ALL USING (
    order_id IN (
        SELECT id FROM orders WHERE business_id IN (SELECT get_user_businesses())
    )
);

CREATE POLICY tenant_isolation_invc ON invoices FOR ALL USING (
    sale_id IN (
        SELECT id FROM sales WHERE order_id IN (
            SELECT id FROM orders WHERE business_id IN (SELECT get_user_businesses())
        )
    )
);

CREATE POLICY tenant_isolation_deliv ON deliveries FOR ALL USING (
    order_id IN (
        SELECT id FROM orders WHERE business_id IN (SELECT get_user_businesses())
    )
);

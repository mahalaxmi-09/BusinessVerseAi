import math
from typing import List, Dict, Any

def run_business_simulation(
    price_multiplier: float,
    marketing_budget: float,
    employees_hired: int,
    branches_open: int,
    inventory_buffer: float
) -> Dict[str, Any]:
    # Baseline constants
    BASE_UNIT_PRICE = 120.0
    BASE_UNIT_COGS = 45.0
    EMPLOYEE_MONTHLY_SALARY = 3800.0
    BRANCH_MONTHLY_OVERHEAD = 6000.0
    HOLDING_COST_PER_UNIT = 4.0
    
    # Yearly seasonal factors (simulating 12 months starting from January)
    seasonality = [0.85, 0.90, 1.00, 1.05, 1.10, 1.15, 1.05, 0.95, 1.00, 1.10, 1.25, 1.40]
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    monthly_data = []
    
    # Cumulative stats
    total_revenue = 0.0
    total_profit = 0.0
    total_orders = 0
    
    # We will simulate month-over-month. Leftover inventory carries forward.
    # Start with initial inventory
    current_inventory = 1500 * branches_open * inventory_buffer
    
    for i in range(12):
        month_name = months[i]
        season = seasonality[i]
        
        # 1. Base Demand per branch
        base_demand_units = 800 * season
        
        # 2. Price Elasticity of Demand
        # Demand drops if price_multiplier > 1.0, increases if < 1.0
        # If price multiplier is 1.0, factor is 1.0.
        # If multiplier goes to 2.0, factor drops drastically.
        price_factor = max(0.0, 2.5 - 1.5 * price_multiplier)
        if price_multiplier > 1.5:
            # Drop off even faster
            price_factor = max(0.0, price_factor - (price_multiplier - 1.5) * 2.0)
            
        # 3. Marketing Impact
        # Logarithmic return on marketing budget
        # Base marketing is assumed to be 1000.
        marketing_factor = 1.0 + 0.45 * math.log((marketing_budget / 500.0) + 1.0)
        
        # Total target demand (orders placed)
        target_demand = int(base_demand_units * price_factor * marketing_factor * branches_open)
        target_demand = max(50, target_demand)  # Keep some baseline traffic
        
        # 4. Operations & Employee Capacity
        # Each employee can handle 120 orders per month
        max_processing_capacity = employees_hired * 120
        orders_processed = min(target_demand, max_processing_capacity)
        
        # 5. Supply Chain / Inventory fulfillment
        # Order inventory restocked at start of month based on inventory buffer
        restock_target = int(target_demand * inventory_buffer)
        # Add to current stock
        current_inventory += restock_target
        
        # Orders fulfilled is limited by inventory available
        orders_fulfilled = min(orders_processed, int(current_inventory))
        
        # Deduct fulfilled inventory
        current_inventory = max(0.0, current_inventory - orders_fulfilled)
        
        # Stockout calculation
        stockouts = max(0, target_demand - orders_fulfilled)
        stockout_rate = stockouts / target_demand if target_demand > 0 else 0.0
        
        # 6. Customer Satisfaction
        # High prices and stockouts or lack of employees reduce satisfaction
        fulfillment_rate = orders_fulfilled / target_demand if target_demand > 0 else 1.0
        satisfaction_deduction = (price_multiplier - 1.0) * 20.0 + (1.0 - fulfillment_rate) * 50.0
        satisfaction = max(10, min(100, int(90 - satisfaction_deduction + (marketing_budget / 5000.0) * 5.0)))
        
        # 7. Financial Calculations
        unit_sale_price = BASE_UNIT_PRICE * price_multiplier
        revenue = orders_fulfilled * unit_sale_price
        cogs = orders_fulfilled * BASE_UNIT_COGS
        
        # Expenses
        marketing_expense = marketing_budget
        labor_expense = employees_hired * EMPLOYEE_MONTHLY_SALARY
        overhead_expense = branches_open * BRANCH_MONTHLY_OVERHEAD
        holding_expense = current_inventory * HOLDING_COST_PER_UNIT
        
        total_expenses = marketing_expense + labor_expense + overhead_expense + holding_expense
        gross_profit = revenue - cogs
        net_profit = gross_profit - total_expenses
        
        # Accruals
        total_revenue += revenue
        total_profit += net_profit
        total_orders += orders_fulfilled
        
        monthly_data.append({
            "month": month_name,
            "revenue": round(revenue, 2),
            "profit": round(net_profit, 2),
            "expenses": round(total_expenses, 2),
            "inventory": int(current_inventory),
            "orders": orders_fulfilled,
            "customers": int(target_demand * 1.25),  # Traffic count
            "satisfaction": satisfaction,
            "stockouts": stockouts
        })
        
    return {
        "monthlyData": monthly_data,
        "summary": {
            "totalRevenue": round(total_revenue, 2),
            "totalProfit": round(total_profit, 2),
            "avgSatisfaction": round(sum(d["satisfaction"] for d in monthly_data) / 12, 1),
            "totalOrders": total_orders,
            "endingInventory": int(current_inventory)
        }
    }

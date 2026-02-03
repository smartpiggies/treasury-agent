#!/bin/bash
# Treasury Ops Bot - Appwrite Database Setup Script
# This script creates the database, tables, columns, and indexes for the Treasury Ops Bot
#
# IMPORTANT NOTES:
# 1. Default Values: Appwrite doesn't allow defaults on required columns.
#    Fields with defaults are created as optional - the default is applied automatically.
#
# 2. Permissions: Using simplified POC permissions (any/users).
#    Original schema specified team-based permissions (team:operators/team:admins).
#    To use team-based permissions, change PERMISSIONS below and create the teams first.

set -e  # Exit on first error

echo "========================================"
echo "Treasury Ops Bot - Appwrite Database Setup"
echo "========================================"
echo ""

# Database configuration
DB_ID="treasury"
DB_NAME="Treasury Database"

# Permissions configuration
# Model: Read-only dashboard, API key (n8n) for writes
#
# How it works:
# - read("any"): Dashboard can read all data without authentication
# - create/update/delete("users"): Requires authentication
#   - Dashboard users (not logged in): Can only READ
#   - API keys (n8n): Bypass collection permissions, can read/write everything
#   - This effectively makes the database read-only for dashboard, writable only via API key
#
PERM_READ='read("any")'
PERM_CREATE='create("users")'
PERM_UPDATE='update("users")'
PERM_DELETE='delete("users")'

# For team-based permissions (requires creating teams first in Appwrite Console):
# PERM_READ='read("any")'
# PERM_CREATE='create("team:operators")'
# PERM_UPDATE='update("team:operators")'
# PERM_DELETE='delete("team:admins")'

# Helper function to run appwrite commands
run_appwrite() {
    npx appwrite "$@"
}

# =============================================================================
# Step 1: Create Database
# =============================================================================
echo "Step 1: Creating database '$DB_ID'..."
run_appwrite tables-db create \
    --database-id "$DB_ID" \
    --name "$DB_NAME"
echo "✓ Database created"
echo ""

# =============================================================================
# Step 2: Create Tables
# =============================================================================
echo "Step 2: Creating tables..."

# Table: price_history
echo "  Creating table 'price_history'..."
run_appwrite tables-db create-table \
    --database-id "$DB_ID" \
    --table-id "price_history" \
    --name "Price History" \
    --permissions "$PERM_READ" "$PERM_CREATE" "$PERM_UPDATE" "$PERM_DELETE"
echo "  ✓ price_history created"

# Table: executions
echo "  Creating table 'executions'..."
run_appwrite tables-db create-table \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --name "Executions" \
    --permissions "$PERM_READ" "$PERM_CREATE" "$PERM_UPDATE" "$PERM_DELETE"
echo "  ✓ executions created"

# Table: alerts
echo "  Creating table 'alerts'..."
run_appwrite tables-db create-table \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --name "Alerts" \
    --permissions "$PERM_READ" "$PERM_CREATE" "$PERM_UPDATE" "$PERM_DELETE"
echo "  ✓ alerts created"

# Table: balances
echo "  Creating table 'balances'..."
run_appwrite tables-db create-table \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --name "Balances" \
    --permissions "$PERM_READ" "$PERM_CREATE" "$PERM_UPDATE" "$PERM_DELETE"
echo "  ✓ balances created"

echo ""

# =============================================================================
# Step 3: Create Columns for price_history
# =============================================================================
echo "Step 3: Creating columns for 'price_history'..."

run_appwrite tables-db create-datetime-column \
    --database-id "$DB_ID" \
    --table-id "price_history" \
    --key "timestamp" \
    --required true
echo "  ✓ timestamp (datetime, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "price_history" \
    --key "token" \
    --size 10 \
    --required true
echo "  ✓ token (string, required)"

run_appwrite tables-db create-float-column \
    --database-id "$DB_ID" \
    --table-id "price_history" \
    --key "price_usd" \
    --required true
echo "  ✓ price_usd (float, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "price_history" \
    --key "source" \
    --size 50 \
    --required true
echo "  ✓ source (string, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "price_history" \
    --key "chain" \
    --size 20 \
    --required false \
    --xdefault "ethereum"
echo "  ✓ chain (string, optional, default: ethereum)"

echo ""

# =============================================================================
# Step 4: Create Columns for executions
# =============================================================================
echo "Step 4: Creating columns for 'executions'..."

run_appwrite tables-db create-datetime-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "timestamp" \
    --required true
echo "  ✓ timestamp (datetime, required)"

run_appwrite tables-db create-enum-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "type" \
    --elements "swap" "rebalance" "transfer" \
    --required true
echo "  ✓ type (enum, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "source_chain" \
    --size 20 \
    --required true
echo "  ✓ source_chain (string, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "dest_chain" \
    --size 20 \
    --required true
echo "  ✓ dest_chain (string, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "source_token" \
    --size 10 \
    --required true
echo "  ✓ source_token (string, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "dest_token" \
    --size 10 \
    --required true
echo "  ✓ dest_token (string, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "amount" \
    --size 50 \
    --required true
echo "  ✓ amount (string, required)"

run_appwrite tables-db create-float-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "amount_usd" \
    --required false
echo "  ✓ amount_usd (float, optional)"

# Note: Appwrite doesn't allow default values on required columns
# Making this non-required with a default - application logic should ensure it's always set
run_appwrite tables-db create-enum-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "status" \
    --elements "pending" "awaiting_confirmation" "confirmed" "executing" "completed" "failed" "cancelled" \
    --required false \
    --xdefault "pending"
echo "  ✓ status (enum, default: pending)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "tx_hash" \
    --size 100 \
    --required false
echo "  ✓ tx_hash (string, optional)"

run_appwrite tables-db create-enum-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "route" \
    --elements "uniswap" "lifi" "circle" \
    --required false
echo "  ✓ route (enum, optional)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "requester" \
    --size 100 \
    --required false
echo "  ✓ requester (string, optional)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "approver" \
    --size 100 \
    --required false
echo "  ✓ approver (string, optional)"

run_appwrite tables-db create-datetime-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "approved_at" \
    --required false
echo "  ✓ approved_at (datetime, optional)"

run_appwrite tables-db create-datetime-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "completed_at" \
    --required false
echo "  ✓ completed_at (datetime, optional)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "error" \
    --size 500 \
    --required false
echo "  ✓ error (string, optional)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "gas_used" \
    --size 50 \
    --required false
echo "  ✓ gas_used (string, optional)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "gas_price" \
    --size 50 \
    --required false
echo "  ✓ gas_price (string, optional)"

run_appwrite tables-db create-float-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "slippage" \
    --required false
echo "  ✓ slippage (float, optional)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "reason" \
    --size 200 \
    --required false
echo "  ✓ reason (string, optional)"

echo ""

# =============================================================================
# Step 5: Create Columns for alerts
# =============================================================================
echo "Step 5: Creating columns for 'alerts'..."

run_appwrite tables-db create-datetime-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "timestamp" \
    --required true
echo "  ✓ timestamp (datetime, required)"

run_appwrite tables-db create-enum-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "type" \
    --elements "price_high" "price_low" "execution_failed" "limit_reached" "system_error" \
    --required true
echo "  ✓ type (enum, required)"

# Note: Appwrite doesn't allow default values on required columns
run_appwrite tables-db create-enum-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "severity" \
    --elements "info" "warning" "critical" \
    --required false \
    --xdefault "warning"
echo "  ✓ severity (enum, default: warning)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "message" \
    --size 500 \
    --required true
echo "  ✓ message (string, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "token" \
    --size 10 \
    --required false
echo "  ✓ token (string, optional)"

run_appwrite tables-db create-float-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "threshold" \
    --required false
echo "  ✓ threshold (float, optional)"

run_appwrite tables-db create-float-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "actual_value" \
    --required false
echo "  ✓ actual_value (float, optional)"

# Note: Appwrite doesn't allow default values on required columns
run_appwrite tables-db create-boolean-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "acknowledged" \
    --required false \
    --xdefault false
echo "  ✓ acknowledged (boolean, default: false)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "acknowledged_by" \
    --size 100 \
    --required false
echo "  ✓ acknowledged_by (string, optional)"

run_appwrite tables-db create-datetime-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "acknowledged_at" \
    --required false
echo "  ✓ acknowledged_at (datetime, optional)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "related_execution" \
    --size 50 \
    --required false
echo "  ✓ related_execution (string, optional)"

echo ""

# =============================================================================
# Step 6: Create Columns for balances
# =============================================================================
echo "Step 6: Creating columns for 'balances'..."

run_appwrite tables-db create-datetime-column \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --key "timestamp" \
    --required true
echo "  ✓ timestamp (datetime, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --key "chain" \
    --size 20 \
    --required true
echo "  ✓ chain (string, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --key "token" \
    --size 10 \
    --required true
echo "  ✓ token (string, required)"

run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --key "balance" \
    --size 50 \
    --required true
echo "  ✓ balance (string, required)"

run_appwrite tables-db create-float-column \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --key "balance_usd" \
    --required false
echo "  ✓ balance_usd (float, optional)"

# Note: Appwrite doesn't allow default values on required columns
run_appwrite tables-db create-string-column \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --key "source" \
    --size 50 \
    --required false \
    --xdefault "circle"
echo "  ✓ source (string, default: circle)"

echo ""

# =============================================================================
# Step 7: Create Indexes
# =============================================================================
echo "Step 7: Creating indexes..."

# Indexes for price_history
echo "  Creating indexes for 'price_history'..."
run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "price_history" \
    --key "idx_token_timestamp" \
    --type "key" \
    --columns "token" "timestamp" \
    --orders "ASC" "DESC"
echo "  ✓ idx_token_timestamp (token ASC, timestamp DESC)"

run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "price_history" \
    --key "idx_timestamp" \
    --type "key" \
    --columns "timestamp" \
    --orders "DESC"
echo "  ✓ idx_timestamp (timestamp DESC)"

# Indexes for executions
echo "  Creating indexes for 'executions'..."
run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "idx_status" \
    --type "key" \
    --columns "status" \
    --orders "ASC"
echo "  ✓ idx_status (status ASC)"

run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "idx_timestamp" \
    --type "key" \
    --columns "timestamp" \
    --orders "DESC"
echo "  ✓ idx_timestamp (timestamp DESC)"

run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "executions" \
    --key "idx_type_status" \
    --type "key" \
    --columns "type" "status" \
    --orders "ASC" "ASC"
echo "  ✓ idx_type_status (type ASC, status ASC)"

# Indexes for alerts
echo "  Creating indexes for 'alerts'..."
run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "idx_acknowledged" \
    --type "key" \
    --columns "acknowledged" \
    --orders "ASC"
echo "  ✓ idx_acknowledged (acknowledged ASC)"

run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "idx_type_timestamp" \
    --type "key" \
    --columns "type" "timestamp" \
    --orders "ASC" "DESC"
echo "  ✓ idx_type_timestamp (type ASC, timestamp DESC)"

run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "alerts" \
    --key "idx_severity" \
    --type "key" \
    --columns "severity" "acknowledged" \
    --orders "ASC" "ASC"
echo "  ✓ idx_severity (severity ASC, acknowledged ASC)"

# Indexes for balances
echo "  Creating indexes for 'balances'..."
run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --key "idx_chain_token" \
    --type "key" \
    --columns "chain" "token" \
    --orders "ASC" "ASC"
echo "  ✓ idx_chain_token (chain ASC, token ASC)"

run_appwrite tables-db create-index \
    --database-id "$DB_ID" \
    --table-id "balances" \
    --key "idx_timestamp" \
    --type "key" \
    --columns "timestamp" \
    --orders "DESC"
echo "  ✓ idx_timestamp (timestamp DESC)"

echo ""
echo "========================================"
echo "Database setup completed successfully!"
echo "========================================"
echo ""
echo "Summary:"
echo "  - Database: $DB_ID ($DB_NAME)"
echo "  - Tables: price_history (5 cols), executions (20 cols), alerts (11 cols), balances (6 cols)"
echo "  - Total: 4 tables, 42 columns, 10 indexes"
echo ""
echo "Permissions applied:"
echo "  - Read: $PERM_READ"
echo "  - Create: $PERM_CREATE"
echo "  - Update: $PERM_UPDATE"
echo "  - Delete: $PERM_DELETE"
echo ""
echo "Note: Fields with defaults (status, severity, acknowledged, chain, source) are"
echo "      created as optional due to Appwrite constraint. Defaults are applied automatically."
echo ""
echo "Next steps:"
echo "  1. Update dashboard/.env.local with VITE_APPWRITE_DATABASE_ID=$DB_ID"
echo "  2. Configure n8n workflows with the database ID"
echo "  3. Create an API key in Appwrite Console for n8n access"
echo ""

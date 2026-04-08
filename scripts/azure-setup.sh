#!/bin/bash
# ============================================================
# Doctors Office — Azure Deployment Script
# Run this on your LOCAL machine after: az login
# ============================================================
set -e

# ---- Configuration ----
RESOURCE_GROUP="doctorsoffice-rg"
LOCATION="centralindia"           # Closest to Indian users
APP_SERVICE_PLAN="doctorsoffice-plan"
FRONTEND_APP="doctorsoffice-client"
BACKEND_APP="doctorsoffice-api"
COSMOS_ACCOUNT="doctorsoffice-db"
REDIS_NAME="doctorsoffice-cache"
SKU="F1"                          # Free tier

echo "============================================"
echo "  Doctors Office — Azure Deployment"
echo "============================================"
echo ""

# ---- Step 1: Login (if not already) ----
echo "[1/8] Checking Azure login..."
az account show > /dev/null 2>&1 || az login
echo "  ✓ Logged in as: $(az account show --query user.name -o tsv)"
echo ""

# ---- Step 2: Create Resource Group ----
echo "[2/8] Creating resource group: $RESOURCE_GROUP in $LOCATION..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none
echo "  ✓ Resource group ready"
echo ""

# ---- Step 3: Create App Service Plan (Free Tier) ----
echo "[3/8] Creating App Service Plan (Free F1)..."
az appservice plan create \
  --name "$APP_SERVICE_PLAN" \
  --resource-group "$RESOURCE_GROUP" \
  --sku "$SKU" \
  --is-linux \
  --output none
echo "  ✓ App Service Plan ready"
echo ""

# ---- Step 4: Create Backend Web App (Node.js) ----
echo "[4/8] Creating backend app: $BACKEND_APP..."
az webapp create \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --plan "$APP_SERVICE_PLAN" \
  --runtime "NODE:22-lts" \
  --output none
echo "  ✓ Backend app created: https://$BACKEND_APP.azurewebsites.net"
echo ""

# ---- Step 5: Create Frontend Web App (Static) ----
echo "[5/8] Creating frontend app: $FRONTEND_APP..."
az webapp create \
  --name "$FRONTEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --plan "$APP_SERVICE_PLAN" \
  --runtime "NODE:22-lts" \
  --output none
echo "  ✓ Frontend app created: https://$FRONTEND_APP.azurewebsites.net"
echo ""

# ---- Step 6: Create Azure Cosmos DB for MongoDB (Free Tier) ----
echo "[6/8] Creating Cosmos DB (MongoDB API, Free Tier)..."
echo "  ⚠ This takes 3-5 minutes..."
az cosmosdb create \
  --name "$COSMOS_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --kind MongoDB \
  --server-version "7.0" \
  --enable-free-tier true \
  --default-consistency-level Session \
  --locations regionName="$LOCATION" failoverPriority=0 \
  --output none
echo "  ✓ Cosmos DB ready"

# Create database
az cosmosdb mongodb database create \
  --account-name "$COSMOS_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --name "doctorsoffice" \
  --output none
echo "  ✓ Database 'doctorsoffice' created"
echo ""

# ---- Step 7: Create Azure Cache for Redis (Basic C0) ----
echo "[7/8] Creating Redis Cache (Basic C0)..."
echo "  ⚠ This takes 10-15 minutes..."
az redis create \
  --name "$REDIS_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku Basic \
  --vm-size c0 \
  --output none
echo "  ✓ Redis Cache ready"
echo ""

# ---- Step 8: Configure Backend App Settings ----
echo "[8/8] Configuring backend environment variables..."

# Get Cosmos DB connection string
MONGODB_URI=$(az cosmosdb keys list \
  --name "$COSMOS_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --type connection-strings \
  --query "connectionStrings[0].connectionString" -o tsv)

# Get Redis connection string
REDIS_KEY=$(az redis list-keys \
  --name "$REDIS_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query primaryKey -o tsv)
REDIS_HOST="$REDIS_NAME.redis.cache.windows.net"
REDIS_URL="rediss://:$REDIS_KEY@$REDIS_HOST:6380"

# Generate a random JWT secret
JWT_SECRET=$(openssl rand -base64 32)

az webapp config appsettings set \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --settings \
    MONGODB_URI="$MONGODB_URI" \
    REDIS_URL="$REDIS_URL" \
    JWT_SECRET="$JWT_SECRET" \
    NODE_ENV="production" \
    PORT="8080" \
    OTP_EXPIRY="300" \
  --output none

echo "  ✓ Backend environment configured"
echo ""

echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo ""
echo "  Frontend: https://$FRONTEND_APP.azurewebsites.net"
echo "  Backend:  https://$BACKEND_APP.azurewebsites.net"
echo ""
echo "  Next steps:"
echo "  1. Deploy backend:  cd server && zip -r ../server.zip . && az webapp deploy --name $BACKEND_APP --resource-group $RESOURCE_GROUP --src-path ../server.zip --type zip"
echo "  2. Deploy frontend: cd client && ng build && cd dist/client/browser && zip -r ../../../client.zip . && az webapp deploy --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --src-path ../../../client.zip --type zip"
echo ""
echo "  Or use the deploy-apps.sh script for app deployment."
echo "============================================"

#!/bin/bash
# ============================================================
# Doctors Office — Azure Setup Script
# Uses existing MongoDB Atlas cluster (no Cosmos DB needed)
# Run this on your LOCAL machine after: az login
# ============================================================
set -e

# ---- Configuration ----
RESOURCE_GROUP="doctorsoffice-rg"
LOCATION="centralindia"
APP_SERVICE_PLAN="doctorsoffice-plan"
FRONTEND_APP="doctorsoffice-client"
BACKEND_APP="doctorsoffice-api"
SKU="F1"                          # Free tier

# MongoDB Atlas connection (user's existing cluster)
MONGODB_URI="mongodb+srv://jones:admin123@doctorsofficedevcluster.uzuyzqy.mongodb.net/doctorsoffice?retryWrites=true&w=majority&appName=DoctorsOfficeDevCluster"

echo "============================================"
echo "  Doctors Office — Azure Setup"
echo "============================================"
echo ""

# ---- Step 1: Login check ----
echo "[1/5] Checking Azure login..."
az account show > /dev/null 2>&1 || az login
echo "  ✓ Logged in as: $(az account show --query user.name -o tsv)"
echo ""

# ---- Step 2: Create Resource Group ----
echo "[2/5] Creating resource group: $RESOURCE_GROUP in $LOCATION..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none
echo "  ✓ Resource group ready"
echo ""

# ---- Step 3: Create App Service Plan (Free Tier) ----
echo "[3/5] Creating App Service Plan (Free F1)..."
az appservice plan create \
  --name "$APP_SERVICE_PLAN" \
  --resource-group "$RESOURCE_GROUP" \
  --sku "$SKU" \
  --is-linux \
  --output none
echo "  ✓ App Service Plan ready"
echo ""

# ---- Step 4: Create Web Apps ----
echo "[4/5] Creating web apps..."

# Backend
az webapp create \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --plan "$APP_SERVICE_PLAN" \
  --runtime "NODE:22-lts" \
  --output none 2>/dev/null
echo "  ✓ Backend: https://$BACKEND_APP.azurewebsites.net"

# Frontend
az webapp create \
  --name "$FRONTEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --plan "$APP_SERVICE_PLAN" \
  --runtime "NODE:22-lts" \
  --output none 2>/dev/null
echo "  ✓ Frontend: https://$FRONTEND_APP.azurewebsites.net"
echo ""

# ---- Step 5: Configure Backend Environment ----
echo "[5/5] Configuring backend environment..."

JWT_SECRET=$(openssl rand -base64 32)

az webapp config appsettings set \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --settings \
    MONGODB_URI="$MONGODB_URI" \
    REDIS_URL="" \
    JWT_SECRET="$JWT_SECRET" \
    NODE_ENV="production" \
    PORT="8080" \
    OTP_EXPIRY="300" \
  --output none

echo "  ✓ Backend configured with MongoDB Atlas"
echo ""

echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "  Resources created:"
echo "    Resource Group : $RESOURCE_GROUP"
echo "    App Plan       : $APP_SERVICE_PLAN (Free F1)"
echo "    Backend App    : https://$BACKEND_APP.azurewebsites.net"
echo "    Frontend App   : https://$FRONTEND_APP.azurewebsites.net"
echo "    Database       : MongoDB Atlas (existing cluster)"
echo ""
echo "  Next: run ./scripts/deploy-apps.sh"
echo "============================================"

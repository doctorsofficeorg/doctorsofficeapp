#!/bin/bash
# ============================================================
# Doctors Office — Deploy Apps to Azure
# Run this AFTER azure-setup.sh has completed
# ============================================================
set -e

RESOURCE_GROUP="doctorsoffice-rg"
FRONTEND_APP="doctorsoffice-client"
BACKEND_APP="doctorsoffice-api"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "============================================"
echo "  Deploying Doctors Office to Azure"
echo "============================================"
echo ""

# ---- Deploy Backend ----
echo "[1/2] Building & deploying backend..."
cd "$ROOT_DIR/server"
npm install --production
npm run build

# Create deployment package
cd dist
cp ../package.json ../package-lock.json .
zip -r "$ROOT_DIR/server-deploy.zip" . > /dev/null
cd "$ROOT_DIR"

# Configure startup command
az webapp config set \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --startup-file "node index.js" \
  --output none

az webapp deploy \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --src-path "server-deploy.zip" \
  --type zip \
  --output none

rm -f server-deploy.zip
echo "  ✓ Backend deployed: https://$BACKEND_APP.azurewebsites.net"
echo ""

# ---- Deploy Frontend ----
echo "[2/2] Building & deploying frontend..."
cd "$ROOT_DIR/client"

# Update API URL to point to backend app
# The Angular build will use environment.ts (production)
# Make sure it points to the Azure backend
cat > src/environments/environment.ts << ENVEOF
export const environment = {
  production: true,
  apiUrl: 'https://$BACKEND_APP.azurewebsites.net/api',
  yjsWsUrl: 'wss://$BACKEND_APP.azurewebsites.net/yjs',
  clarityProjectId: '',
};
ENVEOF

npx ng build --configuration production

# Create a simple Node.js server to serve the Angular app
cd dist/client/browser
cat > server.js << 'SERVEREOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname));

// All routes fall back to index.html (Angular SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend serving on port ${PORT}`);
});
SERVEREOF

cat > package.json << 'PKGEOF'
{
  "name": "doctorsoffice-frontend",
  "version": "1.0.0",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^5.1.0" }
}
PKGEOF

zip -r "$ROOT_DIR/client-deploy.zip" . > /dev/null
cd "$ROOT_DIR"

az webapp config set \
  --name "$FRONTEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --startup-file "node server.js" \
  --output none

az webapp deploy \
  --name "$FRONTEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --src-path "client-deploy.zip" \
  --type zip \
  --output none

rm -f client-deploy.zip
echo "  ✓ Frontend deployed: https://$FRONTEND_APP.azurewebsites.net"
echo ""

# ---- Configure CORS ----
echo "Configuring CORS on backend..."
az webapp cors add \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --allowed-origins "https://$FRONTEND_APP.azurewebsites.net" \
  --output none
echo "  ✓ CORS configured"
echo ""

echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo ""
echo "  Frontend: https://$FRONTEND_APP.azurewebsites.net"
echo "  Backend:  https://$BACKEND_APP.azurewebsites.net/api/health"
echo "============================================"

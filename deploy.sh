#!/bin/bash

# === CONFIGURATION ===
LOCAL_BUILD_DIR="build"
ZIP_NAME="build.zip"
REMOTE_USER="root"
REMOTE_HOST="187.127.149.169"
REMOTE_DIR="/root/nodeprojects/relayNrelax"
PASSWORD="Whatthefq101@#"
PM2_ID=6

# === BUILD PROJECT ===
echo "🛠️ Running npm run build..."
npm run build || { echo "❌ Build failed. Aborting deployment."; exit 1; }

# === LOCAL STEPS ===
echo "👉 Checking if zip is installed..."
if ! command -v zip &> /dev/null; then
    echo "❌ zip not found. Install it using: sudo apt install zip"
    exit 1
fi

echo "👉 Ensuring server host key is trusted..."
ssh-keyscan -H $REMOTE_HOST >> ~/.ssh/known_hosts 2>/dev/null

echo "📦 Zipping $LOCAL_BUILD_DIR into $ZIP_NAME..."
rm -f $ZIP_NAME
zip -r $ZIP_NAME $LOCAL_BUILD_DIR > /dev/null

echo "📤 Copying $ZIP_NAME to server..."
sshpass -p "$PASSWORD" scp $ZIP_NAME ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/ || {
  echo "❌ Failed to upload zip. Aborting."
  exit 1
}

# === REMOTE DEPLOYMENT ===
echo "🚀 Deploying on remote server..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} << 'EOF'
echo "📂 Moving to project directory..."
cd /root/nodeprojects/relayNrelax || { echo "❌ Directory not found!"; exit 1; }

echo "🧹 Cleaning old build..."
rm -rf build

echo "📥 Unzipping build.zip..."
unzip -o build.zip > /dev/null || { echo "❌ Unzip failed."; exit 1; }

echo "🗑️ Cleaning up build.zip..."
rm -f build.zip

echo "🔄 Restarting PM2 process..."
# Load environment in case pm2 is not in PATH
if ! command -v pm2 &> /dev/null; then
    echo "ℹ️ pm2 not in PATH, attempting to load NVM and retry..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

if command -v pm2 &> /dev/null; then
    pm2 restart 4 || echo "⚠️ PM2 restart failed. Check process ID or app status."
else
    echo "❌ pm2 still not found. Make sure it's installed and available in PATH."
fi

echo "✅ Deployment complete."
EOF

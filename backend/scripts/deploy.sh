#!/bin/bash
# Trishul Deployment Script

echo "🔱 Starting Trishul Platform Deployment..."

# Build Backend
echo "Building Backend..."
cd backend
npm install
npm run build
npx prisma generate
npx prisma migrate deploy

# Frontend instructions
echo "Frontend should be deployed to Vercel/EAS independently."

echo "✅ Deployment Process Complete"

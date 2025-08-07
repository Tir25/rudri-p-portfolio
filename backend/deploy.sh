#!/bin/bash
# Production Deployment Script

echo "🚀 Starting production deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Production environment file not found"
    echo "Run: node setup-production.js"
    exit 1
fi

# Copy production env to .env
cp .env.production .env

# Install dependencies
npm install --production

# Run database migrations
npm run migrate

# Start the server
npm start

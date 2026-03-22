#!/bin/bash
# ============================================
# Doctors Office — Repository Setup Script
# ============================================
# Run this from the extracted ZIP folder:
#   chmod +x setup.sh && ./setup.sh
# ============================================

echo "🏥 Setting up Doctors Office repository..."

# Initialize git if not already
if [ ! -d ".git" ]; then
  git init
  git branch -m main
fi

# Set remote (update URL if using org repo)
git remote remove origin 2>/dev/null
git remote add origin https://github.com/jonesprabu/doctorsofficeapp.git

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy env template
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "📝 Created .env.local — update with your Supabase credentials"
fi

# Stage and commit all files
echo "📝 Creating initial commit..."
git add -A
git commit -m "chore: initialize Doctors Office MVP

- Next.js 15 with App Router, TypeScript, Tailwind CSS 4
- Pearl Design System (enterprise healthcare UI)
- Supabase Pro configuration (Mumbai region)
- UI Components: Button, Input, Badge, Card, Avatar
- Layout: Collapsible sidebar, Header with notifications
- Pages: Landing, Login, Dashboard, Patients, Appointments,
  Prescriptions, Billing, Settings
- Auth middleware with route protection
- TypeScript types for all domain entities
- Utility functions for Indian locale (INR, dates, phone)"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ Done! Your repository is ready at:"
echo "   https://github.com/jonesprabu/doctorsofficeapp"
echo ""
echo "Next steps:"
echo "   1. Update .env.local with your Supabase credentials"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Open http://localhost:3000"

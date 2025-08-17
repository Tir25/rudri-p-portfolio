@echo off
echo ========================================
echo 🚀 Rudri P Portfolio Deployment Script
echo ========================================
echo.

echo 📋 Step 1: Testing build...
cd my-react-app
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)
echo ✅ Build successful!

echo.
echo 📋 Step 2: Testing development server...
echo Starting dev server on http://localhost:5173
echo Press Ctrl+C to stop the server when done testing
echo.
npm run dev

echo.
echo ========================================
echo 🎉 Ready for deployment!
echo ========================================
echo.
echo Next steps:
echo 1. Create .env.local file (see DEPLOYMENT_SCRIPT.md)
echo 2. Set up Supabase database (see DEPLOYMENT_SCRIPT.md)
echo 3. Deploy to Vercel/Netlify (see DEPLOYMENT_SCRIPT.md)
echo.
pause

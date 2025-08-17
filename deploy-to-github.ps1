# PowerShell script to deploy to GitHub
Write-Host "🚀 Deploying to GitHub..." -ForegroundColor Green

# Check if git remote exists
$remoteExists = git remote -v 2>$null
if ($remoteExists) {
    Write-Host "Git remote already exists:" -ForegroundColor Yellow
    git remote -v
} else {
    Write-Host "No git remote found. You need to add your GitHub repository." -ForegroundColor Red
    Write-Host "Run this command with your GitHub repo URL:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/yourusername/rudri-p-portfolio.git" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Replace 'yourusername' with your actual GitHub username" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Green
Write-Host "1. Add your GitHub remote (if not already done)" -ForegroundColor White
Write-Host "2. Push to GitHub: git push -u origin main" -ForegroundColor White
Write-Host "3. Deploy on Vercel: https://vercel.com" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Quick commands:" -ForegroundColor Cyan
Write-Host "git remote add origin https://github.com/yourusername/rudri-p-portfolio.git" -ForegroundColor Yellow
Write-Host "git push -u origin main" -ForegroundColor Yellow

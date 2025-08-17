# PowerShell script to create .env.local file
$envContent = @"
# Supabase Configuration
VITE_SUPABASE_URL=https://nfhaaidiyxlbkuhcvjlw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5maGFhaWRpeXhsYmt1aGN2amx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MDI3MTksImV4cCI6MjA3MDk3ODcxOX0.oCmjv6z6ayfy5G1iNkKLaVBd2IWqI91bmTCh5-2njfk

# Application Configuration
VITE_APP_NAME=Rudri Dave Portfolio
VITE_APP_DESCRIPTION=Personal website and research papers
VITE_OWNER_EMAIL=rudridave1998@gmail.com

# Feature Flags
VITE_ENABLE_BLOG=true
VITE_ENABLE_PAPERS=true
VITE_ENABLE_ADMIN=true

# Contact Information
VITE_CONTACT_EMAIL=rudridave1998@gmail.com

# Social Media
VITE_TWITTER_HANDLE=@rudridave
VITE_GITHUB_URL=https://github.com/rudridave
VITE_LINKEDIN_URL=https://linkedin.com/in/rudridave

# Development
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
"@

# Create the .env.local file in my-react-app directory
$envContent | Out-File -FilePath "my-react-app\.env.local" -Encoding UTF8

Write-Host "Environment file created successfully!" -ForegroundColor Green
Write-Host "Location: my-react-app\.env.local" -ForegroundColor Yellow

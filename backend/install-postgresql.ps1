# PostgreSQL Installation and Setup Script for Rudri's Project
# This script helps you install PostgreSQL and set up the required database

# Configuration
$pgVersion = "16.1"
$pgPort = 5432
$pgUser = "postgres"
$pgPassword = "postgres" # You should change this to a secure password
$pgDatabase = "rudri_db"
$downloadDir = "$env:USERPROFILE\Downloads"
$installerUrl = "https://get.enterprisedb.com/postgresql/postgresql-$pgVersion-1-windows-x64.exe"
$installerPath = "$downloadDir\postgresql-$pgVersion-1-windows-x64.exe"

# Function to check if PostgreSQL is already installed
function Test-PostgreSQLInstalled {
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    return ($pgService -ne $null)
}

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Function to download PostgreSQL installer
function Download-PostgreSQL {
    Write-Host "Downloading PostgreSQL $pgVersion installer..." -ForegroundColor Cyan
    
    try {
        # Create downloads directory if it doesn't exist
        if (-not (Test-Path $downloadDir)) {
            New-Item -ItemType Directory -Path $downloadDir | Out-Null
        }
        
        # Download the installer
        Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
        
        Write-Host "Download completed: $installerPath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Error downloading PostgreSQL installer: $_" -ForegroundColor Red
        Write-Host "Please download PostgreSQL manually from: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads" -ForegroundColor Yellow
        return $false
    }
}

# Function to install PostgreSQL
function Install-PostgreSQL {
    Write-Host "Installing PostgreSQL $pgVersion..." -ForegroundColor Cyan
    
    if (-not (Test-Path $installerPath)) {
        Write-Host "Installer not found at: $installerPath" -ForegroundColor Red
        return $false
    }
    
    Write-Host "Installation Instructions:" -ForegroundColor Yellow
    Write-Host "1. When the installer opens, follow the wizard" -ForegroundColor Yellow
    Write-Host "2. Use '$pgPassword' as the superuser password when prompted" -ForegroundColor Yellow
    Write-Host "3. Keep the default port as $pgPort" -ForegroundColor Yellow
    Write-Host "4. Complete the installation process" -ForegroundColor Yellow
    
    # Start the installer
    Start-Process -FilePath $installerPath -Wait
    
    # Check if installation was successful
    if (Test-PostgreSQLInstalled) {
        Write-Host "PostgreSQL installation completed successfully!" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "PostgreSQL installation may not have completed successfully." -ForegroundColor Red
        return $false
    }
}

# Function to add PostgreSQL to PATH
function Add-PostgreSQLToPath {
    Write-Host "Adding PostgreSQL to PATH..." -ForegroundColor Cyan
    
    # Find PostgreSQL installation path
    $pgPath = "C:\Program Files\PostgreSQL\$pgVersion\bin"
    
    if (-not (Test-Path $pgPath)) {
        # Try to find PostgreSQL installation directory
        $pgInstallDir = Get-ChildItem "C:\Program Files\PostgreSQL" -ErrorAction SilentlyContinue | 
                        Sort-Object -Property Name -Descending | 
                        Select-Object -First 1 -ExpandProperty FullName
        
        if ($pgInstallDir) {
            $pgPath = Join-Path $pgInstallDir "bin"
        }
        else {
            Write-Host "PostgreSQL bin directory not found. Please add it to PATH manually." -ForegroundColor Red
            Write-Host "Typically it's located at: C:\Program Files\PostgreSQL\<version>\bin" -ForegroundColor Yellow
            return $false
        }
    }
    
    # Add to PATH if not already there
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if (-not $currentPath.Contains($pgPath)) {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$pgPath", "User")
        Write-Host "Added PostgreSQL bin directory to PATH: $pgPath" -ForegroundColor Green
        
        # Update current session PATH
        $env:Path = "$env:Path;$pgPath"
    }
    else {
        Write-Host "PostgreSQL bin directory is already in PATH" -ForegroundColor Green
    }
    
    return $true
}

# Function to create database
function Create-Database {
    Write-Host "Creating database '$pgDatabase'..." -ForegroundColor Cyan
    
    try {
        # Check if psql is available
        if (-not (Test-CommandExists "psql")) {
            Write-Host "psql command not found. Make sure PostgreSQL is installed and in your PATH." -ForegroundColor Red
            return $false
        }
        
        # Check if the database already exists
        $checkDbCmd = "psql -U $pgUser -c `"SELECT 1 FROM pg_database WHERE datname = '$pgDatabase'`" postgres"
        $dbExists = Invoke-Expression $checkDbCmd
        
        if ($dbExists -like "*1 row*") {
            Write-Host "Database '$pgDatabase' already exists" -ForegroundColor Green
        }
        else {
            # Create the database
            $createDbCmd = "psql -U $pgUser -c `"CREATE DATABASE $pgDatabase`" postgres"
            Invoke-Expression $createDbCmd
            Write-Host "Database '$pgDatabase' created successfully" -ForegroundColor Green
        }
        
        return $true
    }
    catch {
        Write-Host "Error creating database: $_" -ForegroundColor Red
        return $false
    }
}

# Function to test database connection
function Test-DatabaseConnection {
    Write-Host "Testing connection to database '$pgDatabase'..." -ForegroundColor Cyan
    
    try {
        # Test connection
        $testCmd = "psql -U $pgUser -c `"SELECT version()`" $pgDatabase"
        $result = Invoke-Expression $testCmd
        
        if ($result -like "*PostgreSQL*") {
            Write-Host "Successfully connected to PostgreSQL database '$pgDatabase'" -ForegroundColor Green
            Write-Host "PostgreSQL version: $result" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "Failed to connect to database" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "Error testing database connection: $_" -ForegroundColor Red
        return $false
    }
}

# Main installation process
Write-Host "PostgreSQL Installation and Setup for Rudri's Project" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Check if PostgreSQL is already installed
if (Test-PostgreSQLInstalled) {
    Write-Host "PostgreSQL is already installed on this system" -ForegroundColor Green
    
    # Add to PATH anyway to ensure it's there
    Add-PostgreSQLToPath | Out-Null
}
else {
    # Download and install PostgreSQL
    $downloaded = Download-PostgreSQL
    if ($downloaded) {
        $installed = Install-PostgreSQL
        if ($installed) {
            Add-PostgreSQLToPath | Out-Null
        }
        else {
            Write-Host "PostgreSQL installation failed. Please install manually." -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "Failed to download PostgreSQL installer. Please install manually." -ForegroundColor Red
        exit 1
    }
}

# Create the database and test connection
Write-Host "`nNow setting up the database..." -ForegroundColor Cyan

# Create database
$dbCreated = Create-Database
if (-not $dbCreated) {
    Write-Host "Failed to create database. Please check your PostgreSQL installation." -ForegroundColor Red
    exit 1
}

# Test connection
$connectionOk = Test-DatabaseConnection
if (-not $connectionOk) {
    Write-Host "Failed to connect to database. Please check your PostgreSQL installation and configuration." -ForegroundColor Red
    exit 1
}

# Update .env file with database connection info
Write-Host "`nUpdating .env file with database connection information..." -ForegroundColor Cyan
$envPath = ".\.env"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    # Update database configuration
    $envContent = $envContent -replace "DB_HOST=.*", "DB_HOST=localhost"
    $envContent = $envContent -replace "DB_PORT=.*", "DB_PORT=$pgPort"
    $envContent = $envContent -replace "DB_USER=.*", "DB_USER=$pgUser"
    $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$pgPassword"
    $envContent = $envContent -replace "DB_NAME=.*", "DB_NAME=$pgDatabase"
    
    # Write updated content back to .env file
    $envContent | Set-Content $envPath
    Write-Host "Updated .env file with database connection information" -ForegroundColor Green
}
else {
    # Create new .env file
    @"
# Server Configuration
PORT=4000

# Database Configuration
DB_HOST=localhost
DB_PORT=$pgPort
DB_USER=$pgUser
DB_PASSWORD=$pgPassword
DB_NAME=$pgDatabase

# JWT Secret
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=1d

# Admin User
ADMIN_EMAIL=admin@rudri.com
ADMIN_PASSWORD=admin123

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
"@ | Set-Content $envPath
    
    Write-Host "Created new .env file with database connection information" -ForegroundColor Green
}

# Final instructions
Write-Host "`nPostgreSQL Installation and Setup Completed!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "Database Information:" -ForegroundColor Cyan
Write-Host "  Host:     localhost" -ForegroundColor White
Write-Host "  Port:     $pgPort" -ForegroundColor White
Write-Host "  User:     $pgUser" -ForegroundColor White
Write-Host "  Password: $pgPassword" -ForegroundColor White
Write-Host "  Database: $pgDatabase" -ForegroundColor White
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Initialize the database schema: npm run init-db" -ForegroundColor White
Write-Host "2. Start the server: npm run dev" -ForegroundColor White
Write-Host "`nIf you encounter any issues, check the PostgreSQL logs or run:" -ForegroundColor Yellow
Write-Host "  npm run test-db" -ForegroundColor White
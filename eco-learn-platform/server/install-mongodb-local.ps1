# MongoDB Local Installation Script for Windows
Write-Host "🚀 Installing MongoDB Community Server locally..." -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "💡 Right-click PowerShell and 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

try {
    # Check if chocolatey is installed
    if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "📦 Installing Chocolatey package manager..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        
        # Reload PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }

    Write-Host "📥 Installing MongoDB Community Edition..." -ForegroundColor Yellow
    choco install mongodb -y

    Write-Host "🔧 Creating MongoDB directories..." -ForegroundColor Yellow
    $mongoPath = "C:\data\db"
    if (!(Test-Path $mongoPath)) {
        New-Item -Path $mongoPath -ItemType Directory -Force
    }

    Write-Host "▶️ Starting MongoDB service..." -ForegroundColor Yellow
    # Start MongoDB as a Windows service
    net start MongoDB

    Write-Host "✅ MongoDB installed and started successfully!" -ForegroundColor Green
    Write-Host "📡 MongoDB is now running on mongodb://localhost:27017" -ForegroundColor Cyan
    Write-Host "🎯 You can now run: npm run seed" -ForegroundColor Cyan

} catch {
    Write-Host "❌ Error installing MongoDB: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Try MongoDB Atlas instead: npm run setup" -ForegroundColor Yellow
}

Write-Host "Press any key to continue..."
$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

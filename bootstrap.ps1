<#
.SYNOPSIS
    NEXUS-OS Development Bootstrap Script
    
.DESCRIPTION
    Hjälper till att snabbt sätta upp utvecklingsmiljön för NEXUS-OS efter migreringen
    till Serverless och MySQL.

.EXAMPLE
    .\bootstrap.ps1
#>

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   🚀 INITIERAR NEXUS-OS BOOTSTRAP 🚀   " -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Kontrollera Node.js
Write-Host "`n[1/5] Kontrollerar Node.js-installation..." -ForegroundColor Yellow
if (Get-Command "node" -ErrorAction SilentlyContinue) {
    $nodeVer = node -v
    Write-Host "✔ Node.js hittades ($nodeVer)" -ForegroundColor Green
} else {
    Write-Host "✖ Node.js saknas! Ladda ner från https://nodejs.org/" -ForegroundColor Red
    exit
}

# 2. Installera Beroenden
Write-Host "`n[2/5] Installerar NPM-paket..." -ForegroundColor Yellow
npm install

# 3. Miljövariabler
Write-Host "`n[3/5] Konfigurerar miljövariabler (.env.local)..." -ForegroundColor Yellow
if (-Not (Test-Path ".env.local")) {
    $envTemplate = @"
# NEXUS-OS Local Environment
# Ersätt detta med din PlanetScale eller lokala MySQL URL
DATABASE_URL="mysql://root:password@localhost:3306/nexus"
RUN_LOCAL="true"
"@
    Set-Content -Path ".env.local" -Value $envTemplate
    Write-Host "✔ Skapade en ny .env.local baserat på mallen." -ForegroundColor Green
    Write-Host "⚠️  OBS: Kom ihåg att uppdatera DATABASE_URL till din egen databas." -ForegroundColor Magenta
} else {
    Write-Host "✔ .env.local finns redan." -ForegroundColor Green
}

# 4. Databas och Schema
Write-Host "`n[4/5] Bygger Drizzle-databas scheman..." -ForegroundColor Yellow
npx drizzle-kit generate
Write-Host "✔ Scheman genererade." -ForegroundColor Green

# 5. Starta Server
Write-Host "`n[5/5] Startar NEXUS-OS utvecklingsmiljö..." -ForegroundColor Yellow
Write-Host "Frontend och Backend kommer snurra upp." -ForegroundColor Cyan
Write-Host "Tryck Ctrl+C för att avsluta.`n" -ForegroundColor DarkGray

# Startar Vite
npm run dev

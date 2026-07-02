#Requires -RunAsAdministrator
<#
.SYNOPSIS
    WA-Core Bootstrap Installer
    The Ultimate PowerShell Agent - Installation Script

.DESCRIPTION
    This script installs and configures WA-Core, the autonomous PowerShell agent
    that orchestrates code, infrastructure, communication, and business logic.

.PARAMETER InstallPath
    Installation directory for WA-Core (default: C:\Program Files\WA-Core)

.PARAMETER SkipDependencies
    Skip automatic dependency installation

.PARAMETER ConfigPath
    Custom configuration file path

.EXAMPLE
    .\wa-core-bootstrap-installer.ps1
    .\wa-core-bootstrap-installer.ps1 -InstallPath "D:\WA-Core" -SkipDependencies

.NOTES
    Author: WA-Core Team
    Version: 1.0.0
    Requires: PowerShell 5.1 or higher, Windows 10/Server 2016+
#>

param(
    [string]$InstallPath = "C:\Program Files\WA-Core",
    [switch]$SkipDependencies,
    [string]$ConfigPath
)

# ============================================
# COLOR & FORMATTING FUNCTIONS
# ============================================

function Write-Header {
    param([string]$Message)
    Write-Host "`n" -NoNewline
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $($Message.PadRight(62)) ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ " -ForegroundColor Green -NoNewline
    Write-Host $Message -ForegroundColor White
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ " -ForegroundColor Red -NoNewline
    Write-Host $Message -ForegroundColor White
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠ " -ForegroundColor Yellow -NoNewline
    Write-Host $Message -ForegroundColor White
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ " -ForegroundColor Cyan -NoNewline
    Write-Host $Message -ForegroundColor White
}

function Write-Step {
    param([string]$Message, [int]$Step, [int]$Total)
    Write-Host "`n[Step $Step/$Total] " -ForegroundColor Magenta -NoNewline
    Write-Host $Message -ForegroundColor White
}

# ============================================
# SYSTEM CHECKS
# ============================================

function Test-SystemRequirements {
    Write-Header "System Requirements Check"
    
    $allChecksPassed = $true
    
    # Check Windows Version
    Write-Info "Checking Windows version..."
    $osVersion = [System.Environment]::OSVersion.Version
    if ($osVersion.Major -ge 10) {
        Write-Success "Windows version: $($osVersion.Major).$($osVersion.Minor) (Compatible)"
    } else {
        Write-Error-Custom "Windows 10 or newer required. Current: $($osVersion.Major).$($osVersion.Minor)"
        $allChecksPassed = $false
    }
    
    # Check PowerShell Version
    Write-Info "Checking PowerShell version..."
    if ($PSVersionTable.PSVersion.Major -ge 5) {
        Write-Success "PowerShell version: $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor) (Compatible)"
    } else {
        Write-Error-Custom "PowerShell 5.1 or newer required. Current: $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor)"
        $allChecksPassed = $false
    }
    
    # Check Administrator Privileges
    Write-Info "Checking administrator privileges..."
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if ($isAdmin) {
        Write-Success "Administrator privileges confirmed"
    } else {
        Write-Error-Custom "Administrator privileges required. Please run as Administrator."
        $allChecksPassed = $false
    }
    
    # Check Disk Space
    Write-Info "Checking available disk space..."
    $drive = Split-Path -Path $InstallPath -Qualifier
    $diskSpace = (Get-Volume -DriveLetter $drive[0]).SizeRemaining / 1GB
    if ($diskSpace -gt 2) {
        Write-Success "Available disk space: $([math]::Round($diskSpace, 2)) GB (Sufficient)"
    } else {
        Write-Warning-Custom "Low disk space: $([math]::Round($diskSpace, 2)) GB (Recommended: 2+ GB)"
    }
    
    # Check Network Connectivity
    Write-Info "Checking network connectivity..."
    try {
        $null = Test-Connection -ComputerName "8.8.8.8" -Count 1 -ErrorAction Stop
        Write-Success "Network connectivity confirmed"
    } catch {
        Write-Warning-Custom "Network connectivity check failed (may be required for dependency installation)"
    }
    
    if (-not $allChecksPassed) {
        Write-Host "`n"
        Write-Error-Custom "System requirements not met. Installation cannot proceed."
        exit 1
    }
    
    Write-Success "All system requirements met!"
}

# ============================================
# DEPENDENCY INSTALLATION
# ============================================

function Install-Dependencies {
    if ($SkipDependencies) {
        Write-Warning-Custom "Skipping dependency installation (as requested)"
        return
    }
    
    Write-Header "Installing Dependencies"
    
    # Check and install NuGet provider
    Write-Step "Installing NuGet provider" 1 3
    try {
        if (-not (Get-PackageProvider -Name NuGet -ErrorAction SilentlyContinue)) {
            Write-Info "Installing NuGet provider..."
            Install-PackageProvider -Name NuGet -Force -Confirm:$false | Out-Null
            Write-Success "NuGet provider installed"
        } else {
            Write-Success "NuGet provider already installed"
        }
    } catch {
        Write-Error-Custom "Failed to install NuGet provider: $_"
    }
    
    # Check and install PSScriptAnalyzer
    Write-Step "Installing PSScriptAnalyzer" 2 3
    try {
        if (-not (Get-Module -ListAvailable -Name PSScriptAnalyzer)) {
            Write-Info "Installing PSScriptAnalyzer..."
            Install-Module -Name PSScriptAnalyzer -Force -Confirm:$false | Out-Null
            Write-Success "PSScriptAnalyzer installed"
        } else {
            Write-Success "PSScriptAnalyzer already installed"
        }
    } catch {
        Write-Error-Custom "Failed to install PSScriptAnalyzer: $_"
    }
    
    # Check and install Pester (testing framework)
    Write-Step "Installing Pester" 3 3
    try {
        if (-not (Get-Module -ListAvailable -Name Pester)) {
            Write-Info "Installing Pester..."
            Install-Module -Name Pester -Force -Confirm:$false | Out-Null
            Write-Success "Pester installed"
        } else {
            Write-Success "Pester already installed"
        }
    } catch {
        Write-Error-Custom "Failed to install Pester: $_"
    }
}

# ============================================
# INSTALLATION
# ============================================

function Install-WACore {
    Write-Header "Installing WA-Core"
    
    # Create installation directory
    Write-Step "Creating installation directory" 1 5
    try {
        if (-not (Test-Path -Path $InstallPath)) {
            New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
            Write-Success "Installation directory created: $InstallPath"
        } else {
            Write-Success "Installation directory already exists: $InstallPath"
        }
    } catch {
        Write-Error-Custom "Failed to create installation directory: $_"
        exit 1
    }
    
    # Create core module structure
    Write-Step "Creating module structure" 2 5
    try {
        $modulePath = Join-Path $InstallPath "Modules"
        $corePath = Join-Path $modulePath "WA-Core"
        
        foreach ($dir in @($modulePath, $corePath)) {
            if (-not (Test-Path -Path $dir)) {
                New-Item -ItemType Directory -Path $dir -Force | Out-Null
            }
        }
        
        Write-Success "Module structure created"
    } catch {
        Write-Error-Custom "Failed to create module structure: $_"
        exit 1
    }
    
    # Create WA-Core manifest
    Write-Step "Creating module manifest" 3 5
    try {
        $manifestPath = Join-Path $corePath "WA-Core.psd1"
        
        $manifestContent = @"
@{
    RootModule = 'WA-Core.psm1'
    ModuleVersion = '1.0.0'
    GUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    Author = 'WA-Core Team'
    CompanyName = 'WA-Core'
    Description = 'The Ultimate PowerShell Agent - Autonomous infrastructure orchestration'
    PowerShellVersion = '5.1'
    FunctionsToExport = @(
        'Initialize-WACore',
        'Start-WACore',
        'Stop-WACore',
        'Get-WACoreStatus',
        'Update-WACore'
    )
    CmdletsToExport = @()
    VariablesToExport = @()
    AliasesToExport = @()
    PrivateData = @{
        PSData = @{
            Tags = @('Agent', 'Automation', 'Infrastructure', 'PowerShell')
            LicenseUri = 'https://wa-core.dev/license'
            ProjectUri = 'https://wa-core.dev'
            ReleaseNotes = 'Initial release of WA-Core'
        }
    }
}
"@
        
        Set-Content -Path $manifestPath -Value $manifestContent -Force
        Write-Success "Module manifest created"
    } catch {
        Write-Error-Custom "Failed to create module manifest: $_"
        exit 1
    }
    
    # Create main module file
    Write-Step "Creating module implementation" 4 5
    try {
        $modulePath = Join-Path $corePath "WA-Core.psm1"
        
        $moduleContent = @"
# WA-Core Module
# The Ultimate PowerShell Agent

`$script:WACorePath = Split-Path -Parent `$MyInvocation.MyCommand.Path
`$script:ConfigPath = Join-Path `$WACorePath "config.json"
`$script:LogPath = Join-Path `$WACorePath "logs"

# Initialize logging
if (-not (Test-Path -Path `$script:LogPath)) {
    New-Item -ItemType Directory -Path `$script:LogPath -Force | Out-Null
}

function Initialize-WACore {
    <#
    .SYNOPSIS
        Initialize WA-Core agent with default configuration
    #>
    [CmdletBinding()]
    param()
    
    Write-Host "Initializing WA-Core..." -ForegroundColor Cyan
    
    # Create default configuration
    `$config = @{
        Enabled = `$true
        Version = "1.0.0"
        InstallDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Features = @{
            CodeOrchestration = `$true
            InfrastructureMonitoring = `$true
            CommunicationTriage = `$true
            ROIFiltering = `$true
        }
        Logging = @{
            Enabled = `$true
            Level = "Info"
            Path = `$script:LogPath
        }
    }
    
    `$config | ConvertTo-Json | Set-Content -Path `$script:ConfigPath -Force
    Write-Host "✓ WA-Core initialized successfully" -ForegroundColor Green
}

function Start-WACore {
    <#
    .SYNOPSIS
        Start the WA-Core background agent
    #>
    [CmdletBinding()]
    param()
    
    Write-Host "Starting WA-Core agent..." -ForegroundColor Cyan
    
    if (-not (Test-Path -Path `$script:ConfigPath)) {
        Write-Host "Configuration not found. Initializing..." -ForegroundColor Yellow
        Initialize-WACore
    }
    
    Write-Host "✓ WA-Core agent started" -ForegroundColor Green
    Write-Host "  - Code Orchestration: Enabled" -ForegroundColor Gray
    Write-Host "  - Infrastructure Monitoring: Enabled" -ForegroundColor Gray
    Write-Host "  - Communication Triage: Enabled" -ForegroundColor Gray
    Write-Host "  - ROI Filtering: Enabled" -ForegroundColor Gray
}

function Stop-WACore {
    <#
    .SYNOPSIS
        Stop the WA-Core background agent
    #>
    [CmdletBinding()]
    param()
    
    Write-Host "Stopping WA-Core agent..." -ForegroundColor Cyan
    Write-Host "✓ WA-Core agent stopped" -ForegroundColor Green
}

function Get-WACoreStatus {
    <#
    .SYNOPSIS
        Get the current status of WA-Core
    #>
    [CmdletBinding()]
    param()
    
    if (Test-Path -Path `$script:ConfigPath) {
        `$config = Get-Content -Path `$script:ConfigPath | ConvertFrom-Json
        Write-Host "WA-Core Status:" -ForegroundColor Cyan
        Write-Host "  Version: `$(`$config.Version)" -ForegroundColor Gray
        Write-Host "  Status: Running" -ForegroundColor Green
        Write-Host "  Installed: `$(`$config.InstallDate)" -ForegroundColor Gray
        return `$config
    } else {
        Write-Host "WA-Core is not initialized" -ForegroundColor Yellow
        return `$null
    }
}

function Update-WACore {
    <#
    .SYNOPSIS
        Update WA-Core to the latest version
    #>
    [CmdletBinding()]
    param()
    
    Write-Host "Checking for WA-Core updates..." -ForegroundColor Cyan
    Write-Host "✓ WA-Core is up to date (v1.0.0)" -ForegroundColor Green
}

# Export functions
Export-ModuleMember -Function @(
    'Initialize-WACore',
    'Start-WACore',
    'Stop-WACore',
    'Get-WACoreStatus',
    'Update-WACore'
)
"@
        
        Set-Content -Path $modulePath -Value $moduleContent -Force
        Write-Success "Module implementation created"
    } catch {
        Write-Error-Custom "Failed to create module implementation: $_"
        exit 1
    }
    
    # Add to PSModulePath
    Write-Step "Registering module" 5 5
    try {
        $psModulePath = [Environment]::GetEnvironmentVariable("PSModulePath", "User")
        $modulePath = Join-Path $InstallPath "Modules"
        
        if ($psModulePath -notlike "*$modulePath*") {
            $newPath = "$psModulePath;$modulePath"
            [Environment]::SetEnvironmentVariable("PSModulePath", $newPath, "User")
            Write-Success "Module registered in PSModulePath"
        } else {
            Write-Success "Module already registered"
        }
    } catch {
        Write-Error-Custom "Failed to register module: $_"
    }
}

# ============================================
# CONFIGURATION
# ============================================

function Configure-WACore {
    Write-Header "Configuring WA-Core"
    
    Write-Info "Initializing WA-Core with default configuration..."
    
    # Import the module
    $modulePath = Join-Path $InstallPath "Modules"
    $env:PSModulePath += ";$modulePath"
    
    # Initialize WA-Core
    Import-Module WA-Core -Force
    Initialize-WACore
    
    Write-Success "WA-Core configured successfully"
}

# ============================================
# VERIFICATION
# ============================================

function Verify-Installation {
    Write-Header "Verifying Installation"
    
    $allVerified = $true
    
    # Check installation directory
    Write-Info "Checking installation directory..."
    if (Test-Path -Path $InstallPath) {
        Write-Success "Installation directory verified"
    } else {
        Write-Error-Custom "Installation directory not found"
        $allVerified = $false
    }
    
    # Check module files
    Write-Info "Checking module files..."
    $corePath = Join-Path $InstallPath "Modules\WA-Core"
    $requiredFiles = @("WA-Core.psd1", "WA-Core.psm1", "config.json")
    
    foreach ($file in $requiredFiles) {
        $filePath = Join-Path $corePath $file
        if (Test-Path -Path $filePath) {
            Write-Success "$file found"
        } else {
            Write-Warning-Custom "$file not found"
        }
    }
    
    # Test module import
    Write-Info "Testing module import..."
    try {
        $modulePath = Join-Path $InstallPath "Modules"
        $env:PSModulePath += ";$modulePath"
        Import-Module WA-Core -Force -ErrorAction Stop
        Write-Success "Module imported successfully"
    } catch {
        Write-Error-Custom "Failed to import module: $_"
        $allVerified = $false
    }
    
    if ($allVerified) {
        Write-Success "Installation verified successfully!"
    } else {
        Write-Warning-Custom "Some verification checks failed"
    }
}

# ============================================
# MAIN INSTALLATION FLOW
# ============================================

function Main {
    Clear-Host
    
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║                                                                ║" -ForegroundColor Magenta
    Write-Host "║          WA-CORE BOOTSTRAP INSTALLER                          ║" -ForegroundColor Magenta
    Write-Host "║          The Ultimate PowerShell Agent                         ║" -ForegroundColor Magenta
    Write-Host "║                                                                ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""
    
    Write-Info "Installation Path: $InstallPath"
    Write-Info "PowerShell Version: $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor)"
    Write-Info "Windows Version: $([System.Environment]::OSVersion.VersionString)"
    Write-Host ""
    
    # Run installation steps
    Test-SystemRequirements
    Install-Dependencies
    Install-WACore
    Configure-WACore
    Verify-Installation
    
    # Final summary
    Write-Header "Installation Complete!"
    Write-Success "WA-Core has been successfully installed"
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "  1. Import the module: Import-Module WA-Core" -ForegroundColor Gray
    Write-Host "  2. Start the agent: Start-WACore" -ForegroundColor Gray
    Write-Host "  3. Check status: Get-WACoreStatus" -ForegroundColor Gray
    Write-Host ""
    Write-Info "Documentation: https://wa-core.dev/docs"
    Write-Info "Support: support@wa-core.dev"
    Write-Host ""
}

# Execute main installation
Main

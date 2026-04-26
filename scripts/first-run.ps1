Param(
  [switch]$SkipSeed
)

$ErrorActionPreference = "Stop"

function Step($message) {
  Write-Host ""
  Write-Host "==> $message" -ForegroundColor Cyan
}

function Ensure-Command($name, $helpMessage) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    Write-Host "Missing required command: $name" -ForegroundColor Red
    Write-Host $helpMessage -ForegroundColor Yellow
    exit 1
  }
}

Step "Checking prerequisites"
Ensure-Command "node" "Install Node.js >= 20: https://nodejs.org/"
Ensure-Command "npm" "npm is bundled with Node.js."

Step "Checking Node.js version"
$nodeVersionRaw = node -v
$nodeMajor = [int](($nodeVersionRaw -replace "^v", "").Split(".")[0])
if ($nodeMajor -lt 20) {
  Write-Host "Node.js version $nodeVersionRaw is too old. Please install Node.js >= 20." -ForegroundColor Red
  exit 1
}
Write-Host "Node.js version: $nodeVersionRaw" -ForegroundColor Green

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backendPath = Join-Path $repoRoot "backend"
$frontendPath = Join-Path $repoRoot "frontend"

Step "Preparing backend environment file"
$backendEnvExample = Join-Path $backendPath ".env.example"
$backendEnv = Join-Path $backendPath ".env"
if (-not (Test-Path $backendEnv)) {
  Copy-Item $backendEnvExample $backendEnv
  Write-Host "Created backend/.env from .env.example" -ForegroundColor Green
} else {
  Write-Host "backend/.env already exists, skipping" -ForegroundColor Yellow
}

Step "Preparing frontend environment file"
$frontendEnv = Join-Path $frontendPath ".env.local"
if (-not (Test-Path $frontendEnv)) {
  Set-Content -Path $frontendEnv -Value "NEXT_PUBLIC_API_URL=http://localhost:3001"
  Write-Host "Created frontend/.env.local" -ForegroundColor Green
} else {
  Write-Host "frontend/.env.local already exists, skipping" -ForegroundColor Yellow
}

Step "Installing backend dependencies"
Push-Location $backendPath
npm install
Pop-Location

Step "Installing frontend dependencies"
Push-Location $frontendPath
npm install
Pop-Location

if (-not $SkipSeed) {
  Step "Running backend seed data"
  Push-Location $backendPath
  npm run seed:run:document
  Pop-Location
} else {
  Step "Skipping seed data (--SkipSeed)"
}

Step "Checking MongoDB accessibility (optional)"
try {
  $tcp = Test-NetConnection -ComputerName "localhost" -Port 27017 -WarningAction SilentlyContinue
  if ($tcp.TcpTestSucceeded) {
    Write-Host "MongoDB appears reachable on localhost:27017" -ForegroundColor Green
  } else {
    Write-Host "MongoDB was not reachable on localhost:27017." -ForegroundColor Yellow
    Write-Host "Start MongoDB before running backend: npm run start:dev" -ForegroundColor Yellow
  }
} catch {
  Write-Host "Could not verify MongoDB port. Make sure MongoDB is running." -ForegroundColor Yellow
}

Step "Setup complete"
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1) Start backend:  cd backend  && npm run start:dev"
Write-Host "2) Start frontend: cd frontend && npm run dev"
Write-Host "3) Open: http://localhost:3000"

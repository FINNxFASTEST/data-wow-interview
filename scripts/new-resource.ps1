Param(
  [Parameter(Mandatory=$true)]
  [string]$Name
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backendPath = Join-Path $repoRoot "backend"

Write-Host ""
Write-Host "==> Scaffolding resource: $Name" -ForegroundColor Cyan

Push-Location $backendPath
npm run generate:resource:document -- --name $Name
Pop-Location

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Green
Write-Host "1) Add fields to src/$($Name.ToLower())s/domain/$($Name.ToLower()).ts"
Write-Host "2) Add @Prop() to infrastructure/persistence/$($Name.ToLower()).schema.ts"
Write-Host "3) Map fields in infrastructure/persistence/$($Name.ToLower()).mapper.ts"
Write-Host "4) Fill DTOs in presentation/dto/"
Write-Host "5) Implement use-case bodies in application/use-cases/"

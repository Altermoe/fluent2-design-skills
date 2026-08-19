#Requires -Version 5.1
<#
.SYNOPSIS
  Install Fluent 2 design skills into a DSH or Anthropic .agents skills directory (Windows / PowerShell).
.DESCRIPTION
  PowerShell counterpart of install.sh for Windows. Links (or copies on restricted
  systems) each skill under ./skills into the selected target skills directory so
  DSH / Anthropic .agents can auto-discover the SKILL.md files.
.PARAMETER Mode
  --dsh     install into .dsh/skills (project-local, default) or --user -> ~/.dsh/skills
  --agents  install into ~/.agents/skills
.PARAMETER User
  With --dsh, install into $HOME/.dsh/skills instead of the project-local .dsh/skills.
.EXAMPLE
  .\install.ps1 --dsh
  .\install.ps1 --dsh --user
  .\install.ps1 --agents
#>
[CmdletBinding()]
param(
  [ValidateSet('dsh','agents')]
  [string]$Mode,

  [switch]$User
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $root 'skills'

if (-not (Test-Path -LiteralPath $src)) {
  throw "skills source directory not found: $src"
}

$target = $null
if ($Mode -eq 'dsh') {
  $target = if ($User) { Join-Path $HOME '.dsh\skills' } else { Join-Path (Get-Location) '.dsh\skills' }
}
elseif ($Mode -eq 'agents') {
  $target = Join-Path $HOME '.agents\skills'
}
else {
  Write-Host 'Usage: install.ps1 {--dsh | --agents} [--user]' -ForegroundColor Yellow
  Write-Host '  --dsh      install into .dsh/skills (project-local, default) or --user -> ~/.dsh/skills' -ForegroundColor Yellow
  Write-Host '  --agents   install into ~/.agents/skills' -ForegroundColor Yellow
  exit 1
}

$null = New-Item -ItemType Directory -Force -Path $target
Write-Host "Installing skills -> $target"

$dirs = Get-ChildItem -LiteralPath $src -Directory
foreach ($dir in $dirs) {
  $name   = $dir.Name
  $link   = Join-Path $target $name

  # Remove any stale previous entry so links never stack/duplicate.
  if (Test-Path -LiteralPath $link) {
    Remove-Item -LiteralPath $link -Recurse -Force
  }

  # Symlinks give the true "link a directory" experience but often need admin or
  # Developer Mode on Windows; fall back to a directory junction (no admin) when
  # we cannot create one, then to a plain copy as the last resort.
  if (Test-Path -LiteralPath $dir) {
    try {
      New-Item -ItemType SymbolicLink -Path $link -Target $dir.FullName -ErrorAction Stop | Out-Null
      Write-Host "  linked   $name"
    }
    catch {
      try {
        New-Item -ItemType Junction -Path $link -Target $dir.FullName -ErrorAction Stop | Out-Null
        Write-Host "  junction $name"
      }
      catch {
        Copy-Item -LiteralPath $dir.FullName -Destination $link -Recurse -Force
        Write-Host "  copied   $name"
      }
    }
  }
}

Write-Host "Done. DSH will discover these from '$target'."
exit 0
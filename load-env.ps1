# Loads Supabase credentials from .env.local.
#
# These scripts used to hardcode a service_role key. Secrets must never live in
# tracked files: this reads them from the git-ignored .env.local instead.
#
# Exposes $env:SUPABASE_URL and $env:SUPABASE_KEY for the seeding scripts.

$envPath = Join-Path $PSScriptRoot ".env.local"

if (-not (Test-Path $envPath)) {
  throw ".env.local not found at $envPath. Copy .env.example to .env.local and fill in real values."
}

foreach ($line in Get-Content $envPath) {
  if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
    $name = $matches[1]
    $value = $matches[2].Trim().Trim('"').Trim("'")
    if ($value) {
      [Environment]::SetEnvironmentVariable($name, $value)
    }
  }
}

$env:SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$env:SUPABASE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $env:SUPABASE_URL -or -not $env:SUPABASE_KEY) {
  throw ".env.local must define NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
}

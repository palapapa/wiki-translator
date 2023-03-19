try
{
    Push-Location $PSScriptRoot
    npm install
    npm run watch
}
finally
{
    Pop-Location
}

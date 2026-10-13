# 使用 Foundry 官方 Docker 镜像部署 ChogRPSConfig（无需本机安装 forge）
# 用法:
#   $env:DEPLOYER_PRIVATE_KEY = "0x..."
#   $env:TREASURY_ADDRESS = "0x..."   # 可选
#   .\contracts\scripts\deploy-docker.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not (Test-Path (Join-Path $Root "contracts\remix\ChogRPSConfig_Remix.sol"))) {
    $Root = Split-Path $PSScriptRoot -Parent | Split-Path -Parent
}

$pk = $env:DEPLOYER_PRIVATE_KEY
if (-not $pk) {
    Write-Error "请设置环境变量 DEPLOYER_PRIVATE_KEY（0x 开头私钥）"
}

$treasury = $env:TREASURY_ADDRESS
if (-not $treasury) {
    Write-Error "请设置 TREASURY_ADDRESS（回购金库地址，可与部署钱包相同）"
}

$chog = "0x350035555e10d9afaf1566aaebfced5ba6c27777"
$nft = "0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763"
$rpc = if ($env:MONAD_RPC_URL) { $env:MONAD_RPC_URL } else { "https://rpc.monad.xyz" }
$image = "ghcr.io/foundry-rs/foundry:latest"

Write-Host "编译..."
docker run --rm -v "${Root}:/app" -w /app $image forge build --contracts contracts/remix/ChogRPSConfig_Remix.sol

Write-Host "部署到 Monad ($rpc)..."
docker run --rm -v "${Root}:/app" -w /app $image forge create `
    contracts/remix/ChogRPSConfig_Remix.sol:ChogRPSConfig `
    --rpc-url $rpc `
    --private-key $pk `
    --constructor-args $chog $nft $treasury

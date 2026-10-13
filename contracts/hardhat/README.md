# Hardhat 部署（Monad 主网）

Solidity：`contracts/ChogRPSConfig.sol`（与 `../remix/ChogRPSConfig_Remix.sol` 同步）。

## 1. 安装

```powershell
cd d:\source\test_coin\chognft1\contracts\hardhat
copy .env.example .env
# 编辑 .env：PRIVATE_KEY、可选 TREASURY_ADDRESS、MONAD_RPC_URL
npm install
```

需 **Node 18–20** + **Hardhat 2.x**（本目录 `package.json` 已锁定）。

## 2. 编译

```powershell
npm run compile
```

## 3. 部署 Monad 主网（chain id 143）

```powershell
npm run deploy:monad
```

## 4. 部署对战合约（真实下注）

```powershell
# .env 可选 CHOG_RPS_CONFIG=0x011E...（默认已填你部署的 Config）
npm run deploy:game
```

向 **Game 合约** 注入 CHOG 作为机器人准备金（至少 ≥ 单局最大下注）：

```powershell
# 在 cast / 钱包里：approve(game) 后调用 game.deposit(amount)
```

把输出的 `ChogRPSVsBot deployed:` 写入 `../../src/config/chain.ts` → `CONTRACTS.rpsGame`。

## 5. 前端

Config 地址写入 `CHOG_RPS_CONFIG` / `CONTRACTS.chogRpsConfig`。

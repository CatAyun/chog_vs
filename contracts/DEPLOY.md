# Monad 部署合约（Foundry）

> **Remix 不支持 Monad？** 见 **[DEPLOY-ALT.md](./DEPLOY-ALT.md)**（Docker / GitHub 二进制 / WSL 等，无需 Remix）。  
> Remix 可尝试时见 [REMIX-DEPLOY.md](./REMIX-DEPLOY.md)。

当前仓库里**可部署**的是 `ChogRPSConfig`：固化 CHOG、CHOG NFT、回购金库地址，并提供 `hasChogNft()`。完整剪刀石头布 + 自动回购挂单逻辑仍在 `contracts/README.md` 规划中，部署游戏合约后通过 `setGame()` 挂接。

## 1. 安装 Foundry

Windows（PowerShell）：

```powershell
# 官方安装脚本见 https://book.getfoundry.sh/getting-started/installation
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

或已安装则跳过。

## 2. 安装依赖

在 `chognft1` 目录：

```powershell
cd d:\source\test_coin\chognft1
forge install foundry-rs/forge-std --no-commit
```

若 `git` 未初始化，可先 `git init`，或把 `forge-std` 手动克隆到 `contracts/lib/forge-std`。

## 3. 配置环境变量

复制并编辑：

```powershell
copy contracts\.env.example contracts\.env
```

| 变量 | 说明 |
|------|------|
| `PRIVATE_KEY` | 部署钱包私钥（**勿提交 git**） |
| `MONAD_RPC_URL` | 默认 `https://rpc.monad.xyz` |
| `TREASURY_ADDRESS` | 回购/协议金库地址，默认用部署者 |

钱包需有足够 **MON** 付 gas。

## 4. 编译

```powershell
forge build
```

## 5. 部署到 Monad 主网（chain id 143）

**方式 A — 部署脚本（推荐）**

```powershell
forge script contracts/script/Deploy.s.sol:Deploy `
  --rpc-url $env:MONAD_RPC_URL `
  --broadcast `
  -vvvv
```

PowerShell 若未导出变量，可写死 RPC：

```powershell
forge script contracts/script/Deploy.s.sol:Deploy `
  --rpc-url https://rpc.monad.xyz `
  --broadcast `
  --private-key <你的私钥> `
  -vvvv
```

**方式 B — 单次 create**

```powershell
forge create contracts/src/ChogRPSConfig.sol:ChogRPSConfig `
  --rpc-url https://rpc.monad.xyz `
  --private-key <私钥> `
  --constructor-args `
    0x350035555e10d9afaf1566aaebfced5ba6c27777 `
    0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763 `
    <金库地址>
```

终端会打印 `Deployed to: 0x...`，即 **Config 合约地址**。

## 6. 验证（可选）

若配置了 `MONADVISION_API_KEY`：

```powershell
forge verify-contract <部署地址> ChogRPSConfig `
  --chain-id 143 `
  --constructor-args $(cast abi-encode "constructor(address,address,address)" 0x350035555e10d9afaf1566aaebfced5ba6c27777 0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763 <金库地址>)
```

## 7. 接到前端

编辑 `src/config/chain.ts`：

```ts
export const CONTRACTS = {
  rpsGame: "0x你的游戏合约或先填Config地址", // 仅 Config 时对战按钮仍等 game 逻辑
  chogNft: CHOG_NFT,
  buyback: "0x金库或与 treasury 相同",
};
```

若暂时只部署了 `ChogRPSConfig`，可把 **Config 地址** 记在 README；`rpsGame` 留空直到游戏合约上线并 `setGame()`。

## 安全提醒

- 私钥只用 `.env`，不要写进仓库  
- 主网部署前在测试网跑一遍  
- 游戏与回购模块上线前建议审计  

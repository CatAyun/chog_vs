# Monad 部署：不用 Remix、不用本机 foundryup 的几种方式

Remix 没有 Monad 环境时，只要钱包能连 **Chain ID 143** + `https://rpc.monad.xyz`，下面任意一种都能部署本项目的 **`ChogRPSConfig`**（单文件见 `remix/ChogRPSConfig_Remix.sol`）。

官方 Foundry 安装说明：[getfoundry.sh 安装](https://www.getfoundry.sh/introduction/installation)（Windows 需 **Git Bash** 或 **WSL**，纯 PowerShell 不能直接跑 `foundryup`）。

---

## 方式 1：Docker 跑 Forge（推荐，Windows 最省事）

不用装 Rust / foundryup，只装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)。

在 **`chognft1` 目录**打开 PowerShell：

```powershell
cd d:\source\test_coin\chognft1

# 编译（挂载当前目录进容器）
docker run --rm -v "${PWD}:/app" -w /app ghcr.io/foundry-rs/foundry:latest forge build --contracts contracts/remix/ChogRPSConfig_Remix.sol

# 部署（把 0x你的私钥 和 0x金库地址 换成真实值，勿泄露）
docker run --rm -v "${PWD}:/app" -w /app ghcr.io/foundry-rs/foundry:latest forge create `
  contracts/remix/ChogRPSConfig_Remix.sol:ChogRPSConfig `
  --rpc-url https://rpc.monad.xyz `
  --private-key 0x你的私钥 `
  --constructor-args `
    0x350035555e10d9afaf1566aaebfced5ba6c27777 `
    0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763 `
    0x你的金库地址
```

成功会输出 `Deployed to: 0x...`。

也可运行仓库脚本（需先设置环境变量）：

```powershell
$env:DEPLOYER_PRIVATE_KEY = "0x..."
$env:TREASURY_ADDRESS = "0x..."   # 可选，默认同私钥对应地址需在脚本里改
.\contracts\scripts\deploy-docker.ps1
```

---

## 方式 2：GitHub 预编译二进制（不用 Docker、不用编译 Foundry）

Foundry **已不再发 npm 包**，但可从 [GitHub Releases](https://github.com/foundry-rs/foundry/releases) 下载 Windows 的 `forge.exe` / `cast.exe`，解压后加入系统 `PATH`。

然后在 `chognft1` 目录：

```powershell
forge create contracts/remix/ChogRPSConfig_Remix.sol:ChogRPSConfig `
  --rpc-url https://rpc.monad.xyz `
  --private-key 0x你的私钥 `
  --constructor-args 0x350035555e10d9afaf1566aaebfced5ba6c27777 0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763 0x金库地址
```

---

## 方式 3：WSL 或 Git Bash + foundryup

与官方文档相同，在 **WSL Ubuntu** 或 **Git Bash** 里：

```bash
curl -L https://getfoundry.sh/install | bash
foundryup
```

再在 WSL 里 `cd /mnt/d/source/test_coin/chognft1`，按 [DEPLOY.md](./DEPLOY.md) 执行 `forge create` 或 `forge script`。

---

## 方式 4：只用 Cast 发已编译字节码（高级）

若别人已帮你 `forge build` 好，可用 `cast send --create` 带 bytecode + 构造参数部署。一般不如 `forge create` 直观，适合 CI。

---

## 方式 5：Hardhat（你本机已有类似项目）

- **chognft1 专用**：**`chognft1/contracts/hardhat/`**（Monad 主网 143，`npm run deploy:monad`）

```powershell
cd d:\source\test_coin\chognft1\contracts\hardhat
copy .env.example .env
# 填 PRIVATE_KEY
npm install
npm run compile
npm run deploy:monad
```

说明：用 **Hardhat 2.x**（package.json 已锁定），Node 20 可用；`npx hardhat@3` 需 Node 22+。

---

## 方式 6：Remix 的有限 workaround（不一定可用）

部分用户会在钱包里 **手动添加 Monad**，Remix 选 **Injected Provider**，在链 ID 正确时仍能部署。若 Remix 界面或 RPC 限制导致失败，请用上面 **Docker / forge create**。

---

## 构造函数参数（三种方式相同）

| 参数 | 地址 |
|------|------|
| CHOG | `0x350035555e10d9afaf1566aaebfced5ba6c27777` |
| CHOG NFT | `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763` |
| treasury | 回购金库（可先填部署钱包） |

部署后在 [MonadVision](https://monadvision.com) 查合约，并把地址写入 `src/config/chain.ts`。

---

## 对比小结

| 方式 | 适合 |
|------|------|
| Docker + forge | Windows，不想装 WSL / foundryup |
| GitHub 二进制 | 想本地长期用 forge，不想 Docker |
| WSL + foundryup | 跟官方文档一致 |
| Remix | Monad 不支持时建议放弃 |

# 用 Remix 部署到 Monad

> **若 Remix 无法选 Monad / 部署失败**：请改用 **[DEPLOY-ALT.md](./DEPLOY-ALT.md)**（推荐 Docker 一条命令部署）。

部署的是 **`ChogRPSConfig`**（配置 + `hasChogNft`）。对战机器人目前仍是前端演示；游戏合约上线后再对部署地址调用 `setGame`。

## 1. 打开 Remix

浏览器访问：https://remix.ethereum.org

## 2. 放入合约代码

**方式 A（推荐）**

1. 左侧 **File Explorer** → `contracts` 文件夹  
2. 新建文件 `ChogRPSConfig.sol`  
3. 把本仓库 **`contracts/remix/ChogRPSConfig_Remix.sol`** 的全部内容复制进去（单文件，无 import）

**方式 B**

在 Remix 里建 3 个文件，与仓库 `contracts/src/` 结构一致（`interfaces/IERC20.sol`、`IERC721.sol`、`ChogRPSConfig.sol`）。

## 3. 编译

1. 左侧点 **Solidity Compiler**（图标像 Solidity）  
2. **Compiler** 选 `0.8.24` 或更高  
3. **EVM Version** 可用 `default` 或 `cancun`  
4. 点 **Compile ChogRPSConfig.sol**  
5. 无报错即可

## 4. 钱包里添加 Monad 主网

在 MetaMask / Rabby 等里 **添加网络**（以官方为准，常见为）：

| 项 | 值 |
|----|-----|
| 网络名称 | Monad |
| RPC URL | `https://rpc.monad.xyz` |
| Chain ID | **143** |
| 货币符号 | MON |

钱包里要有足够 **MON** 付 gas。

## 5. 部署

1. 左侧 **Deploy & Run**  
2. **Environment** 选 **Injected Provider - MetaMask**（或你的钱包）  
3. 确认 Remix 顶部显示的 **Chain ID = 143**  
4. **Contract** 下拉选 **`ChogRPSConfig`**  
5. 展开 **Deploy**，填写构造函数 **3 个 address**（不要带空格）：

```
_chog
0x350035555e10d9afaf1566aaebfced5ba6c27777

_chogNft
0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763

_treasury
你的回购/协议金库地址（可先填你自己的部署钱包地址）
```

6. 点 **transact**，在钱包里 **确认**  
7. 下方 **Deployed Contracts** 里会出现合约；点 **Copy** 复制地址

## 6. 部署后自检（可选）

在 Remix 已部署实例上：

- `chog` / `chogNft` / `treasury` → **call**，应等于上面填的地址  
- `hasChogNft` → 填入某钱包地址 **call**，有 NFT 应返回 `true`  
- `owner` → 应为你的部署钱包

## 7. 接到前端

编辑 `chognft1/src/config/chain.ts`：

```ts
export const CONTRACTS = {
  rpsGame: "0x你Remix部署出来的地址", // 或先留空，仅 Config 时对战仍为链下演示
  chogNft: CHOG_NFT,
  buyback: "0x与 treasury 相同或你的金库地址",
};
```

在 [MonadVision](https://monadvision.com) 用部署地址查交易是否成功。

## 常见问题

| 问题 | 处理 |
|------|------|
| Remix 显示 Wrong network | 钱包切换到 Monad（143） |
| `zero` revert | 三个构造函数地址都不能是 `0x000…000` |
| Gas 不足 | 钱包充值 MON |
| 找不到 Injected Provider | 安装浏览器钱包插件并解锁 |

## 与 Foundry 的关系

Remix 与 `forge script` 部署的是**同一份逻辑**；任选其一即可。Foundry 步骤见 [DEPLOY.md](./DEPLOY.md)。

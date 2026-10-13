# CHOG RPS 合约

**部署步骤见 [DEPLOY.md](./DEPLOY.md)**（Foundry + Monad）。

## 已实现（可部署）

- `src/ChogRPSConfig.sol` — 固化 CHOG / NFT / treasury，`hasChogNft()`，后续 `setGame()`

## 待实现

## 模块

1. **RPSGame** — commit-reveal 剪刀石头布，托管 CHOG 下注，结算分配。
2. **NftBuyback** — 接收 10% / 20% CHOG，在 NFT 市场回购；回购品由 **Lister** 以 `floorPrice * 1.2` 挂单。
3. **ChogNftGate** — 查询玩家是否持有 CHOG NFT：`0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`（`src/config/chain.ts` → `CHOG_NFT`）。

## 分配（与前端一致）

| 角色 | 赢家分成 | 回购份额 |
|------|----------|----------|
| 持 CHOG NFT | 90% | 10% |
| 无 NFT | 80% | 20% |

## 建议技术栈

- Foundry + Monad RPC
- CHOG ERC20: `0x350035555e10d9afaf1566aaebfced5ba6c27777`

## 安全

- 防重入、超时未 reveal 罚没规则、oracle/地板价来源需单独设计
- 上线前审计

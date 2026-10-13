# CHOG RPS · Monad

Rock-paper-scissors vs a bot on **Monad**. Bet **$CHOG** (`0x350035555e10d9afaf1566aaebfced5ba6c27777`).

- Winners: **90%** with CHOG NFT · **80%** without
- Remaining **10% / 20%** funds CHOG NFT buyback (floor **1.2×** listing per protocol design)

## Local dev

```bash
npm install
npm run dev
```

## Deploy to Netlify

1. Push this repo to GitHub (or connect your Git provider in Netlify).
2. **Add new site** → Import project → pick the repo.
3. Build settings (also in `netlify.toml`):
   - **Base directory:** `chognft1` (if the repo root is `test_coin`; otherwise leave blank)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy. Client-side routes (`/play`) use SPA fallback via `_redirects` / `netlify.toml`.

No server env vars required for the static frontend; contract addresses live in `src/config/chain.ts`.

## Assets

- Gallery: `public/assets/chog/chog-01.jpg` … `chog-05.jpg`
- Optional placeholders: `public/assets/chog/README.md`, paths in `src/config/assets.ts`

## Contracts

See `contracts/README.md` and `contracts/hardhat/README.md`.

| Contract | Address |
|----------|---------|
| ChogRPSConfig | `0x011E1E9d9919deEbc5B3Aa8ADeEEFEcA7c8956c2` |
| ChogRPSVsBot | `0xfDC49be5Ad8abFcc433a28833f4D2398a212691a` |

Fund the game contract with CHOG (`npm run fund:game` in `contracts/hardhat`) before large bets.

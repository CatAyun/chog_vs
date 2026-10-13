import { defineChain } from "viem";

/** Monad Mainnet */
export const monad = defineChain({
  id: 143,
  name: "Monad",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "MonadVision", url: "https://monadvision.com" },
  },
});

export const CHOG_TOKEN = "0x350035555e10d9afaf1566aaebfced5ba6c27777" as const;

export const CHOG_NFT = "0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763" as const;

/** ChogRPSConfig (Monad mainnet) */
export const CHOG_RPS_CONFIG = "0x011E1E9d9919deEbc5B3Aa8ADeEEFEcA7c8956c2" as const;

/** ChogRPSVsBot (on-chain play + CHOG bets) */
export const CHOG_RPS_GAME = "0xfDC49be5Ad8abFcc433a28833f4D2398a212691a" as const;

export const CONTRACTS = {
  chogRpsConfig: CHOG_RPS_CONFIG,
  rpsGame: CHOG_RPS_GAME,
  chogNft: CHOG_NFT,
  buyback: "0xfD221b7353A2848F66D88EEF675F9Bd8301fBeaD" as const,
};

export const explorerContract = (address: string) =>
  `${monad.blockExplorers.default.url}/address/${address}`;

export const PAYOUT = {
  withNft: 0.9,
  withoutNft: 0.8,
  buybackWithNft: 0.1,
  buybackWithoutNft: 0.2,
  listMultiplier: 1.2,
} as const;

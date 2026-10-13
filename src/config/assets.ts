/**
 * 所有可替换素材集中配置。缺失文件时组件会回退到 gallery 里的 chog-0x.jpg。
 */
export const CHOG_ASSETS = {
  gallery: [
    "/assets/chog/chog-01.jpg",
    "/assets/chog/chog-02.jpg",
    "/assets/chog/chog-03.jpg",
    "/assets/chog/chog-04.jpg",
    "/assets/chog/chog-05.jpg",
  ],
  /** 首页主视觉 — 请替换 public/assets/chog/hero-main.png */
  heroMain: "/assets/chog/hero-main.png",
  nftBadge: "/assets/chog/nft-badge.png",
  rps: {
    rock: "/assets/chog/rps-rock.png",
    paper: "/assets/chog/rps-paper.png",
    scissors: "/assets/chog/rps-scissors.png",
  },
  monadStrip: "/assets/chog/monad-strip.svg",
  buybackFlow: "/assets/chog/buyback-flow.png",
} as const;

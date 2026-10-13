import { CHOG_NFT } from "../config/chain";
import type { OwnedChogNft } from "../hooks/useChogNfts";
import { ChogImage } from "./ChogImage";

type Props = {
  nfts: OwnedChogNft[];
  balance: number;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
};

export function OwnedNftGallery({ nfts, balance, loading, error, isConnected }: Props) {
  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#8a7cb0]">
        Connect your wallet to see CHOG NFTs you hold
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#6E3AFF]/30 bg-[#1a0f2e]/70 p-4 text-sm text-[#b8aad8]">
        Loading NFTs…
      </div>
    );
  }

  if (balance === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100/90">
        No CHOG NFT in this wallet · wins pay <strong>80%</strong> of the pool (90% with NFT)
        <p className="mt-2 font-mono text-[10px] text-[#8a7cb0]">{CHOG_NFT}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#6E3AFF]/30 bg-[#1a0f2e]/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[#B794FF]">My CHOG NFTs</h2>
        <span className="text-xs text-[#8a7cb0]">{balance} total</span>
      </div>
      {error && <p className="mb-2 text-xs text-amber-300/90">{error}</p>}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {nfts.map((nft) => (
          <figure
            key={nft.tokenId}
            className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0618]"
          >
            <ChogImage
              src={nft.imageUrl}
              alt={nft.name}
              className="aspect-square w-full object-cover"
              fallbackIndex={Number(nft.tokenId) % 5}
            />
            <figcaption className="truncate px-2 py-1 text-[10px] text-[#8a7cb0]">{nft.name}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-3 text-xs text-[#6E3AFF]">NFT detected · 90% winner pool / 10% buyback</p>
    </div>
  );
}

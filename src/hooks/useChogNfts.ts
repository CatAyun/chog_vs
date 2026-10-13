import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useReadContract } from "wagmi";
import { erc721EnumerableAbi } from "../abi/erc721";
import { CHOG_ASSETS } from "../config/assets";
import { CHOG_NFT } from "../config/chain";
import { fetchNftMetadata } from "../lib/nftMetadata";

export type OwnedChogNft = {
  tokenId: string;
  imageUrl: string;
  name: string;
};

const MAX_DISPLAY = 12;

export function useChogNfts() {
  const { address, isConnected } = useAccount();
  const client = usePublicClient();
  const [nfts, setNfts] = useState<OwnedChogNft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: balance } = useReadContract({
    address: CHOG_NFT,
    abi: erc721EnumerableAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const balanceNum = balance ? Number(balance) : 0;

  useEffect(() => {
    if (!isConnected || !address || !client || balanceNum === 0) {
      setNfts([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      const count = Math.min(balanceNum, MAX_DISPLAY);
      const list: OwnedChogNft[] = [];

      for (let i = 0; i < count; i++) {
        try {
          const tokenId = await client.readContract({
            address: CHOG_NFT,
            abi: erc721EnumerableAbi,
            functionName: "tokenOfOwnerByIndex",
            args: [address, BigInt(i)],
          });
          let imageUrl: string = CHOG_ASSETS.gallery[i % CHOG_ASSETS.gallery.length];
          let name = `CHOG #${tokenId.toString()}`;

          try {
            const uri = await client.readContract({
              address: CHOG_NFT,
              abi: erc721EnumerableAbi,
              functionName: "tokenURI",
              args: [tokenId],
            });
            const meta = await fetchNftMetadata(uri);
            if (meta.image) imageUrl = meta.image;
            if (meta.name) name = meta.name;
          } catch {
            /* 无 tokenURI 或拉取失败时用 gallery 占位 */
          }

          list.push({ tokenId: tokenId.toString(), imageUrl, name });
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : "Could not enumerate NFTs (contract may not be ERC721Enumerable)");
          }
          break;
        }
      }

      if (!cancelled) {
        setNfts(list);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isConnected, address, client, balanceNum]);

  return {
    nfts,
    balance: balanceNum,
    hasNft: balanceNum > 0,
    loading,
    error,
  };
}

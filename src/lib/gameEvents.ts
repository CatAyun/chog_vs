import { decodeEventLog, formatEther, type Hash, type TransactionReceipt } from "viem";
import { chogRpsVsBotAbi } from "../abi/chogRpsVsBot";
import type { Move } from "./rps";

const UINT_TO_MOVE: Move[] = ["rock", "paper", "scissors"];

export type OnChainGameResult = {
  playerMove: Move;
  botMove: Move;
  outcome: "tie" | "win" | "lose";
  amount: string;
  playerPayout: string;
  buybackAmount: string;
  hadNft: boolean;
  txHash: Hash;
};

export function parseGamePlayedFromReceipt(receipt: TransactionReceipt): OnChainGameResult | null {
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: chogRpsVsBotAbi,
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName !== "GamePlayed") continue;
      const o = Number(decoded.args.outcome);
      const outcome = o === 0 ? "tie" : o === 1 ? "win" : "lose";
      return {
        playerMove: UINT_TO_MOVE[Number(decoded.args.playerMove)] ?? "rock",
        botMove: UINT_TO_MOVE[Number(decoded.args.botMove)] ?? "rock",
        outcome,
        amount: formatEther(decoded.args.amount),
        playerPayout: formatEther(decoded.args.playerPayout),
        buybackAmount: formatEther(decoded.args.buybackAmount),
        hadNft: decoded.args.hadNft,
        txHash: receipt.transactionHash,
      };
    } catch {
      continue;
    }
  }
  return null;
}

export function moveToUint8(move: Move): number {
  return { rock: 0, paper: 1, scissors: 2 }[move];
}

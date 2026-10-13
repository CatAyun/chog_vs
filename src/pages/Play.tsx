import { useMemo, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { CHOG_ASSETS } from "../config/assets";
import { CHOG_RPS_CONFIG, CHOG_TOKEN, CONTRACTS, explorerContract, PAYOUT } from "../config/chain";
import { ChogImage } from "../components/ChogImage";
import { OwnedNftGallery } from "../components/OwnedNftGallery";
import { useChogNfts } from "../hooks/useChogNfts";
import { chogRpsVsBotAbi, erc20ApproveAbi } from "../abi/chogRpsVsBot";
import { moveToUint8, parseGamePlayedFromReceipt, type OnChainGameResult } from "../lib/gameEvents";
import { type Move, moveLabel } from "../lib/rps";

const moves: { id: Move; label: string; img: string; emoji: string }[] = [
  { id: "rock", label: "Rock", img: CHOG_ASSETS.rps.rock, emoji: "✊" },
  { id: "paper", label: "Paper", img: CHOG_ASSETS.rps.paper, emoji: "✋" },
  { id: "scissors", label: "Scissors", img: CHOG_ASSETS.rps.scissors, emoji: "✌️" },
];

const BOT_EMOJI: Record<Move, string> = { rock: "✊", paper: "✋", scissors: "✌️" };

export function Play() {
  const { address, isConnected } = useAccount();
  const client = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { nfts, balance, hasNft, loading, error } = useChogNfts();
  const [bet, setBet] = useState("100");
  const [move, setMove] = useState<Move | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [chainResult, setChainResult] = useState<OnChainGameResult | null>(null);

  const gameAddress = CONTRACTS.rpsGame;
  const betNum = Number.parseFloat(bet);
  const betValid = Number.isFinite(betNum) && betNum > 0;

  const amountWei = betValid ? parseEther(bet) : 0n;

  const { data: allowance } = useReadContract({
    address: CHOG_TOKEN,
    abi: erc20ApproveAbi,
    functionName: "allowance",
    args: address && gameAddress ? [address, gameAddress] : undefined,
    query: { enabled: Boolean(address && gameAddress) },
  });

  const payoutPreview = useMemo(() => {
    const rate = hasNft ? PAYOUT.withNft : PAYOUT.withoutNft;
    const buyback = hasNft ? PAYOUT.buybackWithNft : PAYOUT.buybackWithoutNft;
    return { rate, buyback };
  }, [hasNft]);

  async function playOnChain() {
    if (!move || !betValid || !address || !client || !gameAddress) return;
    setBusy(true);
    setStatus("");
    setChainResult(null);

    try {
      const need = amountWei;
      const allowed = allowance ?? 0n;
      if (allowed < need) {
        setStatus("Approving CHOG…");
        const approveHash = await writeContractAsync({
          address: CHOG_TOKEN,
          abi: erc20ApproveAbi,
          functionName: "approve",
          args: [gameAddress, need],
        });
        await client.waitForTransactionReceipt({ hash: approveHash });
      }

      setStatus("Submitting play (you + bot moves on-chain)…");
      const playHash = await writeContractAsync({
        address: gameAddress,
        abi: chogRpsVsBotAbi,
        functionName: "play",
        args: [moveToUint8(move), need],
      });
      const receipt = await client.waitForTransactionReceipt({ hash: playHash });
      const parsed = parseGamePlayedFromReceipt(receipt);
      if (!parsed) {
        throw new Error("GamePlayed event not found in transaction");
      }
      setChainResult(parsed);
      setStatus("Settled · result from on-chain event");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Failed: ${msg.slice(0, 200)}`);
    } finally {
      setBusy(false);
    }
  }

  const displayMove = chainResult?.playerMove ?? move;
  const displayBot = chainResult?.botMove ?? null;

  let resultText = "";
  if (chainResult) {
    const { outcome, playerPayout, buybackAmount, amount } = chainResult;
    if (outcome === "tie") {
      resultText = `On-chain tie · refunded ${playerPayout} CHOG (bet ${amount})`;
    } else if (outcome === "win") {
      resultText = `You won on-chain · received ${playerPayout} CHOG · buyback ${buybackAmount} CHOG`;
    } else {
      resultText = `Bot won on-chain · you lost ${amount} CHOG · buyback ${buybackAmount} CHOG`;
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Rock · Paper · Scissors</h1>
        <p className="mt-2 text-sm text-[#b8aad8]">Real CHOG bets · player and bot moves settle on-chain</p>
      </div>

      <OwnedNftGallery
        nfts={nfts}
        balance={balance}
        loading={loading}
        error={error}
        isConnected={isConnected}
      />

      <div className="rounded-2xl border border-[#6E3AFF]/30 bg-[#1a0f2e]/70 p-5 text-sm text-[#c4b8e8]">
        <p>
          Pool = your bet + house match. Winner:
          <strong className="text-white"> {payoutPreview.rate * 100}%</strong>
          , buyback <strong className="text-white">{payoutPreview.buyback * 100}%</strong>
          {hasNft ? " (NFT on-chain)" : ""}
        </p>
        {!gameAddress && (
          <p className="mt-2 text-amber-200/90">
            Deploy <code className="text-[#B794FF]">ChogRPSVsBot</code> and set{" "}
            <code className="text-[#B794FF]">src/config/chain.ts</code> → <code>CONTRACTS.rpsGame</code> (
            <code>npm run deploy:game</code>)
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-[#c4b8e8]">Bet (CHOG)</label>
        <input
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          disabled={busy}
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#0d0618] px-4 py-3 font-mono outline-none focus:border-[#6E3AFF] disabled:opacity-50"
          placeholder="100"
        />
        {gameAddress && allowance !== undefined && betValid && (
          <p className="mt-1 text-[10px] text-[#6a5d8a]">
            Allowance {formatEther(allowance)} / need {bet} CHOG
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {moves.map((m, i) => (
          <button
            key={m.id}
            type="button"
            disabled={busy}
            onClick={() => setMove(m.id)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition disabled:opacity-50 ${
              move === m.id
                ? "border-[#6E3AFF] bg-[#6E3AFF]/25 shadow-lg shadow-[#6E3AFF]/20"
                : "border-white/10 bg-white/5 hover:border-[#6E3AFF]/40"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-[#0d0618]">
              <ChogImage
                src={m.img}
                alt={`${m.label} icon`}
                className="h-full w-full object-contain"
                fallbackIndex={i + 1}
              />
            </div>
            <span className="text-xs font-medium">{m.label}</span>
            <span className="text-lg" aria-hidden>{m.emoji}</span>
          </button>
        ))}
      </div>

      {(displayBot || busy) && (
        <div className="flex items-center justify-center gap-8 rounded-2xl border border-white/10 bg-white/5 py-6">
          <div className="text-center">
            <p className="text-xs text-[#8a7cb0]">You (on-chain)</p>
            <p className="text-4xl">{displayMove ? moves.find((m) => m.id === displayMove)?.emoji : "—"}</p>
            <p className="text-xs">{displayMove ? moveLabel(displayMove) : ""}</p>
          </div>
          <span className="font-bold text-[#6E3AFF]">VS</span>
          <div className="text-center">
            <p className="text-xs text-[#8a7cb0]">Bot (on-chain)</p>
            <p className="text-4xl">{busy && !displayBot ? "⏳" : displayBot ? BOT_EMOJI[displayBot] : "—"}</p>
            <p className="text-xs">{displayBot ? moveLabel(displayBot) : busy ? "Waiting for block…" : ""}</p>
          </div>
        </div>
      )}

      {resultText && (
        <p
          className={`rounded-xl px-4 py-3 text-center text-sm ${
            chainResult?.outcome === "win"
              ? "bg-emerald-500/20 text-emerald-100"
              : chainResult?.outcome === "lose"
                ? "bg-red-500/15 text-red-100"
                : "bg-white/10 text-[#e0d6ff]"
          }`}
        >
          {resultText}
          {chainResult && (
            <a
              href={explorerContract(chainResult.txHash)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-[#B794FF] hover:underline"
            >
              View transaction
            </a>
          )}
        </p>
      )}

      {status && <p className="text-center text-xs text-[#b8aad8]">{status}</p>}

      <button
        type="button"
        disabled={!isConnected || !move || !betValid || busy || !gameAddress}
        onClick={() => void playOnChain()}
        className="w-full rounded-xl bg-[#6E3AFF] py-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {!isConnected
          ? "Connect wallet"
          : !gameAddress
            ? "Game contract not configured"
            : busy
              ? "On-chain…"
              : `Play on-chain · ${move ?? "—"} · ${bet} CHOG`}
      </button>

      <p className="text-center text-xs text-[#8a7cb0]">
        Config{" "}
        <a href={explorerContract(CHOG_RPS_CONFIG)} target="_blank" rel="noreferrer" className="text-[#B794FF]">
          {CHOG_RPS_CONFIG.slice(0, 10)}…
        </a>
        {gameAddress ? (
          <>
            {" · "}Game{" "}
            <a href={explorerContract(gameAddress)} target="_blank" rel="noreferrer" className="text-[#B794FF]">
              {gameAddress.slice(0, 10)}…
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}

import { Link } from "react-router-dom";
import { CHOG_ASSETS } from "../config/assets";
import { CHOG_NFT, CHOG_TOKEN, PAYOUT } from "../config/chain";
import { ChogImage } from "../components/ChogImage";

export function Home() {
  return (
    <div className="space-y-14">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#6E3AFF]/40 bg-[#6E3AFF]/10 px-3 py-1 text-xs text-[#B794FF]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6E3AFF]" />
            Monad · on-chain RPS
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Hold <span className="text-[#6E3AFF]">CHOG NFT</span>
            <br />
            Bet <span className="text-[#F5A8FF]">$CHOG</span>
          </h1>
          <p className="text-[#c4b8e8] leading-relaxed">
            Winner pool: <strong className="text-white">{PAYOUT.withNft * 100}%</strong> with NFT,{" "}
            <strong className="text-white">{PAYOUT.withoutNft * 100}%</strong> without. The rest (
            {PAYOUT.buybackWithNft * 100}% / {PAYOUT.buybackWithoutNft * 100}%) buys back CHOG NFTs and lists at{" "}
            <strong className="text-[#B794FF]">{PAYOUT.listMultiplier}×</strong> floor.
          </p>
          <Link
            to="/play"
            className="inline-flex rounded-xl bg-[#6E3AFF] px-6 py-3 text-sm font-semibold shadow-lg shadow-[#6E3AFF]/40 hover:bg-[#8255ff]"
          >
            Play now
          </Link>
          <div className="space-y-1 font-mono text-[11px] text-[#8a7cb0]">
            <p>CHOG: {CHOG_TOKEN}</p>
            <p>NFT: {CHOG_NFT}</p>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-[#6E3AFF]/30 bg-[#1a0f2e]/60 p-2 shadow-2xl shadow-[#6E3AFF]/20">
            <ChogImage
              src={CHOG_ASSETS.heroMain}
              alt="CHOG hero (replace hero-main.png)"
              className="aspect-[4/3] w-full rounded-xl object-cover"
              fallbackIndex={0}
            />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden h-20 w-20 overflow-hidden rounded-2xl border-2 border-[#6E3AFF] md:block">
            <ChogImage src={CHOG_ASSETS.nftBadge} alt="NFT badge" className="h-full w-full object-cover" fallbackIndex={2} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-lg font-semibold text-[#B794FF]">CHOG gallery</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {CHOG_ASSETS.gallery.map((src, i) => (
            <div
              key={src}
              className="overflow-hidden rounded-xl border border-white/10 bg-[#1a0f2e]/50 transition hover:border-[#6E3AFF]/50"
            >
              <img src={src} alt={`CHOG artwork ${i + 1}`} className="aspect-square w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "1. Play", desc: "Rock-paper-scissors vs the bot — no matchmaking queue" },
          { title: "2. Settle", desc: "Winners take 90% or 80% of the pool based on NFT ownership" },
          { title: "3. Buyback", desc: "Protocol share buys NFTs → lists at 1.2× floor for holders" },
        ].map((step) => (
          <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <h3 className="font-semibold text-[#6E3AFF]">{step.title}</h3>
            <p className="mt-2 text-sm text-[#b8aad8]">{step.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

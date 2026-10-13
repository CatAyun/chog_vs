import { Link, NavLink } from "react-router-dom";
import { CHOG_NFT, CHOG_RPS_CONFIG, CHOG_TOKEN, explorerContract } from "../config/chain";
import { ConnectButton } from "./ConnectButton";
import { MonadBg } from "./MonadBg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/play", label: "Play" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-[#F4F0FF]">
      <MonadBg />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0618]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6E3AFF] text-sm">
              ◆
            </span>
            <span>
              CHOG <span className="text-[#B794FF]">RPS</span>
            </span>
            <span className="rounded-full border border-[#6E3AFF]/40 px-2 py-0.5 text-[10px] uppercase text-[#B794FF]">
              Monad
            </span>
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm transition ${isActive ? "bg-[#6E3AFF]/30 text-white" : "text-[#c4b8e8] hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <ConnectButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t border-white/10 py-8 text-center text-xs text-[#8a7cb0]">
        <p className="font-mono text-[10px]">Monad · CHOG {CHOG_TOKEN}</p>
        <p className="mt-1 font-mono text-[10px]">
          Config{" "}
          <a
            href={explorerContract(CHOG_RPS_CONFIG)}
            target="_blank"
            rel="noreferrer"
            className="text-[#B794FF] hover:underline"
          >
            {CHOG_RPS_CONFIG.slice(0, 10)}…
          </a>
          {" · "}NFT {CHOG_NFT.slice(0, 10)}…
        </p>
      </footer>
    </div>
  );
}

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const injected = connectors[0];

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="rounded-xl border border-[#6E3AFF]/50 bg-[#6E3AFF]/20 px-3 py-1.5 text-xs font-medium hover:bg-[#6E3AFF]/35"
      >
        {address.slice(0, 6)}…{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={!injected || isPending}
      onClick={() => injected && connect({ connector: injected })}
      className="rounded-xl bg-[#6E3AFF] px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-[#6E3AFF]/30 hover:bg-[#8255ff] disabled:opacity-50"
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </button>
  );
}

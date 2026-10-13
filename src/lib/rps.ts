export type Move = "rock" | "paper" | "scissors";

export const MOVES: Move[] = ["rock", "paper", "scissors"];

export type RpsOutcome = "win" | "lose" | "tie";

export function beats(a: Move, b: Move): boolean {
  return (
    (a === "rock" && b === "scissors") ||
    (a === "paper" && b === "rock") ||
    (a === "scissors" && b === "paper")
  );
}

export function resolveRps(player: Move, bot: Move): RpsOutcome {
  if (player === bot) return "tie";
  return beats(player, bot) ? "win" : "lose";
}

export function moveLabel(m: Move): string {
  return { rock: "Rock", paper: "Paper", scissors: "Scissors" }[m];
}

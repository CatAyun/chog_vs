import { ethers } from "hardhat";

const CHOG = "0x350035555e10d9afaf1566aaebfced5ba6c27777";
const GAME =
  process.env.CHOG_RPS_GAME || "0xfDC49be5Ad8abFcc433a28833f4D2398a212691a";

async function main() {
  const [signer] = await ethers.getSigners();
  const amountHuman = process.env.DEPOSIT_AMOUNT || "1000";
  const amount = ethers.parseEther(amountHuman);

  console.log("Signer:", await signer.getAddress());
  console.log("Game:", GAME);
  console.log("Deposit:", amountHuman, "CHOG");

  const chog = await ethers.getContractAt(
    [
      "function approve(address spender, uint256 amount) returns (bool)",
      "function balanceOf(address account) view returns (uint256)",
    ],
    CHOG,
  );
  const game = await ethers.getContractAt("ChogRPSVsBot", GAME);

  const bal = await chog.balanceOf(await signer.getAddress());
  console.log("Wallet CHOG balance:", ethers.formatEther(bal));
  if (bal < amount) {
    throw new Error(`钱包 CHOG 不足，需要 ${amountHuman}，当前 ${ethers.formatEther(bal)}`);
  }

  const approveTx = await chog.approve(GAME, amount);
  await approveTx.wait();
  console.log("approve OK");

  const depositTx = await game.deposit(amount);
  await depositTx.wait();
  console.log("deposit OK");

  const houseBal = await chog.balanceOf(GAME);
  console.log("Game contract CHOG balance:", ethers.formatEther(houseBal));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

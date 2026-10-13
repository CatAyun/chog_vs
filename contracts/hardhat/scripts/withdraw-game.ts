import { ethers } from "hardhat";

const GAME =
  process.env.CHOG_RPS_GAME || "0xfDC49be5Ad8abFcc433a28833f4D2398a212691a";

async function main() {
  const [signer] = await ethers.getSigners();
  const game = await ethers.getContractAt("ChogRPSVsBot", GAME);
  const owner = await game.owner();
  const addr = await signer.getAddress();
  if (owner.toLowerCase() !== addr.toLowerCase()) {
    throw new Error(`not owner: contract owner=${owner}, signer=${addr}`);
  }

  const all = process.env.WITHDRAW_ALL === "1";
  if (all) {
    const tx = await game.withdrawChogAll();
    await tx.wait();
    console.log("withdrawChogAll OK");
  } else {
    const amountHuman = process.env.WITHDRAW_AMOUNT;
    if (!amountHuman) throw new Error("set WITHDRAW_AMOUNT or WITHDRAW_ALL=1");
    const tx = await game.withdrawChog(ethers.parseEther(amountHuman));
    await tx.wait();
    console.log("withdrawChog OK:", amountHuman, "CHOG");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

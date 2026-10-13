import { ethers } from "hardhat";

const CHOG = "0x350035555e10d9afaf1566aaebfced5ba6c27777";
const CHOG_NFT = "0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763";
const CONFIG = process.env.CHOG_RPS_CONFIG || "0x011E1E9d9919deEbc5B3Aa8ADeEEFEcA7c8956c2";

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasury = process.env.TREASURY_ADDRESS || (await deployer.getAddress());

  console.log("Deployer:", await deployer.getAddress());
  console.log("Treasury:", treasury);
  console.log("Link Config:", CONFIG);

  const Factory = await ethers.getContractFactory("ChogRPSVsBot");
  const game = await Factory.deploy(CHOG, CHOG_NFT, treasury);
  await game.waitForDeployment();
  const gameAddr = await game.getAddress();
  console.log("ChogRPSVsBot deployed:", gameAddr);

  const config = await ethers.getContractAt("ChogRPSConfig", CONFIG);
  const tx = await config.setGame(gameAddr);
  await tx.wait();
  console.log("Config.setGame OK");

  console.log("\nNext: fund house bankroll on game contract:");
  console.log("  chog.approve(game, amount); game.deposit(amount);");
  console.log("\nUpdate src/config/chain.ts CONTRACTS.rpsGame =", gameAddr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { ethers } from "hardhat";

const CHOG = "0x350035555e10d9afaf1566aaebfced5ba6c27777";
const CHOG_NFT = "0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763";

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasury = process.env.TREASURY_ADDRESS || (await deployer.getAddress());

  console.log("Deployer:", await deployer.getAddress());
  console.log("Treasury:", treasury);
  console.log("CHOG:", CHOG);
  console.log("CHOG NFT:", CHOG_NFT);

  const Factory = await ethers.getContractFactory("ChogRPSConfig");
  const config = await Factory.deploy(CHOG, CHOG_NFT, treasury);
  await config.waitForDeployment();

  const addr = await config.getAddress();
  console.log("ChogRPSConfig deployed:", addr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

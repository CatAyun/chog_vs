// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {ChogRPSConfig} from "../src/ChogRPSConfig.sol";

contract Deploy is Script {
    address constant CHOG = 0x350035555e10d9afaf1566aaebfced5ba6c27777;
    address constant CHOG_NFT = 0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763;

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        address treasury = vm.envOr("TREASURY_ADDRESS", deployer);

        vm.startBroadcast(pk);

        ChogRPSConfig config = new ChogRPSConfig(CHOG, CHOG_NFT, treasury);

        vm.stopBroadcast();

        console2.log("ChogRPSConfig", address(config));
        console2.log("CHOG", CHOG);
        console2.log("CHOG_NFT", CHOG_NFT);
        console2.log("treasury", treasury);
    }
}

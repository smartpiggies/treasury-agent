// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GatewaySwapReceiver} from "../src/GatewaySwapReceiver.sol";

// Foundry deploy script
// Usage:
//   forge script script/Deploy.s.sol --rpc-url arbitrum --broadcast --verify
//   forge script script/Deploy.s.sol --rpc-url base --broadcast --verify

contract Deploy {
    // Circle Gateway Minter - same on all chains
    address constant GATEWAY_MINTER = 0x2222222d7164433c4C09B0b0D809a9b52C04C205;

    // Uniswap Universal Router per chain
    address constant UNIVERSAL_ROUTER_ARB = 0xa51afAFe0263b40EDaEf0Df8781Ea9aa03E381a3;
    address constant UNIVERSAL_ROUTER_BASE = 0x6fF5693b99212Da76Ad316178A184AB56D299b43;

    // USDC per chain
    address constant USDC_ARB = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    address constant USDC_BASE = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external {
        uint256 chainId = block.chainid;
        address universalRouter;
        address usdc;

        if (chainId == 42161) {
            universalRouter = UNIVERSAL_ROUTER_ARB;
            usdc = USDC_ARB;
        } else if (chainId == 8453) {
            universalRouter = UNIVERSAL_ROUTER_BASE;
            usdc = USDC_BASE;
        } else {
            revert("Unsupported chain");
        }

        // vm.startBroadcast(); // Uncomment when deploying with Foundry
        new GatewaySwapReceiver(GATEWAY_MINTER, universalRouter, usdc);
        // vm.stopBroadcast();
    }
}

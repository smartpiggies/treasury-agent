// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GatewaySwapReceiver} from "../src/GatewaySwapReceiver.sol";

/// @notice Deploy GatewaySwapReceiver
/// Usage:
///   forge create src/GatewaySwapReceiver.sol:GatewaySwapReceiver \
///     --rpc-url arbitrum \
///     --private-key $TREASURY_PRIVATE_KEY \
///     --constructor-args 0x2222222d7164433c4C09B0b0D809a9b52C04C205 0xA51afAFe0263b40EdaEf0Df8781eA9aa03E381a3 0xaf88d065e77c8cC2239327C5EDb3A432268e5831

contract Deploy {
    // Circle Gateway Minter - same on all chains
    address constant GATEWAY_MINTER = 0x2222222d7164433c4C09B0b0D809a9b52C04C205;

    // Uniswap Universal Router per chain
    address constant UNIVERSAL_ROUTER_ARB = 0xA51afAFe0263b40EdaEf0Df8781eA9aa03E381a3;
    address constant UNIVERSAL_ROUTER_BASE = 0x6fF5693b99212Da76ad316178A184AB56D299b43;

    // USDC per chain
    address constant USDC_ARB = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    address constant USDC_BASE = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
}

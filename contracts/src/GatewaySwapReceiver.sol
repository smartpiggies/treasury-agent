// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGatewayMinter {
    function gatewayMint(bytes calldata attestation, bytes calldata signature) external;
}

interface IUniversalRouter {
    function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable;
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

/// @title GatewaySwapReceiver
/// @notice Atomically mints USDC via Circle Gateway and swaps through Uniswap Universal Router
/// @dev Flow: gatewayMint → transfer USDC to router → router.execute (payerIsUser=false)
contract GatewaySwapReceiver {
    address public immutable gatewayMinter;
    address public immutable universalRouter;
    address public immutable usdc;
    address public immutable owner;

    error NotOwner();
    error SwapFailed();

    constructor(address _gatewayMinter, address _universalRouter, address _usdc) {
        gatewayMinter = _gatewayMinter;
        universalRouter = _universalRouter;
        usdc = _usdc;
        owner = msg.sender;
    }

    /// @notice Mint USDC from Gateway attestation, then swap via Universal Router
    /// @param attestation Circle Gateway attestation bytes
    /// @param signature Circle Gateway signature bytes
    /// @param commands Universal Router command bytes
    /// @param inputs Universal Router encoded inputs per command
    /// @param deadline Swap deadline timestamp
    /// @param outputToken Address of the expected output token (address(0) for ETH)
    /// @param recipient Address to receive swap output
    function executeSwap(
        bytes calldata attestation,
        bytes calldata signature,
        bytes calldata commands,
        bytes[] calldata inputs,
        uint256 deadline,
        address outputToken,
        address recipient
    ) external {
        // 1. Mint USDC via Gateway
        IGatewayMinter(gatewayMinter).gatewayMint(attestation, signature);

        // 2. Transfer minted USDC to Universal Router (so payerIsUser=false works)
        uint256 usdcBalance = IERC20(usdc).balanceOf(address(this));
        IERC20(usdc).transfer(universalRouter, usdcBalance);

        // 3. Execute swap via Universal Router
        IUniversalRouter(universalRouter).execute(commands, inputs, deadline);

        // 4. Forward any remaining output tokens to recipient
        if (outputToken == address(0)) {
            // Native ETH (from UNWRAP_WETH)
            uint256 ethBalance = address(this).balance;
            if (ethBalance > 0) {
                (bool sent, ) = recipient.call{value: ethBalance}("");
                if (!sent) revert SwapFailed();
            }
        } else {
            uint256 tokenBalance = IERC20(outputToken).balanceOf(address(this));
            if (tokenBalance > 0) {
                IERC20(outputToken).transfer(recipient, tokenBalance);
            }
        }
    }

    /// @notice Rescue stuck tokens (owner only)
    function rescueTokens(address token) external {
        if (msg.sender != owner) revert NotOwner();
        if (token == address(0)) {
            (bool sent, ) = owner.call{value: address(this).balance}("");
            if (!sent) revert SwapFailed();
        } else {
            uint256 balance = IERC20(token).balanceOf(address(this));
            if (balance > 0) {
                IERC20(token).transfer(owner, balance);
            }
        }
    }

    /// @notice Accept native ETH (from router's UNWRAP_WETH)
    receive() external payable {}
}

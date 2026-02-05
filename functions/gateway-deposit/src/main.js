import { ethers } from 'ethers';

// Circle Gateway Wallet - same address on all chains
const GATEWAY_WALLET = '0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE';

// USDC contract addresses by chain ID
const USDC_ADDRESSES = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',     // Ethereum
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',  // Base
};

// Circle CCTP domain IDs
const CIRCLE_DOMAINS = {
  1: 0,      // Ethereum
  42161: 3,  // Arbitrum
  8453: 6,   // Base
};

// RPC URLs by chain ID
const RPC_URLS = {
  1: process.env.RPC_ETHEREUM || 'https://eth.llamarpc.com',
  42161: process.env.RPC_ARBITRUM || 'https://arb1.arbitrum.io/rpc',
  8453: process.env.RPC_BASE || 'https://mainnet.base.org',
};

// Chain names
const CHAIN_NAMES = {
  1: 'Ethereum',
  42161: 'Arbitrum',
  8453: 'Base',
};

// ERC20 ABI (minimal)
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
];

// Gateway Wallet ABI
const GATEWAY_ABI = [
  'function depositForBurn(uint256 amount, uint32 destinationDomain, bytes32 mintRecipient, address burnToken) returns (uint64)',
];

// USDC has 6 decimals
const USDC_DECIMALS = 6;

/**
 * Convert address to bytes32 for mintRecipient
 */
function addressToBytes32(address) {
  return ethers.zeroPadValue(address, 32);
}

/**
 * Parse USDC amount (handles both string dollar amounts like "$100" and numeric values)
 */
function parseAmount(amount) {
  let value = amount;
  if (typeof value === 'string') {
    // Remove $ and commas
    value = value.replace(/[$,]/g, '').trim();
  }
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  return ethers.parseUnits(parsed.toString(), USDC_DECIMALS);
}

/**
 * Format USDC amount for display
 */
function formatAmount(amount) {
  return ethers.formatUnits(amount, USDC_DECIMALS);
}

/**
 * Main handler for Appwrite function
 */
export default async function ({ req, res, log, error }) {
  // Parse request body
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.json({
      success: false,
      error: 'Invalid JSON body',
    }, 400);
  }

  const { chainId, amount, recipient } = body;

  // Validate required params
  if (!chainId || !amount) {
    return res.json({
      success: false,
      error: 'Missing required parameters: chainId, amount',
    }, 400);
  }

  // Validate chain
  const chainIdNum = parseInt(chainId);
  if (!USDC_ADDRESSES[chainIdNum]) {
    return res.json({
      success: false,
      error: `Unsupported chain: ${chainId}. Supported: Ethereum (1), Arbitrum (42161), Base (8453)`,
    }, 400);
  }

  // Get environment variables
  const privateKey = process.env.TREASURY_PRIVATE_KEY;
  const treasuryAddress = process.env.TREASURY_ADDRESS;

  if (!privateKey || !treasuryAddress) {
    error('Missing TREASURY_PRIVATE_KEY or TREASURY_ADDRESS environment variables');
    return res.json({
      success: false,
      error: 'Server configuration error',
    }, 500);
  }

  try {
    // Parse amount
    const amountParsed = parseAmount(amount);
    log(`Depositing ${formatAmount(amountParsed)} USDC on ${CHAIN_NAMES[chainIdNum]}`);

    // Connect to chain
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chainIdNum]);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Verify wallet address matches
    if (wallet.address.toLowerCase() !== treasuryAddress.toLowerCase()) {
      error('Private key does not match treasury address');
      return res.json({
        success: false,
        error: 'Wallet configuration error',
      }, 500);
    }

    // Get contract instances
    const usdcAddress = USDC_ADDRESSES[chainIdNum];
    const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, wallet);
    const gateway = new ethers.Contract(GATEWAY_WALLET, GATEWAY_ABI, wallet);

    // Check USDC balance
    const balance = await usdc.balanceOf(wallet.address);
    log(`Current USDC balance: ${formatAmount(balance)}`);

    if (balance < amountParsed) {
      return res.json({
        success: false,
        error: `Insufficient USDC balance. Have: ${formatAmount(balance)}, Need: ${formatAmount(amountParsed)}`,
      }, 400);
    }

    // Check allowance
    const allowance = await usdc.allowance(wallet.address, GATEWAY_WALLET);
    log(`Current allowance: ${formatAmount(allowance)}`);

    let approveTxHash = null;
    if (allowance < amountParsed) {
      log('Approving USDC spend...');
      const approveTx = await usdc.approve(GATEWAY_WALLET, amountParsed);
      const approveReceipt = await approveTx.wait();
      approveTxHash = approveReceipt.hash;
      log(`Approval confirmed: ${approveTxHash}`);
    }

    // Prepare deposit parameters
    const domain = CIRCLE_DOMAINS[chainIdNum];
    const mintRecipient = addressToBytes32(recipient || wallet.address);

    log(`Depositing to Gateway (domain: ${domain})...`);

    // Execute deposit
    const depositTx = await gateway.depositForBurn(
      amountParsed,
      domain,
      mintRecipient,
      usdcAddress
    );
    const depositReceipt = await depositTx.wait();
    const depositTxHash = depositReceipt.hash;

    log(`Deposit confirmed: ${depositTxHash}`);

    return res.json({
      success: true,
      data: {
        chain: CHAIN_NAMES[chainIdNum],
        chainId: chainIdNum,
        amount: formatAmount(amountParsed),
        recipient: recipient || wallet.address,
        approveTxHash,
        depositTxHash,
        explorerUrl: getExplorerUrl(chainIdNum, depositTxHash),
      },
    });
  } catch (err) {
    error(`Deposit failed: ${err.message}`);
    return res.json({
      success: false,
      error: err.message,
    }, 500);
  }
}

/**
 * Get block explorer URL for a transaction
 */
function getExplorerUrl(chainId, txHash) {
  const explorers = {
    1: 'https://etherscan.io',
    42161: 'https://arbiscan.io',
    8453: 'https://basescan.org',
  };
  return `${explorers[chainId] || explorers[1]}/tx/${txHash}`;
}

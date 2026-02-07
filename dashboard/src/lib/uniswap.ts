import { encodeAbiParameters, parseAbiParameters, concat, numberToHex } from 'viem';
import { WETH_ADDRESSES, USDC_ADDRESSES } from './contracts';

// Universal Router command bytes
const V3_SWAP_EXACT_IN = 0x00;
const UNWRAP_WETH = 0x0c;

// Special addresses used by Universal Router
const ADDRESS_THIS = '0x0000000000000000000000000000000000000002' as const; // router keeps tokens

export interface SwapParams {
  chainId: number;
  amountIn: bigint;
  amountOutMin: bigint;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  recipient: `0x${string}`;
  fee: number;
}

/** Encode a Uniswap v3 path: tokenIn + fee + tokenOut (packed) */
export function encodePath(
  tokenIn: `0x${string}`,
  fee: number,
  tokenOut: `0x${string}`,
): `0x${string}` {
  // v3 path is: address(20) + uint24(3) + address(20) = 43 bytes, packed
  const tokenInBytes = tokenIn.toLowerCase().replace('0x', '');
  const feeHex = fee.toString(16).padStart(6, '0');
  const tokenOutBytes = tokenOut.toLowerCase().replace('0x', '');
  return `0x${tokenInBytes}${feeHex}${tokenOutBytes}` as `0x${string}`;
}

/** Encode V3_SWAP_EXACT_IN input */
function encodeV3SwapExactIn(
  recipient: `0x${string}`,
  amountIn: bigint,
  amountOutMin: bigint,
  path: `0x${string}`,
  payerIsUser: boolean,
): `0x${string}` {
  return encodeAbiParameters(
    parseAbiParameters('address, uint256, uint256, bytes, bool'),
    [recipient, amountIn, amountOutMin, path, payerIsUser],
  );
}

/** Encode UNWRAP_WETH input */
function encodeUnwrapWeth(
  recipient: `0x${string}`,
  amountMin: bigint,
): `0x${string}` {
  return encodeAbiParameters(
    parseAbiParameters('address, uint256'),
    [recipient, amountMin],
  );
}

/** Get the best fee tier for a token pair */
export function getPoolFee(chainId: number, tokenIn: `0x${string}`, tokenOut: `0x${string}`): number {
  const usdc = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES]?.toLowerCase();
  const weth = WETH_ADDRESSES[chainId]?.toLowerCase();

  const inLower = tokenIn.toLowerCase();
  const outLower = tokenOut.toLowerCase();

  // USDC/WETH pairs typically use 500 (0.05%) fee tier
  if ((inLower === usdc && outLower === weth) || (inLower === weth && outLower === usdc)) {
    return 500;
  }

  // Default to 3000 (0.3%) for other pairs
  return 3000;
}

export interface SwapCommands {
  commands: `0x${string}`;
  inputs: `0x${string}`[];
}

/** Build Universal Router commands + inputs for a swap
 *
 * If output is native ETH (WETH → unwrap):
 *   command 1: V3_SWAP_EXACT_IN to ADDRESS_THIS
 *   command 2: UNWRAP_WETH to recipient
 *
 * If output is ERC20:
 *   command 1: V3_SWAP_EXACT_IN to recipient
 *
 * payerIsUser=false because we've already transferred USDC to the router
 */
export function buildSwapCommands(params: SwapParams): SwapCommands {
  const weth = WETH_ADDRESSES[params.chainId];
  const isOutputEth = params.tokenOut.toLowerCase() === weth?.toLowerCase();

  const path = encodePath(params.tokenIn, params.fee, isOutputEth ? weth : params.tokenOut);

  if (isOutputEth) {
    // Swap USDC → WETH (to router), then unwrap WETH → ETH (to recipient)
    const swapInput = encodeV3SwapExactIn(
      ADDRESS_THIS, // router holds WETH temporarily
      params.amountIn,
      params.amountOutMin,
      path,
      false, // payerIsUser=false: router uses its own USDC balance
    );

    const unwrapInput = encodeUnwrapWeth(
      params.recipient,
      params.amountOutMin,
    );

    return {
      commands: concat([
        numberToHex(V3_SWAP_EXACT_IN, { size: 1 }),
        numberToHex(UNWRAP_WETH, { size: 1 }),
      ]),
      inputs: [swapInput, unwrapInput],
    };
  } else {
    // Direct ERC20 swap to recipient
    const swapInput = encodeV3SwapExactIn(
      params.recipient,
      params.amountIn,
      params.amountOutMin,
      path,
      false,
    );

    return {
      commands: numberToHex(V3_SWAP_EXACT_IN, { size: 1 }),
      inputs: [swapInput],
    };
  }
}

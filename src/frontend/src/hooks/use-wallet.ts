/**
 * EVM wallet hook — backed exclusively by wagmi v3 hooks.
 *
 * ARCHITECTURE: Thin wrapper around wagmi's useConnect / useAccount /
 * useDisconnect / useSendTransaction / useWriteContract / useSwitchChain.
 * No module-level state, no custom mutex, no direct window.ethereum calls.
 *
 * wagmi's useConnect serializes concurrent connector requests internally.
 * useSwitchChain is called automatically before burnToken to ensure the wallet
 * is on Base (8453) — the only chain where the allowlisted tokens live.
 */
import { useCallback } from "react";
import { getAddress, parseUnits } from "viem";

import {
  useAccount,
  useChainId,
  useConfig,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { CHAIN_IDS } from "../types";

const BASE_CHAIN_ID = 8453;

/** Default platform fee rate: 0.69% — used as fallback if backend value is unavailable. */
const DEFAULT_PLATFORM_FEE_RATE = 0.0069;

/** Fetch the USD price of the native token for a given chain ID.
 *  ETH  → chains 1, 10 (Optimism), 8453 (Base)
 *  CELO → chain 42220 (Celo)
 */
async function fetchNativeTokenPriceUsd(chainId: number): Promise<number> {
  const isCelo = chainId === 42220;
  const coinId = isCelo ? "celo" : "ethereum";
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Native price fetch failed: ${res.status}`);
  const json = (await res.json()) as Record<string, { usd?: number }>;
  const price = json[coinId]?.usd;
  if (!price || price <= 0)
    throw new Error(`Invalid native token price received for ${coinId}`);
  return price;
}

function getChainName(chainId: number | undefined): string | null {
  if (!chainId) return null;
  return CHAIN_IDS[chainId] ?? "unknown";
}

/** Returns true when the error indicates MetaMask has a pending request (-32002). */
function isPendingMetaMaskError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as Record<string, unknown>;
  if (e.code === -32002) return true;
  const msg =
    (typeof e.message === "string" ? e.message : "").toLowerCase() +
    (typeof e.details === "string" ? e.details : "").toLowerCase();
  if (
    msg.includes("-32002") ||
    msg.includes("already pending") ||
    msg.includes("previous request is still active") ||
    msg.includes("already processing")
  )
    return true;
  if (e.cause != null) return isPendingMetaMaskError(e.cause);
  try {
    const s = JSON.stringify(err).toLowerCase();
    if (s.includes("-32002") || s.includes("already pending")) return true;
  } catch {
    // ignore serialization errors
  }
  return false;
}

export interface PlatformFeeInfo {
  /** Fee in USD (0.69% of burn value) */
  feeUsd: number;
  /** Fee in native token units (e.g. ETH or CELO) */
  feeNative: number;
  /** Native token symbol */
  nativeSymbol: string;
  /** Native token price in USD used for the conversion */
  nativePriceUsd: number;
}

export interface UseWalletReturn {
  address: string | null;
  chainId: number | null;
  chainName: string | null;
  isConnected: boolean;
  isOnBase: boolean;
  /** True while wagmi is processing a connect attempt. */
  isConnecting: boolean;
  /** True when wagmi's connect error indicates MetaMask has a pending request. */
  isPendingRequest: boolean;
  error: string | null;
  connectMetaMask: () => void;
  connectWalletConnect: () => void;
  /** Legacy alias — calls connectMetaMask. */
  connect: () => void;
  disconnect: () => void;
  /** Clears wagmi's connect error state so the user can retry. */
  resetConnection: () => void;
  switchToBase: () => Promise<void>;
  /** Switches the wallet to any EVM chain by numeric chain ID. */
  switchToChain: (chainId: number) => Promise<void>;
  sendTransaction: (params: {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
    chainId?: number;
  }) => Promise<string>;
  /**
   * Generic contract-call helper for arbitrary EVM calls (to/data/value).
   * Automatically switches the wallet to the target chain (defaults to Base)
   * before sending, then returns the tx hash. Used for the kVCM retirement
   * flow (approve AAM + retireCreditViaKlima) and any other raw contract call.
   */
  sendContractTransaction: (params: {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
    chainId?: number;
  }) => Promise<string>;
  /**
   * Burns ERC-20 tokens by calling transfer(deadAddress, amount) via
   * useWriteContract. Uses the canonical dead address (0x000...dEaD) which
   * is universally accepted — unlike the null address which many ERC-20s reject.
   * Automatically switches to the target chain if the wallet is on a different one.
   * Wallets receive a structured ABI call they can decode, showing token name,
   * method, amount, and a proper Confirm button.
   */
  burnToken: (
    tokenAddress: string,
    amount: string,
    decimals: number,
    chainId?: number,
  ) => Promise<string>;
  /**
   * Calculates and sends the platform fee as a native token transfer.
   * feeUsd: the USD value of (feeRate * 100)% of the burn.
   * chainId: the chain the burn happened on.
   * recipientAddress: the EVM wallet address to receive the fee (from backend config).
   * feeRate: decimal fee rate (e.g. 0.0042 for 0.42%). Defaults to DEFAULT_PLATFORM_FEE_RATE.
   * Returns the fee transfer tx hash.
   */
  sendPlatformFee: (
    feeUsd: number,
    chainId: number,
    recipientAddress: string,
    feeRate?: number,
  ) => Promise<string>;
  /**
   * Fetches the native token price and returns fee info so the UI can
   * display the fee before the user confirms.
   * feeRate: decimal fee rate (e.g. 0.0042 for 0.42%). Defaults to DEFAULT_PLATFORM_FEE_RATE.
   */
  getPlatformFeeInfo: (
    burnAmountUsd: number,
    chainId: number,
    feeRate?: number,
  ) => Promise<PlatformFeeInfo>;
}

export function useWallet(): UseWalletReturn {
  const config = useConfig();
  const { address, status } = useAccount();
  const walletChainId = useChainId();
  const {
    connect: wagmiConnect,
    isPending,
    error: connectError,
    reset,
  } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  const isConnected = status === "connected";
  const isConnecting = isPending;
  const isOnBase = walletChainId === BASE_CHAIN_ID;
  const isPendingRequest = isPendingMetaMaskError(connectError);

  const errorMessage = (() => {
    if (!connectError) return null;
    if (isPendingRequest)
      return "MetaMask has a pending request. Open MetaMask and approve or reject it, then click Try Again.";
    const msg = connectError.message ?? "";
    if (msg.includes("User rejected") || msg.includes("user rejected"))
      return null;
    return msg || "Failed to connect wallet. Please try again.";
  })();

  const getInjectedConnector = useCallback(() => {
    return config.connectors.find(
      (c) => c.type === "injected" || c.id === "injected",
    );
  }, [config.connectors]);

  const getWalletConnectConnector = useCallback(() => {
    return config.connectors.find(
      (c) => c.type === "walletConnect" || c.id === "walletConnect",
    );
  }, [config.connectors]);

  const connectMetaMask = useCallback(() => {
    if (isConnecting) return;
    const connector = getInjectedConnector();
    if (!connector) return;
    wagmiConnect({ connector });
  }, [isConnecting, getInjectedConnector, wagmiConnect]);

  const connectWalletConnect = useCallback(() => {
    // connectWalletConnect is kept for API compatibility but the AppKit modal
    // is the primary connect flow. Callers should use openConnectModal() instead.
    if (isConnecting) return;
    const connector = getWalletConnectConnector();
    if (!connector) {
      connectMetaMask();
      return;
    }
    wagmiConnect({ connector });
  }, [isConnecting, getWalletConnectConnector, wagmiConnect, connectMetaMask]);

  const disconnect = useCallback(() => {
    reset();
    wagmiDisconnect();
  }, [reset, wagmiDisconnect]);

  const resetConnection = useCallback(() => {
    reset();
  }, [reset]);

  /**
   * Switch the wallet to Base (chainId 8453).
   * Throws if the user rejects the switch or the wallet doesn't support it.
   */
  const switchToBase = useCallback(async () => {
    if (walletChainId === BASE_CHAIN_ID) return;
    await switchChainAsync({ chainId: BASE_CHAIN_ID });
  }, [walletChainId, switchChainAsync]);

  /**
   * Switch the wallet to any EVM chain by numeric chain ID.
   */
  const switchToChain = useCallback(
    async (chainId: number) => {
      if (walletChainId === chainId) return;
      await switchChainAsync({
        chainId: chainId as Parameters<typeof switchChainAsync>[0]["chainId"],
      });
    },
    [walletChainId, switchChainAsync],
  );

  const sendTransaction = useCallback(
    async (params: {
      to: `0x${string}`;
      data: `0x${string}`;
      value?: bigint;
      chainId?: number;
    }) => {
      const hash = await sendTransactionAsync({
        to: params.to,
        data: params.data,
        value: params.value ?? 0n,
        ...(params.chainId !== undefined ? { chainId: params.chainId } : {}),
      });
      return hash;
    },
    [sendTransactionAsync],
  );

  /**
   * Generic contract-call helper for arbitrary EVM calls (to/data/value).
   * Switches the wallet to the target chain (defaults to Base) if needed,
   * then sends the raw transaction and returns the tx hash. This is the
   * primitive used by the kVCM retirement flow (approve AAM + retireCreditViaKlima).
   */
  const sendContractTransaction = useCallback(
    async (params: {
      to: `0x${string}`;
      data: `0x${string}`;
      value?: bigint;
      chainId?: number;
    }): Promise<string> => {
      const targetChainId = params.chainId ?? BASE_CHAIN_ID;
      if (walletChainId !== targetChainId) {
        await switchChainAsync({
          chainId: targetChainId as Parameters<
            typeof switchChainAsync
          >[0]["chainId"],
        });
      }
      const hash = await sendTransactionAsync({
        to: params.to,
        data: params.data,
        value: params.value ?? 0n,
        chainId: targetChainId as Parameters<
          typeof sendTransactionAsync
        >[0]["chainId"],
      });
      return hash;
    },
    [walletChainId, switchChainAsync, sendTransactionAsync],
  );

  /**
   * ERC-20 burn: switches to Base if needed, then calls
   * transfer(DEAD_ADDRESS, rawAmount) on the token contract via writeContractAsync.
   *
   * Uses the canonical dead address (0x000...dEaD) instead of the null address
   * (0x000...0000) — most ERC-20 implementations reject transfers to address(0)
   * as a safety guard, but universally accept the dead address as a valid
   * burn destination.
   *
   * - tokenAddress: the ERC-20 contract address (any case — checksummed internally)
   * - amount: decimal string, e.g. "1.5" — must be a trimmed string, not a float
   * - decimals: token decimals (number)
   *
   * The chainId is ALWAYS 8453 (Base) — all allowlisted tokens live on Base.
   * Passing chainId to writeContractAsync tells wagmi to enforce the chain;
   * if the wallet is on the wrong chain wagmi will request a switch automatically.
   */
  const getPlatformFeeInfo = useCallback(
    async (
      burnAmountUsd: number,
      chainId: number,
      feeRate: number = DEFAULT_PLATFORM_FEE_RATE,
    ): Promise<PlatformFeeInfo> => {
      const isCelo = chainId === 42220;
      const nativeSymbol = isCelo ? "CELO" : "ETH";
      const nativePriceUsd = await fetchNativeTokenPriceUsd(chainId);
      const feeUsd = burnAmountUsd * feeRate;
      const feeNative = feeUsd / nativePriceUsd;
      return { feeUsd, feeNative, nativeSymbol, nativePriceUsd };
    },
    [],
  );

  const sendPlatformFee = useCallback(
    async (
      feeUsd: number,
      chainId: number,
      recipientAddress: string,
      feeRate: number = DEFAULT_PLATFORM_FEE_RATE,
    ): Promise<string> => {
      if (!recipientAddress || !recipientAddress.startsWith("0x")) {
        throw new Error(
          "Fee recipient address is not configured. Please contact the platform admin.",
        );
      }
      const nativePriceUsd = await fetchNativeTokenPriceUsd(chainId);
      // Recalculate the fee amount from the burn value and the live fee rate
      // so the native transfer always matches the admin-configured percentage.
      const effectiveFeeUsd = feeUsd * feeRate;
      const feeNative = effectiveFeeUsd / nativePriceUsd;
      // Convert to wei (1e18)
      const feeWei = BigInt(Math.round(feeNative * 1e18));
      if (feeWei <= 0n)
        throw new Error("Calculated fee is zero — cannot send platform fee");

      // Ensure wallet is on the right chain before the transfer
      if (walletChainId !== chainId) {
        await switchChainAsync({
          chainId: chainId as Parameters<typeof switchChainAsync>[0]["chainId"],
        });
      }

      const hash = await sendTransactionAsync({
        to: recipientAddress as `0x${string}`,
        data: "0x" as `0x${string}`,
        value: feeWei,
        chainId: chainId as Parameters<
          typeof sendTransactionAsync
        >[0]["chainId"],
      });
      return hash;
    },
    [walletChainId, switchChainAsync, sendTransactionAsync],
  );

  const burnToken = useCallback(
    async (
      tokenAddress: string,
      amount: string,
      decimals: number,
      chainId: number = BASE_CHAIN_ID,
    ): Promise<string> => {
      // The canonical EVM dead address — universally accepted by ERC-20 tokens.
      // Tokens sent here are permanently unrecoverable (no private key exists).
      // NOTE: do NOT use the null address (0x000...0000) — many ERC-20s reject
      // transfers to address(0) with a "transfer to zero address" revert.
      const DEAD_ADDRESS =
        "0x000000000000000000000000000000000000dEaD" as `0x${string}`;

      // Checksum the token contract address — viem requires EIP-55 format.
      let checksummedAddress: `0x${string}`;
      try {
        checksummedAddress = getAddress(tokenAddress);
      } catch (_err) {
        throw new Error(`Invalid token contract address: ${tokenAddress}`);
      }

      // Validate and convert amount to raw BigInt using parseUnits.
      // This avoids ALL floating-point precision loss.
      const trimmed = amount.trim();
      if (!trimmed || Number.parseFloat(trimmed) <= 0) {
        throw new Error("Burn amount must be greater than zero");
      }

      // Defensive decimal override: axlREGEN has 6 decimals on ALL chains.
      // The live canister may have been deployed before the decimal fix and
      // could still store 18 for this token. Check address regardless of chain
      // (same address used on Base and Celo).
      const AXLREGEN_ADDRESS = "0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754";
      const effectiveDecimals =
        tokenAddress.toLowerCase() === AXLREGEN_ADDRESS ? 6 : Number(decimals);
      if (process.env.NODE_ENV !== "production") {
        console.debug(
          `[burnToken] token=${tokenAddress} chain=${chainId} decimals_param=${decimals} effective=${effectiveDecimals} amount=${trimmed}`,
        );
      }
      const rawAmount = parseUnits(trimmed, effectiveDecimals);

      // Standard ERC-20 transfer ABI — gives wallets full context to display
      // the token name, method, destination, and amount in their signing UI.
      const ERC20_TRANSFER_ABI = [
        {
          name: "transfer",
          type: "function",
          inputs: [
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
          ],
          outputs: [{ name: "", type: "bool" }],
          stateMutability: "nonpayable",
        },
      ] as const;

      // Switch to the target chain before attempting the write.
      // If the wallet is already on the right chain this is a no-op.
      if (walletChainId !== chainId) {
        await switchChainAsync({
          chainId: chainId as Parameters<typeof switchChainAsync>[0]["chainId"],
        });
      }

      const hash = await writeContractAsync({
        address: checksummedAddress,
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [DEAD_ADDRESS, rawAmount],
        chainId: chainId as Parameters<typeof writeContractAsync>[0]["chainId"],
        // gas intentionally omitted — let the wallet estimate.
        // Hardcoded gas values cause "transaction likely to fail" warnings.
      });
      return hash;
    },
    [writeContractAsync, walletChainId, switchChainAsync],
  );

  return {
    address: address ?? null,
    chainId: walletChainId ?? null,
    chainName: getChainName(walletChainId),
    isConnected,
    isOnBase,
    isConnecting,
    isPendingRequest,
    error: errorMessage,
    connectMetaMask,
    connectWalletConnect,
    connect: connectMetaMask,
    disconnect,
    resetConnection,
    switchToBase,
    switchToChain,
    sendTransaction,
    sendContractTransaction,
    burnToken,
    sendPlatformFee,
    getPlatformFeeInfo,
  };
}

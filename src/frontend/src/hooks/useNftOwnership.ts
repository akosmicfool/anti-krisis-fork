import { Contract, JsonRpcProvider } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const NFT_CONTRACT_A = "0x48e727F3052ea0497e5d939B9B52a1B601F166bb";
const NFT_CONTRACT_B = "0x9c4642e8456e05BCF3da1922eE9ee5868A602cbA";

const ETH_RPC_ENDPOINTS = [
  "https://eth.llamarpc.com",
  "https://cloudflare-eth.com",
  "https://rpc.ankr.com/eth",
  "https://ethereum.publicnode.com",
];

const ERC721_ABI = ["function balanceOf(address owner) view returns (uint256)"];

async function readBalanceOf(
  contractAddress: string,
  walletAddress: string,
): Promise<bigint> {
  for (const rpc of ETH_RPC_ENDPOINTS) {
    console.log(
      `[useNftOwnership] Trying RPC ${rpc} for contract ${contractAddress}`,
    );
    try {
      const provider = new JsonRpcProvider(rpc);
      const contract = new Contract(contractAddress, ERC721_ABI, provider);
      const balance = await contract.balanceOf(walletAddress);
      const balanceBigInt = BigInt(balance.toString());
      console.log(
        `[useNftOwnership] ${rpc} → balanceOf(${walletAddress}) for ${contractAddress} = ${balanceBigInt}`,
      );
      return balanceBigInt;
    } catch (err) {
      console.warn(
        `[useNftOwnership] RPC ${rpc} failed for ${contractAddress}:`,
        err,
      );
    }
  }
  throw new Error(`All RPCs failed for contract ${contractAddress}`);
}

export interface NftOwnershipResult {
  holdsOgBadge: boolean;
  nftCheckLoading: boolean;
  nftCheckError: string | null;
}

export function useNftOwnership(): NftOwnershipResult {
  const { address: connectedAddress } = useAccount();
  const [holdsOgBadge, setHoldsOgBadge] = useState(false);
  const [nftCheckLoading, setNftCheckLoading] = useState(false);
  const [nftCheckError, setNftCheckError] = useState<string | null>(null);

  // Only ever checks the connected wallet's own address — never someone else's.
  const targetAddress = connectedAddress;

  useEffect(() => {
    if (!targetAddress) {
      console.log("[useNftOwnership] No wallet address — skipping NFT check");
      setHoldsOgBadge(false);
      setNftCheckLoading(false);
      setNftCheckError(null);
      return;
    }

    let cancelled = false;

    async function checkOwnership() {
      console.log(
        `[useNftOwnership] Starting NFT check for wallet: ${targetAddress}`,
      );
      setNftCheckLoading(true);
      setNftCheckError(null);

      try {
        let balA = 0n;
        let balB = 0n;

        try {
          balA = await readBalanceOf(NFT_CONTRACT_A, targetAddress as string);
        } catch (err) {
          console.error(
            `[useNftOwnership] All RPCs failed for contract A (${NFT_CONTRACT_A}):`,
            err,
          );
        }

        try {
          balB = await readBalanceOf(NFT_CONTRACT_B, targetAddress as string);
        } catch (err) {
          console.error(
            `[useNftOwnership] All RPCs failed for contract B (${NFT_CONTRACT_B}):`,
            err,
          );
        }

        console.log(
          `[useNftOwnership] Final results — Contract A balance: ${balA} (bigint), Contract B balance: ${balB} (bigint)`,
        );
        console.log(
          `[useNftOwnership] holdsOgBadge = ${balA > 0n && balB > 0n} (balA > 0n: ${balA > 0n}, balB > 0n: ${balB > 0n})`,
        );

        if (!cancelled) {
          setHoldsOgBadge(balA > 0n && balB > 0n);
        }
      } catch (err) {
        console.error(
          "[useNftOwnership] Unexpected error during NFT check:",
          err,
        );
        if (!cancelled) {
          setNftCheckError(
            err instanceof Error ? err.message : "NFT check failed",
          );
          setHoldsOgBadge(false);
        }
      } finally {
        if (!cancelled) {
          setNftCheckLoading(false);
        }
      }
    }

    checkOwnership();
    return () => {
      cancelled = true;
    };
  }, [targetAddress]);

  return { holdsOgBadge, nftCheckLoading, nftCheckError };
}

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppKit } from "@reown/appkit/react";
import {
  AlertCircle,
  ChevronDown,
  Loader2,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useAkkBalance, useGetTokens } from "../hooks/use-backend";
import { useWallet } from "../hooks/use-wallet";
import { truncateAddress } from "../types";
import { WalletsAndBalances } from "./WalletsAndBalances";
import { WithdrawModal } from "./WithdrawModal";

function formatAkk(val: bigint): string {
  const n = Number(val) / 100_000_000;
  if (n === 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}k`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function WalletButton() {
  const {
    address,
    isConnected,
    isConnecting,
    isPendingRequest,
    error,
    connectMetaMask,
    resetConnection,
  } = useWallet();
  const { open: openModal } = useAppKit();
  const { principal } = useAuth();
  const { data: tokens = [] } = useGetTokens();
  const { data: akkBalance } = useAkkBalance();

  const [open, setOpen] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const akkDisplay = akkBalance !== undefined ? formatAkk(akkBalance) : null;

  // ── Connected state — show Wallets & Balances dropdown ────────────────────
  if (isConnected && address) {
    return (
      <>
        {showWithdraw && (
          <WithdrawModal
            akkBalance={akkBalance ?? BigInt(0)}
            onClose={() => setShowWithdraw(false)}
          />
        )}
        <div className="flex items-center gap-1.5">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-[#00ff41]/40 bg-[#00ff41]/5 hover:bg-[#00ff41]/10 hover:border-[#00ff41] font-accent text-xs gap-1.5 uppercase tracking-widest transition-smooth"
                data-ocid="wallet.dropdown_menu"
              >
                <Wallet className="h-3 w-3 text-[#00ff41]" />
                {akkDisplay !== null ? (
                  <span className="text-[#00ff41] font-semibold">
                    {akkDisplay} AKK
                  </span>
                ) : (
                  <span className="text-foreground hidden sm:inline">
                    {truncateAddress(address, 4)}
                  </span>
                )}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="p-0 border-0 bg-transparent shadow-none w-auto"
              data-ocid="wallet.popover"
            >
              <WalletsAndBalances
                tokens={tokens}
                icpPrincipal={principal ?? null}
                onClose={() => setOpen(false)}
                onWithdraw={() => setShowWithdraw(true)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </>
    );
  }

  // ── MetaMask pending request ───────────────────────────────────────────────
  if (isPendingRequest) {
    return (
      <div
        className="flex flex-col items-end gap-2"
        data-ocid="wallet.pending_request_state"
      >
        <div className="flex items-start gap-2 max-w-[300px] border border-amber-500/40 bg-amber-500/10 px-3 py-2">
          <AlertCircle className="h-4 w-4 text-amber-400 mt-px shrink-0" />
          <p className="text-[11px] text-amber-200 leading-snug">
            MetaMask has a pending request.{" "}
            <span className="font-semibold">Open MetaMask</span> to approve or
            reject it, then click Try Again.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            resetConnection();
            setTimeout(connectMetaMask, 50);
          }}
          className="border-amber-500/50 text-amber-300 hover:bg-amber-500/10 text-xs font-accent gap-1.5"
          data-ocid="wallet.try_again_button"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      </div>
    );
  }

  // ── Connecting spinner ─────────────────────────────────────────────────────
  if (isConnecting) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="border-border font-accent text-xs gap-1.5"
        data-ocid="wallet.connecting_state"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Connecting…
      </Button>
    );
  }

  // ── Default: single Connect Wallet button — opens AppKit modal ────────────
  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => openModal()}
        className="border-[#00ff41]/40 bg-[#00ff41]/5 hover:bg-[#00ff41]/10 hover:border-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.3)] gap-1.5 text-xs font-accent uppercase tracking-widest text-[#00ff41] transition-all"
        data-ocid="wallet.connect_button"
      >
        <Wallet className="h-3.5 w-3.5" />
        Connect
      </Button>
      {error && (
        <p
          className="flex items-start gap-1 text-[11px] text-destructive max-w-[260px] text-right"
          data-ocid="wallet.error_state"
        >
          <AlertCircle className="h-3.5 w-3.5 mt-px shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

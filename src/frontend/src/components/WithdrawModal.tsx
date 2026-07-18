import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Coins } from "lucide-react";
import { useState } from "react";
import { createActor } from "../backend";
import { useGetAkkTransferFee } from "../hooks/use-backend";

interface WithdrawModalProps {
  akkBalance: bigint;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string" && err) return err;
  if (typeof err === "object" && err !== null) {
    const e = err as Record<string, unknown>;
    // Standard {message: string}
    if (typeof e.message === "string" && e.message) return e.message;
    // {err: string} — Candid result variant
    if (typeof e.err === "string" && e.err) return e.err;
    // {Err: string}
    if (typeof e.Err === "string" && e.Err) return e.Err;
    // {Err: {message: string}}
    if (typeof e.Err === "object" && e.Err !== null) {
      const inner = e.Err as Record<string, unknown>;
      if (typeof inner.message === "string" && inner.message)
        return inner.message;
    }
    // ICRC-1 transfer errors: { InsufficientFunds: { balance: bigint } }
    if ("InsufficientFunds" in e)
      return "Insufficient AKK balance for this withdrawal.";
    if ("BadFee" in e) return "Incorrect transfer fee. Please try again.";
    if ("TemporarilyUnavailable" in e)
      return "Ledger temporarily unavailable. Please try again.";
    if ("GenericError" in e) {
      const ge = e.GenericError as Record<string, unknown>;
      if (typeof ge?.message === "string") return ge.message;
      return "Transaction failed. Please try again.";
    }
    if ("TooOld" in e) return "Transaction request expired. Please try again.";
    if ("CreatedInFuture" in e)
      return "Transaction timestamp is in the future.";
    if ("Duplicate" in e) return "This transaction was already processed.";
    if ("BadBurn" in e) {
      const bb = e.BadBurn as Record<string, unknown>;
      const minBurn =
        typeof bb?.min_burn_amount === "bigint"
          ? (Number(bb.min_burn_amount) / 1e8).toLocaleString("en-US", {
              maximumFractionDigits: 8,
            })
          : "unknown";
      return `Minimum burn amount required: ${minBurn} AKK`;
    }
    if ("InsufficientAllowance" in e)
      return "Insufficient allowance for this transfer.";
    // ICP replica rejection code
    if (typeof e.code === "number")
      return "The transaction was rejected. Please try again.";
    // Reject stringifying the object — show a safe fallback
    return "Withdrawal failed. Please try again.";
  }
  return "Withdrawal failed. Please try again.";
}

export function WithdrawModal({ akkBalance, onClose }: WithdrawModalProps) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: feeE8s = 10000n } = useGetAkkTransferFee();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const FEE_AKK = Number(feeE8s) / 1e8;

  const balanceAkk = Number(akkBalance) / 1e8;
  const balanceDisplay = balanceAkk.toLocaleString("en-US", {
    maximumFractionDigits: 8,
  });

  const amtNum = Number(amount);
  const amtE8s =
    amount && !Number.isNaN(amtNum) ? BigInt(Math.floor(amtNum * 1e8)) : 0n;
  const netReceived = amtNum > 0 ? Math.max(0, amtNum - FEE_AKK) : 0;

  async function handleWithdraw() {
    if (!actor) {
      setErrorMsg("Not connected to ICP");
      setStatus("error");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Wallet address is required");
      setStatus("error");
      return;
    }
    if (!amount || Number.isNaN(amtNum) || amtNum <= 0) {
      setErrorMsg("Enter a valid amount");
      setStatus("error");
      return;
    }
    if (amtNum <= FEE_AKK) {
      setErrorMsg(
        `Minimum withdrawal is more than ${FEE_AKK} AKK (the transfer fee)`,
      );
      setStatus("error");
      return;
    }
    if (amtE8s + feeE8s > akkBalance) {
      setErrorMsg("Amount exceeds your AKK balance");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      let owner: Principal;
      try {
        owner = Principal.fromText(address.trim());
      } catch {
        throw new Error("Invalid ICP principal address");
      }

      // withdrawAkk uses Account type: { owner: Principal; subaccount?: Uint8Array }
      const recipient = { owner, subaccount: undefined };
      const result = await actor.withdrawAkk(recipient, amtE8s);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      setStatus("success");
      queryClient.invalidateQueries({ queryKey: ["akkBalance"] });
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
      setStatus("error");
    }
  }

  const isPending = status === "loading";

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="bg-[#0a0a0a] border border-[#00ff41]/30 max-w-md shadow-[0_0_30px_rgba(0,255,65,0.08)]"
        data-ocid="withdraw.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-[#00ff41] tracking-widest uppercase flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Withdraw $AKK
          </DialogTitle>
        </DialogHeader>

        {status === "success" ? (
          <div
            className="flex flex-col items-center gap-4 py-6"
            data-ocid="withdraw.success_state"
          >
            <CheckCircle2 className="h-12 w-12 text-[#00ff41]" />
            <p className="font-display text-xl text-[#00ff41] tracking-widest uppercase">
              Withdrawal Submitted
            </p>
            <p className="font-body text-sm text-muted-foreground text-center">
              Your AKK is on its way to your wallet.
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="font-accent uppercase tracking-widest bg-[#00ff41]/10 border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/20"
              data-ocid="withdraw.close_button"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-5 pt-1">
            {/* Token info block */}
            <div className="border border-[#00ff41]/15 bg-[#00ff41]/3 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-accent text-xs text-muted-foreground uppercase tracking-widest">
                  Token
                </span>
                <span className="font-body text-sm text-foreground">$AKK</span>
              </div>
              <div className="flex justify-between">
                <span className="font-accent text-xs text-muted-foreground uppercase tracking-widest">
                  Your Balance
                </span>
                <span className="font-body text-sm text-[#00ff41]">
                  {balanceDisplay} AKK
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-accent text-xs text-muted-foreground uppercase tracking-widest">
                  Transfer Fee
                </span>
                <span className="font-body text-sm text-muted-foreground">
                  {FEE_AKK} AKK
                </span>
              </div>
            </div>

            {/* Destination address */}
            <div className="space-y-1.5">
              <Label
                htmlFor="withdraw-address"
                className="font-accent text-xs uppercase tracking-widest text-muted-foreground"
              >
                ICP Principal Address
              </Label>
              <Input
                id="withdraw-address"
                placeholder="Enter ICP principal address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setStatus("idle");
                }}
                disabled={isPending}
                className="font-body text-sm bg-transparent border-[#00ff41]/25 focus:border-[#00ff41]/60 placeholder:text-muted-foreground/40"
                data-ocid="withdraw.address_input"
              />
              <p className="font-body text-[11px] text-muted-foreground">
                Recommended: Oisy or Plug wallets
              </p>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label
                htmlFor="withdraw-amount"
                className="font-accent text-xs uppercase tracking-widest text-muted-foreground"
              >
                Amount (AKK)
              </Label>
              <Input
                id="withdraw-amount"
                type="number"
                min="0"
                step="0.00000001"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setStatus("idle");
                }}
                disabled={isPending}
                className="font-body text-sm bg-transparent border-[#00ff41]/25 focus:border-[#00ff41]/60 placeholder:text-muted-foreground/40"
                data-ocid="withdraw.amount_input"
              />
              {amtNum > FEE_AKK && (
                <p className="font-body text-[11px] text-[#00ff41]/70">
                  You receive:{" "}
                  <span className="text-[#00ff41]">
                    {netReceived.toLocaleString("en-US", {
                      maximumFractionDigits: 8,
                    })}{" "}
                    AKK
                  </span>{" "}
                  (after fee)
                </p>
              )}
            </div>

            {/* Error message */}
            {status === "error" && errorMsg && (
              <div
                className="flex items-start gap-2 text-destructive text-xs font-body"
                data-ocid="withdraw.error_state"
              >
                <AlertCircle className="h-3.5 w-3.5 mt-px shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 font-accent text-xs uppercase tracking-widest border-border hover:border-border/80"
                data-ocid="withdraw.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleWithdraw}
                disabled={isPending}
                className="flex-1 font-accent text-xs uppercase tracking-widest bg-[#00ff41]/15 border border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41]/25 hover:border-[#00ff41] transition-smooth"
                data-ocid="withdraw.confirm_button"
              >
                {isPending ? "Processing…" : "Confirm"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

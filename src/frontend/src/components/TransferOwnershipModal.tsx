import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTransferTribeOwnership } from "../hooks/use-backend";
import type { Tribe } from "../types";

interface Props {
  tribe: Tribe;
  onClose: () => void;
}

export function TransferOwnershipModal({ tribe, onClose }: Props) {
  const [username, setUsername] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const transfer = useTransferTribeOwnership();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    try {
      await transfer.mutateAsync({
        tribeId: tribe.id,
        newOwnerUsername: username.trim(),
      });
      toast.success("Ownership transferred!", {
        description: `${tribe.name} is now owned by @${username.trim()}.`,
      });
      onClose();
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      const description =
        raw === "newOwnerMaxTribes"
          ? "This player already owns the maximum of 5 tribes and cannot receive ownership."
          : raw === "newOwnerNotFound" || raw === "newOwnerNoUsername"
            ? "That username could not be found."
            : raw || "Unknown error";
      toast.error("Transfer failed", { description });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      data-ocid="transfer-tribe.dialog"
    >
      <div
        className="relative w-full max-w-md mx-4 bg-card pixel-border p-6 space-y-5"
        style={{ boxShadow: "0 0 32px rgba(255,80,80,0.15)" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-destructive tracking-widest uppercase">
            Transfer Ownership
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-accent transition-colors"
            aria-label="Close"
            data-ocid="transfer-tribe.close_button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="font-mono text-sm text-muted-foreground">
          Transfer ownership of{" "}
          <span className="text-accent font-semibold">{tribe.name}</span> to
          another user. This action cannot be undone.
        </p>

        {confirmed && (
          <div className="flex items-start gap-3 p-3 border border-destructive/40 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="font-mono text-sm text-destructive">
              Confirm: transfer <strong>{tribe.name}</strong> to{" "}
              <strong>@{username}</strong>? You will lose ownership.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label
              htmlFor="transfer-username"
              className="font-accent text-[10px] uppercase tracking-widest text-accent"
            >
              New Owner Username
            </Label>
            <Input
              id="transfer-username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setConfirmed(false);
              }}
              placeholder="username"
              maxLength={15}
              className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
              data-ocid="transfer-tribe.username_input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-accent text-[10px] uppercase tracking-widest border-border text-muted-foreground hover:text-foreground"
              data-ocid="transfer-tribe.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={transfer.isPending || !username.trim()}
              className="flex-1 font-accent text-[10px] uppercase tracking-widest bg-destructive hover:bg-destructive/80 text-white"
              data-ocid="transfer-tribe.confirm_button"
            >
              {transfer.isPending
                ? "Transferring…"
                : confirmed
                  ? "Confirm Transfer"
                  : "Transfer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

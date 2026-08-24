import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Check, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { createActor } from "../backend";
import { useSaveMyProfile } from "../hooks/use-backend";

interface Props {
  onComplete: () => void;
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 400;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > MAX) {
          h = Math.round((h * MAX) / w);
          w = MAX;
        }
      } else {
        if (h > MAX) {
          w = Math.round((w * MAX) / h);
          h = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = url;
  });
}

export function UsernamePromptModal({ onComplete }: Props) {
  const { actor } = useActor(createActor);
  const saveProfile = useSaveMyProfile();
  const qc = useQueryClient();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [checkState, setCheckState] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [fieldError, setFieldError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const avatarRef = useRef<HTMLInputElement>(null);
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function checkAvailability(value: string) {
    if (!value.trim() || !actor) return;
    setCheckState("checking");
    try {
      const available = await (
        actor as unknown as Record<string, (u: string) => Promise<boolean>>
      ).isUsernameAvailable(value.trim());
      setCheckState(available ? "available" : "taken");
      setFieldError(available ? "" : "Username already taken");
    } catch {
      setCheckState("idle");
    }
  }

  function handleUsernameChange(val: string) {
    const cleaned = val.slice(0, 15);
    setUsername(cleaned);
    setFieldError("");
    setCheckState("idle");
    if (checkTimer.current) clearTimeout(checkTimer.current);
    if (cleaned.trim().length > 0) {
      checkTimer.current = setTimeout(() => checkAvailability(cleaned), 500);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setAvatar(compressed);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) {
      setFieldError("Username is required");
      return;
    }
    if (username.length > 15) {
      setFieldError("Username must be 15 characters or less");
      return;
    }
    if (checkState === "taken") {
      setFieldError("Username already taken");
      return;
    }
    setSubmitError("");
    try {
      await saveProfile.mutateAsync({
        username: username.trim(),
        displayName: displayName.trim(),
        bio: "",
        location: "",
        born: "",
        superpowers: "",
        profilePicture: avatar,
        coverImage: "",
        evmAddress: null,
        socials: [],
      });
      // Invalidate so the rest of the app reflects the new username
      qc.invalidateQueries({ queryKey: ["hasUsername"] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
      onComplete();
    } catch (err) {
      const code =
        err && typeof err === "object" && "profileError" in err
          ? String((err as { profileError: unknown }).profileError)
          : "";
      const msg = err instanceof Error ? err.message : "Could not save profile";
      if (
        code === "usernameAlreadyTaken" ||
        msg.toLowerCase().includes("already taken")
      ) {
        setFieldError("Username already taken");
        setCheckState("taken");
      } else if (
        code === "usernameTooLong" ||
        msg.toLowerCase().includes("15 characters")
      ) {
        setFieldError("Username must be 15 characters or less");
      } else {
        setSubmitError(msg);
      }
    }
  }

  const canSubmit =
    username.trim().length > 0 &&
    checkState !== "taken" &&
    checkState !== "checking" &&
    !saveProfile.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      data-ocid="username_prompt.dialog"
      // No backdrop click to close — username is mandatory
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)",
        }}
      />

      <div
        className="relative w-full max-w-md mx-4 pixel-border bg-card p-8"
        style={{
          boxShadow:
            "0 0 40px rgba(0,255,65,0.2), 0 0 80px rgba(0,255,65,0.08)",
        }}
      >
        {/* Welcome heading */}
        <div className="text-center mb-6">
          <h1
            className="font-display text-5xl tracking-widest uppercase text-accent mb-2"
            style={{ textShadow: "0 0 16px rgba(0,255,65,0.6)" }}
          >
            Welcome
          </h1>
          <p className="font-display text-2xl tracking-widest uppercase text-foreground">
            Anti Krisis
          </p>
          <p className="font-accent text-sm text-muted-foreground mt-3 tracking-wider">
            Choose your username to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="relative w-20 h-20 pixel-border overflow-hidden bg-muted hover:bg-muted/70 transition-smooth group"
              aria-label="Upload profile picture"
              data-ocid="username_prompt.avatar_upload_button"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1">
                  <Camera className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-smooth" />
                  <span className="font-accent text-[9px] uppercase tracking-widest text-muted-foreground">
                    Photo
                  </span>
                </div>
              )}
            </button>
            <span className="font-accent text-[10px] text-muted-foreground uppercase tracking-widest">
              Profile Picture (optional)
            </span>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="prompt-username"
              className="block font-accent text-[10px] uppercase tracking-widest text-accent"
            >
              Username *
            </label>
            <div className="relative">
              <input
                id="prompt-username"
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="satoshi"
                maxLength={15}
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-input border border-border text-foreground font-mono text-sm px-3 py-2 pr-8 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-smooth"
                data-ocid="username_prompt.username_input"
              />
              {/* Availability indicator */}
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {checkState === "checking" && (
                  <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                )}
                {checkState === "available" && (
                  <Check className="h-3.5 w-3.5 text-accent" />
                )}
                {checkState === "taken" && (
                  <X className="h-3.5 w-3.5 text-destructive" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              {fieldError ? (
                <p
                  className="font-accent text-[10px] text-destructive tracking-wide"
                  data-ocid="username_prompt.username_field_error"
                >
                  {fieldError}
                </p>
              ) : checkState === "available" ? (
                <p className="font-accent text-[10px] text-accent tracking-wide">
                  Username available!
                </p>
              ) : (
                <span />
              )}
              <span className="font-mono text-[10px] text-muted-foreground">
                {username.length}/15
              </span>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="prompt-displayname"
              className="block font-accent text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Display Name (optional)
            </label>
            <input
              id="prompt-displayname"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value.slice(0, 30))}
              placeholder="Your full name or alias"
              maxLength={30}
              className="w-full bg-input border border-border text-foreground font-mono text-sm px-3 py-2 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-smooth"
              data-ocid="username_prompt.display_name_input"
            />
            <div className="flex justify-end">
              <span className="font-mono text-[10px] text-muted-foreground">
                {displayName.length}/30
              </span>
            </div>
          </div>

          {submitError && (
            <p
              className="font-accent text-[10px] text-destructive tracking-wide text-center"
              data-ocid="username_prompt.error_state"
            >
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 font-accent text-sm uppercase tracking-widest transition-smooth"
            style={{
              background: canSubmit ? "#00ff41" : "#004d14",
              color: canSubmit ? "#000" : "#006618",
              border: "1px solid #00ff41",
              boxShadow: canSubmit ? "0 0 12px rgba(0,255,65,0.5)" : "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
            data-ocid="username_prompt.submit_button"
          >
            {saveProfile.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up…
              </span>
            ) : (
              "Set Username"
            )}
          </button>
        </form>

        {/* Decorative corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-accent/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-accent/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-accent/40" />
      </div>
    </div>
  );
}

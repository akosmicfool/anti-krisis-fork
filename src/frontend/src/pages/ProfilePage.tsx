import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  Camera,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit2,
  MapPin,
  Plus,
  Save,
  Share2,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CreateTribeModal } from "../components/CreateTribeModal";
import { EditTribeModal } from "../components/EditTribeModal";
import { HighlightsSection } from "../components/HighlightsSection";
import { TransferOwnershipModal } from "../components/TransferOwnershipModal";
import { useAuth } from "../hooks/use-auth";
import {
  useClaimOgBadge,
  useCreateTribe,
  useGetMyOwnedTribes,
  useGetMyProfile,
  useGetMyTribe,
  useGetTribeLeaderboard,
  useJoinTribe,
  useLeaveTribe,
  useSaveMyProfile,
  useSearchTribes,
  useUpdatePlayerBadge,
} from "../hooks/use-backend";
import type { SocialLink } from "../hooks/use-backend";
import { useTestScore } from "../hooks/use-test-score";
import { useNftOwnership } from "../hooks/useNftOwnership";
import { type Tribe, formatGrit } from "../types";

const DEFAULT_COVER = "/assets/images/placeholder.svg";
const DEFAULT_AVATAR = "/assets/images/placeholder.svg";

interface FormState {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  born: string;
  superpowers: string;
  profilePicture: string;
  coverImage: string;
  socials: SocialLink[];
}

const EMPTY_FORM: FormState = {
  username: "",
  displayName: "",
  bio: "",
  location: "",
  born: "",
  superpowers: "",
  profilePicture: "",
  coverImage: "",
  socials: [],
};

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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-accent text-xs uppercase tracking-widest text-white">
      {children}
    </span>
  );
}

function SectionHeader({
  children,
  white = false,
}: { children: React.ReactNode; white?: boolean }) {
  return (
    <h2
      className={`font-display text-xl tracking-widest uppercase border-b border-border pb-1 mb-4 ${white ? "text-white" : "text-accent"}`}
    >
      {children}
    </h2>
  );
}

export function ProfilePage() {
  const { isAuthenticated, isLoading, principal: principalText } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const saveProfile = useSaveMyProfile();

  const { data: myTribe, isLoading: tribeLoading } = useGetMyTribe();
  const { data: ownedTribes = [] } = useGetMyOwnedTribes();
  const joinTribe = useJoinTribe();
  const leaveTribe = useLeaveTribe();

  const [editMode, setEditMode] = useState(false);
  const { testScore, testBadgeLevel } = useTestScore();

  // Interests — stored in localStorage keyed by principal
  const interestsKey = principalText ? `interests_${principalText}` : null;
  const [interests, setInterests] = useState<string>(() => {
    if (!interestsKey) return "";
    try {
      return localStorage.getItem(interestsKey) ?? "";
    } catch {
      return "";
    }
  });

  // Persist interests to localStorage on change (only when key is available)
  useEffect(() => {
    if (!interestsKey) return;
    try {
      localStorage.setItem(interestsKey, interests);
    } catch {
      // ignore storage errors
    }
  }, [interests, interestsKey]);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [usernameError, setUsernameError] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Tribe modals
  const [showCreateTribe, setShowCreateTribe] = useState(false);
  const [editingTribe, setEditingTribe] = useState<Tribe | null>(null);
  const [transferTribe, setTransferTribe] = useState<Tribe | null>(null);
  const [leavingTribe, setLeavingTribe] = useState<Tribe | null>(null);

  // Tribe search
  const [tribeSearch, setTribeSearch] = useState("");
  const { data: tribeResults = [], isFetching: searchFetching } =
    useSearchTribes(tribeSearch);

  const claimBadge = useClaimOgBadge();
  const updatePlayerBadge = useUpdatePlayerBadge();
  const { holdsOgBadge } = useNftOwnership();
  const canClaimBadge = holdsOgBadge && !(profile?.hasOgBadge ?? false);
  const handleClaimBadge = async () => {
    await claimBadge.mutateAsync();
  };

  // Auto-update player badge level on own profile mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: mutation refs are stable
  useEffect(() => {
    if (
      isAuthenticated &&
      !updatePlayerBadge.isPending &&
      !updatePlayerBadge.isSuccess
    ) {
      updatePlayerBadge.mutate();
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Populate form from profile data
  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username ?? "",
        displayName: profile.displayName ?? "",
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        born: profile.born ?? "",
        superpowers: profile.superpowers ?? "",
        profilePicture: profile.profilePicture ?? "",
        coverImage: profile.coverImage ?? "",
        socials: Array.isArray(profile.socials) ? profile.socials : [],
      });
    }
  }, [profile]);

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profilePicture" | "coverImage",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setForm((f) => ({ ...f, [field]: compressed }));
  }

  function handleChange(
    field: Exclude<keyof FormState, "socials">,
    value: string,
  ) {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "username" && value.trim()) setUsernameError("");
  }

  function handleCancel() {
    if (profile) {
      setForm({
        username: profile.username ?? "",
        displayName: profile.displayName ?? "",
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        born: profile.born ?? "",
        superpowers: profile.superpowers ?? "",
        profilePicture: profile.profilePicture ?? "",
        coverImage: profile.coverImage ?? "",
        socials: Array.isArray(profile.socials) ? profile.socials : [],
      });
    }
    setEditMode(false);
    setUsernameError("");
  }

  async function handleSave() {
    if (!form.username.trim()) {
      setUsernameError("Username is required");
      return;
    }
    try {
      await saveProfile.mutateAsync({
        username: form.username.trim(),
        displayName: form.displayName.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        born: form.born.trim(),
        superpowers: form.superpowers.trim(),
        profilePicture: form.profilePicture,
        coverImage: form.coverImage,
        socials: form.socials.filter((l) => l.name.trim() || l.url.trim()),
      });
      toast.success("Profile saved", {
        description: "Your profile has been updated.",
      });
      setEditMode(false);
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  async function handleShare() {
    if (!form.username) return;
    const url = `https://ak69.fun/profile/${form.username}`;

    // Use native share sheet on mobile (iOS/Android), fallback to clipboard
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${form.displayName || form.username} \u2014 Anti Krisis`,
          text: `Check out ${form.displayName || form.username}'s profile on Anti Krisis`,
          url,
        });
        return;
      } catch (err) {
        // User cancelled share \u2014 don't show error
        if (err instanceof Error && err.name === "AbortError") return;
        // Fall through to clipboard copy
      }
    }

    const copyViaTextarea = () => {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    };

    let success = false;

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(url);
        success = true;
      } catch {
        // Clipboard API rejected — fall back to textarea
        success = copyViaTextarea();
      }
    } else {
      success = copyViaTextarea();
    }

    if (success) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
      toast.success("Link copied!", { description: url });
    } else {
      toast.error("Could not copy link", {
        description: `Please copy manually: ${url}`,
      });
    }
  }

  if (isLoading || profileLoading) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-8 space-y-4"
        data-ocid="profile.loading_state"
      >
        <Skeleton className="h-48 w-full bg-muted" />
        <Skeleton className="h-8 w-48 bg-muted" />
        <Skeleton className="h-4 w-64 bg-muted" />
      </div>
    );
  }

  const coverSrc = form.coverImage || DEFAULT_COVER;
  const avatarSrc = form.profilePicture || DEFAULT_AVATAR;
  const displayName = form.displayName || (editMode ? "Display Name" : "");

  // tribeName removed — tribe badge now uses myTribe directly

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-ocid="profile.page">
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — IDENTITY
          Cover image as a top band, avatar overlapping, identity row below.
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="mb-6" data-ocid="profile.identity_section">
        {/* Cover + avatar hero */}
        <div className="relative mb-14 border border-border">
          <div className="relative h-32 sm:h-48 overflow-hidden bg-muted">
            <img
              src={coverSrc}
              alt="Cover"
              className="w-full h-full object-cover opacity-70"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
              }}
            />
            {editMode && (
              <button
                type="button"
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-background/80 border border-accent text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/10 transition-smooth btn-glow"
                onClick={() => coverInputRef.current?.click()}
                data-ocid="profile.cover_upload_button"
              >
                <Camera className="h-3 w-3" />
                Change Cover
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "coverImage")}
              data-ocid="profile.cover_image_input"
            />
          </div>
          {/* Avatar + Tribe badge row */}
          <div className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-6 flex items-end gap-3">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 border border-border overflow-hidden bg-muted">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              {editMode && (
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center bg-background/70 hover:bg-background/85 transition-smooth"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label="Change profile picture"
                  data-ocid="profile.avatar_upload_button"
                >
                  <Camera className="h-5 w-5 text-accent" />
                </button>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "profilePicture")}
                data-ocid="profile.avatar_image_input"
              />
            </div>
            {myTribe && (
              <Link
                to="/tribe/$tribeId"
                params={{ tribeId: myTribe.id }}
                className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 border border-border overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                title={`View Tribe: ${myTribe.name}`}
                data-ocid="profile.tribe_badge"
              >
                {myTribe.photoUrl ? (
                  <img
                    src={myTribe.photoUrl}
                    alt={myTribe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display text-lg text-accent">
                    {myTribe.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>
            )}
          </div>
          {/* Edit / Save / Share controls — right-aligned */}
          <div className="absolute bottom-2 right-3 flex items-center gap-2">
            {editMode ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-1.5 font-accent text-sm uppercase tracking-widest border-border text-muted-foreground hover:text-foreground"
                  data-ocid="profile.cancel_button"
                >
                  <X className="h-3 w-3" /> Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  disabled={saveProfile.isPending}
                  className="gap-1.5 font-accent text-sm uppercase tracking-widest bg-primary hover:bg-primary/80 text-primary-foreground btn-glow"
                  data-ocid="profile.save_button"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saveProfile.isPending ? "Saving…" : "Save Profile"}
                </Button>
              </>
            ) : (
              <>
                {form.username && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="gap-1.5 font-accent text-sm uppercase tracking-widest border-border text-muted-foreground hover:border-accent hover:text-accent transition-smooth"
                    data-ocid="profile.share_button"
                  >
                    {shareCopied ? (
                      <>
                        <Copy className="h-3.5 w-3.5 text-accent" />
                        <span className="text-accent">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </>
                    )}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="gap-1.5 font-accent text-sm uppercase tracking-widest border-accent text-accent hover:bg-accent/10 transition-smooth btn-glow"
                  data-ocid="profile.edit_button"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Identity row: name + username + tribe + location + born */}
        {!editMode ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {displayName && (
                <h1 className="font-display text-3xl text-foreground tracking-widest">
                  {displayName}
                </h1>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {form.username && (
                <span className="font-accent text-base text-accent tracking-widest">
                  @{form.username}
                </span>
              )}
              {form.location && (
                <span className="flex items-center gap-1.5 font-mono text-sm text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  {form.location}
                </span>
              )}
              {form.born && (
                <span className="flex items-center gap-1.5 font-mono text-sm text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-accent" />
                  {form.born}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Edit mode: form fields for identity */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <Label htmlFor="username" className="block">
                <FieldLabel>Username *</FieldLabel>
              </Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="satoshi"
                maxLength={15}
                className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
                data-ocid="profile.username_input"
              />
              {usernameError && (
                <p
                  className="text-destructive font-accent text-xs tracking-wide"
                  data-ocid="profile.username_field_error"
                >
                  {usernameError}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="displayName" className="block">
                <FieldLabel>Display Name</FieldLabel>
              </Label>
              <Input
                id="displayName"
                value={form.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                placeholder="Satoshi Nakamoto"
                maxLength={30}
                className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
                data-ocid="profile.display_name_input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="location" className="block">
                <FieldLabel>
                  <MapPin className="inline h-2.5 w-2.5 mr-0.5" /> Location
                </FieldLabel>
              </Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Earth"
                maxLength={30}
                className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
                data-ocid="profile.location_input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="born" className="block">
                <FieldLabel>Born</FieldLabel>
              </Label>
              <Input
                id="born"
                type="text"
                value={form.born}
                onChange={(e) => handleChange("born", e.target.value)}
                placeholder="e.g. 1990s, Late 80s, Year of the Dragon"
                className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
                data-ocid="profile.dob_input"
              />
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — BIO + LINKS (two columns)
      ═══════════════════════════════════════════════════════════════════ */}
      {(editMode ||
        form.bio ||
        form.socials.filter((l) => l.name && l.url).length > 0) && (
        <section
          className="border border-border p-4 bg-card mb-6"
          data-ocid="profile.bio_links_section"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left column — Bio */}
            {(editMode || form.bio) && (
              <div className="flex-1 min-w-0">
                <SectionHeader white>Bio</SectionHeader>
                {editMode ? (
                  <div className="space-y-1">
                    <Label htmlFor="bio" className="block">
                      <FieldLabel>About You</FieldLabel>
                    </Label>
                    <Textarea
                      id="bio"
                      value={form.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Tell the world who you are..."
                      rows={4}
                      maxLength={500}
                      className="bg-input border-border text-foreground font-mono text-sm resize-none focus:ring-accent focus:border-accent"
                      data-ocid="profile.bio_textarea"
                    />
                  </div>
                ) : (
                  <p
                    className="font-mono text-sm text-foreground whitespace-pre-wrap"
                    data-ocid="profile.bio_textarea"
                  >
                    {form.bio}
                  </p>
                )}
              </div>
            )}

            {/* Right column — Links */}
            {(editMode ||
              form.socials.filter((l) => l.name && l.url).length > 0) && (
              <div
                className="flex-1 min-w-0"
                data-ocid="profile.socials_section"
              >
                <SectionHeader white>Links</SectionHeader>
                {editMode ? (
                  <div>
                    <p
                      style={{
                        fontFamily: "Handjet",
                        color: "#a0a0a0",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Your Links
                    </p>
                    {form.socials.map((link, i) => (
                      <div
                        key={link.id || `social-${i}`}
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                          alignItems: "center",
                        }}
                        data-ocid={`profile.socials.item.${i + 1}`}
                      >
                        <Input
                          type="text"
                          value={link.name}
                          onChange={(e) => {
                            const s = [...form.socials];
                            s[i] = { ...s[i], name: e.target.value };
                            setForm((p) => ({ ...p, socials: s }));
                          }}
                          placeholder="Link Name"
                          maxLength={100}
                          className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
                          data-ocid={`profile.socials.name_input.${i + 1}`}
                        />
                        <Input
                          type="url"
                          value={link.url}
                          onChange={(e) => {
                            const s = [...form.socials];
                            s[i] = { ...s[i], url: e.target.value };
                            setForm((p) => ({ ...p, socials: s }));
                          }}
                          placeholder="https://..."
                          maxLength={100}
                          className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
                          data-ocid={`profile.socials.url_input.${i + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const s = form.socials.filter((_, j) => j !== i);
                            setForm((p) => ({ ...p, socials: s }));
                          }}
                          style={{
                            background: "none",
                            border: "1px solid #333",
                            color: "#888",
                            padding: "0.25rem 0.5rem",
                            cursor: "pointer",
                            fontFamily: "Handjet",
                            flexShrink: 0,
                          }}
                          aria-label="Remove link"
                          data-ocid={`profile.socials.delete_button.${i + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          socials: [
                            ...p.socials,
                            { name: "", url: "", id: Date.now().toString() },
                          ],
                        }))
                      }
                      style={{
                        background: "none",
                        border: "1px solid #00ff41",
                        color: "#00ff41",
                        padding: "0.25rem 0.75rem",
                        cursor: "pointer",
                        fontFamily: "Handjet",
                        fontSize: "0.8rem",
                        marginTop: "0.25rem",
                      }}
                      data-ocid="profile.socials.add_button"
                    >
                      + Add Link
                    </button>
                  </div>
                ) : (
                  form.socials.filter((l) => l.name && l.url).length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                      }}
                    >
                      {form.socials.map((link, i) =>
                        link.name && link.url ? (
                          <a
                            key={`social-view-${i}-${link.name}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#00ff41",
                              fontFamily: "Tomorrow",
                              fontSize: "0.9rem",
                              textDecoration: "none",
                              borderBottom: "1px solid #00ff41",
                              paddingBottom: "1px",
                            }}
                            data-ocid={`profile.socials.link.${i + 1}`}
                          >
                            {link.name}
                          </a>
                        ) : null,
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — OVERVIEW + BURN ALLO + BADGES (horizontal row)
      ═══════════════════════════════════════════════════════════════════ */}
      {principalText && (
        <HighlightsSection
          type="player"
          principal={Principal.fromText(principalText)}
          hasOgBadge={profile?.hasOgBadge ?? false}
          canClaimBadge={canClaimBadge}
          onClaimBadge={handleClaimBadge}
          playerBadgeLevel={
            testScore !== null
              ? testBadgeLevel
              : Number(profile?.playerBadgeLevel ?? 0n)
          }
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — SUPERPOWERS + INTERESTS (two columns)
      ═══════════════════════════════════════════════════════════════════ */}
      {(editMode || form.superpowers || interests) && (
        <section
          className="border border-border p-4 bg-card mb-6"
          data-ocid="profile.superpowers_interests_section"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left column — Superpowers */}
            {(editMode || form.superpowers) && (
              <div className="flex-1 min-w-0">
                <SectionHeader white>Superpowers</SectionHeader>
                {editMode ? (
                  <div className="space-y-1">
                    <Label htmlFor="superpowers" className="block">
                      <FieldLabel>Your Skills &amp; Powers</FieldLabel>
                    </Label>
                    <Input
                      id="superpowers"
                      value={form.superpowers}
                      onChange={(e) =>
                        handleChange("superpowers", e.target.value)
                      }
                      placeholder="DeFi wizard, on-chain archaeologist, pixel artist"
                      maxLength={250}
                      className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
                      data-ocid="profile.superpowers_input"
                    />
                  </div>
                ) : (
                  <p
                    className="font-mono text-sm text-foreground"
                    data-ocid="profile.superpowers_input"
                  >
                    {form.superpowers}
                  </p>
                )}
              </div>
            )}

            {/* Right column — Interests */}
            {(editMode || interests) && (
              <div
                className="flex-1 min-w-0"
                data-ocid="profile.interests_section"
              >
                <SectionHeader white>Interests</SectionHeader>
                {editMode ? (
                  <div className="space-y-1">
                    <Label htmlFor="interests" className="block">
                      <FieldLabel>What You Care About</FieldLabel>
                    </Label>
                    <Textarea
                      id="interests"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="Regenerative finance, game theory, coordination"
                      rows={3}
                      maxLength={300}
                      className="bg-input border-border text-foreground font-mono text-sm resize-none focus:ring-accent focus:border-accent"
                      data-ocid="profile.interests_textarea"
                    />
                  </div>
                ) : (
                  <p
                    className="font-mono text-sm text-foreground whitespace-pre-wrap"
                    data-ocid="profile.interests_textarea"
                  >
                    {interests}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — TRIBES MANAGEMENT (authenticated only)
      ═══════════════════════════════════════════════════════════════════ */}
      <TribesSection
        myTribe={myTribe ?? null}
        tribeLoading={tribeLoading}
        ownedTribes={ownedTribes}
        tribeSearch={tribeSearch}
        setTribeSearch={setTribeSearch}
        tribeResults={tribeResults}
        searchFetching={searchFetching}
        onJoinTribe={async (tribeId) => {
          try {
            await joinTribe.mutateAsync(tribeId);
            toast.success("Joined tribe!");
          } catch (err) {
            toast.error("Failed to join tribe", {
              description: err instanceof Error ? err.message : "Unknown error",
            });
          }
        }}
        onLeaveTribe={(tribe) => setLeavingTribe(tribe)}
        onEditTribe={setEditingTribe}
        onTransferTribe={setTransferTribe}
        onCreateTribe={() => setShowCreateTribe(true)}
      />

      {/* Tribe Modals */}
      {showCreateTribe && (
        <CreateTribeModal onClose={() => setShowCreateTribe(false)} />
      )}
      {editingTribe && (
        <EditTribeModal
          tribe={editingTribe}
          onClose={() => setEditingTribe(null)}
        />
      )}
      {transferTribe && (
        <TransferOwnershipModal
          tribe={transferTribe}
          onClose={() => setTransferTribe(null)}
        />
      )}
      {leavingTribe && (
        <LeaveTribeDialog
          tribe={leavingTribe}
          onCancel={() => setLeavingTribe(null)}
          onConfirm={async () => {
            try {
              await leaveTribe.mutateAsync();
              toast.success("Left tribe");
            } catch (err) {
              toast.error("Failed to leave tribe", {
                description:
                  err instanceof Error ? err.message : "Unknown error",
              });
            } finally {
              setLeavingTribe(null);
            }
          }}
        />
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function copyToClipboard(text: string): Promise<boolean> {
  const copyViaTextarea = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  };
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return copyViaTextarea();
    }
  }
  return copyViaTextarea();
}

// ─── Tribe Card ───────────────────────────────────────────────────────────────

function TribeCard({
  tribe,
  isMine,
  isOwned,
  onLeave,
  onEdit,
  onTransfer,
  leaveLoading,
}: {
  tribe: Tribe;
  isMine?: boolean;
  isOwned?: boolean;
  onLeave?: () => void;
  onEdit?: () => void;
  onTransfer?: () => void;
  leaveLoading?: boolean;
}) {
  const { data: tribeLeaderboard } = useGetTribeLeaderboard("allTime");
  const leaderboardEntry = tribeLeaderboard?.find(
    (entry) => entry.tribeId === tribe.id,
  );
  const rank = leaderboardEntry?.rank ?? 0;
  const score = leaderboardEntry?.score ?? 0;

  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `https://ak69.fun/tribe/${tribe.id}`;
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!", { description: url });
    } else {
      toast.error("Could not copy link", {
        description: `Copy manually: ${url}`,
      });
    }
  }

  return (
    <div
      className="border border-border bg-card overflow-hidden"
      data-ocid={`tribe.card.${tribe.id}`}
    >
      {/* Cover image hero */}
      {tribe.coverImageUrl && (
        <div className="relative h-24 overflow-hidden">
          <img
            src={tribe.coverImageUrl}
            alt=""
            className="w-full h-full object-cover opacity-70"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
            }}
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {/* Photo — clickable to tribe page */}
          <Link
            to="/tribe/$tribeId"
            params={{ tribeId: tribe.id }}
            className="w-14 h-14 flex-shrink-0 border border-border overflow-hidden bg-muted flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label={`View ${tribe.name} tribe page`}
            data-ocid={`tribe.logo_link.${tribe.id}`}
          >
            {tribe.photoUrl ? (
              <img
                src={tribe.photoUrl}
                alt={tribe.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="h-6 w-6 text-muted-foreground" />
            )}
          </Link>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {/* Tribe name — clickable to tribe page */}
              <Link
                to="/tribe/$tribeId"
                params={{ tribeId: tribe.id }}
                className="font-display text-xl text-accent tracking-widest truncate hover:text-primary transition-colors"
                data-ocid={`tribe.name_link.${tribe.id}`}
              >
                {tribe.name}
              </Link>
              {isOwned && (
                <Shield
                  className="h-3.5 w-3.5 text-accent flex-shrink-0"
                  aria-label="You own this tribe"
                />
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="flex items-center gap-1">
                <span className="font-accent text-sm uppercase tracking-widest text-white">
                  Members
                </span>
                <span className="font-mono text-xs text-foreground">
                  {tribe.memberCount.toString()}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span className="font-accent text-sm uppercase tracking-widest text-white">
                  Rank
                </span>
                <span className="font-mono text-xs text-foreground">
                  {rank > 0 ? `#${rank}` : "—"}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span className="font-accent text-sm uppercase tracking-widest text-white">
                  Score
                </span>
                <span className="font-mono text-xs text-foreground">
                  {score > 0 ? score.toFixed(2) : "—"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-border text-muted-foreground hover:border-accent hover:text-accent font-accent text-sm uppercase tracking-widest transition-colors"
            data-ocid={`tribe.share_button.${tribe.id}`}
          >
            {copied ? (
              <>
                <Copy className="h-3 w-3 text-accent" />
                <span className="text-accent">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3 w-3" />
                Share
              </>
            )}
          </button>
          {isMine && onLeave && (
            <button
              type="button"
              onClick={onLeave}
              disabled={leaveLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 border border-destructive/40 text-destructive hover:bg-destructive/10 font-accent text-sm uppercase tracking-widest transition-colors disabled:opacity-50"
              data-ocid={`tribe.leave_button.${tribe.id}`}
            >
              {leaveLoading ? "Leaving…" : "Leave Tribe"}
            </button>
          )}
          {isOwned && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 px-2.5 py-1 border border-accent/40 text-accent hover:bg-accent/10 font-accent text-sm uppercase tracking-widest transition-colors"
              data-ocid={`tribe.edit_button.${tribe.id}`}
            >
              Edit
            </button>
          )}
          {isOwned && onTransfer && (
            <button
              type="button"
              onClick={onTransfer}
              className="flex items-center gap-1.5 px-2.5 py-1 border border-border text-muted-foreground hover:text-foreground font-accent text-sm uppercase tracking-widest transition-colors"
              data-ocid={`tribe.transfer_button.${tribe.id}`}
            >
              Transfer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tribes Section ──────────────────────────────────────────────────────────

interface TribesSectionProps {
  myTribe: Tribe | null;
  tribeLoading: boolean;
  ownedTribes: Tribe[];
  tribeSearch: string;
  setTribeSearch: (v: string) => void;
  tribeResults: Tribe[];
  searchFetching: boolean;
  onJoinTribe: (id: string) => Promise<void>;
  onLeaveTribe: (tribe: Tribe) => void;
  onEditTribe: (t: Tribe) => void;
  onTransferTribe: (t: Tribe) => void;
  onCreateTribe: () => void;
}

// ─── Leave Tribe Dialog ───────────────────────────────────────────────────────

function LeaveTribeDialog({
  tribe,
  onCancel,
  onConfirm,
}: {
  tribe: Tribe;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      data-ocid="leave-tribe.dialog"
    >
      <div
        className="relative w-full max-w-sm mx-4 bg-card pixel-border p-6 space-y-5"
        style={{ boxShadow: "0 0 32px rgba(255,60,60,0.18)" }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-display text-xl text-destructive tracking-widest uppercase">
              Caution!
            </h2>
            <p className="font-mono text-sm text-foreground leading-relaxed">
              The stats accrued to{" "}
              <span className="text-accent font-mono">{tribe.name}</span> will
              remain there when you leave.
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              Sure you want to leave?
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="flex-1 px-4 py-2 border border-border text-muted-foreground hover:text-foreground font-accent text-sm uppercase tracking-widest transition-colors disabled:opacity-50"
            data-ocid="leave-tribe.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="flex-1 px-4 py-2 border border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20 font-accent text-sm uppercase tracking-widest transition-colors disabled:opacity-50"
            data-ocid="leave-tribe.confirm_button"
          >
            {pending ? "Leaving…" : "Leave Tribe"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TribesSection({
  myTribe,
  tribeLoading,
  ownedTribes,
  tribeSearch,
  setTribeSearch,
  tribeResults,
  searchFetching,
  onJoinTribe,
  onLeaveTribe,
  onEditTribe,
  onTransferTribe,
  onCreateTribe,
}: TribesSectionProps) {
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const canCreateTribe = ownedTribes.length < 3;

  return (
    <section
      className="mt-8 border border-border p-4 bg-card space-y-6"
      data-ocid="profile.tribes_section"
    >
      <div className="flex items-center justify-between border-b border-border pb-1 mb-4">
        <h2 className="font-display text-xl text-white tracking-widest uppercase flex items-center gap-2">
          <Users className="h-6 w-6" /> Tribes
        </h2>
      </div>
      {myTribe && (
        <h3 className="font-display text-sm uppercase tracking-widest text-white mt-4 mb-2">
          MY TRIBE
        </h3>
      )}

      {/* My Current Tribe */}
      <div>
        {tribeLoading ? (
          <div
            className="h-16 bg-muted animate-pulse pixel-border"
            data-ocid="tribe.loading_state"
          />
        ) : myTribe ? (
          <TribeCard
            tribe={myTribe}
            isMine
            isOwned={ownedTribes.some((t) => t.id === myTribe.id)}
            onLeave={() => onLeaveTribe(myTribe)}
            onEdit={
              ownedTribes.some((t) => t.id === myTribe.id)
                ? () => onEditTribe(myTribe)
                : undefined
            }
            onTransfer={
              ownedTribes.some((t) => t.id === myTribe.id)
                ? () => onTransferTribe(myTribe)
                : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Input
                value={tribeSearch}
                onChange={(e) => setTribeSearch(e.target.value)}
                placeholder="Search tribes by name (min 2 chars)"
                className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
                data-ocid="tribe.search_input"
              />
              {searchFetching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-accent text-sm text-accent animate-pulse">
                  SEARCHING…
                </span>
              )}
            </div>
            {tribeSearch.length >= 2 && (
              <div className="space-y-2" data-ocid="tribe.search_results">
                {tribeResults.length === 0 && !searchFetching ? (
                  <div className="space-y-3" data-ocid="tribe.empty_state">
                    <p className="font-mono text-xs text-muted-foreground">
                      No tribes found for "{tribeSearch}".
                    </p>
                    {canCreateTribe && (
                      <button
                        type="button"
                        onClick={onCreateTribe}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-accent text-accent hover:bg-accent/10 font-accent text-sm uppercase tracking-widest transition-colors btn-glow"
                        data-ocid="tribe.create_button"
                      >
                        <Plus className="h-3.5 w-3.5" /> Create a New Tribe
                      </button>
                    )}
                  </div>
                ) : (
                  tribeResults.map((t, idx) => (
                    <div
                      key={t.id}
                      className="pixel-border p-3 bg-background flex items-center justify-between gap-3"
                      data-ocid={`tribe.search_result.${idx + 1}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 flex-shrink-0 pixel-border overflow-hidden bg-muted flex items-center justify-center">
                          {t.photoUrl ? (
                            <img
                              src={t.photoUrl}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-xl text-accent tracking-widest truncate">
                            {t.name}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {t.memberCount.toString()} members
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          to="/tribe/$tribeId"
                          params={{ tribeId: t.id }}
                          className="px-3 py-1.5 border border-border text-muted-foreground hover:border-accent hover:text-accent font-accent text-sm uppercase tracking-widest transition-colors"
                          data-ocid={`tribe.view_page_link.${idx + 1}`}
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          disabled={joiningId === t.id}
                          onClick={async () => {
                            setJoiningId(t.id);
                            try {
                              await onJoinTribe(t.id);
                            } finally {
                              setJoiningId(null);
                            }
                          }}
                          className="px-3 py-1.5 border border-accent text-accent hover:bg-accent/10 font-accent text-sm uppercase tracking-widest transition-colors btn-glow disabled:opacity-50"
                          data-ocid={`tribe.join_button.${idx + 1}`}
                        >
                          {joiningId === t.id ? "Joining…" : "Join"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Owned Tribes — Collapsible */}
      {ownedTribes.length > 0 && (
        <ManageTribesCollapsible
          ownedTribes={ownedTribes}
          myTribe={myTribe}
          onLeaveTribe={onLeaveTribe}
          onEditTribe={onEditTribe}
          onTransferTribe={onTransferTribe}
        />
      )}

      {!canCreateTribe && (
        <p className="font-mono text-xs text-muted-foreground">
          You've reached the maximum of 3 tribes.
        </p>
      )}
    </section>
  );
}

// ─── Manage Tribes Collapsible ───────────────────────────────────────────────

function ManageTribesCollapsible({
  ownedTribes,
  myTribe,
  onLeaveTribe,
  onEditTribe,
  onTransferTribe,
}: {
  ownedTribes: Tribe[];
  myTribe: Tribe | null;
  onLeaveTribe: (t: Tribe) => void;
  onEditTribe: (t: Tribe) => void;
  onTransferTribe: (t: Tribe) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 border border-border hover:border-accent transition-colors"
        data-ocid="profile.manage_tribes.toggle"
      >
        <span className="font-accent text-sm uppercase tracking-widest text-white">
          Manage Tribes ({ownedTribes.length}/3)
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-accent" />
        ) : (
          <ChevronRight className="h-4 w-4 text-accent" />
        )}
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "2000px" : "0px", opacity: open ? 1 : 0 }}
        data-ocid="profile.manage_tribes.panel"
      >
        <div className="pt-3 space-y-3">
          {ownedTribes.map((t) => (
            <TribeCard
              key={t.id}
              tribe={t}
              isOwned
              isMine={myTribe?.id === t.id}
              onLeave={myTribe?.id === t.id ? () => onLeaveTribe(t) : undefined}
              onEdit={() => onEditTribe(t)}
              onTransfer={() => onTransferTribe(t)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

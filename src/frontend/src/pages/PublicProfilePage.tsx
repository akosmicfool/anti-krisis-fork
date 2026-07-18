import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Calendar, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { HighlightsSection } from "../components/HighlightsSection";
import type { SocialLink } from "../hooks/use-backend";

interface PublicProfile {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  born: string;
  superpowers: string;
  profilePicture: string;
  coverImage: string;
  evmAddress: string | null;
  hasOgBadge: boolean;
  socials: SocialLink[];
  tribeId?: string | null;
}

function useActorInstance() {
  return useActor(createActor);
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl text-white tracking-widest uppercase border-b border-border pb-1 mb-4">
      {children}
    </h2>
  );
}

export function PublicProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { actor, isFetching } = useActorInstance();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [ownerTribe, setOwnerTribe] = useState<{
    id: string;
    name: string;
    photoUrl?: string;
  } | null>(null);

  useEffect(() => {
    if (isFetching || !actor) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const raw = await (
          actor as unknown as {
            getProfileByUsername: (u: string) => Promise<unknown>;
          }
        ).getProfileByUsername(username);
        if (cancelled) return;
        if (!raw) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const p = raw as Record<string, unknown>;
        setProfile({
          username: (p.username as string) ?? "",
          displayName: (p.displayName as string) ?? "",
          bio: (p.bio as string) ?? "",
          location: (p.location as string) ?? "",
          born: (p.born as string) ?? "",
          superpowers: (p.superpowers as string) ?? "",
          profilePicture: (p.profilePicture as string) ?? "",
          coverImage: (p.coverImage as string) ?? "",
          evmAddress: (p.evmAddress as string | null | undefined) ?? null,
          hasOgBadge: (p.hasOgBadge as boolean | undefined) ?? false,
          socials: Array.isArray(p.socials)
            ? (p.socials as SocialLink[]).map((s, idx) => ({
                ...s,
                id: `social-${idx}`,
              }))
            : [],
        });
        // Fetch owner's tribe if available
        try {
          const tribeId = (p.tribeId as string | undefined) ?? null;
          if (tribeId && actor) {
            const tribeRaw = await (
              actor as unknown as { getTribe: (id: string) => Promise<unknown> }
            ).getTribe(tribeId);
            if (tribeRaw) {
              const t = tribeRaw as Record<string, unknown>;
              setOwnerTribe({
                id: tribeId,
                name: (t.name as string) ?? "",
                photoUrl: (t.photoUrl as string | undefined) ?? undefined,
              });
            }
          }
        } catch {
          // Tribe fetch is best-effort
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, username]);

  // Resolve principal for HighlightsSection via direct lookup
  const { data: resolvedPrincipal } = useQuery<Principal | null>({
    queryKey: ["principalByUsername", username, actor],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getPrincipalByUsername(username);
    },
    enabled: !!actor && !isFetching && !!username,
    staleTime: 120_000,
  });

  if (loading || isFetching) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="public-profile.loading_state"
      >
        <p className="font-display text-3xl text-accent tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="public-profile.error_state"
      >
        <p className="font-display text-2xl text-accent tracking-widest">
          PROFILE NOT FOUND
        </p>
        <p className="font-mono text-sm text-muted-foreground">
          @{username} does not exist.
        </p>
      </div>
    );
  }

  const displayName = profile.displayName || profile.username;
  const hasCover = !!profile.coverImage;
  const hasAvatar = !!profile.profilePicture;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const visibleSocials = profile.socials.filter((l) => l.name && l.url);

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8"
      data-ocid="public-profile.page"
    >
      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — IDENTITY
          Cover band + overlapping avatar + one-row identity details.
      ════════════════════════════════════════════════════════════════ */}
      <section className="mb-6" data-ocid="public-profile.identity_section">
        {/* Cover + Avatar Hero */}
        <div className="relative mb-14 border border-border">
          {/* Cover */}
          <div
            className="relative h-48 overflow-hidden"
            style={{
              background: hasCover
                ? undefined
                : "linear-gradient(135deg, #001a05 0%, #004d14 50%, #001a05 100%)",
            }}
          >
            {hasCover && (
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover opacity-80"
              />
            )}
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
              }}
            />
          </div>

          {/* Avatar + Tribe badge row */}
          <div className="absolute -bottom-12 left-6 flex items-end gap-3">
            <div className="relative w-24 h-24 border border-border overflow-hidden bg-muted">
              {hasAvatar ? (
                <img
                  src={profile.profilePicture}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card">
                  <span className="font-display text-3xl text-accent">
                    {initials}
                  </span>
                </div>
              )}
            </div>
            {ownerTribe && (
              <Link
                to="/tribe/$tribeId"
                params={{ tribeId: ownerTribe.id }}
                className="w-10 h-10 flex-shrink-0 border border-border overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                title={`View Tribe: ${ownerTribe.name}`}
                data-ocid="public-profile.tribe_badge"
              >
                {ownerTribe.photoUrl ? (
                  <img
                    src={ownerTribe.photoUrl}
                    alt={ownerTribe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display text-sm text-accent">
                    {ownerTribe.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Empty top-right bar (maintains height above cover) */}
          <div className="flex justify-end px-4 pt-2 pb-3 min-h-[2.5rem]" />
        </div>

        {/* Identity row: name + username + location + born */}
        <div className="space-y-2">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl text-foreground tracking-widest">
                {displayName}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-base text-accent tracking-widest">
                @{profile.username}
              </span>
              {profile.location && (
                <span className="flex items-center gap-1.5 font-mono text-sm text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  {profile.location}
                </span>
              )}
              {profile.born && (
                <span className="flex items-center gap-1.5 font-mono text-sm text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-accent" />
                  {profile.born}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — BIO + LINKS (side by side)
      ════════════════════════════════════════════════════════════════ */}
      {(profile.bio || visibleSocials.length > 0) && (
        <div
          className="flex flex-col sm:flex-row gap-4 mb-6"
          data-ocid="public-profile.bio_links_row"
        >
          {/* Bio */}
          {profile.bio && (
            <section
              className="border border-border p-4 bg-card flex-1 min-w-0"
              data-ocid="public-profile.bio_section"
            >
              <SectionHeader>Bio</SectionHeader>
              <p className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </section>
          )}
          {/* Links */}
          {visibleSocials.length > 0 && (
            <section
              className="border border-border p-4 bg-card flex-1 min-w-0"
              data-ocid="public-profile.socials_section"
            >
              <SectionHeader>Links</SectionHeader>
              <div className="flex flex-wrap gap-3">
                {visibleSocials.map((link, i) => (
                  <a
                    key={`social-${i}-${link.name}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-mono text-sm text-accent border-b border-accent pb-px hover:text-primary hover:border-primary transition-colors"
                    data-ocid={`public-profile.socials.link.${i + 1}`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — OVERVIEW + BURN ALLO + BADGES (horizontal row)
      ════════════════════════════════════════════════════════════════ */}
      {resolvedPrincipal && (
        <HighlightsSection
          type="player"
          principal={resolvedPrincipal}
          hasOgBadge={profile.hasOgBadge}
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4 — SUPERPOWERS + INTERESTS (side by side)
      ════════════════════════════════════════════════════════════════ */}
      {(profile.superpowers ||
        !!localStorage.getItem(
          `interests_${resolvedPrincipal?.toText() ?? ""}`,
        )) && (
        <div
          className="flex flex-col sm:flex-row gap-4 mb-6"
          data-ocid="public-profile.superpowers_interests_row"
        >
          {/* Superpowers */}
          {profile.superpowers && (
            <section
              className="border border-border p-4 bg-card flex-1 min-w-0"
              data-ocid="public-profile.superpowers_section"
            >
              <SectionHeader>Superpowers</SectionHeader>
              <p
                className="font-mono text-sm text-foreground"
                data-ocid="public-profile.superpowers"
              >
                {profile.superpowers}
              </p>
            </section>
          )}
          {/* Interests */}
          {resolvedPrincipal &&
            localStorage.getItem(`interests_${resolvedPrincipal.toText()}`) && (
              <section
                className="border border-border p-4 bg-card flex-1 min-w-0"
                data-ocid="public-profile.interests_section"
              >
                <SectionHeader>Interests</SectionHeader>
                <p
                  className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap"
                  data-ocid="public-profile.interests"
                >
                  {localStorage.getItem(
                    `interests_${resolvedPrincipal.toText()}`,
                  )}
                </p>
              </section>
            )}
        </div>
      )}
    </div>
  );
}

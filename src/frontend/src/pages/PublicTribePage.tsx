import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useParams } from "@tanstack/react-router";
import { Share2, Shield, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { HighlightsSection } from "../components/HighlightsSection";
import { StatTile } from "../components/StatTile";
import { useAuth } from "../hooks/use-auth";
import {
  useGetMyTribe,
  useGetTribe,
  useGetTribeMembersWithRoles,
  useJoinTribe,
  useLeaveTribe,
} from "../hooks/use-backend";
import { useTopTribesAlltime } from "../hooks/use-score";
import { formatGritCompact } from "../lib/format";

const MAX_MEMBERS = 150;

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl text-white tracking-widest uppercase border-b border-border pb-1 mb-4">
      {children}
    </h2>
  );
}

type ModalKind =
  | { type: "join_solo" }
  | { type: "join_switch" }
  | { type: "leave" }
  | null;

export function PublicTribePage() {
  const { tribeId } = useParams({ from: "/tribe/$tribeId" });
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principal } = useAuth();

  const [modal, setModal] = useState<ModalKind>(null);
  const [copied, setCopied] = useState(false);

  // Live stats from backend
  const [liveGrit, setLiveGrit] = useState(0);
  const [historyAkk, setHistoryAkk] = useState(0);
  const [tribeRank, setTribeRank] = useState<bigint | null>(null);

  // All-time score — derived from the ONE shared all-time tribe leaderboard
  // cache (the same query the Skoreboard and the TOP LEADER badge read), so
  // this page can never disagree with them.
  const { data: topTribes = [] } = useTopTribesAlltime();
  const tribeLeaderboardScore =
    topTribes.find((t) => t.tribeId === tribeId)?.score ?? 0;

  // Tribe + member list live in per-tribe React Query caches (["tribe", id],
  // ["tribeMembersWithRoles", id]) so join/leave can invalidate them and both
  // the MEMBERS tile and the "MEMBERS (n/150)" header converge to server
  // truth instead of drifting from an optimistic ±1.
  const {
    data: tribe,
    isPending: tribePending,
    isError: tribeError,
  } = useGetTribe(tribeId);
  const {
    data: members = [],
    isPending: membersPending,
    isError: membersError,
  } = useGetTribeMembersWithRoles(tribeId);

  const { data: myTribe } = useGetMyTribe();
  const joinTribe = useJoinTribe();
  const leaveTribe = useLeaveTribe();

  // Fetch live GRIT/AKK stats + rank
  useEffect(() => {
    if (isFetching || !actor || !tribeId) return;
    let cancelled = false;
    (async () => {
      try {
        const [liveStats, rank, akkResult] = await Promise.all([
          actor.getTribeLiveStats(tribeId),
          actor.getTribeRank(tribeId, "alltime"),
          actor.getTribeAkkFromHistory(tribeId).catch(() => null),
        ]);
        if (cancelled) return;
        if (liveStats) {
          // totalGrit is a raw Nat value from backend — divide directly for display
          setLiveGrit(Number(liveStats.totalGrit));
        }
        // getTribeAkkFromHistory returns bigint directly — convert to AKK (e8s)
        setHistoryAkk(akkResult != null ? Number(akkResult) / 1e8 : 0);
        setTribeRank(rank ?? null);
      } catch {
        // silently fall back to the initial values
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, tribeId]);

  // Always use origin + path form so query strings or hash fragments don't leak
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/tribe/${tribeId}`
      : `/tribe/${tribeId}`;

  const handleShare = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const el = document.createElement("textarea");
        el.value = shareUrl;
        el.style.position = "fixed";
        el.style.top = "0";
        el.style.left = "0";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }, [shareUrl]);

  const handleJoinClick = useCallback(() => {
    if (!myTribe || myTribe.id === tribeId) return;
    const isSoloTribe = !myTribe || myTribe.memberCount <= 1n;
    setModal(isSoloTribe ? { type: "join_solo" } : { type: "join_switch" });
  }, [myTribe, tribeId]);

  const handleJoinNoTribe = useCallback(() => {
    setModal({ type: "join_solo" });
  }, []);

  const confirmJoin = useCallback(() => {
    joinTribe.mutate(tribeId, {
      onSuccess: () => {
        // The mutation invalidates ["tribe", id] + ["tribeMembersWithRoles", id]
        // so the member tile and header refetch server truth immediately.
        toast.success("Joined tribe!");
        setModal(null);
      },
      onError: (err: Error) => {
        toast.error(err.message);
        setModal(null);
      },
    });
  }, [joinTribe, tribeId]);

  const handleLeaveClick = useCallback(() => {
    setModal({ type: "leave" });
  }, []);

  const confirmLeave = useCallback(() => {
    leaveTribe.mutate(undefined, {
      onSuccess: () => {
        toast.success("Left tribe.");
        setModal(null);
      },
      onError: (err: Error) => {
        toast.error(err.message);
        setModal(null);
      },
    });
  }, [leaveTribe]);

  // Gate on BOTH queries (parity with the old Promise.all) so the members
  // list never flashes "0/150 / No members yet" while its fetch is in flight.
  const loading = tribePending || membersPending;
  const notFound = tribeError || membersError || (!loading && !tribe);

  // Loading state
  if (loading || isFetching) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="tribe.loading_state"
      >
        <p className="font-display text-3xl text-accent tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  // Not found
  if (notFound || !tribe) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="tribe.error_state"
      >
        <p className="font-display text-2xl text-accent tracking-widest">
          TRIBE NOT FOUND
        </p>
        <p className="font-mono text-sm text-muted-foreground">
          Tribe <span className="text-accent">{tribeId}</span> does not exist.
        </p>
      </div>
    );
  }

  const hasPhoto = !!tribe.photoUrl;
  const hasCover = !!tribe.coverImageUrl;
  const isThisTribe = myTribe?.id === tribeId;
  const isInDifferentTribe = !!myTribe && myTribe.id !== tribeId;
  const isAtCapacity = tribe.memberCount >= BigInt(MAX_MEMBERS);
  // Is the current user the tribe leader (creator/owner)?
  const isLeader =
    !!principal && members.some((m) => m.isLeader && m.userId === principal);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-ocid="tribe.page">
      {/* ════════════════════════════════════════════════════════════
          HERO — Cover + Logo + Actions
      ════════════════════════════════════════════════════════════ */}
      <section className="mb-6" data-ocid="tribe.identity_section">
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
                src={tribe.coverImageUrl}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
              }}
            />
          </div>

          {/* Tribe logo — bottom-left overlapping cover */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative w-24 h-24 border border-border overflow-hidden bg-muted flex items-center justify-center">
              {hasPhoto ? (
                <img
                  src={tribe.photoUrl}
                  alt={tribe.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-3xl text-accent select-none">
                  {tribe.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Actions row — top-right */}
          <div className="flex justify-end gap-2 px-4 pt-2 pb-3">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share tribe"
              className="relative flex items-center gap-1.5 px-2.5 py-1 border border-border text-muted-foreground hover:border-accent hover:text-accent font-accent text-sm uppercase tracking-widest transition-colors min-w-[80px] justify-center"
              data-ocid="tribe.share_button"
            >
              {copied ? (
                <span
                  className="text-accent font-accent text-xs uppercase tracking-widest animate-pulse"
                  data-ocid="tribe.share_button.success_state"
                >
                  COPIED!
                </span>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  SHARE
                </>
              )}
            </button>

            {/* JOIN — not logged in */}
            {!isAuthenticated && (
              <button
                type="button"
                disabled
                className="flex items-center gap-1.5 px-3 py-1 border border-border text-muted-foreground font-accent text-sm uppercase tracking-widest opacity-40 cursor-not-allowed"
              >
                JOIN
              </button>
            )}

            {/* JOIN — not in any tribe */}
            {isAuthenticated && !myTribe && !isAtCapacity && (
              <button
                type="button"
                onClick={handleJoinNoTribe}
                disabled={joinTribe.isPending}
                className="flex items-center gap-1.5 px-3 py-1 border border-accent bg-accent/10 text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
                data-ocid="tribe.join_button"
              >
                {joinTribe.isPending ? "JOINING..." : "JOIN"}
              </button>
            )}

            {/* JOIN — in a different tribe */}
            {isAuthenticated && isInDifferentTribe && !isAtCapacity && (
              <button
                type="button"
                onClick={handleJoinClick}
                disabled={joinTribe.isPending}
                className="flex items-center gap-1.5 px-3 py-1 border border-accent bg-accent/10 text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
                data-ocid="tribe.join_button"
              >
                {joinTribe.isPending ? "JOINING..." : "JOIN"}
              </button>
            )}

            {/* CAPACITY WARNING */}
            {isAuthenticated && !isThisTribe && isAtCapacity && (
              <span className="flex items-center px-3 py-1 border border-border text-muted-foreground font-accent text-xs uppercase tracking-widest">
                FULL ({MAX_MEMBERS})
              </span>
            )}

            {/* MEMBER — already in this tribe → show LEAVE */}
            {isAuthenticated && isThisTribe && (
              <button
                type="button"
                onClick={handleLeaveClick}
                disabled={leaveTribe.isPending}
                className="flex items-center gap-1.5 px-3 py-1 border border-destructive/60 bg-destructive/10 text-destructive font-accent text-sm uppercase tracking-widest hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-ocid="tribe.leave_button"
              >
                {leaveTribe.isPending ? "LEAVING..." : "LEAVE"}
              </button>
            )}
          </div>
        </div>

        {/* Tribe name */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl text-foreground tracking-widest leading-tight">
            {tribe.name}
          </h1>
        </div>
      </section>

      {/* ABOUT — tribe description (mirrors the player profile's BIO panel) */}
      {tribe.description && (
        <section
          className="border border-border p-4 bg-card mb-6"
          data-ocid="tribe.about_section"
        >
          <SectionHeader>ABOUT</SectionHeader>
          <p className="font-mono text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap">
            {tribe.description}
          </p>
        </section>
      )}

      {/*════════════════════════════════════════════════════════════
          OVERVIEW — two-row tile grid
      ════════════════════════════════════════════════════════════ */}
      <section className="mb-6" data-ocid="tribe.overview_section">
        <SectionHeader>OVERVIEW</SectionHeader>
        {/* Row 1: RANK · SKORE · MEMBERS — flex-row on ALL screen sizes so all 3 fit */}
        <div className="flex flex-row gap-2 mb-3">
          <StatTile
            label="RANK"
            value={tribeRank !== null ? `#${tribeRank}` : "—"}
            unit="All Time"
            valueColor="text-[#00ff41]"
          />
          <StatTile
            label="SKORE"
            value={
              tribeLeaderboardScore > 0 ? tribeLeaderboardScore.toFixed(2) : "—"
            }
            unit="AK69"
            valueColor="text-[#00ff41]"
          />
          <StatTile
            label="MEMBERS"
            value={String(tribe.memberCount)}
            unit="STRONG"
            valueColor="text-[#00ff41]"
          />
        </div>
        {/* Row 2: GRIT · AKK */}
        <div className="flex gap-3">
          <StatTile
            label="GRIT"
            value={formatGritCompact(liveGrit)}
            unit="All Time"
          />
          <StatTile
            label="AKK"
            value={historyAkk.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            unit="All Time"
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HIGHLIGHTS (Burn Allo bar chart)
      ════════════════════════════════════════════════════════════ */}
      <HighlightsSection type="tribe" tribeId={tribeId} />

      {/* ════════════════════════════════════════════════════════════
          MEMBERS
      ════════════════════════════════════════════════════════════ */}
      <section
        className="border border-border p-4 bg-card mb-4"
        data-ocid="tribe.members_section"
      >
        <SectionHeader>
          <Users className="inline h-5 w-5 mr-2 mb-0.5" />
          MEMBERS ({members.length}/{MAX_MEMBERS})
        </SectionHeader>
        {/* MAX_MEMBERS cap shown in header only */}

        {members.length === 0 ? (
          <p
            className="font-mono text-sm text-muted-foreground py-4 text-center"
            data-ocid="tribe.members.empty_state"
          >
            No members yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {members.map((member, i) => (
              <li
                key={member.userId}
                className="flex items-center gap-3"
                data-ocid={`tribe.members.item.${i + 1}`}
              >
                <span className="font-accent text-xs text-muted-foreground w-6 text-right shrink-0">
                  {i + 1}.
                </span>
                <Link
                  to="/profile/$username"
                  params={{ username: member.username }}
                  className="font-mono text-sm text-accent hover:text-primary transition-colors border-b border-accent/40 hover:border-primary pb-px min-w-0 truncate"
                  data-ocid={`tribe.members.link.${i + 1}`}
                >
                  @{member.username}
                </Link>
                {member.isLeader && (
                  <span
                    className="flex items-center gap-1 px-1.5 py-0.5 border border-accent/50 text-accent font-accent text-xs uppercase tracking-widest shrink-0"
                    data-ocid={`tribe.members.leader_badge.${i + 1}`}
                  >
                    <Shield className="h-3 w-3" />
                    LEADER
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════
          BOTTOM ACTION — JOIN / LEAVE TRIBE
      ════════════════════════════════════════════════════════════ */}
      {isAuthenticated && (
        <section className="mb-8" data-ocid="tribe.action_section">
          {/* Owner / Leader — owns this tribe, cannot leave */}
          {isThisTribe && isLeader && (
            <div className="border border-white/10 bg-card p-4 text-center">
              <span className="font-accent text-sm text-muted-foreground uppercase tracking-widest">
                YOU OWN THIS TRIBE
              </span>
            </div>
          )}

          {/* LEAVE — already a member but not the leader */}
          {isThisTribe && !isLeader && (
            <button
              type="button"
              onClick={handleLeaveClick}
              disabled={leaveTribe.isPending}
              className="w-full pixel-border bg-destructive/10 text-destructive font-accent text-base uppercase tracking-widest py-3 px-6 hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="tribe.bottom_leave_button"
            >
              {leaveTribe.isPending ? "LEAVING..." : "LEAVE TRIBE"}
            </button>
          )}

          {/* JOIN — not a member */}
          {!isThisTribe && !isAtCapacity && (
            <button
              type="button"
              onClick={isInDifferentTribe ? handleJoinClick : handleJoinNoTribe}
              disabled={joinTribe.isPending}
              className="w-full pixel-border bg-accent/10 text-accent font-accent text-base uppercase tracking-widest py-3 px-6 hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
              data-ocid="tribe.bottom_join_button"
            >
              {joinTribe.isPending ? "JOINING..." : "JOIN TRIBE"}
            </button>
          )}

          {/* AT CAPACITY */}
          {!isThisTribe && isAtCapacity && (
            <div className="border border-white/10 bg-card p-4 text-center">
              <span className="font-accent text-sm text-muted-foreground uppercase tracking-widest">
                TRIBE IS FULL ({MAX_MEMBERS} MEMBERS)
              </span>
            </div>
          )}
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════════════ */}
      {modal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          data-ocid="tribe.dialog"
        >
          <div className="pixel-border bg-card p-6 max-w-md w-full space-y-4">
            {/* JOIN SOLO */}
            {modal.type === "join_solo" && (
              <>
                <h3 className="font-display text-xl text-white tracking-widest uppercase">
                  JOIN {tribe.name}?
                </h3>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                  This will become your active tribe.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={confirmJoin}
                    disabled={joinTribe.isPending}
                    className="flex-1 px-4 py-2 border border-accent bg-accent/10 text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-50 btn-glow"
                    data-ocid="tribe.confirm_button"
                  >
                    {joinTribe.isPending ? "JOINING..." : "JOIN"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="flex-1 px-4 py-2 border border-border text-muted-foreground font-accent text-sm uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
                    data-ocid="tribe.cancel_button"
                  >
                    CANCEL
                  </button>
                </div>
              </>
            )}

            {/* JOIN SWITCH — leaving current tribe */}
            {modal.type === "join_switch" && (
              <>
                <h3 className="font-display text-xl text-white tracking-widest uppercase">
                  SWITCH TRIBE?
                </h3>
                <div className="border-l-2 border-accent pl-3">
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                    Your stats accrued with your current tribe will remain there
                    and new stats will accrue to the tribe you are about to
                    join.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={confirmJoin}
                    disabled={joinTribe.isPending}
                    className="flex-1 px-4 py-2 border border-accent bg-accent/10 text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-50 btn-glow"
                    data-ocid="tribe.confirm_button"
                  >
                    {joinTribe.isPending ? "JOINING..." : "CONFIRM JOIN"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="flex-1 px-4 py-2 border border-border text-muted-foreground font-accent text-sm uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
                    data-ocid="tribe.cancel_button"
                  >
                    CANCEL
                  </button>
                </div>
              </>
            )}

            {/* LEAVE */}
            {modal.type === "leave" && (
              <>
                <h3 className="font-display text-xl text-white tracking-widest uppercase">
                  LEAVE {tribe.name}?
                </h3>
                <div className="border-l-2 border-destructive/60 pl-3">
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                    Your stats accrued with your current tribe will remain with
                    them and new stats will accrue to the new tribe.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={confirmLeave}
                    disabled={leaveTribe.isPending}
                    className="flex-1 px-4 py-2 border border-destructive/60 bg-destructive/10 text-destructive font-accent text-sm uppercase tracking-widest hover:bg-destructive/20 transition-colors disabled:opacity-50"
                    data-ocid="tribe.confirm_button"
                  >
                    {leaveTribe.isPending ? "LEAVING..." : "CONFIRM LEAVE"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="flex-1 px-4 py-2 border border-border text-muted-foreground font-accent text-sm uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
                    data-ocid="tribe.cancel_button"
                  >
                    CANCEL
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

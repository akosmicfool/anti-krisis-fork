import { q as useParams, v as useActor, u as useAuth, r as reactExports, x as useGetMyTribe, y as useJoinTribe, z as useLeaveTribe, j as jsxRuntimeExports, L as Link, w as createActor } from "./index-DqUaPUte.js";
import { u as ue } from "./index-lFSGe_yi.js";
import { H as HighlightsSection } from "./HighlightsSection-CybbBRuo.js";
import { S as Share2 } from "./share-2-C0hvVbJQ.js";
import { U as Users } from "./users-B1Dh4dop.js";
import { S as Shield } from "./shield-D2nSa5Nc.js";
const MAX_MEMBERS = 150;
function SectionHeader({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl text-white tracking-widest uppercase border-b border-border pb-1 mb-4", children });
}
function StatTile({
  label,
  value,
  unit,
  valueColor = "text-white"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-white/10 bg-card px-2 py-3 flex flex-col items-center gap-0.5 flex-1 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-accent text-xs sm:text-sm text-accent tracking-widest uppercase truncate", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `font-mono text-lg sm:text-2xl font-bold tabular-nums leading-tight ${valueColor}`,
        children: value
      }
    ),
    unit && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-accent text-[9px] sm:text-xs text-muted-foreground tracking-widest uppercase truncate", children: unit })
  ] });
}
function formatGritCompact(raw) {
  if (raw >= 1e12)
    return `${(raw / 1e12).toFixed(2)}T`;
  if (raw >= 1e9) return `${(raw / 1e9).toFixed(2)}B`;
  if (raw >= 1e6) return `${(raw / 1e6).toFixed(2)}M`;
  return raw.toFixed(2);
}
function PublicTribePage() {
  const { tribeId } = useParams({ from: "/tribe/$tribeId" });
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principal } = useAuth();
  const [tribe, setTribe] = reactExports.useState(null);
  const [members, setMembers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [notFound, setNotFound] = reactExports.useState(false);
  const [modal, setModal] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const [liveGrit, setLiveGrit] = reactExports.useState(0);
  const [historyAkk, setHistoryAkk] = reactExports.useState(0);
  const [tribeRank, setTribeRank] = reactExports.useState(null);
  const [tribeLeaderboardScore, setTribeLeaderboardScore] = reactExports.useState(0);
  const { data: myTribe } = useGetMyTribe();
  const joinTribe = useJoinTribe();
  const leaveTribe = useLeaveTribe();
  const cancelledRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (isFetching || !actor) return;
    cancelledRef.current = false;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const [t, m] = await Promise.all([
          actor.getTribe(tribeId),
          actor.getTribeMembersWithRoles(tribeId)
        ]);
        if (cancelledRef.current) return;
        if (!t) {
          setNotFound(true);
        } else {
          setTribe(t);
          setMembers(m);
        }
      } catch {
        if (!cancelledRef.current) setNotFound(true);
      } finally {
        if (!cancelledRef.current) setLoading(false);
      }
    })();
    return () => {
      cancelledRef.current = true;
    };
  }, [actor, isFetching, tribeId]);
  reactExports.useEffect(() => {
    if (isFetching || !actor || !tribeId) return;
    let cancelled = false;
    (async () => {
      try {
        const [liveStats, rank, topTribes, akkResult] = await Promise.all([
          actor.getTribeLiveStats(tribeId),
          actor.getTribeRank(tribeId, "alltime"),
          actor.getTopTribes("alltime"),
          actor.getTribeAkkFromHistory(tribeId).catch(() => null)
        ]);
        if (cancelled) return;
        if (liveStats) {
          setLiveGrit(Number(liveStats.totalGrit));
        }
        setHistoryAkk(akkResult != null ? Number(akkResult) / 1e8 : 0);
        setTribeRank(rank ?? null);
        const entry = topTribes.find((t) => t.tribeId === tribeId);
        if (entry) {
          const leaderScore = typeof entry.score === "number" ? entry.score : Number(entry.score);
          setTribeLeaderboardScore(Math.round(leaderScore));
        }
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, tribeId]);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/tribe/${tribeId}` : `/tribe/${tribeId}`;
  const handleShare = reactExports.useCallback(async () => {
    var _a;
    try {
      if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
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
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      ue.error("Could not copy link");
    }
  }, [shareUrl]);
  const handleJoinClick = reactExports.useCallback(() => {
    if (!myTribe || myTribe.id === tribeId) return;
    const isSoloTribe = !myTribe || myTribe.memberCount <= 1n;
    setModal(isSoloTribe ? { type: "join_solo" } : { type: "join_switch" });
  }, [myTribe, tribeId]);
  const handleJoinNoTribe = reactExports.useCallback(() => {
    setModal({ type: "join_solo" });
  }, []);
  const confirmJoin = reactExports.useCallback(() => {
    joinTribe.mutate(tribeId, {
      onSuccess: () => {
        ue.success("Joined tribe!");
        if (tribe) setTribe({ ...tribe, memberCount: tribe.memberCount + 1n });
        setModal(null);
      },
      onError: (err) => {
        ue.error(err.message);
        setModal(null);
      }
    });
  }, [joinTribe, tribeId, tribe]);
  const handleLeaveClick = reactExports.useCallback(() => {
    setModal({ type: "leave" });
  }, []);
  const confirmLeave = reactExports.useCallback(() => {
    leaveTribe.mutate(void 0, {
      onSuccess: () => {
        ue.success("Left tribe.");
        if (tribe)
          setTribe({
            ...tribe,
            memberCount: tribe.memberCount > 0n ? tribe.memberCount - 1n : 0n
          });
        setModal(null);
      },
      onError: (err) => {
        ue.error(err.message);
        setModal(null);
      }
    });
  }, [leaveTribe, tribe]);
  if (loading || isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "tribe.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl text-accent tracking-widest animate-pulse", children: "LOADING..." })
      }
    );
  }
  if (notFound || !tribe) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        "data-ocid": "tribe.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-accent tracking-widest", children: "TRIBE NOT FOUND" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-muted-foreground", children: [
            "Tribe ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: tribeId }),
            " does not exist."
          ] })
        ]
      }
    );
  }
  const hasPhoto = !!tribe.photoUrl;
  const hasCover = !!tribe.coverImageUrl;
  const isThisTribe = (myTribe == null ? void 0 : myTribe.id) === tribeId;
  const isInDifferentTribe = !!myTribe && myTribe.id !== tribeId;
  const isAtCapacity = tribe.memberCount >= BigInt(MAX_MEMBERS);
  const isLeader = !!principal && members.some((m) => m.isLeader && m.userId === principal);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", "data-ocid": "tribe.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6", "data-ocid": "tribe.identity_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-14 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative h-48 overflow-hidden",
            style: {
              background: hasCover ? void 0 : "linear-gradient(135deg, #001a05 0%, #004d14 50%, #001a05 100%)"
            },
            children: [
              hasCover && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: tribe.coverImageUrl,
                  alt: "",
                  className: "w-full h-full object-cover opacity-80"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: {
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-12 left-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-24 h-24 border border-border overflow-hidden bg-muted flex items-center justify-center", children: hasPhoto ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: tribe.photoUrl,
            alt: tribe.name,
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl text-accent select-none", children: tribe.name.charAt(0).toUpperCase() }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-4 pt-2 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleShare,
              "aria-label": "Share tribe",
              className: "relative flex items-center gap-1.5 px-2.5 py-1 border border-border text-muted-foreground hover:border-accent hover:text-accent font-accent text-sm uppercase tracking-widest transition-colors min-w-[80px] justify-center",
              "data-ocid": "tribe.share_button",
              children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-accent font-accent text-xs uppercase tracking-widest animate-pulse",
                  "data-ocid": "tribe.share_button.success_state",
                  children: "COPIED!"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
                "SHARE"
              ] })
            }
          ),
          !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              disabled: true,
              className: "flex items-center gap-1.5 px-3 py-1 border border-border text-muted-foreground font-accent text-sm uppercase tracking-widest opacity-40 cursor-not-allowed",
              children: "JOIN"
            }
          ),
          isAuthenticated && !myTribe && !isAtCapacity && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleJoinNoTribe,
              disabled: joinTribe.isPending,
              className: "flex items-center gap-1.5 px-3 py-1 border border-accent bg-accent/10 text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-glow",
              "data-ocid": "tribe.join_button",
              children: joinTribe.isPending ? "JOINING..." : "JOIN"
            }
          ),
          isAuthenticated && isInDifferentTribe && !isAtCapacity && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleJoinClick,
              disabled: joinTribe.isPending,
              className: "flex items-center gap-1.5 px-3 py-1 border border-accent bg-accent/10 text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-glow",
              "data-ocid": "tribe.join_button",
              children: joinTribe.isPending ? "JOINING..." : "JOIN"
            }
          ),
          isAuthenticated && !isThisTribe && isAtCapacity && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center px-3 py-1 border border-border text-muted-foreground font-accent text-xs uppercase tracking-widest", children: [
            "FULL (",
            MAX_MEMBERS,
            ")"
          ] }),
          isAuthenticated && isThisTribe && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleLeaveClick,
              disabled: leaveTribe.isPending,
              className: "flex items-center gap-1.5 px-3 py-1 border border-destructive/60 bg-destructive/10 text-destructive font-accent text-sm uppercase tracking-widest hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              "data-ocid": "tribe.leave_button",
              children: leaveTribe.isPending ? "LEAVING..." : "LEAVE"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground tracking-widest leading-tight", children: tribe.name }),
        tribe.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-white leading-relaxed", children: tribe.description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6", "data-ocid": "tribe.overview_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "OVERVIEW" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "RANK",
            value: tribeRank !== null ? `#${tribeRank}` : "—",
            unit: "All Time",
            valueColor: "text-[#00ff41]"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "SCORE",
            value: tribeLeaderboardScore > 0 ? tribeLeaderboardScore.toString() : "—",
            unit: "AK69",
            valueColor: "text-[#00ff41]"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "MEMBERS",
            value: String(tribe.memberCount),
            unit: "STRONG",
            valueColor: "text-[#00ff41]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "GRIT",
            value: formatGritCompact(liveGrit),
            unit: "All Time"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "AKK",
            value: historyAkk.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }),
            unit: "AKK"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightsSection, { type: "tribe", tribeId }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "border border-border p-4 bg-card mb-4",
        "data-ocid": "tribe.members_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "inline h-5 w-5 mr-2 mb-0.5" }),
            "MEMBERS (",
            members.length,
            "/",
            MAX_MEMBERS,
            ")"
          ] }),
          members.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-sm text-muted-foreground py-4 text-center",
              "data-ocid": "tribe.members.empty_state",
              children: "No members yet."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: members.map((member, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center gap-3",
              "data-ocid": `tribe.members.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-accent text-xs text-muted-foreground w-6 text-right shrink-0", children: [
                  i + 1,
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/profile/$username",
                    params: { username: member.username },
                    className: "font-mono text-sm text-accent hover:text-primary transition-colors border-b border-accent/40 hover:border-primary pb-px min-w-0 truncate",
                    "data-ocid": `tribe.members.link.${i + 1}`,
                    children: [
                      "@",
                      member.username
                    ]
                  }
                ),
                member.isLeader && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "flex items-center gap-1 px-1.5 py-0.5 border border-accent/50 text-accent font-accent text-xs uppercase tracking-widest shrink-0",
                    "data-ocid": `tribe.members.leader_badge.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
                      "LEADER"
                    ]
                  }
                )
              ]
            },
            member.userId
          )) })
        ]
      }
    ),
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", "data-ocid": "tribe.action_section", children: [
      isThisTribe && isLeader && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-white/10 bg-card p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-accent text-sm text-muted-foreground uppercase tracking-widest", children: "YOU OWN THIS TRIBE" }) }),
      isThisTribe && !isLeader && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleLeaveClick,
          disabled: leaveTribe.isPending,
          className: "w-full pixel-border bg-destructive/10 text-destructive font-accent text-base uppercase tracking-widest py-3 px-6 hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          "data-ocid": "tribe.bottom_leave_button",
          children: leaveTribe.isPending ? "LEAVING..." : "LEAVE TRIBE"
        }
      ),
      !isThisTribe && !isAtCapacity && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: isInDifferentTribe ? handleJoinClick : handleJoinNoTribe,
          disabled: joinTribe.isPending,
          className: "w-full pixel-border bg-accent/10 text-accent font-accent text-base uppercase tracking-widest py-3 px-6 hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-glow",
          "data-ocid": "tribe.bottom_join_button",
          children: joinTribe.isPending ? "JOINING..." : "JOIN TRIBE"
        }
      ),
      !isThisTribe && isAtCapacity && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-white/10 bg-card p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-accent text-sm text-muted-foreground uppercase tracking-widest", children: [
        "TRIBE IS FULL (",
        MAX_MEMBERS,
        " MEMBERS)"
      ] }) })
    ] }),
    modal !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4",
        "data-ocid": "tribe.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pixel-border bg-card p-6 max-w-md w-full space-y-4", children: [
          modal.type === "join_solo" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl text-white tracking-widest uppercase", children: [
              "JOIN ",
              tribe.name,
              "?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground leading-relaxed", children: "This will become your active tribe." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: confirmJoin,
                  disabled: joinTribe.isPending,
                  className: "flex-1 px-4 py-2 border border-accent bg-accent/10 text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-50 btn-glow",
                  "data-ocid": "tribe.confirm_button",
                  children: joinTribe.isPending ? "JOINING..." : "JOIN"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setModal(null),
                  className: "flex-1 px-4 py-2 border border-border text-muted-foreground font-accent text-sm uppercase tracking-widest hover:border-accent hover:text-accent transition-colors",
                  "data-ocid": "tribe.cancel_button",
                  children: "CANCEL"
                }
              )
            ] })
          ] }),
          modal.type === "join_switch" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-white tracking-widest uppercase", children: "SWITCH TRIBE?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-l-2 border-accent pl-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground leading-relaxed", children: "Your stats accrued with your current tribe will remain there and new stats will accrue to the tribe you are about to join." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: confirmJoin,
                  disabled: joinTribe.isPending,
                  className: "flex-1 px-4 py-2 border border-accent bg-accent/10 text-accent font-accent text-sm uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-50 btn-glow",
                  "data-ocid": "tribe.confirm_button",
                  children: joinTribe.isPending ? "JOINING..." : "CONFIRM JOIN"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setModal(null),
                  className: "flex-1 px-4 py-2 border border-border text-muted-foreground font-accent text-sm uppercase tracking-widest hover:border-accent hover:text-accent transition-colors",
                  "data-ocid": "tribe.cancel_button",
                  children: "CANCEL"
                }
              )
            ] })
          ] }),
          modal.type === "leave" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl text-white tracking-widest uppercase", children: [
              "LEAVE ",
              tribe.name,
              "?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-l-2 border-destructive/60 pl-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground leading-relaxed", children: "Your stats accrued with your current tribe will remain with them and new stats will accrue to the new tribe." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: confirmLeave,
                  disabled: leaveTribe.isPending,
                  className: "flex-1 px-4 py-2 border border-destructive/60 bg-destructive/10 text-destructive font-accent text-sm uppercase tracking-widest hover:bg-destructive/20 transition-colors disabled:opacity-50",
                  "data-ocid": "tribe.confirm_button",
                  children: leaveTribe.isPending ? "LEAVING..." : "CONFIRM LEAVE"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setModal(null),
                  className: "flex-1 px-4 py-2 border border-border text-muted-foreground font-accent text-sm uppercase tracking-widest hover:border-accent hover:text-accent transition-colors",
                  "data-ocid": "tribe.cancel_button",
                  children: "CANCEL"
                }
              )
            ] })
          ] })
        ] })
      }
    )
  ] });
}
export {
  PublicTribePage
};

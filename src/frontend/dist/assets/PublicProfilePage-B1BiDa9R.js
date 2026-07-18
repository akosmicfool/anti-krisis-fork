import { q as useParams, r as reactExports, s as useQuery, j as jsxRuntimeExports, L as Link, v as useActor, w as createActor } from "./index-DqUaPUte.js";
import { H as HighlightsSection } from "./HighlightsSection-CybbBRuo.js";
import { M as MapPin, C as Calendar } from "./map-pin-Bb1cvKqF.js";
function useActorInstance() {
  return useActor(createActor);
}
function SectionHeader({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl text-white tracking-widest uppercase border-b border-border pb-1 mb-4", children });
}
function PublicProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { actor, isFetching } = useActorInstance();
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [notFound, setNotFound] = reactExports.useState(false);
  const [ownerTribe, setOwnerTribe] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (isFetching || !actor) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const raw = await actor.getProfileByUsername(username);
        if (cancelled) return;
        if (!raw) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const p = raw;
        setProfile({
          username: p.username ?? "",
          displayName: p.displayName ?? "",
          bio: p.bio ?? "",
          location: p.location ?? "",
          born: p.born ?? "",
          superpowers: p.superpowers ?? "",
          profilePicture: p.profilePicture ?? "",
          coverImage: p.coverImage ?? "",
          evmAddress: p.evmAddress ?? null,
          hasOgBadge: p.hasOgBadge ?? false,
          socials: Array.isArray(p.socials) ? p.socials.map((s, idx) => ({
            ...s,
            id: `social-${idx}`
          })) : []
        });
        try {
          const tribeId = p.tribeId ?? null;
          if (tribeId && actor) {
            const tribeRaw = await actor.getTribe(tribeId);
            if (tribeRaw) {
              const t = tribeRaw;
              setOwnerTribe({
                id: tribeId,
                name: t.name ?? "",
                photoUrl: t.photoUrl ?? void 0
              });
            }
          }
        } catch {
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
  const { data: resolvedPrincipal } = useQuery({
    queryKey: ["principalByUsername", username, actor],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getPrincipalByUsername(username);
    },
    enabled: !!actor && !isFetching && !!username,
    staleTime: 12e4
  });
  if (loading || isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "public-profile.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl text-accent tracking-widest animate-pulse", children: "LOADING..." })
      }
    );
  }
  if (notFound || !profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        "data-ocid": "public-profile.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-accent tracking-widest", children: "PROFILE NOT FOUND" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-muted-foreground", children: [
            "@",
            username,
            " does not exist."
          ] })
        ]
      }
    );
  }
  const displayName = profile.displayName || profile.username;
  const hasCover = !!profile.coverImage;
  const hasAvatar = !!profile.profilePicture;
  const initials = displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const visibleSocials = profile.socials.filter((l) => l.name && l.url);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8",
      "data-ocid": "public-profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6", "data-ocid": "public-profile.identity_section", children: [
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
                      src: profile.coverImage,
                      alt: "Cover",
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-12 left-6 flex items-end gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-24 h-24 border border-border overflow-hidden bg-muted", children: hasAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: profile.profilePicture,
                  alt: displayName,
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl text-accent", children: initials }) }) }),
              ownerTribe && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/tribe/$tribeId",
                  params: { tribeId: ownerTribe.id },
                  className: "w-10 h-10 flex-shrink-0 border border-border overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center",
                  title: `View Tribe: ${ownerTribe.name}`,
                  "data-ocid": "public-profile.tribe_badge",
                  children: ownerTribe.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: ownerTribe.photoUrl,
                      alt: ownerTribe.name,
                      className: "w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm text-accent", children: ownerTribe.name.charAt(0).toUpperCase() })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end px-4 pt-2 pb-3 min-h-[2.5rem]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground tracking-widest", children: displayName }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-base text-accent tracking-widest", children: [
                "@",
                profile.username
              ] }),
              profile.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 font-mono text-sm text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-accent" }),
                profile.location
              ] }),
              profile.born && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 font-mono text-sm text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-accent" }),
                profile.born
              ] })
            ] })
          ] }) })
        ] }),
        (profile.bio || visibleSocials.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col sm:flex-row gap-4 mb-6",
            "data-ocid": "public-profile.bio_links_row",
            children: [
              profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "section",
                {
                  className: "border border-border p-4 bg-card flex-1 min-w-0",
                  "data-ocid": "public-profile.bio_section",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Bio" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: profile.bio })
                  ]
                }
              ),
              visibleSocials.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "section",
                {
                  className: "border border-border p-4 bg-card flex-1 min-w-0",
                  "data-ocid": "public-profile.socials_section",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Links" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: visibleSocials.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "a",
                      {
                        href: link.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center font-mono text-sm text-accent border-b border-accent pb-px hover:text-primary hover:border-primary transition-colors",
                        "data-ocid": `public-profile.socials.link.${i + 1}`,
                        children: link.name
                      },
                      `social-${i}-${link.name}`
                    )) })
                  ]
                }
              )
            ]
          }
        ),
        resolvedPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          HighlightsSection,
          {
            type: "player",
            principal: resolvedPrincipal,
            hasOgBadge: profile.hasOgBadge
          }
        ),
        (profile.superpowers || !!localStorage.getItem(
          `interests_${(resolvedPrincipal == null ? void 0 : resolvedPrincipal.toText()) ?? ""}`
        )) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col sm:flex-row gap-4 mb-6",
            "data-ocid": "public-profile.superpowers_interests_row",
            children: [
              profile.superpowers && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "section",
                {
                  className: "border border-border p-4 bg-card flex-1 min-w-0",
                  "data-ocid": "public-profile.superpowers_section",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Superpowers" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-sm text-foreground",
                        "data-ocid": "public-profile.superpowers",
                        children: profile.superpowers
                      }
                    )
                  ]
                }
              ),
              resolvedPrincipal && localStorage.getItem(`interests_${resolvedPrincipal.toText()}`) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "section",
                {
                  className: "border border-border p-4 bg-card flex-1 min-w-0",
                  "data-ocid": "public-profile.interests_section",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Interests" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap",
                        "data-ocid": "public-profile.interests",
                        children: localStorage.getItem(
                          `interests_${resolvedPrincipal.toText()}`
                        )
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  PublicProfilePage
};

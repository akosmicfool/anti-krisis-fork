# Landing Page Copy Conventions (OverviewPage)

How the user's landing copy doc maps to code. Files: `src/frontend/src/pages/OverviewPage.tsx`,
`src/frontend/src/pages/overview/BurnInfoSection.tsx` (+ `KeyInfoSection.tsx` = Protocol State, untouched by copy rewrites).

- Emphasis in the copy (`*italic*`) renders green AND italic: `text-accent font-normal italic`.
  Every green emphasis span on the landing page is italic — "green text" and "italic text"
  are the same thing here. Bold green (Arena, Wield it wisely) stays non-italic.
- Quoted lines render through the `SideQuote` component (OverviewPage.tsx): hero-style
  left-bar blockquote `border-l-4 border-accent pl-4 italic text-foreground/70`.
- Bracket links (`[X] →`) share one pattern: `font-accent uppercase tracking-widest text-accent`
  + arrow span with `group-hover:translate-x-1`.
- Hero CTA row: `[Read Me] →` routes to `/about?tab=tldr` (useAboutTab reads the `tab`
  search param); `ENTER AKORE` is the bordered button to `/akore`. Keep internal routing
  even when the copy doc shows absolute deployment URLs.
- Whitepaper link = `/assets/ak_whitepaper_v1.pdf` (in `src/frontend/public/assets/`),
  label `[READ WHITEPAPER]`.
- AK69 STOCKPILE tile renders the live backend value (`getTotalAk69Score`), not a hardcoded
  placeholder number — hardcoded stats go stale.
- Copy-doc punctuation is literal: no terminal periods where the copy omits them,
  "itself !" keeps the space before `!`, "One more thing…" uses the ellipsis character.

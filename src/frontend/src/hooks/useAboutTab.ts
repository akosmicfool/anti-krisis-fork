import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export type AboutTab = "tldr" | "genesis" | "manifesto" | "regnets" | "faqs";

const VALID_TABS: AboutTab[] = [
  "tldr",
  "genesis",
  "manifesto",
  "regnets",
  "faqs",
];

function isValidTab(t: string | undefined): t is AboutTab {
  return VALID_TABS.includes(t as AboutTab);
}

export function useAboutTab(): [AboutTab, (tab: AboutTab) => void] {
  const search = useSearch({ from: "/about" }) as Record<
    string,
    string | undefined
  >;
  const rawTab = search.tab;
  const [tab, setTabState] = useState<AboutTab>(
    isValidTab(rawTab) ? rawTab : "tldr",
  );

  useEffect(() => {
    if (isValidTab(rawTab) && rawTab !== tab) {
      setTabState(rawTab);
    }
  }, [rawTab, tab]);

  const setTab = (next: AboutTab) => {
    setTabState(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState({}, "", url.toString());
  };

  return [tab, setTab];
}

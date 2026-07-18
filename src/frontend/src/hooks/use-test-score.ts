import { useEffect, useState } from "react";

const STORAGE_KEY = "ak69_test_score";

function getBadgeLevel(score: number | null): number {
  if (score === null || score < 690) return 0;
  if (score >= 69000) return 3;
  if (score >= 6900) return 2;
  return 1;
}

const BADGE_NAMES: Record<number, string> = {
  0: "No badge",
  1: "Player",
  2: "Super Player",
  3: "Alpha Player",
};

export function useTestScore() {
  const [testScore, setTestScoreState] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return null;
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : null;
  });

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        setTestScoreState(null);
      } else {
        const parsed = Number(stored);
        setTestScoreState(Number.isFinite(parsed) ? parsed : null);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setTestScore = (score: number) => {
    localStorage.setItem(STORAGE_KEY, String(score));
    setTestScoreState(score);
  };

  const clearTestScore = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTestScoreState(null);
  };

  const testBadgeLevel = getBadgeLevel(testScore);
  const testBadgeName = BADGE_NAMES[testBadgeLevel];

  return {
    testScore,
    setTestScore,
    clearTestScore,
    testBadgeLevel,
    testBadgeName,
  };
}

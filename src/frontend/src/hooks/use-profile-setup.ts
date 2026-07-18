import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import { useAuth } from "./use-auth";

/**
 * Detects whether the authenticated user still needs to pick a username.
 * Calls `hasUsername()` on the backend and returns:
 *   - needsUsername = true  → user is authenticated but has no username yet
 *   - needsUsername = false → not authenticated OR username already set
 */
export function useProfileSetup(): {
  needsUsername: boolean;
  isLoading: boolean;
} {
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor(createActor);

  const { data, isLoading } = useQuery<boolean>({
    queryKey: ["hasUsername"],
    queryFn: async () => {
      if (!actor) return true; // assume has username while actor unavailable
      return (
        actor as unknown as Record<string, () => Promise<boolean>>
      ).hasUsername();
    },
    enabled: isAuthenticated && !!actor && !isFetching,
    staleTime: 0, // always re-check on mount so new users see the prompt
  });

  if (!isAuthenticated) return { needsUsername: false, isLoading: false };
  if (isFetching || isLoading) return { needsUsername: false, isLoading: true };

  // data === false means the backend confirmed: user has no username yet
  return { needsUsername: data === false, isLoading: false };
}

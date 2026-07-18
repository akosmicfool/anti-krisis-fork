import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Identity } from "@icp-sdk/core/agent";

export interface UseAuthReturn {
  identity: Identity | undefined;
  principal: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  const principal = identity ? identity.getPrincipal().toText() : null;

  return {
    identity,
    principal,
    isAuthenticated,
    isLoading: isInitializing || isLoggingIn,
    login,
    logout: clear,
  };
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  HelpCircle,
  Info,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  Swords,
  Trophy,
  User,
  X,
  Zap,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useVideo } from "../context/VideoContext";
import { useAuth } from "../hooks/use-auth";
import { useIsAdmin } from "../hooks/use-backend";
import { useProfileSetup } from "../hooks/use-profile-setup";
import { formatGrit, truncateAddress } from "../types";
import { UsernamePromptModal } from "./UsernamePromptModal";
import { WalletButton } from "./WalletButton";

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 group"
      data-ocid="nav.logo_link"
    >
      <img
        src="/assets/ak_dark_logo.png"
        alt="Anti Krisis"
        className="h-5 w-auto"
      />
      <span className="font-display font-semibold text-xl tracking-widest uppercase text-foreground">
        Anti Krisis
      </span>
    </Link>
  );
}

// ─── Mute Button ─────────────────────────────────────────────────────────────
function MuteButton() {
  const { isMuted, toggleMute } = useVideo();
  return (
    <button
      type="button"
      onClick={toggleMute}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all border border-[#00ff41]/40 hover:border-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.4)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff41] bg-transparent text-accent"
      aria-label={isMuted ? "Unmute video" : "Mute video"}
      data-ocid="header.mute_toggle_button"
    >
      {isMuted ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Mute"
          role="img"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Unmute"
          role="img"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────
interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  ocid: string;
}

function NavLink({ to, icon, label, ocid }: NavLinkProps) {
  const location = useLocation();
  const isActive =
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      data-ocid={ocid}
      className={[
        "flex items-center gap-1.5 text-base font-accent uppercase tracking-widest px-2 py-1 transition-smooth border-b-2",
        isActive
          ? "text-accent border-accent"
          : "text-white border-transparent hover:text-accent hover:border-border",
      ].join(" ")}
    >
      {icon}
      {label}
    </Link>
  );
}

// ─── GRIT Balance Pill ────────────────────────────────────────────────────────
// GritBalancePill moved to BurnPage header

// ─── Layout ──────────────────────────────────────────────────────────────────
interface LayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export function Layout({ children, isAdmin = false }: LayoutProps) {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  // Re-query isAdmin locally so the dropdown reflects fresh state (avoids stale prop timing)
  const { data: localIsAdmin } = useIsAdmin();
  const adminVisible = isAdmin || !!localIsAdmin;

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Username prompt: show for authenticated users who haven't set a username yet
  const { needsUsername, isLoading: profileSetupLoading } = useProfileSetup();
  const [modalDismissed, setModalDismissed] = useState(false);
  const showUsernamePrompt =
    isAuthenticated && !profileSetupLoading && needsUsername && !modalDismissed;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Logo />

          <Separator
            orientation="vertical"
            className="h-5 bg-border mx-1 hidden sm:block"
          />

          {/* Nav links — desktop only */}
          <nav
            className="hidden sm:flex items-center gap-1"
            aria-label="Main navigation"
          >
            <NavLink
              to="/akore"
              icon={<Swords className="h-3 w-3" />}
              label="AKORE"
              ocid="nav.akore_link"
            />
            <NavLink
              to="/about"
              icon={<Info className="h-3 w-3" />}
              label="ABOUT"
              ocid="nav.about_link"
            />

            <NavLink
              to="/score"
              icon={<Trophy className="h-3 w-3" />}
              label="SKORE"
              ocid="nav.score_link"
            />
            {adminVisible && isAuthenticated && (
              <NavLink
                to="/admin"
                icon={<ShieldCheck className="h-3 w-3" />}
                label="Admin"
                ocid="nav.admin_link"
              />
            )}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <MuteButton />
            <WalletButton />

            {/* ICP Identity */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 font-accent border-border bg-transparent hover:bg-muted/40 hover:border-[#00ff41]/50 transition-smooth hidden sm:flex items-center justify-center"
                    aria-label="Account"
                    data-ocid="nav.principal_dropdown_trigger"
                  >
                    <User className="h-4 w-4 text-[#00ff41]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border min-w-[160px]"
                  data-ocid="nav.principal_dropdown"
                >
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/profile" })}
                    className="gap-2 text-xs font-accent uppercase tracking-widest cursor-pointer text-white hover:text-foreground focus:text-foreground"
                    data-ocid="nav.profile_item"
                  >
                    <User className="h-3.5 w-3.5" />
                    Profile
                  </DropdownMenuItem>
                  {adminVisible && (
                    <>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/admin" })}
                        className="gap-2 text-xs font-accent uppercase tracking-widest cursor-pointer text-accent hover:text-accent focus:text-accent"
                        data-ocid="nav.admin_settings_item"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                        Admin Settings
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="gap-2 text-xs font-accent uppercase tracking-widest cursor-pointer text-destructive hover:text-destructive focus:text-destructive"
                    data-ocid="nav.logout_item"
                  >
                    <LogOut className="h-3.5 w-3.5 text-destructive" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={login}
                disabled={isLoading}
                className="gap-1.5 text-xs bg-primary hover:bg-primary/80 text-primary-foreground btn-glow transition-smooth hidden sm:flex"
                data-ocid="nav.login_button"
              >
                <LogIn className="h-3.5 w-3.5" />
                {isLoading ? "Loading…" : "Login"}
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              className="sm:hidden w-8 h-8 flex items-center justify-center border border-border/60 hover:border-accent/60 transition-colors text-foreground"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              data-ocid="nav.mobile_menu_toggle"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileMenuOpen && (
          <nav
            className="sm:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1"
            aria-label="Mobile navigation"
            data-ocid="nav.mobile_menu"
          >
            {(
              [
                {
                  to: "/akore",
                  icon: <Swords className="h-3.5 w-3.5" />,
                  label: "AKORE",
                  ocid: "nav.mobile_akore_link",
                  show: true,
                },
                {
                  to: "/about",
                  icon: <Info className="h-3.5 w-3.5" />,
                  label: "ABOUT",
                  ocid: "nav.mobile_about_link",
                  show: true,
                },

                {
                  to: "/score",
                  icon: <Trophy className="h-3.5 w-3.5" />,
                  label: "SKORE",
                  ocid: "nav.mobile_score_link",
                  show: true,
                },
                {
                  to: "/admin",
                  icon: <ShieldCheck className="h-3.5 w-3.5" />,
                  label: "Admin",
                  ocid: "nav.mobile_admin_link",
                  show: adminVisible && isAuthenticated,
                },
              ] as const
            )
              .filter((item) => item.show)
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  data-ocid={item.ocid}
                  className="flex items-center gap-2 px-2 py-2 text-sm font-accent uppercase tracking-widest text-white hover:text-foreground hover:bg-muted/20 transition-colors"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            <Separator className="my-1 bg-border" />
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ to: "/profile" });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-2 text-sm font-accent uppercase tracking-widest text-white hover:text-foreground hover:bg-muted/20 transition-colors w-full text-left"
                  data-ocid="nav.mobile_profile_link"
                >
                  <User className="h-3.5 w-3.5" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-2 text-sm font-accent uppercase tracking-widest text-destructive hover:text-destructive/80 hover:bg-muted/20 transition-colors w-full text-left"
                  data-ocid="nav.mobile_logout_button"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-2 py-2 text-sm font-accent uppercase tracking-widest text-accent hover:text-accent/80 hover:bg-muted/20 transition-colors w-full text-left"
                data-ocid="nav.mobile_login_button"
              >
                <LogIn className="h-3.5 w-3.5" />
                {isLoading ? "Loading…" : "Login"}
              </button>
            )}
          </nav>
        )}
      </header>

      {/* Username prompt modal — blocks interaction until username is set */}
      {showUsernamePrompt && (
        <UsernamePromptModal onComplete={() => setModalDismissed(true)} />
      )}

      {/* Main content */}
      <main className="flex-1 bg-background" data-ocid="layout.main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card py-4" data-ocid="layout.footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/assets/ak_dark_logo.png"
              alt="Anti Krisis"
              className="h-4 w-auto"
            />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Anti Krisis
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

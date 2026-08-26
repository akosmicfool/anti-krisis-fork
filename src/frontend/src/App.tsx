import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { VideoProvider } from "./context/VideoContext";
import { useAuth } from "./hooks/use-auth";
import { useIsAdmin } from "./hooks/use-backend";
// Lazy pages
const AkorePage = lazy(() =>
  import("./pages/AkorePage").then((m) => ({ default: m.AkorePage })),
);
const BurnHistoryPage = lazy(() =>
  import("./pages/BurnHistoryPage").then((m) => ({
    default: m.BurnHistoryPage,
  })),
);
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })),
);

const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const PublicProfilePage = lazy(() =>
  import("./pages/PublicProfilePage").then((m) => ({
    default: m.PublicProfilePage,
  })),
);
const PublicTribePage = lazy(() =>
  import("./pages/PublicTribePage").then((m) => ({
    default: m.PublicTribePage,
  })),
);
const ScorePage = lazy(() =>
  import("./pages/ScorePage").then((m) => ({ default: m.ScorePage })),
);
const BlocksHistoryPage = lazy(() =>
  import("./pages/BlocksHistoryPage").then((m) => ({
    default: m.BlocksHistoryPage,
  })),
);
const OverviewPage = lazy(() =>
  import("./pages/OverviewPage").then((m) => ({ default: m.OverviewPage })),
);
const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);

// ─── Root wrapper with Layout ─────────────────────────────────────────────────
function RootComponent() {
  const { principal } = useAuth();
  const { data: isAdmin = false } = useIsAdmin();

  // NOTE: The legacy auto-bootstrap effect (which called bootstrapAdmin()
  // whenever the admin list was empty) was removed along with the backend
  // endpoint. Admin is seeded at canister start from the hardcoded
  // akk-deployer principal in main.mo; additional admins are added via the
  // Admin panel (addAdmin). Do not reintroduce client-side admin claiming.

  return (
    <Layout isAdmin={isAdmin && !!principal}>
      <Suspense
        fallback={
          <div className="p-8 space-y-4 max-w-7xl mx-auto">
            <Skeleton className="h-8 w-64 bg-muted" />
            <Skeleton className="h-48 w-full bg-muted" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </Layout>
  );
}

// ─── Routes ──────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootComponent });

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <OverviewPage />,
});

const akoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/akore",
  component: () => <AkorePage />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => <BurnHistoryPage />,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => <AdminPage />,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => <ProfilePage />,
});
const publicProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$username",
  component: PublicProfilePage,
});

const publicTribeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tribe/$tribeId",
  component: PublicTribePage,
});

const scoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/score",
  component: () => <ScorePage />,
});

const blocksHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mining/blocks",
  component: () => <BlocksHistoryPage />,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => <AboutPage />,
});

const routeTree = rootRoute.addChildren([
  overviewRoute,
  akoreRoute,
  aboutRoute,
  dashboardRoute,
  adminRoute,
  profileRoute,
  publicProfileRoute,
  publicTribeRoute,
  scoreRoute,
  blocksHistoryRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <VideoProvider>
      <RouterProvider router={router} />
    </VideoProvider>
  );
}

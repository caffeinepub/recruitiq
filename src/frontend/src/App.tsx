import { Skeleton } from "@/components/ui/skeleton";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy-loaded pages
const HomePage = lazy(() =>
  import("@/pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const ExamPage = lazy(() =>
  import("@/pages/ExamPage").then((m) => ({ default: m.ExamPage })),
);
const ResultsPage = lazy(() =>
  import("@/pages/ResultsPage").then((m) => ({ default: m.ResultsPage })),
);
const ReviewPage = lazy(() =>
  import("@/pages/ReviewPage").then((m) => ({ default: m.ReviewPage })),
);
const HistoryPage = lazy(() =>
  import("@/pages/HistoryPage").then((m) => ({ default: m.HistoryPage })),
);
const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);

function PageLoader() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-10 w-1/2 rounded-lg" />
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

// Root route with Outlet (no Layout here — pages import Layout themselves)
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});

const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exam/$examId",
  component: () => <ExamPage />,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results/$attemptId",
  component: () => <ResultsPage />,
});

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/review/$attemptId",
  component: () => <ReviewPage />,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history/$examId",
  component: () => <HistoryPage />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => <DashboardPage />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  examRoute,
  resultsRoute,
  reviewRoute,
  historyRoute,
  dashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

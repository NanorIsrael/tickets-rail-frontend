import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { AiChatbot } from "@/components/ai-chatbot";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel max-w-md p-8 text-center">
        <div className="hud-label mb-2">Error / 404</div>
        <h1 className="text-5xl font-mono font-bold text-foreground">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The requested telemetry channel does not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Return to Overview
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel max-w-md p-8 text-center">
        <div className="hud-label mb-2" style={{ color: "var(--color-status-crit)" }}>
          System / Fault
        </div>
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sentinel PDX — AI Predictive Maintenance" },
      {
        name: "description",
        content:
          "AI-powered predictive maintenance platform for industrial critical equipment — health monitoring, anomaly detection, failure prediction, and explainable recommendations.",
      },
      { name: "author", content: "Sentinel PDX" },
      { property: "og:title", content: "Sentinel PDX — AI Predictive Maintenance" },
      {
        property: "og:description",
        content:
          "Monitor critical equipment, detect anomalies, and predict failures before they cause downtime.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function TopBar() {
  const now = new Date();
  const stamp = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";
  return (
    <header className="flex h-12 items-center justify-between border-b border-border/60 bg-panel/80 px-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="hud-label hidden sm:block">Sentinel PDX / Live</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span
            className="status-dot pulse-crit"
            style={{ color: "var(--color-status-ok)", backgroundColor: "var(--color-status-ok)" }}
          />
          TELEMETRY ONLINE
        </div>
        <div className="font-mono text-xs text-muted-foreground">{stamp}</div>
      </div>
    </header>
  );
}

function AuthedApp() {
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* <AppSidebar /> */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* <TopBar /> */}
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
      {/* <AiChatbot /> */}
    </SidebarProvider>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthedApp />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

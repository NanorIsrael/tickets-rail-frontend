import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Cog,
  Activity,
  TrendingDown,
  Bell,
  Wrench,
  FileBarChart,
  Radio,
  ScrollText,
  Database,
  Users,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth, roleLabel, type Role } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type NavItem = { title: string; url: string; icon: typeof LayoutDashboard; roles?: Role[] };

const nav: NavItem[] = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Equipment", url: "/equipment", icon: Cog },
  { title: "Datasets", url: "/datasets", icon: Database, roles: ["admin", "engineer"] },
  { title: "Anomalies", url: "/anomalies", icon: Activity },
  { title: "Predictions", url: "/predictions", icon: TrendingDown },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Maintenance", url: "/maintenance", icon: Wrench },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "User Activity", url: "/activity", icon: ScrollText },
  { title: "Users", url: "/users", icon: Users, roles: ["admin"] },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const isActive = (u: string) => (u === "/" ? pathname === "/" : pathname.startsWith(u));
  const visible = nav.filter((n) => !n.roles || (user && n.roles.includes(user.role)));
  const initials = user
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded bg-primary/15 ring-1 ring-primary/40">
            <Radio className="h-4 w-4 text-primary" />
            <span
              className="status-dot pulse-crit absolute -right-0.5 -top-0.5"
              style={{ color: "var(--color-status-ok)", backgroundColor: "var(--color-status-ok)" }}
            />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-mono text-[0.7rem] tracking-widest text-muted-foreground">
              SENTINEL / PDX
            </span>
            <span className="text-sm font-semibold">Predictive Ops</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="hud-label">Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visible.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex flex-col gap-2 px-2 py-2">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <div className="h-7 w-7 rounded-full bg-primary/20 grid place-items-center text-xs font-mono text-primary">
              {initials}
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-xs font-medium truncate">{user?.name ?? "Guest"}</span>
              <span className="text-[0.65rem] font-mono uppercase text-muted-foreground">
                {user ? roleLabel[user.role] : "—"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

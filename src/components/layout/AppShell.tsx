import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Wallet,
  ChefHat,
  Bus,
  Vote,
  Megaphone,
  MessageSquareWarning,
  UserCheck,
  QrCode,
  FileText,
  LogOut,
  Building2,
  Sparkles,
} from "lucide-react";
import { useRole } from "@/lib/mock";
import { HOSTEL } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/students", label: "Students", icon: Users, maintainerOnly: true },
  { to: "/app/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/app/expenses", label: "Expenses", icon: Wallet },
  { to: "/app/duties", label: "Cooking Duties", icon: ChefHat },
  { to: "/app/bus-pass", label: "Bus Pass", icon: Bus },
  { to: "/app/elections", label: "Elections", icon: Vote },
  { to: "/app/announcements", label: "Announcements", icon: Megaphone },
  { to: "/app/complaints", label: "Complaints", icon: MessageSquareWarning },
  { to: "/app/visitors", label: "Visitors", icon: UserCheck },
  { to: "/app/payments", label: "QR Payments", icon: QrCode, maintainerOnly: true },
  { to: "/app/reports", label: "Reports", icon: FileText },
  { to: "/app/ai-insights", label: "AI Insights", icon: Sparkles },
] as const;

export function AppShell() {
  const { role, setRole } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-bold">H</div>
            <div>
              <div className="font-semibold tracking-tight">HostelHub</div>
              <div className="text-xs opacity-70">{HOSTEL.name}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.filter((n) => !("maintainerOnly" in n && n.maintainerOnly) || role === "maintainer").map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="text-xs opacity-70 px-2 mb-2">Viewing as</div>
          <div className="flex rounded-lg overflow-hidden border border-sidebar-border">
            <button
              onClick={() => setRole("student")}
              className={cn("flex-1 py-1.5 text-xs", role === "student" ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-transparent")}
            >
              Student
            </button>
            <button
              onClick={() => setRole("maintainer")}
              className={cn("flex-1 py-1.5 text-xs", role === "maintainer" ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-transparent")}
            >
              Maintainer
            </button>
          </div>
          <Link to="/" className="mt-3 flex items-center gap-2 px-2 py-2 text-xs opacity-80 hover:opacity-100">
            <LogOut className="size-3.5" /> Sign out
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4" />
              <span>{HOSTEL.name}</span>
              <span className="opacity-50">/</span>
              <span className="capitalize text-foreground font-medium">{role}</span>
            </div>
            <div className="md:hidden">
              <Button size="sm" variant="outline" onClick={() => setRole(role === "student" ? "maintainer" : "student")}>
                Switch role
              </Button>
            </div>
          </div>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth, useCurrentUser, useData, useSettings } from "@/store";
import {
  LayoutDashboard, Users, CalendarCheck2, ChefHat, Bus, Wallet, Vote, Megaphone,
  MessageSquareWarning, UserPlus, QrCode, FileBarChart, Sparkles, Bell, User, Settings,
  LogOut, Moon, Sun, Search, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const studentNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck2 },
  { to: "/cooking", label: "Cooking Duties", icon: ChefHat },
  { to: "/buspass", label: "Bus Pass", icon: Bus },
  { to: "/elections", label: "Elections", icon: Vote },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/complaints", label: "Complaints", icon: MessageSquareWarning },
  { to: "/visitors", label: "Visitors", icon: UserPlus },
  { to: "/qr", label: "QR Payments", icon: QrCode },
];

const maintainerNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck2 },
  { to: "/cooking", label: "Cooking Duties", icon: ChefHat },
  { to: "/buspass", label: "Bus Pass", icon: Bus },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/elections", label: "Elections", icon: Vote },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/complaints", label: "Complaints", icon: MessageSquareWarning },
  { to: "/visitors", label: "Visitors", icon: UserPlus },
  { to: "/qr", label: "QR Payments", icon: QrCode },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
];

export function AppShell({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const nav = useNavigate();
  const logout = useAuth((s) => s.logout);
  const setTheme = useSettings((s) => s.setTheme);
  const theme = useSettings((s) => s.theme);
  const notifs = useData((s) => s.notifications);
  const markAllRead = useData((s) => s.markAllRead);
  const markRead = useData((s) => s.markNotifRead);
  const delNotif = useData((s) => s.deleteNotif);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navItems = user?.role === "maintainer" ? maintainerNav : studentNav;
  const unread = notifs.filter((n) => !n.read).length;

  const doLogout = async () => {
    logout();
    nav({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className={cn(
          "fixed lg:static z-40 inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-14 px-4 flex items-center gap-2 border-b border-sidebar-border">
          <div className="size-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">H</div>
          <div>
            <div className="font-semibold text-sidebar-foreground">HostelHub</div>
            <div className="text-xs text-muted-foreground">{user?.hostelName || "Hostel"}</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent",
                  active && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
                )}
              >
                <Icon className="size-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-sidebar-border">
          <Badge variant="secondary" className="w-full justify-center capitalize">{user?.role}</Badge>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-background flex items-center px-4 gap-2 sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)}>
            <Menu className="size-5" />
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students, expenses, complaints..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 size-4 rounded-full bg-destructive text-destructive-foreground text-[10px] grid place-items-center">
                      {unread}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Button variant="link" size="sm" onClick={markAllRead} className="h-auto p-0">
                    Mark all read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifs.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground text-center">No notifications</div>
                )}
                {notifs.slice(0, 10).map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    onSelect={(e) => e.preventDefault()}
                    className="flex-col items-start gap-1"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className={cn("font-medium", !n.read && "text-primary")}>{n.title}</span>
                      <Badge variant="outline" className="ml-auto text-[10px]">{n.category}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{n.body}</span>
                    <div className="flex gap-2 mt-1">
                      {!n.read && (
                        <button onClick={() => markRead(n.id)} className="text-xs text-primary">Mark read</button>
                      )}
                      <button onClick={() => delNotif(n.id)} className="text-xs text-destructive">Delete</button>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/notifications">View all</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-8">
                    <AvatarImage src={user?.photo} />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile"><User className="mr-2 size-4" />My Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/settings"><Settings className="mr-2 size-4" />Settings</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/notifications"><Bell className="mr-2 size-4" />Notifications</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={doLogout} className="text-destructive">
                  <LogOut className="mr-2 size-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MaintainerOnly({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  if (user?.role !== "maintainer") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold">Access denied</h2>
        <p className="text-sm text-muted-foreground mt-2">
          This area is only available to the elected hostel maintainer for the current month.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

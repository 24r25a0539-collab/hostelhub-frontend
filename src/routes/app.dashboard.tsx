import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ANNOUNCEMENTS,
  DUTIES,
  EXPENSES,
  HOSTEL,
  STUDENTS,
  currency,
  useRole,
} from "@/lib/mock";
import {
  Users,
  Wallet,
  ChefHat,
  Bus,
  TrendingUp,
  CalendarCheck,
  Megaphone,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

function Stat({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint?: string }) {
  return (
    <Card className="p-5 border-border/60">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </Card>
  );
}

function Dashboard() {
  const { role } = useRole();
  const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const me = STUDENTS[0];
  const upcoming = DUTIES.find((d) => d.student.id === me.id && d.status === "Assigned");
  const byCategory = Object.entries(
    EXPENSES.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));
  const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#a855f7"];

  return (
    <>
      <PageHeader
        title={role === "maintainer" ? "Maintainer overview" : `Hi, ${me.name.split(" ")[0]}`}
        subtitle={role === "maintainer" ? "Pulse of the hostel today." : "Here's your hostel at a glance."}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {role === "maintainer" ? (
          <>
            <Stat icon={Users} label="Students" value={String(STUDENTS.length)} hint={`${STUDENTS.filter(s => s.backlogs === 0).length} clear`} />
            <Stat icon={CalendarCheck} label="Present today" value={String(STUDENTS.length - 1)} hint="1 absent" />
            <Stat icon={Wallet} label="Fund remaining" value={currency(HOSTEL.fundRemaining)} hint={`of ${currency(HOSTEL.monthlyBudget)}`} />
            <Stat icon={ChefHat} label="Today's duty" value={DUTIES[14].student.name.split(" ")[0]} hint={`Day ${DUTIES[14].day}`} />
          </>
        ) : (
          <>
            <Stat icon={CalendarCheck} label="Attendance" value={`${me.attendance}%`} hint="This month" />
            <Stat icon={Bus} label="Bus pass balance" value={currency(me.balance)} hint="Of ₹630 monthly" />
            <Stat icon={Wallet} label="Hostel fund" value={currency(HOSTEL.fundRemaining)} hint={`of ${currency(HOSTEL.monthlyBudget)}`} />
            <Stat icon={ChefHat} label="Upcoming duty" value={upcoming ? `Day ${upcoming.day}` : "—"} hint={upcoming?.date ?? "Nothing scheduled"} />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2 border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold">Expense trend</div>
              <div className="text-xs text-muted-foreground">June 2026</div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="size-3" /> {currency(totalExpenses)}
            </Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={EXPENSES.map((e) => ({ date: e.date.slice(-2), amount: e.amount }))}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" fontSize={12} stroke="currentColor" opacity={0.6} />
                <YAxis fontSize={12} stroke="currentColor" opacity={0.6} />
                <Tooltip />
                <Bar dataKey="amount" fill="oklch(0.42 0.16 268)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Budget utilization</span>
              <span className="font-medium">{Math.round((totalExpenses / HOSTEL.monthlyBudget) * 100)}%</span>
            </div>
            <Progress value={(totalExpenses / HOSTEL.monthlyBudget) * 100} />
          </div>
        </Card>

        <Card className="p-5 border-border/60">
          <div className="font-semibold mb-1">By category</div>
          <div className="text-xs text-muted-foreground mb-3">Spend distribution</div>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCategory} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {byCategory.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {c.name}
                </span>
                <span className="font-medium">{currency(c.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <Card className="p-5 border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="size-4 text-primary" />
            <span className="font-semibold">Latest announcements</span>
          </div>
          <div className="space-y-3">
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-medium text-sm">{a.title}</div>
                  <div className="text-[10px] text-muted-foreground whitespace-nowrap">{a.date}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{a.message}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <ChefHat className="size-4 text-primary" />
            <span className="font-semibold">Upcoming duties</span>
          </div>
          <div className="space-y-2">
            {DUTIES.slice(14, 20).map((d) => (
              <div key={d.day} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center text-xs font-semibold">
                    {d.day}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{d.student.name}</div>
                    <div className="text-xs text-muted-foreground">{d.date}</div>
                  </div>
                </div>
                <Badge variant={d.status === "Completed" ? "secondary" : d.status === "Missed" ? "destructive" : "outline"}>
                  {d.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
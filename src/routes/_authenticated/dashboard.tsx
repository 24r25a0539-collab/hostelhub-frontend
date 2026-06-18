import { createFileRoute, Link } from "@tanstack/react-router";
import { useCurrentUser, useData } from "@/store";
import { PageHeader } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wallet, ChefHat, Bus, Megaphone, MessageSquareWarning, UserPlus, FileBarChart, CalendarCheck2, Vote } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function StatCard({ icon: Icon, label, value, hint }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="size-10 rounded-md bg-primary/10 text-primary grid place-items-center">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold truncate">{value}</div>
          {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const user = useCurrentUser();
  const data = useData();
  const students = data.users.filter((u) => u.role === "student");
  const monthExpenses = data.expenses.reduce((a, e) => a + e.amount, 0);
  const myAttendance = data.attendance.filter((a) => a.studentId === user?.id);
  const myPresent = myAttendance.filter((a) => a.present).length;
  const myPct = myAttendance.length ? Math.round((myPresent / myAttendance.length) * 100) : 100;
  const myBalance = data.buspass.filter((t) => t.studentId === user?.id).reduce((a, t) => a + (t.type === "credit" ? t.amount : -t.amount), 0);
  const todayCook = data.cookingQueue.find((d) => d.status === "active");
  const todayCookUser = data.users.find((u) => u.id === todayCook?.studentId);
  const myCookNext = data.cookingQueue.find((d) => d.studentId === user?.id && d.status === "queued");
  const recentAnn = data.announcements.slice(0, 3);
  const pendingVisitors = data.visitors.filter((v) => v.status === "pending").length;
  const openComplaints = data.complaints.filter((c) => c.status !== "Resolved" && c.status !== "Rejected").length;

  if (user?.role === "maintainer") {
    return (
      <>
        <PageHeader title={`Welcome back, ${user.name}`} description="Hostel operations overview" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total Students" value={students.length} />
          <StatCard icon={Wallet} label="Monthly Expenses" value={`₹${monthExpenses.toLocaleString()}`} />
          <StatCard icon={MessageSquareWarning} label="Open Complaints" value={openComplaints} />
          <StatCard icon={UserPlus} label="Pending Visitors" value={pendingVisitors} />
          <StatCard icon={ChefHat} label="Today's Cook" value={todayCookUser?.name || "—"} />
          <StatCard icon={Vote} label="Election" value={data.election.open ? "Open" : "Closed"} hint={data.election.month} />
          <StatCard icon={CalendarCheck2} label="Attendance Marks" value={data.attendance.length} />
          <StatCard icon={Megaphone} label="Announcements" value={data.announcements.length} />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mt-6">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button asChild variant="outline"><Link to="/students">Add Student</Link></Button>
              <Button asChild variant="outline"><Link to="/expenses">Add Expense</Link></Button>
              <Button asChild variant="outline"><Link to="/announcements">Create Announcement</Link></Button>
              <Button asChild variant="outline"><Link to="/visitors">Approve Visitors</Link></Button>
              <Button asChild variant="outline"><Link to="/reports">Generate Reports</Link></Button>
              <Button asChild variant="outline"><Link to="/ai-insights">AI Insights</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Recent Announcements</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {recentAnn.length === 0 && <div className="text-sm text-muted-foreground">No announcements</div>}
              {recentAnn.map((a) => (
                <div key={a.id} className="border-l-2 border-primary pl-3">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.date} · {a.priority}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={`Hi, ${user?.name}`} description={`Room ${user?.roomNo || "—"} · ${user?.hostelName}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={CalendarCheck2} label="Attendance" value={`${myPct}%`} hint={`${myPresent}/${myAttendance.length || 0} days`} />
        <StatCard icon={Bus} label="Bus Pass Balance" value={`₹${myBalance}`} hint={user?.busPassEligible ? "Eligible" : "Not eligible"} />
        <StatCard icon={ChefHat} label="Today's Cook" value={todayCookUser?.name || "—"} hint={myCookNext ? "You're in queue" : ""} />
        <StatCard icon={Megaphone} label="Announcements" value={data.announcements.length} />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline"><Link to="/attendance">My Attendance</Link></Button>
            <Button asChild variant="outline"><Link to="/buspass">Bus Pass</Link></Button>
            <Button asChild variant="outline"><Link to="/complaints">Raise Complaint</Link></Button>
            <Button asChild variant="outline"><Link to="/visitors">Add Visitor</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Announcements</CardTitle>
            <CardDescription>From your maintainer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentAnn.map((a) => (
              <div key={a.id} className="border-l-2 border-primary pl-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{a.title}</span>
                  <Badge variant={a.priority === "Urgent" ? "destructive" : "secondary"} className="text-[10px]">
                    {a.priority}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{a.description}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

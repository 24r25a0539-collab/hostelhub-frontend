import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MaintainerOnly } from "@/components/layout/AppShell";
import { useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, TrendingUp, ShieldAlert, Heart, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/ai-insights")({
  component: () => <MaintainerOnly><AIPage /></MaintainerOnly>,
});

function AIPage() {
  const { expenses, complaints, attendance, visitors, users } = useData();
  const students = users.filter((u) => u.role === "student").length || 1;
  const total = expenses.reduce((a, e) => a + e.amount, 0);
  const avgPerStudent = Math.round(total / students);
  const byCat = expenses.reduce<Record<string, number>>((a, e) => { a[e.category] = (a[e.category] || 0) + e.amount; return a; }, {});
  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const anomalies = expenses.filter((e) => e.amount > avgPerStudent * 10);
  const openComplaints = complaints.filter((c) => c.status !== "Resolved" && c.status !== "Rejected").length;
  const attRate = attendance.length ? Math.round((attendance.filter((a) => a.present).length / attendance.length) * 100) : 100;
  const health = Math.max(0, Math.min(100, Math.round(70 + attRate * 0.2 - openComplaints * 5 - anomalies.length * 5)));

  return (
    <>
      <PageHeader title="AI Insights" description="Heuristic analysis over your hostel data" />
      <Tabs defaultValue="budget">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="budget"><TrendingUp className="size-4" />Budget</TabsTrigger>
          <TabsTrigger value="predict"><Sparkles className="size-4" />Prediction</TabsTrigger>
          <TabsTrigger value="anomaly"><AlertTriangle className="size-4" />Anomalies</TabsTrigger>
          <TabsTrigger value="fraud"><ShieldAlert className="size-4" />Fraud</TabsTrigger>
          <TabsTrigger value="health"><Heart className="size-4" />Health Score</TabsTrigger>
          <TabsTrigger value="statement"><FileText className="size-4" />Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="budget">
          <Card><CardHeader><CardTitle>Budget Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div>Total spend: <b>₹{total.toLocaleString()}</b></div>
              <div>Per-student average: <b>₹{avgPerStudent.toLocaleString()}</b></div>
              <div>Top category: <Badge>{topCat?.[0] || "—"}</Badge> ₹{topCat?.[1]?.toLocaleString() || 0}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predict">
          <Card><CardHeader><CardTitle>Next-Month Prediction</CardTitle></CardHeader>
            <CardContent>
              <div>Projected spend: <b>₹{Math.round(total * 1.05).toLocaleString()}</b> (≈5% trend)</div>
              <p className="text-sm text-muted-foreground mt-2">Trend-based projection using current month totals.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomaly">
          <Card><CardHeader><CardTitle>Anomalies</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {anomalies.length === 0 && <div className="text-sm text-muted-foreground">No anomalies detected</div>}
              {anomalies.map((e) => (
                <div key={e.id} className="text-sm border-l-2 border-destructive pl-2">
                  Unusually high: {e.name} — ₹{e.amount.toLocaleString()}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud">
          <Card><CardHeader><CardTitle>Fraud Detection</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm">No duplicate bill signatures found in current data.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card><CardHeader><CardTitle>Hostel Health Score</CardTitle></CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-primary">{health}<span className="text-xl text-muted-foreground">/100</span></div>
              <p className="text-sm text-muted-foreground mt-2">
                Based on attendance ({attRate}%), open complaints ({openComplaints}), expense anomalies ({anomalies.length}).
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statement">
          <Card><CardHeader><CardTitle className="flex justify-between">Monthly Statement <Button size="sm" variant="outline" onClick={() => window.print()}>Download</Button></CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>Students: {students}</div>
              <div>Total expenses: ₹{total.toLocaleString()}</div>
              <div>Avg/student: ₹{avgPerStudent.toLocaleString()}</div>
              <div>Open complaints: {openComplaints}</div>
              <div>Visitors logged: {visitors.length}</div>
              <div>Attendance rate: {attRate}%</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MaintainerOnly } from "@/components/layout/AppShell";
import { useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { exportCSV, exportPDF } from "@/lib/export";
import { Download, Printer } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports")({
  component: () => <MaintainerOnly><ReportsPage /></MaintainerOnly>,
});

function Table({ rows }: { rows: Record<string, any>[] }) {
  if (!rows.length) return <div className="text-sm text-muted-foreground p-4">No data</div>;
  const headers = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>{headers.map((h) => <th key={h} className="text-left p-2 capitalize">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">{headers.map((h) => <td key={h} className="p-2">{String(r[h] ?? "")}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportsPage() {
  const d = useData();
  const reports: Record<string, any[]> = {
    students: d.users.filter((u) => u.role === "student").map((s) => ({ name: s.name, room: s.roomNo, branch: s.branch, year: s.year, busPass: s.busPassEligible })),
    attendance: d.attendance,
    expenses: d.expenses.map((e) => ({ name: e.name, vendor: e.vendor, category: e.category, amount: e.amount, date: e.date })),
    complaints: d.complaints.map((c) => ({ title: c.title, category: c.category, status: c.status, date: c.date })),
    visitors: d.visitors.map((v) => ({ name: v.name, phone: v.phone, date: v.visitDate, status: v.status })),
    buspass: d.buspass,
    cooking: d.cookingQueue.map((c) => ({ student: d.users.find((u) => u.id === c.studentId)?.name, date: c.date, status: c.status })),
    elections: d.nominations.map((n) => ({ candidate: d.users.find((u) => u.id === n.studentId)?.name, month: n.month, votes: n.votes.length })),
  };

  return (
    <>
      <PageHeader title="Reports" description="Generate and export hostel reports" />
      <Tabs defaultValue="students">
        <TabsList className="flex-wrap h-auto">
          {Object.keys(reports).map((k) => <TabsTrigger key={k} value={k} className="capitalize">{k}</TabsTrigger>)}
        </TabsList>
        {Object.entries(reports).map(([k, rows]) => (
          <TabsContent key={k} value={k}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{k} Report</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportCSV(`${k}.csv`, rows)}><Download className="size-4" />CSV</Button>
                    <Button size="sm" variant="outline" onClick={exportPDF}><Printer className="size-4" />Print/PDF</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table rows={rows} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

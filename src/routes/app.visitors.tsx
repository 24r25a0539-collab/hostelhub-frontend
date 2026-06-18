import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VISITORS } from "@/lib/mock";

export const Route = createFileRoute("/app/visitors")({ component: VisitorsPage });

function VisitorsPage() {
  return (
    <>
      <PageHeader title="Visitors" subtitle="Approve guests and keep an entry log." />
      <Card className="border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Visitor</th>
              <th className="text-left px-5 py-3 font-medium">Visiting</th>
              <th className="text-left px-5 py-3 font-medium">Entry</th>
              <th className="text-left px-5 py-3 font-medium">Exit</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {VISITORS.map((v) => (
              <tr key={v.id} className="hover:bg-muted/30">
                <td className="px-5 py-3">
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.relation} · {v.mobile}</div>
                </td>
                <td className="px-5 py-3">{v.student}</td>
                <td className="px-5 py-3 text-muted-foreground">{v.entry}</td>
                <td className="px-5 py-3 text-muted-foreground">{v.exit}</td>
                <td className="px-5 py-3">
                  <Badge variant={v.status === "Approved" ? "secondary" : "outline"}>{v.status}</Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  {v.status === "Pending" ? (
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline">Reject</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
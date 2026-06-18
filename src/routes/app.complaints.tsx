import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMPLAINTS } from "@/lib/mock";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/app/complaints")({ component: ComplaintsPage });

const statusColor: Record<string, string> = {
  Open: "bg-destructive/15 text-destructive border-transparent",
  "In Progress": "bg-accent/30 text-accent-foreground border-transparent",
  Resolved: "bg-[oklch(0.62_0.16_155/0.15)] text-[oklch(0.32_0.12_155)] border-transparent",
  Rejected: "bg-muted text-muted-foreground border-transparent",
};

function ComplaintsPage() {
  return (
    <>
      <PageHeader
        title="Complaints"
        subtitle="Raise issues. Track them through to resolution."
        action={<Button><Plus className="size-4 mr-2" /> New complaint</Button>}
      />
      <div className="grid sm:grid-cols-2 gap-4">
        {COMPLAINTS.map((c) => (
          <Card key={c.id} className="p-5 border-border/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.category} · by {c.by} · {c.date}</div>
              </div>
              <Badge className={statusColor[c.status]}>{c.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
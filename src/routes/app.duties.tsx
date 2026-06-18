import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DUTIES } from "@/lib/mock";
import { Repeat, ChefHat } from "lucide-react";

export const Route = createFileRoute("/app/duties")({ component: DutiesPage });

const statusStyle: Record<string, string> = {
  Completed: "bg-[oklch(0.62_0.16_155/0.15)] text-[oklch(0.32_0.12_155)] border-transparent",
  Assigned: "bg-primary/10 text-primary border-transparent",
  Missed: "bg-destructive/15 text-destructive border-transparent",
  Swapped: "bg-accent/30 text-accent-foreground border-transparent",
};

function DutiesPage() {
  return (
    <>
      <PageHeader
        title="Cooking duties"
        subtitle="Auto-rotated for the month. Swap with a teammate anytime."
        action={<Button variant="outline"><Repeat className="size-4 mr-2" /> Request swap</Button>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {DUTIES.map((d) => (
          <Card key={d.day} className="p-4 border-border/60">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Day {d.day}</div>
                <div className="font-semibold mt-0.5">{d.date.slice(5)}</div>
              </div>
              <Badge className={statusStyle[d.status]}>{d.status}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
              <div className="size-8 rounded-lg bg-muted grid place-items-center">
                <ChefHat className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium">{d.student.name}</div>
                <div className="text-xs text-muted-foreground">Room {d.student.room}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
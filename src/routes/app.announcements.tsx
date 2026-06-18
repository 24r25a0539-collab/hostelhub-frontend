import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ANNOUNCEMENTS, useRole } from "@/lib/mock";
import { Megaphone, Plus } from "lucide-react";

export const Route = createFileRoute("/app/announcements")({ component: AnnouncementsPage });

function AnnouncementsPage() {
  const { role } = useRole();
  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Updates from the maintainer."
        action={role === "maintainer" && <Button><Plus className="size-4 mr-2" /> New announcement</Button>}
      />
      <div className="space-y-3">
        {ANNOUNCEMENTS.map((a) => (
          <Card key={a.id} className="p-5 border-border/60">
            <div className="flex gap-4">
              <div className="size-10 rounded-xl bg-accent/30 text-accent-foreground grid place-items-center shrink-0">
                <Megaphone className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{a.date}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.message}</p>
                <div className="text-xs text-muted-foreground mt-2">— {a.by}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STUDENTS, currency } from "@/lib/mock";
import { Search, UserPlus } from "lucide-react";

export const Route = createFileRoute("/app/students")({ component: StudentsPage });

function StudentsPage() {
  return (
    <>
      <PageHeader
        title="Students"
        subtitle={`${STUDENTS.length} members in the hostel`}
        action={
          <Button>
            <UserPlus className="size-4 mr-2" /> Add student
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or room" className="pl-9" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STUDENTS.map((s) => {
          const clear = s.backlogs === 0;
          return (
            <Card key={s.id} className="p-5 border-border/60 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: clear ? "oklch(0.62 0.16 155)" : "oklch(0.6 0.22 25)" }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Room {s.room} · {s.id}</div>
                </div>
                <Badge variant={clear ? "secondary" : "destructive"} className={clear ? "bg-[oklch(0.62_0.16_155/0.15)] text-[oklch(0.32_0.12_155)]" : ""}>
                  {clear ? "Clear" : `${s.backlogs} backlog${s.backlogs > 1 ? "s" : ""}`}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground">Attendance</div>
                  <div className="font-semibold">{s.attendance}%</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground">Bus pass</div>
                  <div className="font-semibold text-xs pt-1">{s.busPassEligible ? "Eligible" : "—"}</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground">Balance</div>
                  <div className="font-semibold text-sm pt-0.5">{currency(s.balance)}</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mt-3">{s.mobile} · {s.email}</div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
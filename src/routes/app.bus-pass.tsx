import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BUS_PASS_TX, STUDENTS, currency, useRole } from "@/lib/mock";

export const Route = createFileRoute("/app/bus-pass")({ component: BusPassPage });

function BusPassPage() {
  const { role } = useRole();
  const me = STUDENTS[0];
  const monthly = 630;

  if (role === "student") {
    const tx = BUS_PASS_TX.filter((t) => t.student === me.name);
    const spent = monthly - me.balance;
    return (
      <>
        <PageHeader title="Bus pass balance" subtitle="Your monthly allocation and deductions." />
        <Card className="p-6 border-border/60 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Current balance</div>
            <div className="text-4xl font-semibold mt-2">{currency(me.balance)}</div>
            <div className="text-sm text-muted-foreground mt-1">of {currency(monthly)} this month</div>
            <div className="mt-4 max-w-md">
              <Progress value={(spent / monthly) * 100} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>Spent {currency(spent)}</span>
                <span>Remaining {currency(me.balance)}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border/60 overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30 font-semibold text-sm">Transaction history</div>
          <div className="divide-y divide-border">
            {tx.map((t) => (
              <div key={t.id} className="px-5 py-3 flex justify-between">
                <div>
                  <div className="text-sm font-medium">{t.description}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
                <div className="font-semibold text-destructive">−{currency(t.amount)}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Bus pass" subtitle="Manage monthly allocations and deductions." />
      <Card className="border-border/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 font-semibold text-sm">Eligible students</div>
        <div className="divide-y divide-border">
          {STUDENTS.filter((s) => s.busPassEligible).map((s) => (
            <div key={s.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground">Room {s.room}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{currency(s.balance)} / {currency(monthly)}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
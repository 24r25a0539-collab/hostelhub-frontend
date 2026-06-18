import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EXPENSES, HOSTEL, currency, useRole } from "@/lib/mock";
import { Plus, Camera } from "lucide-react";

export const Route = createFileRoute("/app/expenses")({ component: ExpensesPage });

function ExpensesPage() {
  const { role } = useRole();
  const total = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const remaining = HOSTEL.monthlyBudget - total;

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="Hostel-wide spend, fully transparent."
        action={
          role === "maintainer" && (
            <div className="flex gap-2">
              <Button variant="outline"><Camera className="size-4 mr-2" /> Scan bill</Button>
              <Button><Plus className="size-4 mr-2" /> Add expense</Button>
            </div>
          )
        }
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 border-border/60">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Monthly fund</div>
          <div className="text-2xl font-semibold mt-2">{currency(HOSTEL.monthlyBudget)}</div>
        </Card>
        <Card className="p-5 border-border/60">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Spent</div>
          <div className="text-2xl font-semibold mt-2">{currency(total)}</div>
        </Card>
        <Card className="p-5 border-border/60">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Remaining</div>
          <div className="text-2xl font-semibold mt-2 text-[oklch(0.42_0.16_268)]">{currency(remaining)}</div>
        </Card>
      </div>

      <Card className="p-5 mt-4 border-border/60">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Budget utilization</span>
          <span className="text-muted-foreground">{Math.round((total / HOSTEL.monthlyBudget) * 100)}%</span>
        </div>
        <Progress value={(total / HOSTEL.monthlyBudget) * 100} />
      </Card>

      <Card className="mt-4 border-border/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 font-semibold text-sm">Recent expenses</div>
        <div className="divide-y divide-border">
          {EXPENSES.map((e) => (
            <div key={e.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/30">
              <div>
                <div className="font-medium text-sm">{e.description}</div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">{e.category}</Badge>
                  <span>{e.date}</span>
                </div>
              </div>
              <div className="font-semibold">{currency(e.amount)}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
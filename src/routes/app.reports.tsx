import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, CalendarCheck, Wallet, ChefHat, Bus, Vote } from "lucide-react";

export const Route = createFileRoute("/app/reports")({ component: ReportsPage });

const REPORTS = [
  { icon: CalendarCheck, name: "Attendance report", desc: "Monthly per-student attendance with rankings." },
  { icon: Wallet, name: "Expense report", desc: "Category breakdown and remaining fund." },
  { icon: ChefHat, name: "Duty report", desc: "Completed, missed and swap history." },
  { icon: Bus, name: "Bus pass report", desc: "Allocations, deductions and balances." },
  { icon: Vote, name: "Election report", desc: "Vote counts and winner summary." },
];

function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" subtitle="One-tap monthly PDFs, generated automatically." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((r) => (
          <Card key={r.name} className="p-5 border-border/60 flex flex-col">
            <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3">
              <r.icon className="size-5" />
            </div>
            <div className="font-semibold">{r.name}</div>
            <p className="text-sm text-muted-foreground mt-1 flex-1">{r.desc}</p>
            <Button variant="outline" className="mt-4 w-full">
              <FileDown className="size-4 mr-2" /> Download PDF
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
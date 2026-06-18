import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STUDENTS, currency } from "@/lib/mock";
import { QrCode } from "lucide-react";

export const Route = createFileRoute("/app/payments")({ component: PaymentsPage });

function PaymentsPage() {
  const amount = 2500;
  const paid = STUDENTS.slice(0, 5);
  const unpaid = STUDENTS.slice(5);

  return (
    <>
      <PageHeader title="QR payments" subtitle="Collect monthly contributions via UPI." />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 border-border/60 text-center">
          <div className="mx-auto size-44 rounded-xl bg-foreground text-background grid place-items-center">
            <QrCode className="size-32 stroke-[1.2]" />
          </div>
          <div className="mt-4 font-semibold">{currency(amount)} per student</div>
          <div className="text-xs text-muted-foreground mt-1">UPI · hostelhub@upi</div>
        </Card>

        <Card className="p-5 border-border/60 lg:col-span-2">
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <div className="text-xs text-muted-foreground">Collected</div>
              <div className="text-xl font-semibold mt-1">{currency(paid.length * amount)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="text-xl font-semibold mt-1 text-destructive">{currency(unpaid.length * amount)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Students paid</div>
              <div className="text-xl font-semibold mt-1">{paid.length}/{STUDENTS.length}</div>
            </div>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {STUDENTS.map((s, i) => {
              const isPaid = i < 5;
              return (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/40">
                  <div className="text-sm">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">Room {s.room}</div>
                  </div>
                  <Badge variant={isPaid ? "secondary" : "outline"} className={isPaid ? "bg-[oklch(0.62_0.16_155/0.15)] text-[oklch(0.32_0.12_155)]" : "text-destructive border-destructive/40"}>
                    {isPaid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
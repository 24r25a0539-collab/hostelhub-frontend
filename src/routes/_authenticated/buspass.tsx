import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { uid, todayISO } from "@/lib/id";
import { toast } from "sonner";
import { exportCSV } from "@/lib/export";

export const Route = createFileRoute("/_authenticated/buspass")({ component: BusPassPage });

function BusPassPage() {
  const user = useCurrentUser();
  const { users, buspass, addBusTxn } = useData();
  const isMaintainer = user?.role === "maintainer";
  const students = users.filter((u) => u.role === "student" && u.busPassEligible);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"credit" | "debit">("credit");
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");

  const balanceOf = (id: string) =>
    buspass.filter((t) => t.studentId === id).reduce((a, t) => a + (t.type === "credit" ? t.amount : -t.amount), 0);
  const totalBudget = students.reduce((a, s) => a + balanceOf(s.id), 0);

  const visibleStudents = isMaintainer ? students : students.filter((s) => s.id === user?.id);

  const submit = () => {
    if (!studentId || !amount || !purpose) return toast.error("Fill all fields");
    addBusTxn({
      id: uid(), studentId, type, amount: parseFloat(amount), purpose, description, date: todayISO(),
    });
    toast.success("Transaction added");
    setOpen(false); setAmount(""); setPurpose(""); setDescription("");
  };

  return (
    <>
      <PageHeader
        title="Bus Pass"
        description="Student travel wallets"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCSV("buspass.csv", buspass)}>Export</Button>
            {isMaintainer && <Button onClick={() => setOpen(true)}>Add Transaction</Button>}
          </div>
        }
      />
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total Budget</div><div className="text-2xl font-bold">₹{totalBudget}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Eligible Students</div><div className="text-2xl font-bold">{students.length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Transactions</div><div className="text-2xl font-bold">{buspass.length}</div></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Wallets</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {visibleStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">Room {s.roomNo}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">₹{balanceOf(s.id)}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
            {(isMaintainer ? buspass : buspass.filter((t) => t.studentId === user?.id)).map((t) => {
              const u = users.find((x) => x.id === t.studentId);
              return (
                <div key={t.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium text-sm">{u?.name} · {t.purpose}</div>
                    <div className="text-xs text-muted-foreground">{t.date} · {t.description}</div>
                  </div>
                  <div className={t.type === "credit" ? "text-green-600 font-semibold" : "text-destructive font-semibold"}>
                    {t.type === "credit" ? "+" : "-"}₹{t.amount}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button variant={type === "credit" ? "default" : "outline"} onClick={() => setType("credit")}>Add Amount</Button>
              <Button variant={type === "debit" ? "default" : "outline"} onClick={() => setType("debit")}>Deduct</Button>
            </div>
            <div className="space-y-1">
              <Label>Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Amount</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div className="space-y-1"><Label>Purpose</Label><Input value={purpose} onChange={(e) => setPurpose(e.target.value)} /></div>
            <div className="space-y-1"><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

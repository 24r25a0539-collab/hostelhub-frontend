import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MaintainerOnly } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { uid, todayISO } from "@/lib/id";
import { toast } from "sonner";
import { exportCSV } from "@/lib/export";
import { Trash2, Pencil, ScanLine } from "lucide-react";
import type { Expense } from "@/types";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: () => <MaintainerOnly><ExpensesPage /></MaintainerOnly>,
});

const CATS = ["Electricity", "Water", "Internet", "Gas", "Groceries", "Maintenance", "Miscellaneous"];

function ExpensesPage() {
  const user = useCurrentUser();
  const { expenses, addExpense, updateExpense, deleteExpense } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [cat, setCat] = useState("");

  const blank = (): Expense => ({
    id: uid(), name: "", vendor: "", amount: 0, category: "Miscellaneous",
    date: todayISO(), createdBy: user!.id,
  });

  const startNew = () => { setEditing(blank()); setOpen(true); };
  const startEdit = (e: Expense) => { setEditing({ ...e }); setOpen(true); };
  const total = expenses.reduce((a, e) => a + e.amount, 0);
  const monthTotal = expenses
    .filter((e) => e.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((a, e) => a + e.amount, 0);

  const save = () => {
    if (!editing || !editing.name || !editing.amount) return toast.error("Fill name and amount");
    const dup = expenses.find(
      (e) => e.id !== editing.id && e.name === editing.name && e.amount === editing.amount && e.date === editing.date
    );
    if (dup) return toast.error("Duplicate bill detected");
    if (expenses.some((e) => e.id === editing.id)) updateExpense(editing.id, editing);
    else addExpense(editing);
    setOpen(false); toast.success("Saved");
  };

  const scanBill = (file: File) => {
    if (!editing) return;
    const reader = new FileReader();
    reader.onload = () => {
      // OCR stub: derive bill name from filename, prompt for manual confirmation
      const stem = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setEditing({
        ...editing,
        billImage: reader.result as string,
        name: editing.name || stem,
        vendor: editing.vendor || "Auto-detected vendor",
        date: editing.date || todayISO(),
      });
      toast.success("OCR preview: review fields and save");
    };
    reader.readAsDataURL(file);
  };

  const filtered = cat ? expenses.filter((e) => e.category === cat) : expenses;

  return (
    <>
      <PageHeader
        title="Expenses"
        description="Hostel bills and spending"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCSV("expenses.csv", filtered)}>Export</Button>
            <Button onClick={startNew}>Add Expense</Button>
          </div>
        }
      />
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total Expenses</div><div className="text-2xl font-bold">₹{total.toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">This Month</div><div className="text-2xl font-bold">₹{monthTotal.toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Bills</div><div className="text-2xl font-bold">{expenses.length}</div></CardContent></Card>
      </div>

      <div className="flex gap-2 mb-3">
        <Select value={cat || "all"} onValueChange={(v) => setCat(v === "all" ? "" : v)}>
          <SelectTrigger className="max-w-[200px]"><SelectValue placeholder="Filter category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr><th className="text-left p-2">Bill</th><th className="text-left p-2">Vendor</th><th className="text-left p-2">Category</th><th className="text-right p-2">Amount</th><th className="text-left p-2">Date</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-2">{e.name}</td>
                  <td className="p-2">{e.vendor}</td>
                  <td className="p-2"><Badge variant="outline">{e.category}</Badge></td>
                  <td className="p-2 text-right font-medium">₹{e.amount.toLocaleString()}</td>
                  <td className="p-2">{e.date}</td>
                  <td className="p-2 flex gap-1 justify-end">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(e)}><Pencil className="size-3" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Delete?")) deleteExpense(e.id); }}><Trash2 className="size-3" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing && expenses.some((e) => e.id === editing.id) ? "Edit" : "Add"} Expense</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="flex items-center gap-2"><ScanLine className="size-4" /> Scan Bill (OCR preview)</Label>
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && scanBill(e.target.files[0])} />
                {editing.billImage && <img src={editing.billImage} alt="" className="mt-2 max-h-32 rounded border" />}
              </div>
              <div className="space-y-1"><Label>Bill Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="space-y-1"><Label>Vendor</Label><Input value={editing.vendor} onChange={(e) => setEditing({ ...editing, vendor: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label>Amount</Label><Input type="number" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: parseFloat(e.target.value) || 0 })} /></div>
                <div className="space-y-1"><Label>Date</Label><Input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></div>
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Address</Label><Input value={editing.address || ""} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></div>
              <div className="space-y-1"><Label>Description</Label><Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

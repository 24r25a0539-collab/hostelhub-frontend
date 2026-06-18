import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MaintainerOnly } from "@/components/layout/AppShell";
import { useData } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { uid, todayISO } from "@/lib/id";
import { exportCSV } from "@/lib/export";
import { toast } from "sonner";
import { Trash2, Pencil, Plus, Download } from "lucide-react";
import type { User } from "@/types";

export const Route = createFileRoute("/_authenticated/students")({
  component: () => <MaintainerOnly><StudentsPage /></MaintainerOnly>,
});

const blank = (): User => ({
  id: uid(), name: "", email: "", phone: "", password: "password", role: "student",
  roomNo: "", branch: "", year: "1", busPassEligible: true, joiningDate: todayISO(),
});

function StudentsPage() {
  const { users, addUser, updateUser, deleteUser } = useData();
  const students = users.filter((u) => u.role === "student");
  const [q, setQ] = useState("");
  const [branch, setBranch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const filtered = students.filter(
    (s) =>
      (s.name + s.email + s.roomNo).toLowerCase().includes(q.toLowerCase()) &&
      (!branch || s.branch === branch)
  );

  const startNew = () => { setEditing(blank()); setOpen(true); };
  const startEdit = (s: User) => { setEditing({ ...s }); setOpen(true); };
  const save = () => {
    if (!editing) return;
    if (!editing.name || !editing.email) return toast.error("Name and email required");
    const exists = users.find((u) => u.email === editing.email && u.id !== editing.id);
    if (exists) return toast.error("Email already exists");
    if (users.some((u) => u.id === editing.id)) updateUser(editing.id, editing);
    else addUser(editing);
    toast.success("Saved");
    setOpen(false);
  };
  const del = (id: string) => { if (confirm("Delete this student?")) { deleteUser(id); toast.success("Deleted"); } };

  return (
    <>
      <PageHeader
        title="Students"
        description={`${students.length} students`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCSV("students.csv", filtered)}><Download className="size-4" />Export</Button>
            <Button onClick={startNew}><Plus className="size-4" />Add Student</Button>
          </div>
        }
      />
      <div className="flex gap-2 mb-4 flex-wrap">
        <Input placeholder="Search by name, email, room..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Input placeholder="Filter by branch" value={branch} onChange={(e) => setBranch(e.target.value)} className="max-w-[180px]" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={s.photo} />
                  <AvatarFallback>{s.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground">Room {s.roomNo} · {s.branch} · Year {s.year}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.email}</div>
                </div>
                <Badge variant={s.busPassEligible ? "default" : "secondary"} className="text-[10px]">
                  {s.busPassEligible ? "Bus ✓" : "Bus ✕"}
                </Badge>
              </div>
              <div className="flex gap-1 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => startEdit(s)}><Pencil className="size-3" /> Edit</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => del(s.id)}><Trash2 className="size-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing && users.some((u) => u.id === editing.id) ? "Edit" : "Add"} Student</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid md:grid-cols-2 gap-3">
              {[
                ["name", "Full Name"], ["email", "Email"], ["phone", "Phone"], ["dob", "DOB"], ["gender", "Gender"],
                ["parentName", "Parent Name"], ["parentPhone", "Parent Contact"], ["branch", "Branch"], ["year", "Year"],
                ["cgpa", "CGPA"], ["backlogs", "Backlogs"], ["roomNo", "Room No"], ["bedNo", "Bed No"],
                ["joiningDate", "Joining Date"], ["password", "Password"],
              ].map(([k, label]) => (
                <div key={k} className="space-y-1">
                  <Label>{label}</Label>
                  <Input value={(editing as any)[k] || ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} />
                </div>
              ))}
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={!!editing.busPassEligible} onCheckedChange={(v) => setEditing({ ...editing, busPassEligible: v })} />
                <Label>Bus Pass Eligible</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

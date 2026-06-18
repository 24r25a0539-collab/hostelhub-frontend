import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { uid, todayISO } from "@/lib/id";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/visitors")({ component: VisitorsPage });

function VisitorsPage() {
  const user = useCurrentUser();
  const { visitors, users, addVisitor, decideVisitor, checkVisitor } = useData();
  const isMaintainer = user?.role === "maintainer";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", relation: "", visitDate: todayISO(), purpose: "" });

  const list = isMaintainer ? visitors : visitors.filter((v) => v.studentId === user?.id);

  const submit = () => {
    if (!form.name || !form.phone) return toast.error("Name and phone required");
    addVisitor({ id: uid(), ...form, studentId: user!.id, status: "pending" });
    setOpen(false); toast.success("Visitor request submitted");
    setForm({ name: "", phone: "", relation: "", visitDate: todayISO(), purpose: "" });
  };

  return (
    <>
      <PageHeader title="Visitors" action={<Button onClick={() => setOpen(true)}>Add Visitor</Button>} />
      <div className="grid lg:grid-cols-2 gap-3">
        {list.map((v) => {
          const s = users.find((u) => u.id === v.studentId);
          return (
            <Card key={v.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.relation} · {v.phone}</div>
                    <div className="text-xs">For: {s?.name}</div>
                  </div>
                  <Badge variant={v.status === "approved" ? "default" : v.status === "rejected" ? "destructive" : "secondary"}>{v.status}</Badge>
                </div>
                <div className="text-sm mt-2">Visit: {v.visitDate} · {v.purpose}</div>
                {v.checkIn && <div className="text-xs text-muted-foreground">In: {new Date(v.checkIn).toLocaleString()}</div>}
                {v.checkOut && <div className="text-xs text-muted-foreground">Out: {new Date(v.checkOut).toLocaleString()}</div>}
                {isMaintainer && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {v.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => decideVisitor(v.id, true)}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => decideVisitor(v.id, false)}>Reject</Button>
                      </>
                    )}
                    {v.status === "approved" && !v.checkIn && <Button size="sm" onClick={() => checkVisitor(v.id, "in")}>Check-In</Button>}
                    {v.status === "approved" && v.checkIn && !v.checkOut && <Button size="sm" variant="outline" onClick={() => checkVisitor(v.id, "out")}>Check-Out</Button>}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Visitor</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-1"><Label>Relation</Label><Input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} /></div>
            <div className="space-y-1"><Label>Visit Date</Label><Input type="date" value={form.visitDate} onChange={(e) => setForm({ ...form, visitDate: e.target.value })} /></div>
            <div className="space-y-1"><Label>Purpose</Label><Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Submit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

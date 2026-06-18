import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { uid, todayISO } from "@/lib/id";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/cooking")({ component: CookingPage });

function CookingPage() {
  const user = useCurrentUser();
  const { users, cookingQueue, rotateCooking, swaps, addSwap, decideSwap, pushNotification } = useData();
  const isMaintainer = user?.role === "maintainer";
  const students = users.filter((u) => u.role === "student");
  const active = cookingQueue.find((d) => d.status === "active");
  const queued = cookingQueue.filter((d) => d.status === "queued");
  const done = cookingQueue.filter((d) => d.status === "done").slice(-5);
  const activeUser = users.find((u) => u.id === active?.studentId);
  const nextUser = users.find((u) => u.id === queued[0]?.studentId);

  const [open, setOpen] = useState(false);
  const [toId, setToId] = useState("");
  const [reason, setReason] = useState("");

  const stop = () => {
    if (!isMaintainer && active?.studentId !== user?.id) return toast.error("Only active cook can stop");
    rotateCooking();
    pushNotification({ title: "Cooking duty rotated", body: "Next student is now active", category: "Cooking" });
    toast.success("Rotated to next student");
  };

  const submitSwap = () => {
    if (!toId || !reason) return toast.error("Pick a student and reason");
    addSwap({ id: uid(), fromId: user!.id, toId, reason, status: "pending", createdAt: todayISO() });
    pushNotification({ title: "Swap request submitted", body: "Waiting for maintainer approval", category: "Cooking" });
    toast.success("Swap requested");
    setOpen(false); setToId(""); setReason("");
  };

  return (
    <>
      <PageHeader title="Cooking Duties" description="Automatic rotation system" />
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Today's Cook</CardTitle></CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{activeUser?.name || "—"}</div>
            <div className="text-xs text-muted-foreground">Room {activeUser?.roomNo}</div>
            {(isMaintainer || active?.studentId === user?.id) && (
              <Button className="mt-3" onClick={stop}>Stop Duty</Button>
            )}
            {!isMaintainer && user?.role === "student" && (
              <Button className="mt-3 ml-2" variant="outline" onClick={() => setOpen(true)}>Request Swap</Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Next Cook</CardTitle></CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{nextUser?.name || "—"}</div>
            <div className="text-xs text-muted-foreground">Room {nextUser?.roomNo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Queue</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            {queued.slice(1, 6).map((d) => {
              const u = users.find((x) => x.id === d.studentId);
              return <div key={d.id}>{u?.name}</div>;
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Swap Requests</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {swaps.length === 0 && <div className="text-sm text-muted-foreground">No requests</div>}
            {swaps.map((s) => {
              const f = users.find((u) => u.id === s.fromId);
              const t = users.find((u) => u.id === s.toId);
              return (
                <div key={s.id} className="border rounded-md p-3">
                  <div className="text-sm"><b>{f?.name}</b> → <b>{t?.name}</b></div>
                  <div className="text-xs text-muted-foreground">{s.reason}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={s.status === "pending" ? "secondary" : s.status === "approved" ? "default" : "destructive"}>{s.status}</Badge>
                    {isMaintainer && s.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => decideSwap(s.id, true)}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => decideSwap(s.id, false)}>Reject</Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Duty History</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            {done.map((d) => {
              const u = users.find((x) => x.id === d.studentId);
              return <div key={d.id} className="flex justify-between"><span>{u?.name}</span><span className="text-muted-foreground">{d.date}</span></div>;
            })}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request Cooking Swap</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Swap with</Label>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.filter((s) => s.id !== user?.id).map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Reason</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submitSwap}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

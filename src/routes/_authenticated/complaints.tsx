import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
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
import type { Complaint } from "@/types";

export const Route = createFileRoute("/_authenticated/complaints")({ component: ComplaintsPage });

const STATUSES = ["Open", "In Progress", "Resolved", "Rejected"] as const;
const CATS = ["Room", "Food", "Cleanliness", "Electricity", "Water", "Internet", "Other"];

function ComplaintsPage() {
  const user = useCurrentUser();
  const { complaints, addComplaint, updateComplaint, addComplaintComment, users } = useData();
  const isMaintainer = user?.role === "maintainer";
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Complaint | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const blank = (): Complaint => ({
    id: uid(), title: "", description: "", category: "Room", status: "Open",
    by: user!.id, date: todayISO(), comments: [],
  });

  const list = filter ? complaints.filter((c) => c.status === filter) : complaints;
  const selectedComplaint = complaints.find((c) => c.id === selected);

  const save = () => {
    if (!editing?.title || !editing.description) return toast.error("Fill title and description");
    if (complaints.some((c) => c.id === editing.id)) updateComplaint(editing.id, editing);
    else addComplaint(editing);
    setOpen(false); toast.success("Saved");
  };

  return (
    <>
      <PageHeader
        title="Complaints"
        action={<Button onClick={() => { setEditing(blank()); setOpen(true); }}>Raise Complaint</Button>}
      />
      <Select value={filter || "all"} onValueChange={(v) => setFilter(v === "all" ? "" : v)}>
        <SelectTrigger className="max-w-[200px] mb-3"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="grid lg:grid-cols-2 gap-3">
        {list.map((c) => {
          const by = users.find((u) => u.id === c.by);
          return (
            <Card key={c.id} className="cursor-pointer" onClick={() => setSelected(c.id)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-xs text-muted-foreground">By {by?.name} · {c.date} · {c.category}</div>
                  </div>
                  <Badge variant={c.status === "Resolved" ? "default" : c.status === "Rejected" ? "destructive" : "secondary"}>{c.status}</Badge>
                </div>
                <p className="text-sm mt-2 line-clamp-2">{c.description}</p>
                {isMaintainer && (
                  <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <Select value={c.status} onValueChange={(v: any) => updateComplaint(c.id, { status: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Raise Complaint</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1"><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Description</Label><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedComplaint.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Badge>{selectedComplaint.status}</Badge>
                <p className="text-sm">{selectedComplaint.description}</p>
                <div className="border-t pt-2">
                  <div className="text-xs font-semibold mb-2">Timeline</div>
                  {selectedComplaint.comments.length === 0 && <div className="text-xs text-muted-foreground">No comments</div>}
                  {selectedComplaint.comments.map((cm) => {
                    const u = users.find((x) => x.id === cm.by);
                    return (
                      <div key={cm.id} className="text-xs border-l-2 pl-2 mb-2">
                        <b>{u?.name}</b> · {new Date(cm.at).toLocaleString()}
                        <div>{cm.text}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
                  <Button onClick={() => { if (!comment) return; addComplaintComment(selectedComplaint.id, user!.id, comment); setComment(""); }}>Send</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

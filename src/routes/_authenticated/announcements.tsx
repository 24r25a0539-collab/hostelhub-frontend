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
import type { Announcement } from "@/types";
import { Trash2, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/announcements")({ component: AnnPage });

function AnnPage() {
  const user = useCurrentUser();
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, pushNotification } = useData();
  const isMaintainer = user?.role === "maintainer";
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);

  const blank = (): Announcement => ({
    id: uid(), title: "", description: "", date: todayISO(), priority: "Normal", createdBy: user!.id,
  });

  const save = () => {
    if (!editing?.title || !editing.description) return toast.error("Title and description required");
    if (announcements.some((a) => a.id === editing.id)) updateAnnouncement(editing.id, editing);
    else {
      addAnnouncement(editing);
      pushNotification({ title: `New ${editing.priority}: ${editing.title}`, body: editing.description, category: "Announcement" });
    }
    setOpen(false); toast.success("Saved");
  };

  return (
    <>
      <PageHeader
        title="Announcements"
        action={isMaintainer && <Button onClick={() => { setEditing(blank()); setOpen(true); }}>Create Announcement</Button>}
      />
      <div className="grid md:grid-cols-2 gap-3">
        {announcements.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.date}</div>
                </div>
                <Badge variant={a.priority === "Urgent" ? "destructive" : a.priority === "Important" ? "default" : "secondary"}>{a.priority}</Badge>
              </div>
              <p className="text-sm mt-2">{a.description}</p>
              {isMaintainer && (
                <div className="flex gap-1 mt-3">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="size-3" /></Button>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => { if (confirm("Delete?")) deleteAnnouncement(a.id); }}><Trash2 className="size-3" /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing && announcements.some((a) => a.id === editing.id) ? "Edit" : "Create"} Announcement</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1"><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="space-y-1"><Label>Description</Label><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label>Date</Label><Input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></div>
                <div className="space-y-1">
                  <Label>Priority</Label>
                  <Select value={editing.priority} onValueChange={(v: any) => setEditing({ ...editing, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Important">Important</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useData } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/notifications")({ component: NotifPage });

function NotifPage() {
  const { notifications, markNotifRead, deleteNotif, markAllRead } = useData();
  const [q, setQ] = useState("");
  const filtered = notifications.filter((n) =>
    (n.title + n.body + n.category).toLowerCase().includes(q.toLowerCase())
  );
  return (
    <>
      <PageHeader title="Notifications" description="All your hostel activity in one place" action={<Button onClick={markAllRead}>Mark all read</Button>} />
      <Input placeholder="Search notifications" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-md" />
      <div className="space-y-2">
        {filtered.length === 0 && <Card><CardContent className="p-6 text-center text-muted-foreground">No notifications</CardContent></Card>}
        {filtered.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`size-2 rounded-full mt-2 ${n.read ? "bg-muted" : "bg-primary"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-medium">{n.title}</div>
                  <Badge variant="outline" className="text-[10px]">{n.category}</Badge>
                  <div className="text-xs text-muted-foreground ml-auto">{new Date(n.at).toLocaleString()}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{n.body}</div>
              </div>
              <div className="flex flex-col gap-1">
                {!n.read && <Button size="sm" variant="ghost" onClick={() => markNotifRead(n.id)}>Read</Button>}
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteNotif(n.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

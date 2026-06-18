import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { uid, monthISO } from "@/lib/id";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/elections")({ component: ElectionsPage });

function ElectionsPage() {
  const user = useCurrentUser();
  const { users, election, nominations, addNomination, vote, closeElection, openElection } = useData();
  const monthNoms = nominations.filter((n) => n.month === election.month);
  const [open, setOpen] = useState(false);
  const [manifesto, setManifesto] = useState("");
  const [goals, setGoals] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const alreadyVoted = monthNoms.some((n) => n.votes.includes(user?.id || ""));
  const alreadyNominated = monthNoms.some((n) => n.studentId === user?.id);

  const submit = () => {
    if (!manifesto || !goals) return toast.error("Fill manifesto and goals");
    if (alreadyNominated) return toast.error("You already submitted a nomination");
    addNomination({
      id: uid(), studentId: user!.id, month: election.month, photo, manifesto, goals, votes: [],
    });
    toast.success("Nomination submitted");
    setOpen(false);
  };

  const doVote = (nid: string) => {
    if (!election.open) return toast.error("Election closed");
    const ok = vote(nid, user!.id);
    if (!ok) toast.error("You already voted");
    else toast.success("Vote recorded");
  };

  const close = () => {
    if (!confirm("Close election and elect new maintainer?")) return;
    const winner = closeElection();
    toast.success(winner ? `${winner} elected as next maintainer` : "Election closed");
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setPhoto(r.result as string); r.readAsDataURL(f);
  };

  return (
    <>
      <PageHeader
        title="Elections"
        description={`Maintainer election for ${election.month}`}
        action={
          <div className="flex gap-2">
            {user?.role === "student" && election.open && !alreadyNominated && (
              <Button onClick={() => setOpen(true)}>Apply Nomination</Button>
            )}
            {user?.role === "maintainer" && election.open && <Button variant="destructive" onClick={close}>Close Election</Button>}
            {user?.role === "maintainer" && !election.open && <Button onClick={() => { openElection(); toast.success("New election opened"); }}>Open New Election</Button>}
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Candidates</div><div className="text-2xl font-bold">{monthNoms.length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total Votes</div><div className="text-2xl font-bold">{monthNoms.reduce((a, n) => a + n.votes.length, 0)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Status</div><div className="text-2xl font-bold">{election.open ? "Open" : "Closed"}</div></CardContent></Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {monthNoms.length === 0 && <Card><CardContent className="p-6 text-center text-muted-foreground">No candidates yet</CardContent></Card>}
        {monthNoms.map((n) => {
          const u = users.find((x) => x.id === n.studentId);
          const winner = election.winnerId === n.studentId;
          return (
            <Card key={n.id} className={winner ? "border-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="size-12"><AvatarImage src={n.photo} /><AvatarFallback>{u?.name[0]}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{u?.name}</div>
                    <div className="text-xs text-muted-foreground">Room {u?.roomNo}</div>
                    {winner && <Badge className="mt-1">Winner</Badge>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{n.votes.length}</div>
                    <div className="text-[10px] text-muted-foreground">votes</div>
                  </div>
                </div>
                <div className="text-sm mt-3"><b>Manifesto:</b> {n.manifesto}</div>
                <div className="text-sm mt-1"><b>Goals:</b> {n.goals}</div>
                {user?.role === "student" && election.open && (
                  <Button className="w-full mt-3" disabled={alreadyVoted} onClick={() => doVote(n.id)}>
                    {alreadyVoted ? "Voted" : "Vote"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Submit Nomination</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label>Photo</Label><Input type="file" accept="image/*" onChange={onPhoto} /></div>
            <div className="space-y-1"><Label>Manifesto</Label><Textarea value={manifesto} onChange={(e) => setManifesto(e.target.value)} /></div>
            <div className="space-y-1"><Label>Goals</Label><Textarea value={goals} onChange={(e) => setGoals(e.target.value)} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Submit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

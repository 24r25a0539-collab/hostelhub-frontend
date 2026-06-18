import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ELECTION } from "@/lib/mock";
import { Vote, Trophy } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/elections")({ component: ElectionsPage });

function ElectionsPage() {
  const [voted, setVoted] = useState<string | null>(null);
  const totalVotes = ELECTION.candidates.reduce((s, c) => s + c.votes, 0) + (voted ? 1 : 0);

  return (
    <>
      <PageHeader
        title="Maintainer election"
        subtitle={`Voting ends on ${ELECTION.endsOn}. One anonymous vote per student.`}
        action={<Badge variant="secondary" className="gap-1.5"><Vote className="size-3" /> {totalVotes} votes cast</Badge>}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        {ELECTION.candidates.map((c) => {
          const votes = c.votes + (voted === c.id ? 1 : 0);
          const pct = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;
          const leading = votes === Math.max(...ELECTION.candidates.map((x) => x.votes + (voted === x.id ? 1 : 0)));
          return (
            <Card key={c.id} className="p-5 border-border/60 relative overflow-hidden">
              {leading && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-accent text-accent-foreground gap-1"><Trophy className="size-3" /> Leading</Badge>
                </div>
              )}
              <div className="size-14 rounded-full bg-primary/10 text-primary grid place-items-center text-xl font-semibold">
                {c.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="mt-3 font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">Candidate · {c.id}</div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Votes</span>
                  <span className="font-medium">{votes} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <Button
                className="w-full mt-4"
                variant={voted === c.id ? "secondary" : "default"}
                disabled={!!voted}
                onClick={() => setVoted(c.id)}
              >
                {voted === c.id ? "Voted ✓" : voted ? "Vote locked" : "Cast vote"}
              </Button>
            </Card>
          );
        })}
      </div>
    </>
  );
}
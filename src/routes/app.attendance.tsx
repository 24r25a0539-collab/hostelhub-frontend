import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STUDENTS } from "@/lib/mock";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/attendance")({ component: AttendancePage });

const daysInMonth = 30;
const today = 14;

function AttendancePage() {
  const [selected, setSelected] = useState(today);
  const [marks, setMarks] = useState<Record<string, "P" | "A">>(() => {
    const m: Record<string, "P" | "A"> = {};
    STUDENTS.forEach((s, i) => (m[s.id] = i === 2 ? "A" : "P"));
    return m;
  });

  const present = Object.values(marks).filter((v) => v === "P").length;
  const absent = STUDENTS.length - present;

  return (
    <>
      <PageHeader title="Attendance" subtitle="Pick a date and mark students." />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 border-border/60 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">June 2026</div>
            <div className="text-xs text-muted-foreground">Today is day {today}</div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 1 }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const isToday = d === today;
              const isSelected = d === selected;
              const isPast = d < today;
              return (
                <button
                  key={d}
                  onClick={() => setSelected(d)}
                  className={cn(
                    "aspect-square rounded-lg text-sm flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary text-primary-foreground font-semibold" :
                    isToday ? "bg-accent/30 text-accent-foreground font-medium" :
                    isPast ? "bg-muted/40 hover:bg-muted" : "hover:bg-muted/60",
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[oklch(0.62_0.16_155)]" /> Present {present}</div>
            <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-destructive" /> Absent {absent}</div>
            <div className="ml-auto font-semibold">{Math.round((present / STUDENTS.length) * 100)}%</div>
          </div>
        </Card>

        <Card className="p-5 border-border/60">
          <div className="font-semibold mb-1">Day {selected}</div>
          <div className="text-xs text-muted-foreground mb-4">Tap to toggle</div>
          <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
            {STUDENTS.map((s) => {
              const mark = marks[s.id];
              return (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="text-sm">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">Room {s.room}</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setMarks((m) => ({ ...m, [s.id]: "P" }))}
                      className={cn("px-2.5 py-1 rounded-md text-xs font-medium",
                        mark === "P" ? "bg-[oklch(0.62_0.16_155)] text-white" : "bg-muted")}
                    >P</button>
                    <button
                      onClick={() => setMarks((m) => ({ ...m, [s.id]: "A" }))}
                      className={cn("px-2.5 py-1 rounded-md text-xs font-medium",
                        mark === "A" ? "bg-destructive text-destructive-foreground" : "bg-muted")}
                    >A</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
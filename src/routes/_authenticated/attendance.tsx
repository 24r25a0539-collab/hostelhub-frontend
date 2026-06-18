import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { todayISO } from "@/lib/id";
import { toast } from "sonner";
import { exportCSV } from "@/lib/export";

export const Route = createFileRoute("/_authenticated/attendance")({ component: AttendancePage });

function AttendancePage() {
  const user = useCurrentUser();
  const { users, attendance, cookingQueue, markAttendance } = useData();
  const students = users.filter((u) => u.role === "student");
  const [date, setDate] = useState(todayISO());
  const isMaintainer = user?.role === "maintainer";
  const todayCook = cookingQueue.find((d) => d.status === "active");
  const canMark = isMaintainer || todayCook?.studentId === user?.id;

  const [marks, setMarks] = useState<Record<string, boolean>>({});

  const existingForDate = useMemo(() => {
    const m: Record<string, boolean> = {};
    attendance.filter((a) => a.date === date).forEach((a) => (m[a.studentId] = a.present));
    return m;
  }, [attendance, date]);

  const current = { ...existingForDate, ...marks };

  const save = () => {
    if (!canMark) return toast.error("Only today's cook or maintainer can mark");
    const records = students.map((s) => ({
      date, studentId: s.id, present: current[s.id] ?? false, markedBy: user!.id,
    }));
    markAttendance(records);
    setMarks({});
    toast.success("Attendance saved");
  };

  const setAll = (v: boolean) => {
    const m: Record<string, boolean> = {};
    students.forEach((s) => (m[s.id] = v));
    setMarks(m);
  };

  // stats for current user (if student) or overall (if maintainer)
  const myRecs = isMaintainer ? attendance : attendance.filter((a) => a.studentId === user?.id);
  const present = myRecs.filter((a) => a.present).length;
  const total = myRecs.length;
  const pct = total ? Math.round((present / total) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Attendance"
        description={canMark ? "Mark attendance for today" : "View your attendance records"}
        action={<Button variant="outline" onClick={() => exportCSV("attendance.csv", attendance)}>Export</Button>}
      />
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Present</div><div className="text-2xl font-bold">{present}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Absent</div><div className="text-2xl font-bold">{total - present}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Percentage</div><div className="text-2xl font-bold">{pct}%</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 flex-wrap">
            <span>Mark attendance</span>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="max-w-[180px]" />
            {canMark && (
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={() => setAll(true)}>Select all present</Button>
                <Button size="sm" variant="outline" onClick={() => setAll(false)}>Select all absent</Button>
                <Button size="sm" onClick={save}>Save</Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!canMark && (
            <div className="text-sm text-muted-foreground mb-3">
              Only today's cook can submit attendance.
            </div>
          )}
          <div className="grid gap-2">
            {students.map((s) => {
              const v = current[s.id];
              return (
                <div key={s.id} className="flex items-center gap-3 border rounded-md p-2">
                  <div className="flex-1">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">Room {s.roomNo}</div>
                  </div>
                  <Button
                    size="sm"
                    variant={v === true ? "default" : "outline"}
                    disabled={!canMark}
                    onClick={() => setMarks((m) => ({ ...m, [s.id]: true }))}
                  >Present</Button>
                  <Button
                    size="sm"
                    variant={v === false ? "destructive" : "outline"}
                    disabled={!canMark}
                    onClick={() => setMarks((m) => ({ ...m, [s.id]: false }))}
                  >Absent</Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

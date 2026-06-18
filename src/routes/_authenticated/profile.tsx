import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({ component: Profile });

function Profile() {
  const user = useCurrentUser();
  const updateUser = useData((s) => s.updateUser);
  const [form, setForm] = useState(user);
  useEffect(() => setForm(user), [user?.id]);
  if (!user || !form) return null;

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set("photo", r.result as string);
    r.readAsDataURL(f);
  };

  const save = () => {
    updateUser(user.id, form);
    toast.success("Profile updated");
  };

  return (
    <>
      <PageHeader title="My Profile" description="Manage your personal and hostel information" action={<Button onClick={save}>Save changes</Button>} />
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Profile Photo</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <Avatar className="size-32">
              <AvatarImage src={form.photo} />
              <AvatarFallback className="text-2xl">{form.name?.[0]}</AvatarFallback>
            </Avatar>
            <Input type="file" accept="image/*" onChange={onPhoto} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {[
              ["name", "Full Name"], ["email", "Email"], ["phone", "Phone"], ["dob", "Date of Birth"],
              ["gender", "Gender"], ["emergencyContact", "Emergency Contact"], ["parentName", "Parent Name"], ["parentPhone", "Parent Contact"],
            ].map(([k, label]) => (
              <div key={k} className="space-y-1">
                <Label>{label}</Label>
                <Input value={(form as any)[k] || ""} onChange={(e) => set(k, e.target.value)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Academic Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {[
              ["branch", "Branch"], ["year", "Year"], ["rollNo", "Roll No"], ["cgpa", "CGPA"], ["backlogs", "Backlogs"],
            ].map(([k, label]) => (
              <div key={k} className="space-y-1">
                <Label>{label}</Label>
                <Input value={(form as any)[k] || ""} onChange={(e) => set(k, e.target.value)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Hostel Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {[
              ["hostelName", "Hostel Name"], ["roomNo", "Room No"], ["bedNo", "Bed No"], ["floorNo", "Floor No"], ["joiningDate", "Joining Date"],
            ].map(([k, label]) => (
              <div key={k} className="space-y-1">
                <Label>{label}</Label>
                <Input value={(form as any)[k] || ""} onChange={(e) => set(k, e.target.value)} />
              </div>
            ))}
            <div className="flex items-center gap-2 pt-6">
              <Switch checked={!!form.busPassEligible} onCheckedChange={(v) => set("busPassEligible", v)} />
              <Label>Bus Pass Eligible</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>Change Password</Label>
              <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
            </div>
            <div className="text-xs text-muted-foreground">Role: {form.role}</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

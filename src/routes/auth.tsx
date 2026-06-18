import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window !== "undefined" && useAuth.getState().currentUserId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const [role, setRole] = useState<"student" | "maintainer">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuth((s) => s.login);
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(email, password, role);
    if (!r.ok) toast.error(r.error || "Login failed");
    else {
      toast.success("Welcome back!");
      nav({ to: "/dashboard" });
    }
  };

  const fill = (r: "student" | "maintainer") => {
    setRole(r);
    setEmail(r === "maintainer" ? "maintainer@hostel.in" : "student1@hostel.in");
    setPassword("password");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold text-xl">H</div>
          <div className="text-xl font-semibold">HostelHub</div>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Complete digital management for your hostel.</h1>
          <p className="mt-4 text-sidebar-foreground/70 max-w-md">
            Attendance, cooking duties, expenses, elections, complaints, visitors, bus pass — everything in one place.
          </p>
        </div>
        <div className="text-xs text-sidebar-foreground/60">© {new Date().getFullYear()} HostelHub</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in to HostelHub</CardTitle>
            <CardDescription>Choose your role and enter your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(v) => setRole(v as any)}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="maintainer">Maintainer</TabsTrigger>
              </TabsList>
              <TabsContent value={role} className="mt-4">
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full">Sign in as {role}</Button>
                </form>
                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                  <div>Demo accounts (password: <code>password</code>):</div>
                  <button type="button" className="underline" onClick={() => fill("maintainer")}>
                    maintainer@hostel.in
                  </button>{" · "}
                  <button type="button" className="underline" onClick={() => fill("student")}>
                    student1@hostel.in
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

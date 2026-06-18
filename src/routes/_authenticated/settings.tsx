import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useSettings, useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, setTheme, notif, toggleNotif, privacy, togglePrivacy } = useSettings();
  const reset = useData((s) => s.reset);
  return (
    <>
      <PageHeader title="Settings" description="Customize your HostelHub experience" />
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}><Sun className="size-4" />Light</Button>
            <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}><Moon className="size-4" />Dark</Button>
            <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}><Monitor className="size-4" />System</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(notif).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <Label className="capitalize">{k}</Label>
                <Switch checked={v} onCheckedChange={() => toggleNotif(k as any)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Privacy</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(privacy).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <Label>{k}</Label>
                <Switch checked={v} onCheckedChange={() => togglePrivacy(k as any)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Danger Zone</CardTitle></CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={() => { if (confirm("Reset all demo data?")) { reset(); toast.success("Demo data reset"); } }}>
              <RotateCcw className="size-4" /> Reset demo data
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

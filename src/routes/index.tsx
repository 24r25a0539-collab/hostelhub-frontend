import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Building2,
  CalendarCheck,
  Wallet,
  ChefHat,
  Vote,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HostelHub — Complete Hostel Management System" },
      { name: "description", content: "Run your hostel without notebooks. Attendance, expenses, duties, elections, complaints, visitors — all in one calm dashboard." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: CalendarCheck, title: "Attendance", desc: "Calendar marking with monthly stats." },
  { icon: Wallet, title: "Expenses", desc: "Track every rupee with bill scans." },
  { icon: ChefHat, title: "Cooking Duties", desc: "Auto-rotated roster + swaps." },
  { icon: Vote, title: "Elections", desc: "Anonymous maintainer voting." },
  { icon: QrCode, title: "QR Payments", desc: "Collect contributions over UPI." },
  { icon: ShieldCheck, title: "Visitors", desc: "Approve guests with one tap." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">H</div>
          <span className="font-semibold text-lg tracking-tight">HostelHub</span>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#join" className="hover:text-foreground">Join hostel</a>
        </nav>
        <Link to="/app/dashboard">
          <Button size="sm">Open app</Button>
        </Link>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 bg-background/70" />
        <div className="px-6 md:px-12 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-accent-foreground text-xs font-medium">
              <Sparkles className="size-3.5" /> Built for student communities
            </div>
            <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
              Run your hostel<br />without notebooks.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Attendance, expenses, duties, elections, complaints, visitors — everything your hostel
              needs, in one calm, transparent dashboard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/app/dashboard">
                <Button size="lg" className="shadow-[var(--shadow-soft)]">Enter dashboard</Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">Explore features</Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div><span className="font-semibold text-foreground">8</span> students</div>
              <div><span className="font-semibold text-foreground">₹25K</span> monthly fund</div>
              <div><span className="font-semibold text-foreground">12</span> modules</div>
            </div>
          </div>

          <Card className="p-6 shadow-[var(--shadow-card)] border-border/60">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Sign in</div>
                <div className="font-semibold text-lg">Welcome back</div>
              </div>
              <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <Building2 className="size-5" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@hostel.in" className="mt-1.5" defaultValue="arjun@hub.in" />
              </div>
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" placeholder="••••••••" className="mt-1.5" defaultValue="hostelhub" />
              </div>
              <Link to="/app/dashboard" className="block">
                <Button className="w-full">Sign in</Button>
              </Link>
              <div className="text-center text-xs text-muted-foreground">
                or join a hostel with invite code <span className="font-mono text-foreground">SAI123</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="features" className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Everything a hostel ERP should be.</h2>
          <p className="mt-3 text-muted-foreground">Twelve modules covering the entire hostel workflow — from morning attendance to month-end PDF reports.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-5 hover:shadow-[var(--shadow-card)] transition-shadow border-border/60">
              <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4">
                <f.icon className="size-5" />
              </div>
              <div className="font-semibold">{f.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-6 md:px-12 py-8 text-sm text-muted-foreground flex flex-wrap justify-between gap-3 max-w-7xl mx-auto">
        <div>© 2026 HostelHub. A community-first hostel system.</div>
        <div>Built with care for student hostels.</div>
      </footer>
    </div>
  );
}

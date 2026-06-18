import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles, FileText, TrendingUp, PiggyBank, LineChart, AlertTriangle,
  ShieldAlert, MessageSquareWarning, Bot, NotebookPen, HeartPulse, Award, Send,
} from "lucide-react";
import { useState } from "react";
import { currency, EXPENSES, HOSTEL } from "@/lib/mock";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/app/ai-insights")({
  component: AIInsights,
});

const trend = [
  { m: "Jan", spend: 18200, predicted: 18000 },
  { m: "Feb", spend: 19500, predicted: 19200 },
  { m: "Mar", spend: 21000, predicted: 20400 },
  { m: "Apr", spend: 20100, predicted: 20800 },
  { m: "May", spend: 22500, predicted: 21500 },
  { m: "Jun", spend: 17580, predicted: 22300 },
  { m: "Jul", spend: 0, predicted: 23100 },
  { m: "Aug", spend: 0, predicted: 23900 },
];

const anomalies = [
  { date: "2026-06-08", category: "Electricity", amount: 2200, reason: "62% higher than 3-month average" },
  { date: "2026-06-05", category: "Groceries", amount: 1500, reason: "Duplicate vendor in 48h window" },
];

const frauds = [
  { id: "F-211", entry: "Vegetables ₹640", risk: "Medium", reason: "Bill image blurry; OCR confidence 42%" },
  { id: "F-198", entry: "Gas refill ₹950", risk: "Low", reason: "Within expected vendor pattern" },
];

function AIInsights() {
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I'm HostelHub AI. Ask me about expenses, duties, or budgets." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setChat((c) => [...c, { role: "user", text: q }, {
      role: "ai",
      text: q.toLowerCase().includes("budget")
        ? `You've used ${currency(HOSTEL.monthlyBudget - HOSTEL.fundRemaining)} of ${currency(HOSTEL.monthlyBudget)} this month. Projection: on track to finish at ~${currency(23100)}.`
        : "Based on recent data, hostel operations look healthy. Health Score 82/100.",
    }]);
    setInput("");
  };

  return (
    <>
      <PageHeader
        title="AI Insights"
        subtitle="AI-powered analytics, predictions and assistants"
        action={<Badge className="gap-1"><Sparkles className="size-3" /> Beta</Badge>}
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <ScoreCard icon={HeartPulse} title="Hostel Health Score" value={82} hint="Good — finances & duties on track" tone="text-emerald-600" />
        <ScoreCard icon={Award} title="Maintainer Score" value={91} hint="Excellent — quick complaint resolution" tone="text-indigo-600" />
        <ScoreCard icon={TrendingUp} title="Predicted Jul Spend" value={23100} money hint="+3.6% vs Jun forecast" tone="text-amber-600" />
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="analytics"><LineChart className="size-3.5 mr-1" />Analytics</TabsTrigger>
          <TabsTrigger value="budget"><PiggyBank className="size-3.5 mr-1" />Budget Planner</TabsTrigger>
          <TabsTrigger value="prediction"><TrendingUp className="size-3.5 mr-1" />Prediction</TabsTrigger>
          <TabsTrigger value="anomaly"><AlertTriangle className="size-3.5 mr-1" />Anomalies</TabsTrigger>
          <TabsTrigger value="fraud"><ShieldAlert className="size-3.5 mr-1" />Fraud</TabsTrigger>
          <TabsTrigger value="complaints"><MessageSquareWarning className="size-3.5 mr-1" />Complaints</TabsTrigger>
          <TabsTrigger value="statement"><FileText className="size-3.5 mr-1" />Statement</TabsTrigger>
          <TabsTrigger value="meeting"><NotebookPen className="size-3.5 mr-1" />Meeting</TabsTrigger>
          <TabsTrigger value="chat"><Bot className="size-3.5 mr-1" />Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Expense Analytics</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EXPENSES.map(e => ({ name: e.category, v: e.amount }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" /><YAxis /><Tooltip />
                  <Bar dataKey="v" fill="hsl(var(--primary))" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="mt-4 space-y-3">
          <Card><CardHeader><CardTitle>AI Budget Planner</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { k: "Groceries", v: 8000, used: 65 },
                { k: "Vegetables", v: 4500, used: 78 },
                { k: "Gas", v: 1200, used: 92 },
                { k: "Electricity", v: 3000, used: 73 },
                { k: "Maintenance", v: 2000, used: 35 },
              ].map(b => (
                <div key={b.k}>
                  <div className="flex justify-between text-sm mb-1"><span>{b.k}</span><span className="text-muted-foreground">{currency(b.v)} • {b.used}%</span></div>
                  <Progress value={b.used} />
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">AI suggests reallocating ₹500 from Maintenance to Gas next month.</p>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="prediction" className="mt-4">
          <Card><CardHeader><CardTitle>Expense Prediction (next 2 months)</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="m" /><YAxis /><Tooltip />
                  <Area type="monotone" dataKey="spend" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.2)" />
                  <Area type="monotone" dataKey="predicted" stroke="hsl(var(--accent-foreground))" fill="transparent" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="anomaly" className="mt-4 space-y-2">
          {anomalies.map((a, i) => (
            <Card key={i}><CardContent className="p-4 flex items-start justify-between gap-3">
              <div>
                <div className="font-medium flex items-center gap-2"><AlertTriangle className="size-4 text-amber-600" />{a.category} — {currency(a.amount)}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.date} • {a.reason}</div>
              </div>
              <Button size="sm" variant="outline">Investigate</Button>
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="fraud" className="mt-4 space-y-2">
          {frauds.map(f => (
            <Card key={f.id}><CardContent className="p-4 flex items-start justify-between gap-3">
              <div>
                <div className="font-medium flex items-center gap-2"><ShieldAlert className="size-4 text-rose-600" />{f.entry}</div>
                <div className="text-xs text-muted-foreground mt-1">{f.id} • {f.reason}</div>
              </div>
              <Badge variant={f.risk === "Medium" ? "destructive" : "secondary"}>{f.risk} risk</Badge>
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="complaints" className="mt-4">
          <Card><CardHeader><CardTitle>Complaint Analyzer</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Top category</span><Badge>Maintenance (42%)</Badge></div>
              <div className="flex justify-between"><span>Avg resolution</span><span>1.8 days</span></div>
              <div className="flex justify-between"><span>Sentiment</span><Badge variant="secondary">Mostly neutral</Badge></div>
              <p className="text-xs text-muted-foreground pt-2">Spike in Wi-Fi complaints in A-block detected. Recommend router audit.</p>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="statement" className="mt-4">
          <Card><CardHeader><CardTitle>AI Financial Statement</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Auto-generated monthly statement summarising income, expenses, and per-student dues.</p>
              <div className="rounded-lg border p-4 text-sm leading-6">
                June 2026 — Total inflow {currency(25000)}, outflow {currency(7580)}, balance {currency(17420)}.
                Largest category: Electricity ({currency(2200)}). Average per-student contribution: ₹3,125.
              </div>
              <Button><FileText className="size-4" /> Download PDF</Button>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="meeting" className="mt-4">
          <Card><CardHeader><CardTitle>Meeting Summary Generator</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Paste meeting transcript or upload audio…" />
              <Button><Sparkles className="size-4" /> Generate summary</Button>
              <div className="rounded-lg border p-4 text-sm">
                <strong>Summary (sample):</strong> Discussed June budget overrun in electricity, agreed to switch to LED tubes,
                appointed Karthik as new mess captain. Action items: 3, Decisions: 2.
              </div>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-4">
          <Card><CardHeader><CardTitle>AI Chat Assistant</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto rounded-lg border p-3 space-y-2 mb-3 bg-muted/30">
                {chat.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "text-right" : ""}>
                    <span className={`inline-block px-3 py-1.5 rounded-2xl text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"}`}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about budgets, duties, attendance…" />
                <Button onClick={send}><Send className="size-4" /></Button>
              </div>
            </CardContent></Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function ScoreCard({ icon: Icon, title, value, hint, tone, money }: { icon: any; title: string; value: number; hint: string; tone: string; money?: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{title}</div>
          <Icon className={`size-5 ${tone}`} />
        </div>
        <div className={`text-3xl font-semibold mt-2 ${tone}`}>{money ? currency(value) : value}{!money && <span className="text-base text-muted-foreground">/100</span>}</div>
        <div className="text-xs text-muted-foreground mt-1">{hint}</div>
      </CardContent>
    </Card>
  );
}
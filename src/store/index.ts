import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User, AttendanceRecord, CookingDuty, SwapRequest, Expense, BusPassTxn,
  Nomination, Election, Announcement, Complaint, Visitor, QRInfo, Notification, Role
} from "@/types";
import { uid, todayISO, monthISO } from "@/lib/id";

interface AuthState {
  currentUserId: string | null;
  login: (email: string, password: string, role: Role) => { ok: boolean; error?: string };
  logout: () => void;
}
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      currentUserId: null,
      login: (email, password, role) => {
        const users = useData.getState().users;
        const u = users.find(
          (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password && x.role === role
        );
        if (!u) return { ok: false, error: "Invalid credentials or role" };
        set({ currentUserId: u.id });
        return { ok: true };
      },
      logout: () => set({ currentUserId: null }),
    }),
    { name: "hh_auth" }
  )
);

interface SettingsState {
  theme: "light" | "dark" | "system";
  notif: { announcements: boolean; complaints: boolean; visitors: boolean; cooking: boolean; election: boolean };
  privacy: { showEmail: boolean; showPhone: boolean };
  setTheme: (t: "light" | "dark" | "system") => void;
  toggleNotif: (k: keyof SettingsState["notif"]) => void;
  togglePrivacy: (k: keyof SettingsState["privacy"]) => void;
}
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      notif: { announcements: true, complaints: true, visitors: true, cooking: true, election: true },
      privacy: { showEmail: true, showPhone: true },
      setTheme: (theme) => set({ theme }),
      toggleNotif: (k) =>
        set((s) => ({ notif: { ...s.notif, [k]: !s.notif[k] } })),
      togglePrivacy: (k) =>
        set((s) => ({ privacy: { ...s.privacy, [k]: !s.privacy[k] } })),
    }),
    { name: "hh_settings" }
  )
);

interface DataState {
  users: User[];
  attendance: AttendanceRecord[];
  cookingQueue: CookingDuty[];
  swaps: SwapRequest[];
  expenses: Expense[];
  buspass: BusPassTxn[];
  nominations: Nomination[];
  election: Election;
  announcements: Announcement[];
  complaints: Complaint[];
  visitors: Visitor[];
  qr: QRInfo;
  notifications: Notification[];
  // user actions
  addUser: (u: User) => void;
  updateUser: (id: string, p: Partial<User>) => void;
  deleteUser: (id: string) => void;
  // attendance
  markAttendance: (records: AttendanceRecord[]) => void;
  // cooking
  rotateCooking: () => void;
  addSwap: (s: SwapRequest) => void;
  decideSwap: (id: string, ok: boolean) => void;
  // expenses
  addExpense: (e: Expense) => void;
  updateExpense: (id: string, p: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  // buspass
  addBusTxn: (t: BusPassTxn) => void;
  // elections
  addNomination: (n: Nomination) => void;
  vote: (nominationId: string, voterId: string) => boolean;
  closeElection: () => string | null;
  openElection: () => void;
  // announcements
  addAnnouncement: (a: Announcement) => void;
  updateAnnouncement: (id: string, p: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  // complaints
  addComplaint: (c: Complaint) => void;
  updateComplaint: (id: string, p: Partial<Complaint>) => void;
  addComplaintComment: (id: string, by: string, text: string) => void;
  // visitors
  addVisitor: (v: Visitor) => void;
  decideVisitor: (id: string, ok: boolean) => void;
  checkVisitor: (id: string, kind: "in" | "out") => void;
  // qr
  setQR: (q: QRInfo) => void;
  // notifications
  pushNotification: (n: Omit<Notification, "id" | "at" | "read">) => void;
  markNotifRead: (id: string) => void;
  deleteNotif: (id: string) => void;
  markAllRead: () => void;
  reset: () => void;
}

const seedUsers: User[] = [
  {
    id: "u-maint",
    name: "Arjun Reddy",
    email: "maintainer@hostel.in",
    phone: "9000000001",
    password: "password",
    role: "maintainer",
    roomNo: "101",
    branch: "CSE",
    year: "3",
    busPassEligible: true,
    hostelName: "Sunrise Hostel",
  },
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `u-s${i + 1}`,
    name: ["Rahul Kumar", "Priya Sharma", "Vikram Singh", "Ananya Iyer", "Karthik Rao", "Meera Nair", "Suresh Babu", "Divya Patel"][i],
    email: `student${i + 1}@hostel.in`,
    phone: `90000000${10 + i}`,
    password: "password",
    role: "student" as Role,
    roomNo: `${102 + i}`,
    branch: ["CSE", "ECE", "ME", "CE", "EEE", "IT", "CSE", "ECE"][i],
    year: "2",
    busPassEligible: i % 2 === 0,
    hostelName: "Sunrise Hostel",
  })),
];

const seedCooking: CookingDuty[] = seedUsers
  .filter((u) => u.role === "student")
  .map((u, i) => ({
    id: uid(),
    studentId: u.id,
    date: todayISO(),
    status: i === 0 ? "active" : "queued",
  }));

const seedExpenses: Expense[] = [
  { id: uid(), name: "Electricity Bill", vendor: "TSSPDCL", amount: 4500, category: "Electricity", date: todayISO(), createdBy: "u-maint" },
  { id: uid(), name: "Groceries Week 1", vendor: "More Supermarket", amount: 8200, category: "Groceries", date: todayISO(), createdBy: "u-maint" },
  { id: uid(), name: "Internet", vendor: "ACT Fibernet", amount: 1500, category: "Internet", date: todayISO(), createdBy: "u-maint" },
];

const seedAnn: Announcement[] = [
  { id: uid(), title: "Welcome to HostelHub", description: "Use this platform to manage all hostel activities.", date: todayISO(), priority: "Important", createdBy: "u-maint" },
];

export const useData = create<DataState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      attendance: [],
      cookingQueue: seedCooking,
      swaps: [],
      expenses: seedExpenses,
      buspass: [],
      nominations: [],
      election: { month: monthISO(), open: true },
      announcements: seedAnn,
      complaints: [],
      visitors: [],
      qr: { upiId: "hostel@upi", payeeName: "Sunrise Hostel" },
      notifications: [],

      addUser: (u) => set((s) => ({ users: [...s.users, u] })),
      updateUser: (id, p) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...p } : u)) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      markAttendance: (records) =>
        set((s) => {
          const keyset = new Set(records.map((r) => `${r.date}|${r.studentId}`));
          const kept = s.attendance.filter((a) => !keyset.has(`${a.date}|${a.studentId}`));
          return { attendance: [...kept, ...records] };
        }),

      rotateCooking: () =>
        set((s) => {
          const q = [...s.cookingQueue];
          const idx = q.findIndex((d) => d.status === "active");
          if (idx >= 0) q[idx] = { ...q[idx], status: "done" };
          const next = q.findIndex((d) => d.status === "queued");
          if (next >= 0) q[next] = { ...q[next], status: "active", date: todayISO() };
          else {
            // restart cycle
            const studs = s.users.filter((u) => u.role === "student");
            q.push(
              ...studs.map((u, i) => ({
                id: uid(),
                studentId: u.id,
                date: todayISO(),
                status: i === 0 ? ("active" as const) : ("queued" as const),
              }))
            );
          }
          return { cookingQueue: q };
        }),
      addSwap: (s2) => set((s) => ({ swaps: [s2, ...s.swaps] })),
      decideSwap: (id, ok) =>
        set((s) => {
          const sw = s.swaps.find((x) => x.id === id);
          if (!sw) return {};
          const swaps = s.swaps.map((x) => (x.id === id ? { ...x, status: ok ? "approved" as const : "rejected" as const } : x));
          if (!ok) return { swaps };
          // swap active to "toId"
          const q = [...s.cookingQueue];
          const activeIdx = q.findIndex((d) => d.status === "active");
          if (activeIdx >= 0 && q[activeIdx].studentId === sw.fromId) {
            q[activeIdx] = { ...q[activeIdx], studentId: sw.toId };
          }
          return { swaps, cookingQueue: q };
        }),

      addExpense: (e) => set((s) => ({ expenses: [e, ...s.expenses] })),
      updateExpense: (id, p) =>
        set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...p } : e)) })),
      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      addBusTxn: (t) => set((s) => ({ buspass: [t, ...s.buspass] })),

      addNomination: (n) => set((s) => ({ nominations: [...s.nominations, n] })),
      vote: (nominationId, voterId) => {
        const month = get().election.month;
        const already = get().nominations.some((n) => n.month === month && n.votes.includes(voterId));
        if (already) return false;
        set((s) => ({
          nominations: s.nominations.map((n) =>
            n.id === nominationId ? { ...n, votes: [...n.votes, voterId] } : n
          ),
        }));
        return true;
      },
      closeElection: () => {
        const { nominations, election, users } = get();
        const monthNoms = nominations.filter((n) => n.month === election.month);
        if (!monthNoms.length) {
          set({ election: { ...election, open: false } });
          return null;
        }
        const winner = monthNoms.reduce((a, b) => (b.votes.length > a.votes.length ? b : a));
        const winnerUser = users.find((u) => u.id === winner.studentId);
        set((s) => ({
          election: { ...s.election, open: false, winnerId: winner.studentId },
          users: s.users.map((u) => {
            if (u.id === winner.studentId) return { ...u, role: "maintainer" };
            if (u.role === "maintainer" && u.id !== winner.studentId) return { ...u, role: "student" };
            return u;
          }),
        }));
        return winnerUser?.name || null;
      },
      openElection: () =>
        set({ election: { month: monthISO(), open: true } }),

      addAnnouncement: (a) => set((s) => ({ announcements: [a, ...s.announcements] })),
      updateAnnouncement: (id, p) =>
        set((s) => ({ announcements: s.announcements.map((a) => (a.id === id ? { ...a, ...p } : a)) })),
      deleteAnnouncement: (id) =>
        set((s) => ({ announcements: s.announcements.filter((a) => a.id !== id) })),

      addComplaint: (c) => set((s) => ({ complaints: [c, ...s.complaints] })),
      updateComplaint: (id, p) =>
        set((s) => ({ complaints: s.complaints.map((c) => (c.id === id ? { ...c, ...p } : c)) })),
      addComplaintComment: (id, by, text) =>
        set((s) => ({
          complaints: s.complaints.map((c) =>
            c.id === id
              ? { ...c, comments: [...c.comments, { id: uid(), by, text, at: new Date().toISOString() }] }
              : c
          ),
        })),

      addVisitor: (v) => set((s) => ({ visitors: [v, ...s.visitors] })),
      decideVisitor: (id, ok) =>
        set((s) => ({
          visitors: s.visitors.map((v) =>
            v.id === id ? { ...v, status: ok ? "approved" : "rejected" } : v
          ),
        })),
      checkVisitor: (id, kind) =>
        set((s) => ({
          visitors: s.visitors.map((v) =>
            v.id === id ? { ...v, [kind === "in" ? "checkIn" : "checkOut"]: new Date().toISOString() } : v
          ),
        })),

      setQR: (q) => set({ qr: q }),

      pushNotification: (n) =>
        set((s) => ({
          notifications: [
            { id: uid(), at: new Date().toISOString(), read: false, ...n },
            ...s.notifications,
          ],
        })),
      markNotifRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      deleteNotif: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      reset: () =>
        set({
          users: seedUsers,
          attendance: [],
          cookingQueue: seedCooking,
          swaps: [],
          expenses: seedExpenses,
          buspass: [],
          nominations: [],
          election: { month: monthISO(), open: true },
          announcements: seedAnn,
          complaints: [],
          visitors: [],
          qr: { upiId: "hostel@upi", payeeName: "Sunrise Hostel" },
          notifications: [],
        }),
    }),
    { name: "hh_data", version: 1 }
  )
);

export const useCurrentUser = () => {
  const id = useAuth((s) => s.currentUserId);
  const users = useData((s) => s.users);
  return users.find((u) => u.id === id) || null;
};

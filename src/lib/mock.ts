import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createElement } from "react";

export type Role = "student" | "maintainer";

export type Student = {
  id: string;
  name: string;
  room: string;
  mobile: string;
  email: string;
  joiningDate: string;
  backlogs: number;
  attendance: number;
  busPassEligible: boolean;
  balance: number;
};

export const HOSTEL = {
  name: "Sai Residency Hostel",
  code: "SAI123",
  address: "MG Road, Bengaluru",
  monthlyBudget: 25000,
  fundRemaining: 17420,
};

export const STUDENTS: Student[] = [
  { id: "S001", name: "Arjun Reddy", room: "A-101", mobile: "9876543210", email: "arjun@hub.in", joiningDate: "2024-06-12", backlogs: 0, attendance: 92, busPassEligible: true, balance: 540 },
  { id: "S002", name: "Priya Sharma", room: "A-102", mobile: "9876543211", email: "priya@hub.in", joiningDate: "2024-06-12", backlogs: 0, attendance: 88, busPassEligible: true, balance: 480 },
  { id: "S003", name: "Vikram Iyer", room: "A-103", mobile: "9876543212", email: "vikram@hub.in", joiningDate: "2024-07-02", backlogs: 2, attendance: 76, busPassEligible: false, balance: 0 },
  { id: "S004", name: "Ananya Singh", room: "A-104", mobile: "9876543213", email: "ananya@hub.in", joiningDate: "2024-06-20", backlogs: 0, attendance: 95, busPassEligible: true, balance: 610 },
  { id: "S005", name: "Rohit Mehra", room: "A-105", mobile: "9876543214", email: "rohit@hub.in", joiningDate: "2024-08-01", backlogs: 1, attendance: 80, busPassEligible: false, balance: 0 },
  { id: "S006", name: "Sneha Patel", room: "A-106", mobile: "9876543215", email: "sneha@hub.in", joiningDate: "2024-06-12", backlogs: 0, attendance: 91, busPassEligible: true, balance: 530 },
  { id: "S007", name: "Karthik Rao", room: "A-107", mobile: "9876543216", email: "karthik@hub.in", joiningDate: "2024-06-12", backlogs: 0, attendance: 87, busPassEligible: true, balance: 470 },
  { id: "S008", name: "Divya Nair", room: "A-108", mobile: "9876543217", email: "divya@hub.in", joiningDate: "2024-06-12", backlogs: 0, attendance: 94, busPassEligible: true, balance: 580 },
];

export const EXPENSES = [
  { id: 1, amount: 1200, category: "Groceries", description: "Rice, Dal, Oil", date: "2026-06-10" },
  { id: 2, amount: 480, category: "Vegetables", description: "Weekly vegetables", date: "2026-06-11" },
  { id: 3, amount: 950, category: "Gas", description: "LPG cylinder refill", date: "2026-06-12" },
  { id: 4, amount: 2200, category: "Electricity", description: "May bill", date: "2026-06-08" },
  { id: 5, amount: 380, category: "Maintenance", description: "Plumbing fix", date: "2026-06-09" },
  { id: 6, amount: 220, category: "Miscellaneous", description: "Cleaning supplies", date: "2026-06-13" },
  { id: 7, amount: 640, category: "Vegetables", description: "Tomato, onion, leafy greens", date: "2026-06-14" },
  { id: 8, amount: 1500, category: "Groceries", description: "Monthly provisions", date: "2026-06-05" },
];

export const DUTIES = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const student = STUDENTS[i % STUDENTS.length];
  let status: "Completed" | "Assigned" | "Missed" | "Swapped" = "Assigned";
  if (day < 15) status = "Completed";
  else if (day === 15) status = "Swapped";
  else if (day === 9) status = "Missed";
  return { day, date: `2026-06-${String(day).padStart(2, "0")}`, student, status };
});

export const ANNOUNCEMENTS = [
  { id: 1, title: "Water tank cleaning — Sunday", message: "The overhead tank will be cleaned this Sunday from 9 AM to 12 PM. Please store water in advance.", date: "2026-06-13", by: "Maintainer" },
  { id: 2, title: "New cooking duty roster", message: "The duty roster for June has been published. Please check your assigned days.", date: "2026-06-10", by: "Maintainer" },
  { id: 3, title: "Hostel rent — collection drive", message: "Monthly contribution collection starts tomorrow. Use the QR code in the payments section.", date: "2026-06-08", by: "Maintainer" },
];

export const COMPLAINTS = [
  { id: 1, title: "Wi-Fi keeps dropping in A-103", category: "Maintenance", status: "In Progress", date: "2026-06-12", by: "Vikram Iyer" },
  { id: 2, title: "Mess food too spicy this week", category: "Food Quality", status: "Open", date: "2026-06-13", by: "Priya Sharma" },
  { id: 3, title: "Bathroom tap leakage", category: "Water Issues", status: "Resolved", date: "2026-06-09", by: "Ananya Singh" },
  { id: 4, title: "Common room lights flickering", category: "Electricity", status: "Open", date: "2026-06-14", by: "Karthik Rao" },
];

export const VISITORS = [
  { id: 1, name: "Mr. Reddy", relation: "Father", student: "Arjun Reddy", mobile: "9000000001", entry: "2026-06-13 10:20", exit: "2026-06-13 14:00", status: "Approved" },
  { id: 2, name: "Anjali", relation: "Sister", student: "Priya Sharma", mobile: "9000000002", entry: "2026-06-14 16:00", exit: "—", status: "Pending" },
  { id: 3, name: "Mr. Iyer", relation: "Uncle", student: "Vikram Iyer", mobile: "9000000003", entry: "2026-06-12 11:00", exit: "2026-06-12 13:00", status: "Approved" },
];

export const ELECTION = {
  active: true,
  endsOn: "2026-06-20",
  candidates: [
    { id: "S001", name: "Arjun Reddy", votes: 5 },
    { id: "S004", name: "Ananya Singh", votes: 8 },
    { id: "S007", name: "Karthik Rao", votes: 3 },
  ],
};

export const BUS_PASS_TX = [
  { id: 1, student: "Arjun Reddy", amount: 10, description: "Soap", date: "2026-06-05" },
  { id: 2, student: "Arjun Reddy", amount: 20, description: "Milk", date: "2026-06-07" },
  { id: 3, student: "Arjun Reddy", amount: 50, description: "Vegetables", date: "2026-06-10" },
  { id: 4, student: "Priya Sharma", amount: 30, description: "Detergent", date: "2026-06-06" },
  { id: 5, student: "Ananya Singh", amount: 20, description: "Milk", date: "2026-06-08" },
];

const RoleCtx = createContext<{ role: Role; setRole: (r: Role) => void; userId: string }>({
  role: "student",
  setRole: () => {},
  userId: "S001",
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("student");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("hh_role")) as Role | null;
    if (saved) setRoleState(saved);
  }, []);
  const setRole = (r: Role) => {
    setRoleState(r);
    if (typeof window !== "undefined") localStorage.setItem("hh_role", r);
  };
  return createElement(RoleCtx.Provider, { value: { role, setRole, userId: "S001" } }, children);
}

export const useRole = () => useContext(RoleCtx);

export const currency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
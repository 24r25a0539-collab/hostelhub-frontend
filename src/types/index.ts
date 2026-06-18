export type Role = "student" | "maintainer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  photo?: string;
  roomNo?: string;
  bedNo?: string;
  floorNo?: string;
  branch?: string;
  year?: string;
  rollNo?: string;
  cgpa?: string;
  backlogs?: number;
  dob?: string;
  gender?: string;
  parentName?: string;
  parentPhone?: string;
  emergencyContact?: string;
  joiningDate?: string;
  hostelName?: string;
  busPassEligible?: boolean;
  password: string;
}

export interface AttendanceRecord {
  date: string; // yyyy-MM-dd
  studentId: string;
  present: boolean;
  markedBy: string;
}

export interface CookingDuty {
  id: string;
  studentId: string;
  date: string;
  status: "queued" | "active" | "done";
}

export interface SwapRequest {
  id: string;
  fromId: string;
  toId: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Expense {
  id: string;
  name: string;
  vendor: string;
  amount: number;
  category: string;
  address?: string;
  description?: string;
  date: string;
  billImage?: string;
  createdBy: string;
}

export interface BusPassTxn {
  id: string;
  studentId: string;
  type: "credit" | "debit";
  amount: number;
  purpose: string;
  description?: string;
  date: string;
}

export interface Nomination {
  id: string;
  studentId: string;
  month: string; // yyyy-MM
  photo?: string;
  manifesto: string;
  goals: string;
  votes: string[]; // voter ids
}

export interface Election {
  month: string;
  open: boolean;
  winnerId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: "Normal" | "Important" | "Urgent";
  createdBy: string;
}

export interface ComplaintComment {
  id: string;
  by: string;
  text: string;
  at: string;
}
export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  attachment?: string;
  status: "Open" | "In Progress" | "Resolved" | "Rejected";
  by: string;
  date: string;
  comments: ComplaintComment[];
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  relation: string;
  visitDate: string;
  purpose: string;
  studentId: string;
  status: "pending" | "approved" | "rejected";
  checkIn?: string;
  checkOut?: string;
}

export interface QRInfo {
  upiId: string;
  payeeName: string;
  qrImage?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: string;
  read: boolean;
  at: string;
  forUserId?: string;
}

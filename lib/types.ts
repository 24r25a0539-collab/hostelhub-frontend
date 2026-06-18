// Authentication & User Types
export type UserRole = 'STUDENT' | 'MAINTAINER'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  hostelId: string
  roomNumber?: string
  joiningDate: Date
  profilePhoto?: string
  createdAt: Date
}

export interface Hostel {
  id: string
  code: string
  name: string
  address: string
  description: string
  totalCapacity: number
  founderId: string
  createdAt: Date
}

export interface JoinRequest {
  id: string
  hostelId: string
  userId: string
  userName: string
  userEmail: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requestedAt: Date
  reviewedAt?: Date
}

// Attendance Types
export interface Attendance {
  id: string
  hostelId: string
  date: Date
  studentId: string
  status: 'PRESENT' | 'ABSENT' | 'LEAVE'
  recordedBy: string
  recordedAt: Date
}

export interface AttendanceRecord {
  studentId: string
  studentName: string
  present: number
  absent: number
  leave: number
  percentage: number
}

// Fund Types
export interface StudentFund {
  id: string
  hostelId: string
  studentId: string
  studentName: string
  contributionAmount: number
  paidAmount: number
  pendingAmount: number
  status: 'PAID' | 'PENDING' | 'PARTIAL'
  lastPaidAt?: Date
  history: FundTransaction[]
}

export interface FundTransaction {
  id: string
  studentFundId: string
  amount: number
  type: 'CREDIT' | 'DEBIT'
  description: string
  date: Date
  recordedBy: string
}

// Expense Types
export type ExpenseCategory = 'FOOD' | 'UTILITIES' | 'INTERNET' | 'MAINTENANCE' | 'CLEANING' | 'OTHER'

export interface Expense {
  id: string
  hostelId: string
  category: ExpenseCategory
  amount: number
  description: string
  vendor?: string
  billDate: Date
  recordedAt: Date
  recordedBy: string
  billImage?: string
  aiExtracted?: {
    confidence: number
    vendor: string
    amount: number
    date: Date
  }
}

// Cooking Duty Types
export interface CookingDuty {
  id: string
  hostelId: string
  date: Date
  studentId: string
  studentName: string
  status: 'PENDING' | 'COMPLETED' | 'SWAPPED'
}

export interface DutySwapRequest {
  id: string
  dutyId: string
  requestedBy: string
  requestedWith: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: Date
}

// Complaint Types
export interface Complaint {
  id: string
  hostelId: string
  studentId: string
  studentName: string
  title: string
  description: string
  category: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
  createdAt: Date
  resolvedAt?: Date
}

// Visitor Types
export interface Visitor {
  id: string
  hostelId: string
  name: string
  relationship: string
  studentId: string
  checkInTime: Date
  checkOutTime?: Date
  purpose: string
}

// Election Types
export interface Candidate {
  id: string
  hostelId: string
  userId: string
  name: string
  votes: number
  isWinner: boolean
}

export interface Election {
  id: string
  hostelId: string
  status: 'ONGOING' | 'COMPLETED'
  startDate: Date
  endDate: Date
  candidates: Candidate[]
  winner?: string
}

export interface Vote {
  id: string
  electionId: string
  studentId: string
  candidateId: string
  createdAt: Date
}

// Announcement Types
export interface Announcement {
  id: string
  hostelId: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  isPinned: boolean
  createdAt: Date
  createdBy: string
}

// Bus Pass Types
export interface BusPass {
  id: string
  hostelId: string
  studentId: string
  studentName: string
  balance: number
  eligibilityStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE'
  leaveCount: number
  lastUpdated: Date
}

// AI Types
export interface FinancialStatement {
  openingBalance: number
  closingBalance: number
  totalCollection: number
  totalExpenses: number
  categoryBreakdown: Record<ExpenseCategory, number>
  observations: string[]
  recommendations: string[]
  healthScore: number
}

export interface HealthScore {
  attendance: number
  fundCollection: number
  complaintResolution: number
  expenseManagement: number
  participation: number
  overall: number
  suggestions: string[]
}

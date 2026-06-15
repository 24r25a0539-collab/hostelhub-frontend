export const dashboardStats = {
  totalStudents: 42,
  currentFund: 125500,
  presentToday: 38,
  pendingDuties: 3,
}

export const recentActivity = [
  {
    id: '1',
    title: 'Fund Contribution',
    description: 'Monthly hostel fund contribution received',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'fund' as const,
    amount: '+₹15,000',
  },
  {
    id: '2',
    title: 'Groceries Expense',
    description: 'Weekly grocery purchase for common kitchen',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: 'expense' as const,
    amount: '-₹8,500',
  },
  {
    id: '3',
    title: 'Attendance Marked',
    description: 'Daily attendance recorded for all students',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'attendance' as const,
    amount: '38/42',
  },
  {
    id: '4',
    title: 'Maintenance Charges',
    description: 'Monthly maintenance and utilities paid',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    type: 'expense' as const,
    amount: '-₹5,000',
  },
  {
    id: '5',
    title: 'New Student Registered',
    description: 'New admission processed for Fall semester',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    type: 'attendance' as const,
    amount: '+1',
  },
]

export const announcements = [
  {
    id: '1',
    title: 'Hostel Meeting on Sunday',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'high' as const,
  },
  {
    id: '2',
    title: 'Electricity Maintenance on Friday',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: 'high' as const,
  },
  {
    id: '3',
    title: 'Fund Audit Scheduled',
    date: new Date(Date.now()),
    priority: 'normal' as const,
  },
  {
    id: '4',
    title: 'Sports Day - Next Week',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'normal' as const,
  },
]

export const upcomingDuties = [
  {
    id: '1',
    name: 'Kitchen Duty',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    assignee: 'Rahul Kumar',
    status: 'assigned' as const,
  },
  {
    id: '2',
    name: 'Common Area Cleaning',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    assignee: 'Priya Sharma',
    status: 'assigned' as const,
  },
  {
    id: '3',
    name: 'Laundry Room Maintenance',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    assignee: 'Amit Patel',
    status: 'pending' as const,
  },
  {
    id: '4',
    name: 'Inventory Check',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    assignee: 'Neha Singh',
    status: 'assigned' as const,
  },
]

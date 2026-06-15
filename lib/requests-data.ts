export interface StudentRequest {
  id: string
  name: string
  email: string
  phone: string
  rollNumber: string
  department: string
  year: number
  roomPreference: string
  parentName: string
  parentPhone: string
  address: string
  requestDate: string
  status: 'pending' | 'approved' | 'rejected'
}

export const STUDENT_REQUESTS: StudentRequest[] = [
  {
    id: 'req1',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    phone: '9876543210',
    rollNumber: 'BCS-2024-001',
    department: 'Computer Science',
    year: 1,
    roomPreference: 'Single',
    parentName: 'Rajesh Kumar',
    parentPhone: '9876543200',
    address: '123 Main Street, Delhi',
    requestDate: '2026-06-10',
    status: 'pending',
  },
  {
    id: 'req2',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '8765432109',
    rollNumber: 'BCS-2024-002',
    department: 'Computer Science',
    year: 1,
    roomPreference: 'Double',
    parentName: 'Rajesh Singh',
    parentPhone: '8765432100',
    address: '456 Oak Avenue, Mumbai',
    requestDate: '2026-06-11',
    status: 'pending',
  },
  {
    id: 'req3',
    name: 'Arjun Patel',
    email: 'arjun.patel@example.com',
    phone: '7654321098',
    rollNumber: 'BE-2024-003',
    department: 'Engineering',
    year: 1,
    roomPreference: 'Single',
    parentName: 'Vikram Patel',
    parentPhone: '7654321088',
    address: '789 Pine Street, Bangalore',
    requestDate: '2026-06-12',
    status: 'pending',
  },
]

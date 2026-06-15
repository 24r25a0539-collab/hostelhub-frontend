export interface HostelStudent {
  id: string
  name: string
  room: string
  email: string
  phone: string
  rollNumber: string
  course: string
  joinDate: Date
  attendance: number
  busPassBalance: number
  busPassEligible: boolean
  backlogCount: number
}

export const HOSTEL_STUDENTS: HostelStudent[] = [
  {
    id: '1',
    name: 'Arjun Reddy',
    room: '203',
    email: 'arjun@example.com',
    phone: '9876543210',
    rollNumber: '2021001',
    course: 'BTech - CSE',
    joinDate: new Date(2021, 6, 15),
    attendance: 92,
    busPassBalance: 540,
    busPassEligible: true,
    backlogCount: 0,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    room: '204',
    email: 'priya@example.com',
    phone: '9876543211',
    rollNumber: '2021002',
    course: 'BTech - ECE',
    joinDate: new Date(2021, 6, 20),
    attendance: 88,
    busPassBalance: 450,
    busPassEligible: true,
    backlogCount: 2,
  },
  {
    id: '3',
    name: 'Vikram Iyer',
    room: '205',
    email: 'vikram@example.com',
    phone: '9876543212',
    rollNumber: '2021003',
    course: 'BTech - ME',
    joinDate: new Date(2021, 7, 5),
    attendance: 85,
    busPassBalance: 320,
    busPassEligible: true,
    backlogCount: 1,
  },
  {
    id: '4',
    name: 'Rahul Kumar',
    room: '206',
    email: 'rahul@example.com',
    phone: '9876543213',
    rollNumber: '2021004',
    course: 'BTech - ECE',
    joinDate: new Date(2021, 7, 10),
    attendance: 95,
    busPassBalance: 630,
    busPassEligible: true,
    backlogCount: 0,
  },
  {
    id: '5',
    name: 'Sneha Patel',
    room: '207',
    email: 'sneha@example.com',
    phone: '9876543214',
    rollNumber: '2021005',
    course: 'BTech - IT',
    joinDate: new Date(2021, 7, 15),
    attendance: 90,
    busPassBalance: 200,
    busPassEligible: true,
    backlogCount: 3,
  },
  {
    id: '6',
    name: 'Kiran Desai',
    room: '208',
    email: 'kiran@example.com',
    phone: '9876543215',
    rollNumber: '2021006',
    course: 'BTech - CSE',
    joinDate: new Date(2021, 8, 1),
    attendance: 87,
    busPassBalance: 420,
    busPassEligible: true,
    backlogCount: 0,
  },
]

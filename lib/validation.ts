import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Add at least one uppercase letter')
  .regex(/[a-z]/, 'Add at least one lowercase letter')
  .regex(/[0-9]/, 'Add at least one number')

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[+]?[\d\s-]{10,15}$/, 'Enter a valid phone number')

// ---------- Auth ----------
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})
export type LoginValues = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(3, 'Name must be at least 3 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type SignupValues = z.infer<typeof signupSchema>

// ---------- Create Hostel ----------
export const createHostelSchema = z.object({
  name: z.string().min(1, 'Hostel name is required').min(3, 'Name is too short'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z
    .string()
    .min(1, 'Pincode is required')
    .regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  description: z.string().max(300, 'Keep the description under 300 characters').optional().or(z.literal('')),
  capacity: z
    .number({ message: 'Capacity is required' })
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(2000, 'Capacity looks too large'),
  type: z.enum(['BOYS', 'GIRLS', 'CO_LIVING'], {
    message: 'Select a hostel type',
  }),
})
export type CreateHostelValues = z.infer<typeof createHostelSchema>

// ---------- Join Hostel ----------
export const joinHostelSchema = z.object({
  hostelCode: z
    .string()
    .min(1, 'Hostel code is required')
    .regex(/^[A-Z]{2,4}\d{4}$/, 'Enter a valid hostel code (e.g. MDK2026)'),
  roomNumber: z.string().min(1, 'Room number is required'),
  preferredName: z.string().min(1, 'Preferred name is required'),
  intro: z
    .string()
    .min(10, 'Tell us a little more (min 10 characters)')
    .max(300, 'Keep your introduction under 300 characters'),
})
export type JoinHostelValues = z.infer<typeof joinHostelSchema>

// ---------- Profile Setup ----------
export const profileSchema = z.object({
  photo: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  emergencyContact: phoneSchema,
  collegeName: z.string().min(1, 'College name is required'),
  branch: z.string().min(1, 'Branch is required'),
  year: z.string().min(1, 'Year is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  bio: z.string().max(300, 'Keep your bio under 300 characters').optional().or(z.literal('')),
})
export type ProfileValues = z.infer<typeof profileSchema>

// ---------- Approve / Reject ----------
export const approveSchema = z.object({
  assignedRoom: z.string().min(1, 'Assign a room number'),
  notes: z.string().max(300).optional().or(z.literal('')),
})
export type ApproveValues = z.infer<typeof approveSchema>

export const rejectSchema = z.object({
  reason: z.string().min(5, 'Please provide a reason (min 5 characters)'),
})
export type RejectValues = z.infer<typeof rejectSchema>

// ---------- Password strength helper ----------
export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { score, label: 'Weak', color: '#EF4444' }
  if (score === 3) return { score, label: 'Fair', color: '#F59E0B' }
  if (score === 4) return { score, label: 'Good', color: '#3B82F6' }
  return { score, label: 'Strong', color: '#10B981' }
}

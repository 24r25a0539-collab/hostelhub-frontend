'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useFund } from '@/lib/fund-context'
import { useNotifications } from '@/lib/notifications-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { StatsCard } from '@/components/cards/StatsCard'
import {
  Users,
  Banknote,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  ClipboardList,
} from 'lucide-react'
import {
  dashboardStats,
  recentActivity,
  announcements,
  upcomingDuties,
} from '@/lib/mock-data'

export default function Dashboard() {
  const router = useRouter()
  const { currentUser, currentRole, isLoading } = useAuth()
  const { fundData } = useFund()
  const { notifications } = useNotifications()
  
  const pendingRequests = notifications.filter((n) => n.type === 'student_request')
  const pendingRequestsCount = pendingRequests.length

  useEffect(() => {
    if (isLoading) return
    if (!currentUser) {
      router.push('/login')
      return
    }
    // Gate users who have not finished onboarding
    if (!currentUser.hostelId && currentUser.joinStatus === 'none') {
      router.push('/onboarding')
      return
    }
    if (currentUser.joinStatus === 'pending') {
      router.push('/onboarding/pending')
      return
    }
    if (currentUser.joinStatus === 'approved' && !currentUser.profileComplete) {
      router.push('/profile/setup')
    }
  }, [currentUser, isLoading, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return null
  }

  if (currentRole === 'STUDENT') {
    const studentStats = [
      {
        title: 'Attendance',
        value: '92%',
        icon: CheckCircle,
        trend: { direction: 'up' as const, percentage: 5 },
      },
      {
        title: 'Bus Pass Balance',
        value: '₹5,000',
        icon: Banknote,
        trend: { direction: 'up' as const, percentage: 0 },
      },
      {
        title: 'Hostel Fund',
        value: '₹15,000',
        icon: TrendingUp,
        trend: { direction: 'up' as const, percentage: 8 },
      },
      {
        title: 'Next Duty',
        value: 'June 20',
        icon: Calendar,
        trend: { direction: 'down' as const, percentage: 0 },
      },
    ]

    return (
      <PageContainer title="My Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {studentStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-[#E5E7EB] dark:border-[#374151] last:border-b-0">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'expense' ? 'bg-red-500' :
                    activity.type === 'fund' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#111827] dark:text-white truncate">{activity.title}</p>
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{activity.description}</p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#6B7280] mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-[#111827] dark:text-white">{activity.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="pb-4 border-b border-[#E5E7EB] dark:border-[#374151] last:border-b-0">
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                      announcement.priority === 'high'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-[#111827] dark:text-white line-clamp-2">{announcement.title}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                    {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    )
  }

  const maintainerStats = [
    {
      title: 'Total Students',
      value: dashboardStats.totalStudents,
      icon: Users,
      trend: { direction: 'up' as const, percentage: 5 },
    },
    {
      title: 'Current Fund',
      value: `₹${fundData.currentBalance.toLocaleString()}`,
      icon: Banknote,
      trend: { direction: 'up' as const, percentage: 8 },
    },
    {
      title: 'Present Today',
      value: dashboardStats.presentToday,
      icon: CheckCircle,
      trend: { direction: 'up' as const, percentage: 2 },
    },
    {
      title: 'Expenses This Month',
      value: `₹${fundData.expensesTotal.toLocaleString()}`,
      icon: AlertCircle,
      trend: { direction: 'down' as const, percentage: 3 },
    },
  ]

  return (
    <PageContainer title="Maintainer Dashboard">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {maintainerStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Pending Requests Card */}
      {pendingRequestsCount > 0 && (
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151] mb-10 cursor-pointer hover:shadow-md hover:border-[#F7B538] dark:hover:border-[#F7B538] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ClipboardList className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Pending Requests</p>
                <p className="text-2xl font-bold text-[#111827] dark:text-white">{pendingRequestsCount}</p>
              </div>
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">
              View All →
            </span>
          </div>
        </div>
      )}

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-[#E5E7EB] dark:border-[#374151] last:border-b-0">
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'expense' ? 'bg-red-500' :
                  activity.type === 'fund' ? 'bg-green-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#111827] dark:text-white truncate">{activity.title}</p>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{activity.description}</p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#6B7280] mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-[#111827] dark:text-white">{activity.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Announcements</h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="pb-4 border-b border-[#E5E7EB] dark:border-[#374151] last:border-b-0">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                    announcement.priority === 'high'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                  </span>
                </div>
                <p className="font-semibold text-sm text-[#111827] dark:text-white line-clamp-2">{announcement.title}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Duties */}
      <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-[#F7B538]" />
          <h2 className="text-xl font-bold text-[#111827] dark:text-white">Upcoming Duties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white text-sm">Duty</th>
                <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white text-sm">Assigned To</th>
                <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingDuties.map((duty) => (
                <tr key={duty.id} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-all">
                  <td className="py-3 px-4 text-sm text-[#111827] dark:text-white">{duty.name}</td>
                  <td className="py-3 px-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    {new Date(duty.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#111827] dark:text-white">{duty.assignee}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      duty.status === 'assigned'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {duty.status.charAt(0).toUpperCase() + duty.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}

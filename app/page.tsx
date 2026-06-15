'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { StatsCard } from '@/components/cards/StatsCard'
import {
  Users,
  Banknote,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import {
  dashboardStats,
  recentActivity,
  announcements,
  upcomingDuties,
} from '@/lib/mock-data'

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Students',
      value: dashboardStats.totalStudents,
      icon: Users,
      trend: { direction: 'up' as const, percentage: 5 },
    },
    {
      title: 'Current Fund',
      value: `₹${dashboardStats.currentFund.toLocaleString()}`,
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
      title: 'Pending Duties',
      value: dashboardStats.pendingDuties,
      icon: AlertCircle,
      trend: { direction: 'down' as const, percentage: 3 },
    },
  ]

  return (
    <PageContainer title="Dashboard">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#111827] mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-[#E5E7EB] last:border-b-0">
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'expense' ? 'bg-red-500' :
                  activity.type === 'fund' ? 'bg-green-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#111827] truncate">{activity.title}</p>
                  <p className="text-sm text-[#6B7280]">{activity.description}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-[#111827]">{activity.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#111827] mb-6">Announcements</h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="pb-4 border-b border-[#E5E7EB] last:border-b-0">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                    announcement.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                  </span>
                </div>
                <p className="font-semibold text-sm text-[#111827] line-clamp-2">{announcement.title}</p>
                <p className="text-xs text-[#6B7280] mt-1">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Duties */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-[#F7B538]" />
          <h2 className="text-xl font-bold text-[#111827]">Upcoming Duties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-3 px-4 font-semibold text-[#111827] text-sm">Duty</th>
                <th className="text-left py-3 px-4 font-semibold text-[#111827] text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-[#111827] text-sm">Assigned To</th>
                <th className="text-left py-3 px-4 font-semibold text-[#111827] text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingDuties.map((duty) => (
                <tr key={duty.id} className="border-b border-[#E5E7EB] hover:bg-[#F5F7FA] transition-all">
                  <td className="py-3 px-4 text-sm text-[#111827]">{duty.name}</td>
                  <td className="py-3 px-4 text-sm text-[#6B7280]">
                    {new Date(duty.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#111827]">{duty.assignee}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      duty.status === 'assigned'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
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

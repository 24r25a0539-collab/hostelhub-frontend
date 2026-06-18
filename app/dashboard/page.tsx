'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Settings,
  User,
  Menu,
  X,
} from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function DashboardPage() {
  const router = useRouter()
  const { user, hostel, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#111827]">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    )
  }

  // Mock data
  const stats = [
    { label: 'Total Students', value: '48', change: '+5%', trend: 'up' },
    { label: 'Monthly Fund', value: '₹24,500', change: '+12%', trend: 'up' },
    { label: 'Present Today', value: '42', change: '-3%', trend: 'down' },
    { label: 'Pending Complaints', value: '3', change: '+1', trend: 'down' },
  ]

  const chartData = [
    { name: 'Jan', expenses: 4500, revenue: 5200 },
    { name: 'Feb', expenses: 3200, revenue: 5100 },
    { name: 'Mar', expenses: 5800, revenue: 5900 },
    { name: 'Apr', expenses: 4100, revenue: 5300 },
    { name: 'May', expenses: 5200, revenue: 5400 },
    { name: 'Jun', expenses: 6100, revenue: 5900 },
  ]

  const expensePie = [
    { name: 'Food', value: 35 },
    { name: 'Utilities', value: 25 },
    { name: 'Internet', value: 15 },
    { name: 'Maintenance', value: 20 },
    { name: 'Other', value: 5 },
  ]

  const COLORS = ['#F7B538', '#1F3A93', '#10B981', '#F87171', '#8B5CF6']

  const recentActivities = [
    { id: 1, type: 'payment', user: 'Rahul Kumar', action: 'Submitted Fund Contribution', amount: '₹500', time: '2 hours ago' },
    { id: 2, type: 'complaint', user: 'Priya Sharma', action: 'Raised Complaint', amount: 'WiFi Issue', time: '4 hours ago' },
    { id: 3, type: 'expense', user: 'Admin', action: 'Recorded Expense', amount: '₹1,200', time: '1 day ago' },
    { id: 4, type: 'attendance', user: 'System', action: 'Marked Attendance', amount: '47/50', time: '1 day ago' },
  ]

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊', disabled: false },
    { label: 'Students', href: '/students', icon: '👥', disabled: user.role !== 'MAINTAINER' },
    { label: 'Attendance', href: '/attendance', icon: '✓', disabled: false },
    { label: 'Cooking Duties', href: '/cooking-duties', icon: '🍳', disabled: false },
    { label: 'Fund Management', href: '/fund-management', icon: '💰', disabled: user.role !== 'MAINTAINER' },
    { label: 'Expenses', href: '/expenses', icon: '💸', disabled: user.role !== 'MAINTAINER' },
    { label: 'Bus Pass', href: '/bus-pass', icon: '🚌', disabled: false },
    { label: 'Complaints', href: '/complaints', icon: '⚠️', disabled: false },
    { label: 'Visitors', href: '/visitors', icon: '🚪', disabled: user.role !== 'MAINTAINER' },
    { label: 'Announcements', href: '/announcements', icon: '📢', disabled: user.role !== 'MAINTAINER' },
    { label: 'Elections', href: '/elections', icon: '🗳️', disabled: false },
    { label: 'Reports', href: '/reports', icon: '📈', disabled: user.role !== 'MAINTAINER' },
  ]

  if (user.role === 'STUDENT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] dark:from-[#111827] dark:to-[#1F2937] flex flex-col lg:flex-row">
        {/* Sidebar - Student View */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-[#1F2937] border-r border-[#E5E7EB] dark:border-[#374151] transition-all duration-300 overflow-hidden`}>
          <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151]">
            <h1 className="text-xl font-bold text-[#111827] dark:text-white">HostelHub</h1>
          </div>
          <nav className="p-4 space-y-2">
            {sidebarItems.filter(item => !item.disabled).map((item) => (
              <Link key={item.href} href={item.href} className="block px-4 py-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#374151] text-[#111827] dark:text-white transition-all">
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#374151]">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <div>
                  <h2 className="text-xl font-bold text-[#111827] dark:text-white">Dashboard</h2>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Welcome, {user.name}</p>
                </div>
              </div>

              {/* Profile */}
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
                  <div className="w-8 h-8 rounded-full bg-[#F7B538] flex items-center justify-center text-[#1F2937] font-bold">
                    {user.name[0]}
                  </div>
                  <span className="text-sm">{user.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1F2937] rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#374151]">
                    <Link href="/profile" className="block px-4 py-3 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] text-[#111827] dark:text-white border-b border-[#E5E7EB] dark:border-[#374151]">
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-3 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] text-[#111827] dark:text-white border-b border-[#E5E7EB] dark:border-[#374151]">
                      Settings
                    </Link>
                    <button onClick={() => { logout(); router.push('/signin'); }} className="w-full text-left px-4 py-3 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] text-red-600">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-[#111827] dark:text-white">{stat.value}</h3>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
                <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#111827]">
                      <div className="w-10 h-10 rounded-full bg-[#F5F7FA] dark:bg-[#374151] flex items-center justify-center flex-shrink-0">
                        {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-[#10B981]" />}
                        {activity.type === 'complaint' && <AlertCircle className="w-5 h-5 text-[#F87171]" />}
                        {activity.type === 'expense' && <TrendingUp className="w-5 h-5 text-[#F7B538]" />}
                        {activity.type === 'attendance' && <Users className="w-5 h-5 text-[#1F3A93]" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111827] dark:text-white">{activity.user}</p>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{activity.action}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#111827] dark:text-white">{activity.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
                <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/attendance" className="block w-full px-4 py-2 bg-[#1F3A93] hover:bg-[#162952] text-white rounded-lg text-sm font-medium transition-all">
                    Mark Attendance
                  </Link>
                  <Link href="/cooking-duties" className="block w-full px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] rounded-lg text-sm font-medium transition-all">
                    View Duties
                  </Link>
                  <Link href="/fund-management" className="block w-full px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm font-medium transition-all">
                    Pay Fund
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Maintainer Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] dark:from-[#111827] dark:to-[#1F2937] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-[#1F2937] border-r border-[#E5E7EB] dark:border-[#374151] transition-all duration-300 overflow-hidden sticky top-0 h-screen`}>
        <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151]">
          <h1 className="text-xl font-bold text-[#111827] dark:text-white">HostelHub</h1>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-all ${
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#F5F7FA] dark:hover:bg-[#374151]'
              } text-[#111827] dark:text-white`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#374151]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#111827] dark:text-white">Dashboard</h2>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{hostel?.name}</p>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
                <div className="w-8 h-8 rounded-full bg-[#F7B538] flex items-center justify-center text-[#1F2937] font-bold text-sm">
                  {user.name[0]}
                </div>
                <span className="text-sm text-[#111827] dark:text-white">{user.name}</span>
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1F2937] rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#374151]">
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-3 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] border-b border-[#E5E7EB] dark:border-[#374151] text-[#111827] dark:text-white">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] border-b border-[#E5E7EB] dark:border-[#374151] text-[#111827] dark:text-white">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button onClick={() => { logout(); router.push('/signin'); }} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151] hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-[#111827] dark:text-white">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
                <p className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change} from last month
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4">Revenue vs Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#FFF' }} />
                  <Bar dataKey="revenue" fill="#1F3A93" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#F7B538" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expensePie} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {expensePie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#F7B538]" />
                Recent Activities
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#111827] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#F5F7FA] dark:bg-[#374151] flex items-center justify-center flex-shrink-0">
                      {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-[#10B981]" />}
                      {activity.type === 'complaint' && <AlertCircle className="w-5 h-5 text-[#F87171]" />}
                      {activity.type === 'expense' && <TrendingUp className="w-5 h-5 text-[#F7B538]" />}
                      {activity.type === 'attendance' && <Users className="w-5 h-5 text-[#1F3A93]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111827] dark:text-white">{activity.user}</p>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{activity.action}</p>
                      <p className="text-xs text-[#9CA3AF] dark:text-[#6B7280] mt-1">{activity.time}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-[#111827] dark:text-white">{activity.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/attendance" className="block w-full px-4 py-3 bg-[#1F3A93] hover:bg-[#162952] text-white rounded-lg text-sm font-medium transition-all text-center">
                  Mark Attendance
                </Link>
                <Link href="/expenses" className="block w-full px-4 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] rounded-lg text-sm font-medium transition-all text-center">
                  Add Expense
                </Link>
                <Link href="/fund-management" className="block w-full px-4 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm font-medium transition-all text-center">
                  Manage Funds
                </Link>
                <Link href="/students" className="block w-full px-4 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-sm font-medium transition-all text-center">
                  View Students
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

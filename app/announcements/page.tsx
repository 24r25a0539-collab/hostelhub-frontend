'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { Trash2, Edit2, Plus, X } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  priority: 'high' | 'normal'
  date: Date
  author: string
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Hostel Meeting on Sunday',
    content: 'All residents are requested to attend the monthly hostel meeting on Sunday at 6 PM in the common hall.',
    priority: 'high',
    date: new Date(2025, 5, 15),
    author: 'John Doe',
  },
  {
    id: '2',
    title: 'Electricity Maintenance on Friday',
    content: 'Electrical maintenance work will be conducted on Friday. Power may be interrupted between 2-4 PM.',
    priority: 'high',
    date: new Date(2025, 5, 14),
    author: 'John Doe',
  },
  {
    id: '3',
    title: 'Fund Audit Scheduled',
    content: 'The monthly fund audit will be conducted on the 20th. All expense receipts should be submitted.',
    priority: 'normal',
    date: new Date(2025, 5, 13),
    author: 'John Doe',
  },
]

export default function AnnouncementsPage() {
  const { currentRole } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'normal' as const })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.content) {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        date: new Date(),
        author: 'John Doe',
      }
      setAnnouncements([newAnnouncement, ...announcements])
      setFormData({ title: '', content: '', priority: 'normal' })
      setShowForm(false)
    }
  }

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id))
  }

  return (
    <PageContainer title="Announcements">
      <div className="max-w-4xl">
        {currentRole === 'MAINTAINER' && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Create Announcement
            </button>
          </div>
        )}

        {showForm && currentRole === 'MAINTAINER' && (
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151] mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">Create New Announcement</h3>
              <button onClick={() => setShowForm(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Announcement title"
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Announcement content"
                  rows={4}
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'normal' })}
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-[#E5E7EB] dark:bg-[#374151] text-[#111827] dark:text-white font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {announcements.map(announcement => (
            <div key={announcement.id} className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      announcement.priority === 'high'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] dark:text-white">{announcement.title}</h3>
                </div>
                {currentRole === 'MAINTAINER' && (
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg transition-all">
                      <Edit2 size={18} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg transition-all"
                    >
                      <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-3">{announcement.content}</p>

              <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                <span>{announcement.author}</span>
                <span>{announcement.date.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

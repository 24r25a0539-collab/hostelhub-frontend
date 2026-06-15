'use client'

import { PageContainer } from '@/components/layout/PageContainer'

export default function AttendancePage() {
  return (
    <PageContainer
      title="Attendance Management"
      breadcrumbs={[{ label: 'Attendance' }]}
    >
      <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center">
        <p className="text-[#6B7280]">Attendance management module coming soon...</p>
      </div>
    </PageContainer>
  )
}

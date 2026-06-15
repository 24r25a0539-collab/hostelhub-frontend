'use client'

import { PageContainer } from '@/components/layout/PageContainer'

export default function AnnouncementsPage() {
  return (
    <PageContainer
      title="Announcements"
      breadcrumbs={[{ label: 'Announcements' }]}
    >
      <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center">
        <p className="text-[#6B7280]">Announcements module coming soon...</p>
      </div>
    </PageContainer>
  )
}

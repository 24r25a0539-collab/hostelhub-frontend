'use client'

import { PageContainer } from '@/components/layout/PageContainer'

export default function VisitorsPage() {
  return (
    <PageContainer
      title="Visitors"
      breadcrumbs={[{ label: 'Visitors' }]}
    >
      <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center">
        <p className="text-[#6B7280]">Visitors module coming soon...</p>
      </div>
    </PageContainer>
  )
}

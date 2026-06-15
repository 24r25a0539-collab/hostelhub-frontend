'use client'

import { PageContainer } from '@/components/layout/PageContainer'

export default function ElectionsPage() {
  return (
    <PageContainer
      title="Elections"
      breadcrumbs={[{ label: 'Elections' }]}
    >
      <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center">
        <p className="text-[#6B7280]">Elections module coming soon...</p>
      </div>
    </PageContainer>
  )
}

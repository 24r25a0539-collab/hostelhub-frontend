'use client'

import { PageContainer } from '@/components/layout/PageContainer'

export default function CookingDutiesPage() {
  return (
    <PageContainer
      title="Cooking Duties"
      breadcrumbs={[{ label: 'Cooking Duties' }]}
    >
      <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center">
        <p className="text-[#6B7280]">Cooking duties module coming soon...</p>
      </div>
    </PageContainer>
  )
}

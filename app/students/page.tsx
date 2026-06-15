'use client'

import { PageContainer } from '@/components/layout/PageContainer'

export default function StudentsPage() {
  return (
    <PageContainer
      title="Students"
      breadcrumbs={[{ label: 'Students' }]}
    >
      <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center">
        <p className="text-[#6B7280]">Student management module coming soon...</p>
      </div>
    </PageContainer>
  )
}

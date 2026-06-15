'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { RoleGuard } from '@/components/auth/RoleGuard'

export default function ReportsPage() {
  return (
    <RoleGuard requiredRole="MAINTAINER">
      <PageContainer
        title="Reports & Analytics"
        breadcrumbs={[{ label: 'Reports' }]}
      >
        <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">Reports module coming soon...</p>
        </div>
      </PageContainer>
    </RoleGuard>
  )
}

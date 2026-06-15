'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { RoleGuard } from '@/components/auth/RoleGuard'

export default function FundManagementPage() {
  return (
    <RoleGuard requiredRole="MAINTAINER">
      <PageContainer
        title="Fund Management"
        breadcrumbs={[{ label: 'Fund Management' }]}
      >
        <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">Fund management module coming soon...</p>
        </div>
      </PageContainer>
    </RoleGuard>
  )
}

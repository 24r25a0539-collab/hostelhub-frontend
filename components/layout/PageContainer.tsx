'use client'

import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

export interface PageContainerProps {
  title: string
  breadcrumbs?: BreadcrumbItem[]
  children: React.ReactNode
}

export function PageContainer({
  title,
  breadcrumbs = [],
  children,
}: PageContainerProps) {
  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}

            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#111827]">{title}</h1>
            </div>

            {/* Page children */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

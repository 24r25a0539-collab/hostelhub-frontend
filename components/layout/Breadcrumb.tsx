'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link href="/" className="text-[#6B7280] hover:text-[#111827] transition-colors">
        Home
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={16} className="text-[#D1D5DB]" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#111827] font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

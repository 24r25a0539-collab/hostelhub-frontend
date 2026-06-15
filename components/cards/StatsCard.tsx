'use client'

import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    direction: 'up' | 'down'
    percentage: number
  }
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-[#F5F7FA] rounded-full flex items-center justify-center">
          <Icon size={24} className="text-[#F7B538]" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              trend.direction === 'up'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {trend.percentage}%
          </div>
        )}
      </div>

      <h3 className="text-[#6B7280] text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-[#111827]">{value}</p>
    </div>
  )
}

import Link from 'next/link'
import { Lock, ArrowRight } from 'lucide-react'

export default function NotAuthorized() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] dark:bg-[#111827] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Lock size={40} className="text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#111827] dark:text-white mb-2">403</h1>
        <p className="text-xl font-semibold text-[#111827] dark:text-white mb-2">
          Forbidden
        </p>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8">
          You are not the current maintainer. Only the elected maintainer can access management features.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all dark:bg-[#F7B538] dark:hover:bg-[#FCD34D] dark:text-[#1F2937]"
        >
          Return To Dashboard
          <ArrowRight size={20} />
        </Link>
      </div>
    </main>
  )
}

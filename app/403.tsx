import Link from 'next/link'
import { Lock, ArrowRight } from 'lucide-react'

export default function NotAuthorized() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Lock size={40} className="text-red-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#111827] mb-2">403</h1>
        <p className="text-xl font-semibold text-[#111827] mb-2">
          Access Denied
        </p>
        <p className="text-[#6B7280] mb-8">
          You don&apos;t have permission to access this resource. Please contact your administrator if you believe this is a mistake.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#F7B538] text-[#1F2937] font-semibold rounded-lg hover:bg-[#F59E0B] transition-all"
        >
          Back to Dashboard
          <ArrowRight size={20} />
        </Link>
      </div>
    </main>
  )
}

'use client'

import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Crown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'

interface Candidate {
  id: string
  name: string
  room: number
  major: string
  voteCount: number
}

const mockCandidates: Candidate[] = [
  { id: '1', name: 'Arjun Patel', room: 401, major: 'Computer Science', voteCount: 45 },
  { id: '2', name: 'Priya Sharma', room: 302, major: 'Engineering', voteCount: 38 },
  { id: '3', name: 'Rohan Singh', room: 205, major: 'Business', voteCount: 32 },
  { id: '4', name: 'Sneha Gupta', room: 403, major: 'Mathematics', voteCount: 28 },
]

export default function ElectionsPage() {
  const { currentUser, currentRole } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [votes, setVotes] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState('')

  const handleVote = (candidateId: string) => {
    if (!currentUser || currentRole !== 'STUDENT') return

    // Check if candidate is self
    if (candidateId === currentUser.id) {
      setToast('You cannot vote for yourself.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    // Check if already voted
    if (votes.has(currentUser.id)) {
      setToast('You have already voted.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    // Cast vote
    setVotes(new Set([...votes, currentUser.id]))
    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
    ))
    setToast('Your vote has been recorded successfully!')
    setTimeout(() => setToast(''), 3000)
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0)
  const winner = candidates.reduce((prev, current) => 
    prev.voteCount > current.voteCount ? prev : current
  )
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount)

  const getVotePercentage = (voteCount: number) => {
    return totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100
  }

  return (
    <ProtectedRoute>
      <PageContainer title="Elections">
        <div className="max-w-6xl mx-auto">
          {winner && (
            <div className="mb-10 bg-gradient-to-r from-[#F7B538] to-[#F59E0B] rounded-3xl p-8 shadow-lg border border-[#FCD34D]">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Crown size={32} className="text-[#1F2937]" />
                <h2 className="text-3xl font-bold text-[#1F2937]">Current Elected Maintainer</h2>
              </div>
              <p className="text-center text-xl text-[#1F2937] font-semibold">{winner.name} (Room {winner.room})</p>
              <p className="text-center text-sm text-[#1F2937] mt-2">{winner.voteCount} votes</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`rounded-3xl p-6 shadow-sm border transition-all ${
                  winner.id === candidate.id
                    ? 'bg-gradient-to-b from-[#FEF3C7] to-[#FCD34D] border-[#FCD34D]'
                    : 'bg-white dark:bg-[#1F2937] border-[#E5E7EB] dark:border-[#374151]'
                }`}
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F7B538] to-[#F59E0B] flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">{candidate.name.charAt(0)}</span>
                  </div>
                  <h3 className={`font-bold text-lg ${winner.id === candidate.id ? 'text-[#1F2937]' : 'text-[#111827] dark:text-white'}`}>
                    {candidate.name}
                  </h3>
                  <p className={`text-sm ${winner.id === candidate.id ? 'text-[#1F2937]' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                    Room {candidate.room}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-semibold ${winner.id === candidate.id ? 'text-[#1F2937]' : 'text-[#111827] dark:text-white'}`}>
                        Votes: {candidate.voteCount}
                      </span>
                      {winner.id === candidate.id && <Crown size={16} className="text-[#1F2937]" />}
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-[#374151] rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          winner.id === candidate.id ? 'bg-[#F59E0B]' : 'bg-[#F7B538]'
                        }`}
                        style={{
                          width: `${getVotePercentage(candidate.voteCount)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className={`text-sm font-semibold ${winner.id === candidate.id ? 'text-[#1F2937]' : 'text-[#111827] dark:text-white'}`}>
                    {getVotePercentage(candidate.voteCount).toFixed(1)}%
                  </p>
                </div>

                {currentRole === 'STUDENT' && (
                  <button
                    onClick={() => handleVote(candidate.id)}
                    disabled={votes.has(currentUser?.id || '')}
                    className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      votes.has(currentUser?.id || '')
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937]'
                    }`}
                  >
                    <ThumbsUp size={16} />
                    {votes.has(currentUser?.id || '') ? 'Voted' : 'Vote'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Total Votes</p>
              <p className="text-3xl font-bold text-[#111827] dark:text-white">{totalVotes}</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Candidates</p>
              <p className="text-3xl font-bold text-[#111827] dark:text-white">{candidates.length}</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Participation</p>
              <p className="text-3xl font-bold text-[#111827] dark:text-white">{Math.round((votes.size / 42) * 100)}%</p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {toast}
          </div>
        )}
      </PageContainer>
    </ProtectedRoute>
  )
}

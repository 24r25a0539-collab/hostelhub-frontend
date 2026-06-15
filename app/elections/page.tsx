'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ThumbsUp, Crown } from 'lucide-react'
import { HOSTEL_STUDENTS } from '@/lib/students-data'

interface Candidate {
  id: string
  name: string
  room: string
  backlogCount: number
  voteCount: number
  isWinner: boolean
}

const mockCandidates: Candidate[] = HOSTEL_STUDENTS.map((s, idx) => ({
  id: s.id,
  name: s.name,
  room: s.room,
  backlogCount: s.backlogCount,
  voteCount: [25, 18, 12, 8, 5, 2][idx] || 0,
  isWinner: idx === 0,
}))

export default function ElectionsPage() {
  const { currentRole } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [userVote, setUserVote] = useState<string | null>(null)
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0)

  const handleVote = (candidateId: string) => {
    if (userVote || currentRole === 'MAINTAINER') return // Only students can vote, and once only
    setUserVote(candidateId)
    setCandidates(
      candidates.map(c => {
        if (c.id === candidateId) {
          return { ...c, voteCount: c.voteCount + 1 }
        }
        return c
      })
    )
  }

  const winner = candidates.find(c => c.isWinner)
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount)

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
                candidate.isWinner
                  ? 'bg-gradient-to-b from-[#FEF3C7] to-[#FCD34D] border-[#FCD34D]'
                  : 'bg-white dark:bg-[#1F2937] border-[#E5E7EB] dark:border-[#374151]'
              }`}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F7B538] to-[#F59E0B] flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">{candidate.name.charAt(0)}</span>
                </div>
                <h3 className={`font-bold text-lg ${candidate.isWinner ? 'text-[#1F2937]' : 'text-[#111827] dark:text-white'}`}>
                  {candidate.name}
                </h3>
                <p className={`text-sm ${candidate.isWinner ? 'text-[#1F2937]' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                  Room {candidate.room}
                </p>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-semibold ${candidate.isWinner ? 'text-[#1F2937]' : 'text-[#111827] dark:text-white'}`}>
                      Votes: {candidate.voteCount}
                    </span>
                    {candidate.isWinner && <Crown size={16} className="text-[#1F2937]" />}
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-[#374151] rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        candidate.isWinner ? 'bg-[#F59E0B]' : 'bg-[#F7B538]'
                      }`}
                      style={{ width: `${totalVotes ? (candidate.voteCount / totalVotes) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <p className={`text-sm font-semibold ${candidate.isWinner ? 'text-[#1F2937]' : 'text-[#111827] dark:text-white'}`}>
                  {totalVotes ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0}%
                </p>
              </div>

              {currentRole === 'STUDENT' && (
                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={userVote !== null || candidate.id === userVote}
                  className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    userVote === candidate.id
                      ? 'bg-green-600 text-white'
                      : userVote
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937]'
                  }`}
                >
                  <ThumbsUp size={16} />
                  {userVote === candidate.id ? 'Voted' : 'Vote'}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-4">Election Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Votes Cast</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-white">{totalVotes}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Candidates</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-white">{candidates.length}</p>
            </div>
          </div>
        </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}

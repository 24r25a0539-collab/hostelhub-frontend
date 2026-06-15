'use client'

import { useAuth } from '@/lib/auth-context'
import { useElections } from '@/lib/elections-context'
import { useNotifications } from '@/lib/notifications-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ThumbsUp, Crown, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function ElectionsPage() {
  const { currentUser, currentRole } = useAuth()
  const { electionData, castVote, hasVoted, getCurrentWinner, getVotePercentage } = useElections()
  const { addNotification } = useNotifications()
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
    if (hasVoted(currentUser.id)) {
      setToast('You have already voted.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    // Cast vote
    const success = castVote(currentUser.id, candidateId)
    if (success) {
      addNotification({
        type: 'election_started',
        title: 'Vote Recorded',
        message: `Your vote has been recorded successfully`,
        priority: 'normal',
      })
    }
  }

  const winner = getCurrentWinner()
  const sortedCandidates = [...electionData.candidates].sort(
    (a, b) => b.voteCount - a.voteCount,
  )

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
                        winner?.id === candidate.id ? 'bg-[#F59E0B]' : 'bg-[#F7B538]'
                      }`}
                      style={{
                        width: `${getVotePercentage(candidate.voteCount)}%`,
                      }}
                    />
                  </div>
                </div>

                <p className={`text-sm font-semibold ${winner?.id === candidate.id ? 'text-[#1F2937]' : 'text-[#111827] dark:text-white'}`}>
                  {getVotePercentage(candidate.voteCount).toFixed(1)}%
                </p>
              </div>

              {currentRole === 'STUDENT' && electionData.isActive && (
                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={hasVoted(currentUser?.id || '')}
                  className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    hasVoted(currentUser?.id || '')
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937]'
                  }`}
                >
                  <ThumbsUp size={16} />
                  {hasVoted(currentUser?.id || '') ? 'Voted' : 'Vote'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Election Status */}
        <div className="mt-10">
          {electionData.isActive ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-6 mb-10 flex items-start gap-4">
              <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Election is Currently Active
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Students can cast their vote now. Each student gets one vote.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-3xl p-6 mb-10 flex items-start gap-4">
              <AlertCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Election Ended
                </h3>
                <p className="text-sm text-green-800 dark:text-green-300">
                  {winner
                    ? `${winner.name} has been elected as the new maintainer.`
                    : 'No winner has been determined yet.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Election Details */}
        <div className="mt-10 bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">
            Election Details
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Votes Cast</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-white">
                {electionData.totalVotes}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Candidates</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-white">
                {electionData.candidates.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Participation</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-white">
                {Math.round((electionData.votedStudents.size / 42) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Election History */}
        {electionData.electionHistory.length > 0 && (
          <div className="mt-10 bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">
              Election History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                    <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">
                      Election
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">
                      Winner
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">
                      Votes
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">
                      Participation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {electionData.electionHistory.map((election) => (
                    <tr
                      key={election.id}
                      className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]"
                    >
                      <td className="py-3 px-4 font-semibold text-[#111827] dark:text-white">
                        {election.electionName}
                      </td>
                      <td className="py-3 px-4 text-[#6B7280] dark:text-[#9CA3AF]">
                        {new Date(election.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Crown size={16} className="text-[#F7B538]" />
                          <span className="font-semibold text-[#111827] dark:text-white">
                            {election.winner}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-[#111827] dark:text-white">
                        {election.votes}
                      </td>
                      <td className="py-3 px-4 text-center text-[#111827] dark:text-white">
                        {election.participation}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {toast}
          </div>
        )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

export interface Candidate {
  id: string
  name: string
  room: string
  backlogCount: number
  voteCount: number
}

export interface ElectionData {
  isActive: boolean
  candidates: Candidate[]
  winner: Candidate | null
  totalVotes: number
  votedStudents: Set<string>
  electionHistory: Array<{
    id: string
    electionName: string
    date: string
    winner: string
    votes: number
    participation: number
  }>
}

interface ElectionsContextType {
  electionData: ElectionData
  castVote: (studentId: string, candidateId: string) => boolean
  hasVoted: (studentId: string) => boolean
  getCurrentWinner: () => Candidate | null
  endElection: () => void
  startElection: () => void
  getVotePercentage: (voteCount: number) => number
}

const ElectionsContext = createContext<ElectionsContextType | undefined>(
  undefined,
)

// Mock candidates from students data
const getMockCandidates = (): Candidate[] => [
  {
    id: '1',
    name: 'Rahul Kumar',
    room: '201',
    backlogCount: 0,
    voteCount: 25,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    room: '302',
    backlogCount: 0,
    voteCount: 18,
  },
  {
    id: '3',
    name: 'Amit Patel',
    room: '103',
    backlogCount: 1,
    voteCount: 12,
  },
  {
    id: '4',
    name: 'Anaya Gupta',
    room: '404',
    backlogCount: 0,
    voteCount: 8,
  },
  {
    id: '5',
    name: 'Vikram Singh',
    room: '205',
    backlogCount: 2,
    voteCount: 5,
  },
  {
    id: '6',
    name: 'Isha Reddy',
    room: '306',
    backlogCount: 0,
    voteCount: 2,
  },
]

const INITIAL_ELECTION_DATA: ElectionData = {
  isActive: true,
  candidates: getMockCandidates(),
  winner: null,
  totalVotes: 70,
  votedStudents: new Set(),
  electionHistory: [
    {
      id: '1',
      electionName: 'May 2026',
      date: '2026-05-31',
      winner: 'Rohit Verma',
      votes: 38,
      participation: 85,
    },
    {
      id: '2',
      electionName: 'February 2026',
      date: '2026-02-28',
      winner: 'Sneha Iyer',
      votes: 42,
      participation: 92,
    },
  ],
}

export function ElectionsProvider({ children }: { children: ReactNode }) {
  const [electionData, setElectionData] = useState<ElectionData>(INITIAL_ELECTION_DATA)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hostelhub_elections')
    if (saved) {
      try {
        const data = JSON.parse(saved) as ElectionData
        data.votedStudents = new Set(data.votedStudents as any)
        setElectionData(data)
      } catch (e) {
        setElectionData(INITIAL_ELECTION_DATA)
      }
    }
    setIsLoaded(true)
  }, [])

  const castVote = (studentId: string, candidateId: string): boolean => {
    // Check if student has already voted
    if (electionData.votedStudents.has(studentId)) {
      return false
    }

    // Check if student is voting for themselves
    const candidate = electionData.candidates.find((c) => c.id === candidateId)
    if (candidate && candidate.id === studentId) {
      return false
    }

    // Check if election is active
    if (!electionData.isActive) {
      return false
    }

    // Cast vote
    const updatedCandidates = electionData.candidates.map((c) =>
      c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c,
    )

    const updatedVotedStudents = new Set(electionData.votedStudents)
    updatedVotedStudents.add(studentId)

    const updatedData: ElectionData = {
      ...electionData,
      candidates: updatedCandidates,
      totalVotes: electionData.totalVotes + 1,
      votedStudents: updatedVotedStudents,
    }

    // Update winner if needed
    const maxVotes = Math.max(...updatedCandidates.map((c) => c.voteCount))
    const newWinner = updatedCandidates.find((c) => c.voteCount === maxVotes) || null
    updatedData.winner = newWinner

    setElectionData(updatedData)
    // Persist to localStorage
    const toSave = {
      ...updatedData,
      votedStudents: Array.from(updatedData.votedStudents),
    }
    localStorage.setItem('hostelhub_elections', JSON.stringify(toSave))

    return true
  }

  const hasVoted = (studentId: string): boolean => {
    return electionData.votedStudents.has(studentId)
  }

  const getCurrentWinner = (): Candidate | null => {
    const maxVotes = Math.max(...electionData.candidates.map((c) => c.voteCount))
    return electionData.candidates.find((c) => c.voteCount === maxVotes) || null
  }

  const getVotePercentage = (voteCount: number): number => {
    if (electionData.totalVotes === 0) return 0
    return (voteCount / electionData.totalVotes) * 100
  }

  const endElection = () => {
    const winner = getCurrentWinner()
    if (winner) {
      const newHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        electionName: new Date().toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        date: new Date().toISOString().split('T')[0],
        winner: winner.name,
        votes: winner.voteCount,
        participation: Math.round(
          (electionData.votedStudents.size / 42) * 100,
        ),
      }

      const updatedData: ElectionData = {
        ...electionData,
        isActive: false,
        winner: winner,
        electionHistory: [newHistoryEntry, ...electionData.electionHistory],
      }

      setElectionData(updatedData)
      const toSave = {
        ...updatedData,
        votedStudents: Array.from(updatedData.votedStudents),
      }
      localStorage.setItem('hostelhub_elections', JSON.stringify(toSave))
    }
  }

  const startElection = () => {
    const resetData: ElectionData = {
      ...electionData,
      isActive: true,
      candidates: getMockCandidates(),
      winner: null,
      totalVotes: 0,
      votedStudents: new Set(),
    }
    setElectionData(resetData)
    const toSave = {
      ...resetData,
      votedStudents: Array.from(resetData.votedStudents),
    }
    localStorage.setItem('hostelhub_elections', JSON.stringify(toSave))
  }

  if (!isLoaded) {
    return <>{children}</>
  }

  return (
    <ElectionsContext.Provider
      value={{
        electionData,
        castVote,
        hasVoted,
        getCurrentWinner,
        endElection,
        startElection,
        getVotePercentage,
      }}
    >
      {children}
    </ElectionsContext.Provider>
  )
}

export function useElections() {
  const context = useContext(ElectionsContext)
  if (context === undefined) {
    throw new Error('useElections must be used within ElectionsProvider')
  }
  return context
}

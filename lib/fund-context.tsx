'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

export interface FundData {
  totalFund: number
  currentBalance: number
  monthlyContributions: number
  expensesTotal: number
  expenses: Array<{
    id: string
    category: string
    amount: number
    description: string
    date: string
  }>
}

interface FundContextType {
  fundData: FundData
  addExpense: (expense: {
    category: string
    amount: number
    description: string
  }) => void
  deleteExpense: (id: string) => void
  addContribution: (amount: number) => void
}

const FundContext = createContext<FundContextType | undefined>(undefined)

const INITIAL_FUND_DATA: FundData = {
  totalFund: 125500,
  currentBalance: 125500,
  monthlyContributions: 15000,
  expensesTotal: 0,
  expenses: [
    {
      id: '1',
      category: 'Groceries',
      amount: 5000,
      description: 'Weekly grocery shopping',
      date: '2026-06-10',
    },
    {
      id: '2',
      category: 'Electricity',
      amount: 2500,
      description: 'Monthly electricity bill',
      date: '2026-06-08',
    },
    {
      id: '3',
      category: 'Maintenance',
      amount: 1500,
      description: 'Pipe repair in common area',
      date: '2026-06-05',
    },
  ],
}

export function FundProvider({ children }: { children: ReactNode }) {
  const [fundData, setFundData] = useState<FundData>(INITIAL_FUND_DATA)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedFund = localStorage.getItem('hostelhub_fund')

    if (savedFund) {
      try {
        const data = JSON.parse(savedFund) as FundData
        setFundData(data)
      } catch (e) {
        setFundData(INITIAL_FUND_DATA)
      }
    } else {
      // Calculate initial balance
      const expensesTotal = INITIAL_FUND_DATA.expenses.reduce(
        (sum, exp) => sum + exp.amount,
        0,
      )
      const initialData = {
        ...INITIAL_FUND_DATA,
        expensesTotal,
        currentBalance: INITIAL_FUND_DATA.totalFund - expensesTotal,
      }
      setFundData(initialData)
    }
    setIsLoaded(true)
  }, [])

  const addExpense = (expense: {
    category: string
    amount: number
    description: string
  }) => {
    const newExpense = {
      id: Math.random().toString(36).substr(2, 9),
      ...expense,
      date: new Date().toISOString().split('T')[0],
    }

    const updatedFund = {
      ...fundData,
      expenses: [newExpense, ...fundData.expenses],
      expensesTotal: fundData.expensesTotal + expense.amount,
      currentBalance: fundData.currentBalance - expense.amount,
    }

    setFundData(updatedFund)
    localStorage.setItem('hostelhub_fund', JSON.stringify(updatedFund))
  }

  const deleteExpense = (id: string) => {
    const expense = fundData.expenses.find((e) => e.id === id)
    if (!expense) return

    const updatedFund = {
      ...fundData,
      expenses: fundData.expenses.filter((e) => e.id !== id),
      expensesTotal: fundData.expensesTotal - expense.amount,
      currentBalance: fundData.currentBalance + expense.amount,
    }

    setFundData(updatedFund)
    localStorage.setItem('hostelhub_fund', JSON.stringify(updatedFund))
  }

  const addContribution = (amount: number) => {
    const updatedFund = {
      ...fundData,
      totalFund: fundData.totalFund + amount,
      currentBalance: fundData.currentBalance + amount,
      monthlyContributions: fundData.monthlyContributions + amount,
    }

    setFundData(updatedFund)
    localStorage.setItem('hostelhub_fund', JSON.stringify(updatedFund))
  }

  if (!isLoaded) {
    return <>{children}</>
  }

  return (
    <FundContext.Provider value={{ fundData, addExpense, deleteExpense, addContribution }}>
      {children}
    </FundContext.Provider>
  )
}

export function useFund() {
  const context = useContext(FundContext)
  if (context === undefined) {
    throw new Error('useFund must be used within FundProvider')
  }
  return context
}

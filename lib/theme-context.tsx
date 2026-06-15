'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('hostelhub_theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    let shouldBeDark = prefersDark
    if (savedTheme !== null) {
      shouldBeDark = savedTheme === 'dark'
    }

    setIsDarkMode(shouldBeDark)
    applyTheme(shouldBeDark)
    setIsLoaded(true)
  }, [])

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    applyTheme(newMode)
    localStorage.setItem('hostelhub_theme', newMode ? 'dark' : 'light')
  }

  if (!isLoaded) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

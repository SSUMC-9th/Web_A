import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface ThemeContextType {
    isDark: boolean
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false)

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    // body 태그에 직접 dark 클래스 적용/제거
    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }, [isDark])

    const value = {
        isDark,
        toggleTheme,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
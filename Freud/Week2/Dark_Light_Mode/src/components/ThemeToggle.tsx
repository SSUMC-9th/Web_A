import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${isDark
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }
      `}
        >
            {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
    )
}
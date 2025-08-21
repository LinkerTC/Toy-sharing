import { createContext, useContext, useReducer, useEffect } from 'react'

const ThemeContext = createContext()

// Theme modes
const THEMES = {
  KID: 'kid',
  PARENT: 'parent', 
  AUTO: 'auto'
}

// Initial state
const initialState = {
  mode: THEMES.AUTO,
  currentTheme: THEMES.KID,
  soundEnabled: true,
  animationsEnabled: true,
  fontSize: 'normal' // small, normal, large
}

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        currentTheme: action.payload === THEMES.AUTO ? getAutoTheme() : action.payload
      }
    case 'SET_CURRENT_THEME':
      return {
        ...state,
        currentTheme: action.payload
      }
    case 'TOGGLE_SOUND':
      return {
        ...state,
        soundEnabled: !state.soundEnabled
      }
    case 'TOGGLE_ANIMATIONS':
      return {
        ...state,
        animationsEnabled: !state.animationsEnabled
      }
    case 'SET_FONT_SIZE':
      return {
        ...state,
        fontSize: action.payload
      }
    case 'RESET_THEME':
      return initialState
    default:
      return state
  }
}

// Get theme based on time (morning = kid, evening = parent)
const getAutoTheme = () => {
  const hour = new Date().getHours()
  return (hour >= 6 && hour < 18) ? THEMES.KID : THEMES.PARENT
}

// Load theme from localStorage
const loadThemeFromStorage = () => {
  try {
    const savedTheme = localStorage.getItem('theme-settings')
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme)
      return {
        ...initialState,
        ...parsed,
        currentTheme: parsed.mode === THEMES.AUTO ? getAutoTheme() : parsed.mode
      }
    }
  } catch (error) {
    console.error('Error loading theme from storage:', error)
  }
  return {
    ...initialState,
    currentTheme: getAutoTheme()
  }
}

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState, loadThemeFromStorage)

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme-settings', JSON.stringify(state))
  }, [state])

  // Auto theme switching
  useEffect(() => {
    if (state.mode === THEMES.AUTO) {
      const checkTime = () => {
        const newTheme = getAutoTheme()
        if (newTheme !== state.currentTheme) {
          dispatch({ type: 'SET_CURRENT_THEME', payload: newTheme })
        }
      }

      const interval = setInterval(checkTime, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [state.mode, state.currentTheme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement

    if (state.currentTheme === THEMES.KID) {
      root.classList.add('theme-kid')
      root.classList.remove('theme-parent')
    } else {
      root.classList.add('theme-parent')
      root.classList.remove('theme-kid')
    }

    // Apply font size
    root.classList.remove('text-sm-mode', 'text-lg-mode')
    if (state.fontSize === 'small') {
      root.classList.add('text-sm-mode')
    } else if (state.fontSize === 'large') {
      root.classList.add('text-lg-mode')
    }

    // Apply reduced motion
    if (!state.animationsEnabled) {
      root.style.setProperty('--animation-duration', '0.01ms')
    } else {
      root.style.removeProperty('--animation-duration')
    }
  }, [state.currentTheme, state.fontSize, state.animationsEnabled])

  const setMode = (mode) => {
    dispatch({ type: 'SET_MODE', payload: mode })
  }

  const toggleSound = () => {
    dispatch({ type: 'TOGGLE_SOUND' })
  }

  const toggleAnimations = () => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' })
  }

  const setFontSize = (size) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size })
  }

  const resetTheme = () => {
    dispatch({ type: 'RESET_THEME' })
  }

  // Helper functions
  const isKidMode = () => state.currentTheme === THEMES.KID
  const isParentMode = () => state.currentTheme === THEMES.PARENT

  const getThemeClasses = () => {
    const base = 'transition-all duration-300 ease-in-out'
    if (state.currentTheme === THEMES.KID) {
      return `${base} theme-kid bg-gradient-to-br from-kid-bg to-pink-50`
    } else {
      return `${base} theme-parent bg-gradient-to-br from-parent-bg to-gray-50`
    }
  }

  const value = {
    ...state,
    THEMES,
    setMode,
    toggleSound,
    toggleAnimations,
    setFontSize,
    resetTheme,
    isKidMode,
    isParentMode,
    getThemeClasses
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
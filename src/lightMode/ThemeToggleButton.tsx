import React, { useEffect, useReducer } from 'react';
import styles from './ThemeToggleButton.module.css';

const themes = {
  light: 'light',
  dark: 'dark',
} as const;
type Theme = typeof themes[keyof typeof themes]; 

type State = {
  isDark: boolean;
  isLoading: boolean;
  isSaving: boolean;
};

type Action =
  | { type: 'LOAD_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean };

const initialState: State = {
  isDark: false,
  isLoading: true,
  isSaving: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_THEME':
      return {
        ...state,
        isDark: action.payload === 'dark',
        isLoading: false,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        isDark: !state.isDark,
        isSaving: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    default:
      return state;
  }
};

const ThemeToggleButton: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme') as Theme | null || 'light';
        console.log('Theme loaded from localStorage:', savedTheme);
        dispatch({ type: 'LOAD_THEME', payload: savedTheme });
        if (savedTheme === 'dark') {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
        dispatch({ type: 'LOAD_THEME', payload: 'light' });
        document.body.classList.remove('dark-mode');
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    const newTheme: Theme = state.isDark ? 'light' : 'dark';

    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', newTheme);
    dispatch({ type: 'TOGGLE_THEME' });
    console.log('Theme updated to:', newTheme);
  };

  const { isDark, isLoading, isSaving } = state;

  if (isLoading) {
    return null;
  }

  return (
    <button
      className={styles.themeToggleButton}
      onClick={toggleTheme}
      disabled={isSaving}
    >
      {isSaving ? 'Saving...' : isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggleButton;
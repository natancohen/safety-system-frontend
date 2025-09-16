import React, { useEffect, useState } from 'react';
import styles from './ThemeToggleButton.module.css';

const ThemeToggleButton: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <button className={styles.themeToggleButton} onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggleButton;
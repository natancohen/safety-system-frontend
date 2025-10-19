import React, { useEffect, useState } from 'react';
import styles from './ThemeToggleButton.module.css';
import { getCookie, setCookie } from '@utils/cookies'; // שימוש בקובץ הקוקיז

const ThemeToggleButton: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = getCookie('theme');
    console.log('Theme from cookie:', savedTheme); // בדיקה
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = prev ? 'light' : 'dark';

      // החלפת toggle ב־add/remove כדי למנוע בעיות
      if (newTheme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }

      setCookie('theme', newTheme); // שמירה בקוקי
      return !prev;
    });
  };

  return (
    <button className={styles.themeToggleButton} onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggleButton;
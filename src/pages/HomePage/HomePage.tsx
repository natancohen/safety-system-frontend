import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.pageContainer} dir="rtl">
      <header className={styles.header}>
        <h1 className={styles.title}>ברוכים הבאים</h1>
        <p className={styles.subtitle}>מערכת הזנת דו''ח בטיחות</p>
      </header>
      
      <section className={styles.content}>
        <nav className={styles.navigation}>
          <Link to="/form" className={styles.navButton}>
            כניסה לטופס הזנת נתונים
          </Link>
        </nav>
        <aside className={styles.infoSection}>
          <h2>מידע כללי</h2>
          <p>מערכת זו מיועדת להזנת דוחות בטיחות ופרטי אירוע.</p>
        </aside>
      </section>
    </main>
  );
}
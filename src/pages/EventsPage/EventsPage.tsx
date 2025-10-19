import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsPage.module.css';
import { getEvents, updateEvent, deleteEvent, Event } from '../../utils/api';

interface FilterState {
  eventNumber: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  severity: string;
  unitName: string;
}

const formatCasualties = (casualties?: Event['casualties']) => {
  if (!casualties || casualties.length === 0) return '-';
  return casualties.map(c => `${c.severity} (${c.count})`).join(', ');
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<string>('בטיפול');
  const [filters, setFilters] = useState<FilterState>({
    eventNumber: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    severity: '',
    unitName: ''
  });
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('שגיאה בטעינת אירועים:', error);
      alert('שגיאה בטעינת האירועים מהשרת');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleStatusChange = async (eventId: number, newStatus: string) => {
    try {
      await updateEvent(eventId, { status: newStatus });
      const updatedEvents = events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      );
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
    } catch (error) {
      console.error('שגיאה בעדכון סטטוס:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    let filtered = events;

    if (filters.eventNumber) {
      const eventId = parseInt(filters.eventNumber);
      filtered = filtered.filter(event => event.id === eventId);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(event => 
        new Date(event.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(event => 
        new Date(event.date) <= new Date(filters.dateTo)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    if (filters.severity) {
      filtered = filtered.filter(event => event.eventSeverity === filters.severity);
    }

    if (filters.unitName) {
      filtered = filtered.filter(event => 
        event.unitName.toLowerCase().includes(filters.unitName.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const resetFilters = () => {
    setFilters({
      eventNumber: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      severity: '',
      unitName: ''
    });
    setFilteredEvents(events);
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את האירוע?')) return;
    
    try {
      await deleteEvent(id);
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
      alert('האירוע נמחק בהצלחה');
    } catch (error) {
      console.error('שגיאה במחיקת אירוע:', error);
      alert('שגיאה במחיקת האירוע');
    }
  };

  const getEventsForTab = () => {
    return filteredEvents.filter(event => event.status === activeTab);
  };

  if (loading) {
    return (
      <main className={styles.pageContainer} dir="rtl">
        <p style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '2rem' }}>
          טוען אירועים...
        </p>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer} dir="rtl">
      <header className={styles.header}>
        <h1 className={styles.title}>ניהול אירועי בטיחות</h1>
        <Link to="/" className={styles.backButton}>
          🏠 חזרה לעמוד הבית
        </Link>
      </header>

      <section className={styles.filterSection}>
        <div className={styles.filterGrid}>
          <div className={styles.filterItem}>
            <label>מספר אירוע:</label>
            <input
              type="number"
              value={filters.eventNumber}
              onChange={(e) => handleFilterChange('eventNumber', e.target.value)}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterItem}>
            <label>תאריך מ:</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterItem}>
            <label>תאריך עד:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterItem}>
            <label>סטטוס אירוע:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={styles.filterInput}
            >
              <option value="">הכל</option>
              <option value="בטיפול">בטיפול</option>
              <option value="טופל">טופל</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <label>חומרת אירוע:</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className={styles.filterInput}
            >
              <option value="">הכל</option>
              <option value="קל">קל</option>
              <option value="בינוני">בינוני</option>
              <option value="חמור">חמור</option>
              <option value="קטלני">קטלני</option>
            </select>
          </div>
          <div className={styles.filterItem}>
            <label>יחידת משנה:</label>
            <input
              type="text"
              value={filters.unitName}
              onChange={(e) => handleFilterChange('unitName', e.target.value)}
              className={styles.filterInput}
              placeholder="הזן שם יחידה"
            />
          </div>
        </div>
        <div className={styles.filterButtons}>
          <button onClick={applyFilters} className={styles.filterButton}>
            🔍 סינון
          </button>
          <button onClick={resetFilters} className={styles.resetButton}>
            🔄 איפוס סינון
          </button>
        </div>
      </section>

      <section className={styles.tabsSection}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'בטיפול' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('בטיפול')}
          >
            בטיפול ({filteredEvents.filter(e => e.status === 'בטיפול').length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'טופל' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('טופל')}
          >
            טופל ({filteredEvents.filter(e => e.status === 'טופל').length})
          </button>
        </div>
      </section>

      <section className={styles.content}>
        <p>מספר אירועים מסוננים: {filteredEvents.length}</p>
        {getEventsForTab().length === 0 ? (
          <div className={styles.emptyState}>
            <p>אין אירועים להצגה בקטגוריה "{activeTab}"</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.eventsTable}>
              <thead>
                <tr>
                  <th>מספר אירוע</th>
                  <th>יחידה</th>
                  <th>תאריך</th>
                  <th>שעה</th>
                  <th>מאפיין פעילות יחידה</th>
                  <th>מאפיין פעילות פרט</th>
                  <th>קטגוריה</th>
                  <th>גורמים לאירוע</th>
                  <th>תת-קטגוריה</th>
                  <th>תת-תת קטגוריה</th>
                  <th>חומרת אירוע</th>
                  <th>תוצאת אירוע</th>
                  <th>חומרת נזק</th>
                  <th>חקירה</th>
                  <th>מיקום</th>
                  <th>תיאור מיקום</th>
                  <th>מזג אוויר</th>
                  <th>קואורדינטות</th>
                  <th>נפגעים</th>
                  <th>תיאור</th>
                  <th>המלצות</th>
                  <th>עלות</th>
                  <th>תאריך יצירה</th>
                  <th>סטטוס</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {getEventsForTab().map((event) => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.unitName}</td>
                    <td>{new Date(event.date).toLocaleDateString('he-IL')}</td>
                    <td>{event.time || '-'}</td>
                    <td>{event.unitActivityType}</td>
                    <td>{event.activityType}</td>
                    <td>{event.category}</td>
                    <td>{event.eventFactor || '-'}</td>
                    <td>{event.categorySubOptions || '-'}</td>
                    <td>{event.subCategoryOptions || '-'}</td>
                    <td>
                      <span className={`${styles.severityBadge} ${styles[event.eventSeverity]}`}>
                        {event.eventSeverity}</span>
                    </td>
                    <td>{event.eventOutcome}</td>
                    <td>{event.damageType || '-'}</td>
                    <td>{event.investigation || '-'}</td>
                    <td>{event.location}</td>
                    <td>{event.locationDescription || '-'}</td>
                    <td>{event.weather || '-'}</td>
                    <td>{event.coordinates.latitude ? `${event.coordinates.latitude}, ${event.coordinates.longitude}` : '-'}</td>
                    <td>{formatCasualties(event.casualties)}</td>
                    <td className={styles.textCell}>
                      {event.text.length > 50 ? `${event.text.substring(0, 50)}...` : event.text}
                    </td>
                    <td className={styles.textCell}>
                      {event.recommendations ? (event.recommendations.length > 50 ? `${event.recommendations.substring(0, 50)}...` : event.recommendations) : '-'}
                    </td>
                    <td>{event.costAmount ? `${event.costAmount} ₪` : '-'}</td>
                    <td>{new Date(event.createdAt).toLocaleDateString('he-IL')}</td>
                    <td>
                      <select
                        value={event.status}
                        onChange={(e) => handleStatusChange(event.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="בטיפול">בטיפול</option>
                        <option value="טופל">טופל</option>
                      </select>
                    </td>
                    <td>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteEvent(event.id)}
                        title="מחק אירוע"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsPage.module.css';

interface Event {
  id: string;
  unitName: string;
  date: string;
  category: string;
  eventSeverity: string;
  eventOutcome: string;
  location: string;
  text: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  casualties: Array<{
    severity: string;
    count: number;
  }>;
  createdAt: string;
  status: 'בטיפול' | 'טופל';
}

interface FilterState {
  eventNumber: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  severity: string;
  unitName: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'בטיפול' | 'טופל'>('בטיפול');
  const [filters, setFilters] = useState<FilterState>({
    eventNumber: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    severity: '',
    unitName: ''
  });
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load events from localStorage
    const savedEvents = localStorage.getItem('safetyEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        status: event.status || 'בטיפול' // Default status if not set
      }));
      setEvents(parsedEvents);
      setFilteredEvents(parsedEvents);
    }
  }, []);

  const handleStatusChange = (eventId: string, newStatus: 'בטיפול' | 'טופל') => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    );
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    localStorage.setItem('safetyEvents', JSON.stringify(updatedEvents));
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    let filtered = events;

    if (filters.eventNumber) {
      const eventIndex = parseInt(filters.eventNumber) - 1;
      filtered = filtered.filter((_, index) => index === eventIndex);
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

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    localStorage.setItem('safetyEvents', JSON.stringify(updatedEvents));
  };

  const getEventsForTab = () => {
    return filteredEvents.filter(event => event.status === activeTab);
  };

  return (
    <main className={styles.pageContainer} dir="rtl">
      <header className={styles.header}>
        <h1 className={styles.title}>ניהול אירועי בטיחות</h1>
        <Link to="/" className={styles.backButton}>
          🏠 חזרה לעמוד הבית
        </Link>
      </header>

      {/* Filter Section */}
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

      {/* Tabs */}
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

      {/* Events Table */}
      <section className={styles.content}>
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
                  <th>קטגוריה</th>
                  <th>חומרת אירוע</th>
                  <th>תוצאת אירוע</th>
                  <th>מיקום</th>
                  <th>תיאור</th>
                  <th>תאריך יצירה</th>
                  <th>סטטוס</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {getEventsForTab().map((event, index) => (
                  <tr key={event.id}>
                    <td>{events.findIndex(e => e.id === event.id) + 1}</td>
                    <td>{event.unitName}</td>
                    <td>{new Date(event.date).toLocaleDateString('he-IL')}</td>
                    <td>{event.category}</td>
                    <td>
                      <span className={`${styles.severityBadge} ${styles[event.eventSeverity]}`}>
                        {event.eventSeverity}
                      </span>
                    </td>
                    <td>{event.eventOutcome}</td>
                    <td>{event.location}</td>
                    <td className={styles.textCell}>
                      {event.text.length > 50 ? `${event.text.substring(0, 50)}...` : event.text}
                    </td>
                    <td>{new Date(event.createdAt).toLocaleDateString('he-IL')}</td>
                    <td>
                      <select
                        value={event.status}
                        onChange={(e) => handleStatusChange(event.id, e.target.value as 'בטיפול' | 'טופל')}
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

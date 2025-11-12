import { useState, useEffect } from 'react';
import styles from './EventsPage.module.css';
import { getEvents, deleteEvent, updateEventStatus } from '../../utils/api';
import type { Event as AppEvent } from '../../utils/api';
import  InlinePopover  from '../../components/InlinePopover';
import HeaderNav from '@components/headerNav';

interface FilterState {
  eventNumber: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  severity: string;
  unitName: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [activeTab, setActiveTab] = useState<string>('בטיפול');
  const [filters, setFilters] = useState<FilterState>({
    eventNumber: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    severity: '',
    unitName: '',
  });
  const [filteredEvents, setFilteredEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setFilteredEvents(applyCurrentFilters(data, filters));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('שגיאה בטעינת אירועים:', error);
      alert('שגיאה בטעינת האירועים מהשרת');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents();
  }, []);

  const applyCurrentFilters = (source: AppEvent[], f: FilterState): AppEvent[] => {
    let res = source;

    if (f.eventNumber) {
      const idNum = Number.parseInt(f.eventNumber, 10);
      res = res.filter((ev) => ev.id === idNum);
    }
    if (f.dateFrom) {
      res = res.filter((ev) => new Date(ev.date) >= new Date(f.dateFrom));
    }
    if (f.dateTo) {
      res = res.filter((ev) => new Date(ev.date) <= new Date(f.dateTo));
    }
    if (f.status) {
      res = res.filter((ev) => ev.status === f.status);
    }
    if (f.severity) {
      res = res.filter((ev) => ev.eventSeverity === f.severity);
    }
    if (f.unitName) {
      res = res.filter((ev) => ev.unitName.toLowerCase().includes(f.unitName.toLowerCase()));
    }
    return res;
  };

  const handleStatusChange = async (eventId: number, newStatus: AppEvent['status']): Promise<void> => {
    try {
      const updatedFromServer = await updateEventStatus(eventId, newStatus);
      const nextEvents = events.map((ev) => (ev.id === eventId ? updatedFromServer : ev));
      setEvents(nextEvents);
      setFilteredEvents(applyCurrentFilters(nextEvents, filters));
      if (activeTab !== updatedFromServer.status) {
        setActiveTab(updatedFromServer.status);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('שגיאה בעדכון סטטוס:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string): void => {
    const next = { ...filters, [field]: value };
    setFilters(next);
    setFilteredEvents(applyCurrentFilters(events, next));
  };

  const resetFilters = (): void => {
    const empty: FilterState = {
      eventNumber: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      severity: '',
      unitName: '',
    };
    setFilters(empty);
    setFilteredEvents(events);
  };

  const handleDeleteEvent = async (id: number): Promise<void> => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את האירוע?')) return;
    try {
      await deleteEvent(id);
      const next = events.filter((ev) => ev.id !== id);
      setEvents(next);
      setFilteredEvents(applyCurrentFilters(next, filters));
      alert('האירוע נמחק בהצלחה');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('שגיאה במחיקת אירוע:', error);
      alert('שגיאה במחיקת האירוע');
    }
  };

  const getEventsForTab = (): AppEvent[] => filteredEvents.filter((ev) => ev.status === activeTab);

  if (loading) {
    return (
      <main className={styles.pageContainer} dir="rtl">
        <p style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '2rem' }}>טוען אירועים...</p>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer} dir="rtl">
      <header className={styles.header}>
        <HeaderNav/>
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
              <option value="Low">קל</option>
              <option value="Medium">בינוני</option>
              <option value="High">חמור</option>
              <option value="Fatal">קטלני</option>
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
          <button onClick={() => setFilteredEvents(applyCurrentFilters(events, filters))} className={styles.filterButton}>
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
            בטיפול ({filteredEvents.filter((e) => e.status === 'בטיפול').length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'טופל' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('טופל')}
          >
            טופל ({filteredEvents.filter((e) => e.status === 'טופל').length})
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
                  <th>תאריך אירוע</th>
                  <th>יחידת משנה</th>
                  <th>מאפיין תחומי</th>
                  <th>חומרת אירוע</th>
                  <th>תוצאות אירוע</th>
                  <th>מיקום אירוע</th>
                  <th>תיאור אירוע</th>
                  <th>סטטוס</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {getEventsForTab().map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.id}</td>
                    <td>{new Date(ev.date).toLocaleDateString('he-IL')}</td>
                    <td>{ev.unitName}</td>
                    <td>{ev.categoryOptions}</td>
                    <td>
                      <span className={`${styles.severityBadge} ${styles[ev.eventSeverity]}`}>
                        {ev.eventSeverity}
                      </span>
                    </td>
                    <td>{ev.eventOutcomeByCategory}</td>
                    <td>{ev.location}</td>
                    <td className={styles.textCell} title={ev.text}>
                      {ev.text && ev.text.length > 50 ? `${ev.text.substring(0, 50)}...` : ev.text}
                      {ev.text && ev.text.length > 50 && <InlinePopover text={ev.text} />}
                    </td>

                    <td>
                      <select
                        value={ev.status}
                        onChange={(e) => void handleStatusChange(ev.id, e.target.value as AppEvent['status'])}
                        className={styles.statusSelect}
                      >
                        <option value="בטיפול">בטיפול</option>
                        <option value="טופל">טופל</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={() => void handleDeleteEvent(ev.id)}
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

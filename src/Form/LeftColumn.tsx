import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useState, useEffect } from 'react';
import type { FormData } from '../utils/validationSchema';
import styles from '../styles/FormBase.module.css';
import { MAX_TEXT_LENGTH } from '../utils/validationMessages';
import { locationOptions, weatherOptions } from '../data/options';
import { handlePinPlacement } from '../components/openMap';
import  CompactSelect  from '../components/compact-select'; 

interface LeftColumnProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  getCharCounterClass: (length: number) => string;
}

export default function LeftColumn({
  register,
  errors,
  watch,
  setValue,
  getCharCounterClass
}: LeftColumnProps) {
  const [isPinPlaced, setIsPinPlaced] = useState(false);
  const [isWaitingForCoordinates, setIsWaitingForCoordinates] = useState(false);
  const locationDescriptionValue = watch('locationDescription') || '';
  const locationDescriptionLength = locationDescriptionValue.length;
  const coordinates = watch('coordinates') || { latitude: '', longitude: '' };
  const selectedLocation = watch('location') || '';

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      setIsPinPlaced(true);
    }
  }, [coordinates.latitude, coordinates.longitude]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'COORDINATES_SELECTED') {
        const { lat, lng } = event.data;
        setValue('coordinates.latitude', lat.toString());
        setValue('coordinates.longitude', lng.toString());
        setIsPinPlaced(true);
        setIsWaitingForCoordinates(false);
        alert(`קואורדינטות נשמרו בהצלחה:\nקו רוחב: ${lat}\nקו אורך: ${lng}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setValue]);

  const handleGoogleMapsClick = () => {
    const lat = coordinates.latitude;
    const lng = coordinates.longitude;
    
    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    } else {
      alert('יש להזין קואורדינטות לפני פתיחת המפה');
    }
  };

  const handlePinPlacementClick = () => {
    handlePinPlacement(setIsWaitingForCoordinates);
  };

  const handleCoordinateChange = (field: 'latitude' | 'longitude', value: string) => {
    setValue(`coordinates.${field}`, value);
    
    const currentCoords = watch('coordinates');
    const otherField = field === 'latitude' ? 'longitude' : 'latitude';
    
    if (value && currentCoords[otherField]) {
      setIsPinPlaced(true);
    } else if (!value || !currentCoords[otherField]) {
      setIsPinPlaced(false);
    }
  };

  return (
    <aside className={`${styles.column} ${styles.leftColumn}`} data-label="פרטי המיקום">
      <div className={styles.fieldBox}>
        <label className={styles.label}>מיקום האירוע: </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', alignItems: 'center' }}>
          {locationOptions.map(option => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              <input
                type="checkbox"
                checked={selectedLocation === option}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue('location', option);
                  } else {
                    setValue('location', '');
                  }
                }}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.location && <span className={styles.error}>{errors.location.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>תיאור מיקום: </label>
        <textarea
          className={styles.textarea}
          style={{ minHeight: '40px', maxHeight: '100px' }}
          placeholder="תיאור מפורט של המיקום..."
          maxLength={800}
          {...register('locationDescription')}
        />
        <div className={`${styles.charCounter} ${styles[getCharCounterClass(locationDescriptionLength)]}`}>
          {locationDescriptionLength}/{MAX_TEXT_LENGTH}
        </div>
        {errors.locationDescription && <span className={styles.error}>{errors.locationDescription.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>מזג אוויר: </label>
        <CompactSelect
          value={watch('weather')}
          onChange={(v) => setValue('weather', v)}
          options={weatherOptions}
          placeholder="בחר מזג אוויר"
        />
        {errors.weather && <span className={styles.error}>{errors.weather.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>נ.צ. (קואורדינטות):</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="number"
            step="0.000001"
            className={styles.input}
            placeholder="קו רוחב"
            value={coordinates.latitude}
            onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
            disabled={selectedLocation !== 'שטח אזרחי'}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            step="0.000001"
            className={styles.input}
            placeholder="קו אורך"
            value={coordinates.longitude}
            onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
            disabled={selectedLocation !== 'שטח אזרחי'}
            style={{ flex: 1 }}
          />
        </div>
        {errors.coordinates?.latitude && <span className={styles.error}>{errors.coordinates.latitude.message}</span>}
        {errors.coordinates?.longitude && <span className={styles.error}>{errors.coordinates.longitude.message}</span>}
        {selectedLocation !== 'שטח אזרחי' && (
          <p style={{ fontSize: '0.7rem', color: '#666', margin: '0.1rem 0 0 0' }}>
            זמין רק עבור מיקום "שטח אזרחי"
          </p>
        )}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>הצגת מיקום נ.צ. :</label>
        <button
          type="button"
          className={styles.input}
          style={{ 
            backgroundColor: (coordinates.latitude && coordinates.longitude && selectedLocation === 'שטח אזרחי') ? '#28a745' : '#ccc',
            color: 'white',
            cursor: (coordinates.latitude && coordinates.longitude && selectedLocation === 'שטח אזרחי') ? 'pointer' : 'not-allowed',
            textAlign: 'center',
            border: 'none',
            padding: '0.4rem',
            fontWeight: '600'
          }}
          onClick={handleGoogleMapsClick}
          disabled={!coordinates.latitude || !coordinates.longitude || selectedLocation !== 'שטח אזרחי'}
        >
          📍 הצג נ.צ. במפה
        </button>
        <p style={{ fontSize: '0.7rem', color: '#666', margin: '0.1rem 0 0 0' }}>
          זמין רק כאשר קיימות קואורדינטות תקפות ונבחר "שטח אזרחי"
        </p>
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>נעיצת סיכה במפה:</label>
        <button
          type="button"
          onClick={handlePinPlacementClick}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginTop: '0.2rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-color)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          disabled={isWaitingForCoordinates || selectedLocation !== 'שטח אזרחי'}
        >
          🗺️ {isPinPlaced ? 'ערוך נעיצת סיכה' : 'פתח גוגל מפות לנעיצת סיכה'}
        </button>
        <p style={{ fontSize: '0.7rem', color: '#666', margin: '0.1rem 0 0 0' }}>
          {selectedLocation !== 'שטח אזרחי' ? 'זמין רק עבור מיקום "שטח אזרחי"' :
           isWaitingForCoordinates ? 'בחר מיקום במפה והקואורדינטות יישמרו אוטומטית' :
           isPinPlaced ? 'לחץ לעריכת המיקום הנבחר' : 'יפתח מפה אינטראקטיבית לבחירת מיקום'}
        </p>
      </div>
    </aside>
  );
}
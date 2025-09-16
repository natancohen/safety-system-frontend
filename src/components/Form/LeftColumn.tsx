import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { FormData } from '../../types/FormTypes';
import styles from '../../styles/FormBase.module.css';
import { MAX_TEXT_LENGTH } from '../../constants/validationMessages';
import { locationOptions, weatherOptions } from '../../data/options';

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

  // Check if coordinates exist on component mount
  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      setIsPinPlaced(true);
    }
  }, [coordinates.latitude, coordinates.longitude]);

  // Listen for messages from the map window
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

  const handlePinPlacement = () => {
    // Create a custom HTML page that will handle the map interaction
    const mapHtml = `
<!DOCTYPE html>
<html dir="rtl">
<head>
    <title>בחירת מיקום במפה</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; font-family: Arial, sans-serif; direction: rtl; }
        #map { height: 90vh; width: 100%; }
        #instructions { 
            padding: 10px; 
            background: #f0f8ff; 
            text-align: center; 
            font-weight: bold;
            border-bottom: 2px solid #007bff;
        }
        #coordinates { 
            padding: 10px; 
            background: #e8f5e8; 
            text-align: center; 
            font-weight: bold;
        }
        .button {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            margin: 5px;
            border-radius: 4px;
            cursor: pointer;
        }
        .button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div id="instructions">
        לחץ על המפה כדי לבחור מיקום. הקואורדינטות יישמרו אוטומטית בטופס.
    </div>
    <div id="map"></div>
    <div id="coordinates">
        <span id="coords-display">לחץ על המפה לבחירת מיקום</span>
        <button class="button" onclick="saveCoordinates()" id="save-btn" style="display:none;">שמור קואורדינטות</button>
        <button class="button" onclick="window.close()">סגור</button>
    </div>

    <script>
        let map, marker, selectedLat, selectedLng;
        
        function initMap() {
            // Center on Israel
            const israel = { lat: 32.0853, lng: 34.7818 };
            
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 8,
                center: israel,
                mapTypeId: 'roadmap'
            });
            
            map.addListener('click', function(event) {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                
                selectedLat = lat;
                selectedLng = lng;
                
                // Remove existing marker
                if (marker) {
                    marker.setMap(null);
                }
                
                // Add new marker
                marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: 'מיקום נבחר'
                });
                
                // Update coordinates display
                document.getElementById('coords-display').textContent = 
                    \`קו רוחב: \${lat.toFixed(6)}, קו אורך: \${lng.toFixed(6)}\`;
                document.getElementById('save-btn').style.display = 'inline-block';
            });
        }
        
        function saveCoordinates() {
            if (selectedLat && selectedLng) {
                // Send coordinates to parent window
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'COORDINATES_SELECTED',
                        lat: selectedLat,
                        lng: selectedLng
                    }, '*');
                }
                window.close();
            }
        }
        
        // Initialize map when Google Maps API loads
        window.initMap = initMap;
    </script>
    <script async defer 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-y931Pk&callback=initMap">
    </script>
</body>
</html>`;

    // Create a blob URL for the HTML content
    const blob = new Blob([mapHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open the map in a new window
    const mapWindow = window.open(url, 'MapSelector', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    setIsWaitingForCoordinates(true);
    
    // Clean up the blob URL when the window is closed
    const checkClosed = setInterval(() => {
      if (mapWindow?.closed) {
        URL.revokeObjectURL(url);
        setIsWaitingForCoordinates(false);
        clearInterval(checkClosed);
      }
    }, 1000);
  };

  const handleCoordinateChange = (field: 'latitude' | 'longitude', value: string) => {
    setValue(`coordinates.${field}`, value);
    
    // Check if both coordinates are filled
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
        <label className={styles.label}>מיקום *</label>
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
        <label className={styles.label}>תיאור מיקום</label>
        <textarea
          className={styles.textarea}
          style={{ minHeight: '40px', maxHeight: '60px' }}
          placeholder="תיאור מפורט של המיקום..."
          {...register('locationDescription')}
        />
        <div className={`${styles.charCounter} ${styles[getCharCounterClass(locationDescriptionLength)]}`}>
          {locationDescriptionLength}/{MAX_TEXT_LENGTH}
        </div>
        {errors.locationDescription && <span className={styles.error}>{errors.locationDescription.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>מזג אוויר</label>
        <select 
          className={styles.select}
          {...register('weather')}
        >
          <option value="">בחר מזג אוויר</option>
          {weatherOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.weather && <span className={styles.error}>{errors.weather.message}</span>}
      </div>

      <div className={styles.fieldBox}>
        <label className={styles.label}>נ.צ. (קואורדינטות)</label>
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
        <label className={styles.label}>הצגת מיקום נ.צ.</label>
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
        <label className={styles.label}>נעיצת סיכה במפה</label>
        <button
          type="button"
          onClick={handlePinPlacement}
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
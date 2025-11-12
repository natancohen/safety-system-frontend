export const handlePinPlacement = (setIsWaitingForCoordinates: (value: boolean) => void) => {
  const mapHtml = `
<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="utf-8">
  <title>בחירת מיקום</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    body { margin: 0; font-family: Arial, sans-serif; direction: rtl; padding: 20px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; }
    #map { width: 100%; height: 400px; }
    .controls { padding: 20px; text-align: center; background: #f8f9fa; }
    .coordinates { font-size: 18px; font-weight: bold; margin: 10px 0; color: #007bff; }
    .button { background: #28a745; color: white; border: none; padding: 12px 24px; margin: 5px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s ease; }
    .button:hover { background: #218838; transform: translateY(-2px); }
    .button:disabled { background: #ccc; cursor: not-allowed; transform: none; }
    .button.close { background: #dc3545; }
    .button.close:hover { background: #c82333; }
    .instructions { margin-bottom: 15px; color: #666; font-size: 14px; }
  </style>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🗺️ בחירת מיקום במפה</h2>
    </div>
    <div id="map"></div>
    <div class="controls">
      <div class="instructions">לחץ על המפה כדי לבחור קואורדינטות</div>
      <div class="coordinates" id="coordinates">לחץ על המפה לבחירת מיקום</div>
      <button class="button" id="saveBtn" onclick="saveLocation()" disabled>✅ שמור קואורדינטות</button>
      <button class="button close" onclick="window.close()">❌ סגור</button>
    </div>
  </div>

  <script>
    const map = L.map('map').setView([31.5, 34.85], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker;
    let selectedLat = null;
    let selectedLng = null;

    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      selectedLat = lat;
      selectedLng = lng;

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);

      document.getElementById('coordinates').innerHTML =
        'קו רוחב: <strong>' + lat.toFixed(6) + '</strong><br>קו אורך: <strong>' + lng.toFixed(6) + '</strong>';
      document.getElementById('saveBtn').disabled = false;
    });

    function saveLocation() {
      if (selectedLat !== null && selectedLng !== null) {
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
  </script>
</body>
</html>`;

  const blob = new Blob([mapHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const mapWindow = window.open(url, 'MapSelector', 'width=900,height=700,scrollbars=no,resizable=yes');

  if (!mapWindow) {
    alert('לא ניתן לפתוח חלון חדש. אנא אפשר חלונות קופצים בדפדפן.');
    return;
  }

  setIsWaitingForCoordinates(true);

  const checkClosed = setInterval(() => {
    if (mapWindow.closed) {
      URL.revokeObjectURL(url);
      setIsWaitingForCoordinates(false);
      clearInterval(checkClosed);
    }
  }, 1000);
};
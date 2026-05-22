import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapComponentProps {
  position: { latitude: number; longitude: number } | null;
  setPosition: (pos: { latitude: number; longitude: number }) => void;
  style?: any;
}

export default function MapComponent({ position, setPosition, style }: MapComponentProps) {
  const initialLat = position?.latitude ?? 10.762622;
  const initialLng = position?.longitude ?? 106.660172;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; width: 100%; }
        .custom-marker {
          background: none;
          border: none;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${initialLat}, ${initialLng}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Tạo custom icon bằng SVG để hiển thị marker sắc nét và không bị lỗi tải ảnh
        var customIcon = L.divIcon({
          html: \`
            <svg viewBox="0 0 24 24" width="36" height="36" style="display: block; filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.4));">
              <path fill="#E53935" stroke="#FFFFFF" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          \`,
          className: 'custom-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 36] // điểm chính giữa cạnh đáy
        });

        var marker = null;
        
        // Hiển thị marker nếu có vị trí ban đầu
        ${position ? `
          marker = L.marker([${position.latitude}, ${position.longitude}], {icon: customIcon}).addTo(map);
          map.setView([${position.latitude}, ${position.longitude}], 15);
        ` : ''}

        map.on('click', function(e) {
          var lat = e.latlng.lat;
          var lng = e.latlng.lng;

          if (marker) {
            marker.setLatLng(e.latlng);
          } else {
            marker = L.marker(e.latlng, {icon: customIcon}).addTo(map);
          }

          var msg = JSON.stringify({ latitude: lat, longitude: lng });
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(msg);
          } else {
            window.parent.postMessage(msg, '*');
          }
        });
      </script>
    </body>
    </html>
  `;

  // Nhận thông điệp gửi về từ iframe (dành cho Web)
  React.useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleWebMessage = (event: any) => {
      try {
        const data = JSON.parse(event.data);
        if (data.latitude && data.longitude) {
          setPosition({ latitude: data.latitude, longitude: data.longitude });
        }
      } catch {
        // Bỏ qua tin nhắn không đúng định dạng
      }
    };

    window.addEventListener('message', handleWebMessage);
    return () => {
      window.removeEventListener('message', handleWebMessage);
    };
  }, [setPosition]);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <iframe
          srcDoc={htmlContent}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Map Picker"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.latitude && data.longitude) {
              setPosition({ latitude: data.latitude, longitude: data.longitude });
            }
          } catch {
            // Bỏ qua tin nhắn không đúng định dạng
          }
        }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  map: {
    flex: 1,
  },
});

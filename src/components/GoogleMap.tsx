import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
    initMap?: () => void;
  }
}

interface MapProps {
  apiKey: string;
  latitude: number;
  longitude: number;
  zoom: number;
  markerTitle: string;
}

const GoogleMap: React.FC<MapProps> = ({ apiKey, latitude, longitude, zoom, markerTitle }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', () => setMapLoaded(true));
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
      }
    };

    loadGoogleMaps();

    return () => {
      const script = document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js?key="]`);
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (mapLoaded && mapRef.current && window.google) {
      const location = { lat: latitude, lng: longitude };
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: zoom,
      });

      // Check if AdvancedMarkerElement is available
      if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
        new window.google.maps.marker.AdvancedMarkerElement({
          map: map,
          position: location,
          title: markerTitle,
        });
      } else {
        // Fallback to regular Marker
        new window.google.maps.Marker({
          map: map,
          position: location,
          title: markerTitle,
        });
      }
    }
  }, [mapLoaded, latitude, longitude, zoom, markerTitle]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default GoogleMap;
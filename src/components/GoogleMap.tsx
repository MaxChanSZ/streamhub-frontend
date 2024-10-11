import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
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

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = initializeMap;
    };

    const initializeMap = () => {
      if (mapRef.current && window.google) {
        const location = { lat: latitude, lng: longitude };
        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: zoom,
        });

        new window.google.maps.Marker({
          position: location,
          map: map,
          title: markerTitle
        });
      }
    };

    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      loadGoogleMaps();
    }

    return () => {
      const script = document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js?key="]`);
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey, latitude, longitude, zoom, markerTitle]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default GoogleMap;
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './Button';

interface PropertyMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  propertyName: string;
  location: string;
}

export function PropertyMap({ coordinates, propertyName, location }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    // Dynamically load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Dynamically load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => initializeMap();
    document.body.appendChild(script);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || map) return;

    // @ts-ignore - Leaflet is loaded dynamically
    const L = window.L;
    if (!L) return;

    const newMap = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(newMap);

    // Custom marker icon
    const customIcon = L.divIcon({
      html: `<div style="background-color: #DC2626; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="transform: rotate(45deg); color: white; font-size: 18px;">📍</div></div>`,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker([coordinates.lat, coordinates.lng], { icon: customIcon }).addTo(newMap);
    marker.bindPopup(`<b>${propertyName}</b><br>${location}`).openPopup();

    setMap(newMap);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userCoords);
          
          // @ts-ignore - Leaflet is loaded dynamically
          const L = window.L;
          if (map && L) {
            // Add user location marker
            const userIcon = L.divIcon({
              html: `<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
              className: 'user-marker',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });

            const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(map);
            userMarker.bindPopup('Votre position');

            // Draw a line between user and property
            const latlngs = [
              [userCoords.lat, userCoords.lng],
              [coordinates.lat, coordinates.lng]
            ];
            
            L.polyline(latlngs, {
              color: '#DC2626',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 10'
            }).addTo(map);

            // Fit bounds to show both markers
            const bounds = L.latLngBounds([
              [userCoords.lat, userCoords.lng],
              [coordinates.lat, coordinates.lng]
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });

            setShowDirections(true);
          }
        },
        (error) => {
          alert('Impossible d\'obtenir votre position. Veuillez vérifier les autorisations de localisation.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  const openInGoogleMaps = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${coordinates.lat},${coordinates.lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <MapPin className="w-5 h-5 text-primary-600" />
          <span className="font-medium">Localisation</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={getUserLocation}
            className="gap-2"
          >
            <Navigation className="w-4 h-4" />
            Ma position
          </Button>
          {showDirections && (
            <Button 
              size="sm"
              onClick={openInGoogleMaps}
              className="gap-2"
            >
              Itinéraire
            </Button>
          )}
        </div>
      </div>

      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded border border-slate-300 overflow-hidden"
      />

      <p className="text-sm text-slate-600">
        <MapPin className="w-4 h-4 inline mr-1" />
        {location}
      </p>
    </div>
  );
}

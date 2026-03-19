'use client';

import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

type POI = {
  id: number | null;
  title: string;
  lat: number;
  lng: number;
  url?: string | null;
};

type Business = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  distance_km?: number;
};

type Props = {
  center: [number, number];
  userLocation?: [number, number] | null;
  pois: POI[];
  businesses: Business[];
  route?: [number, number][];
};

const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
const iconUser = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const iconBusiness = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const iconPoi = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const iconRoute = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function TouristCityMap({ center, userLocation, pois, businesses, route }: Props) {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const mapInstance = React.useRef<L.Map | null>(null);
  const markersLayer = React.useRef<L.LayerGroup | null>(null);
  const routeLayer = React.useRef<L.LayerGroup | null>(null);

  React.useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center,
      zoom: 13,
      scrollWheelZoom: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    mapInstance.current = map;
    markersLayer.current = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
    }).addTo(map);
    routeLayer.current = L.layerGroup().addTo(map);
  }, []);

  React.useEffect(() => {
    if (!mapInstance.current || !markersLayer.current || !routeLayer.current) return;
    mapInstance.current.setView(center, 13);
    markersLayer.current.clearLayers();
    routeLayer.current.clearLayers();
    const layer = markersLayer.current;
    const rLayer = routeLayer.current;

    if (userLocation) {
      L.marker(userLocation, { icon: iconUser })
        .bindPopup('Tu ubicación')
        .addTo(layer);
    }

    businesses.forEach((biz) => {
      L.marker([biz.lat, biz.lng], { icon: iconBusiness })
        .bindPopup(
          `<strong>${biz.name}</strong>${biz.address ? `<br/><span>${biz.address}</span>` : ''}`
        )
        .addTo(layer);
    });

    pois.forEach((poi) => {
      L.marker([poi.lat, poi.lng], { icon: iconPoi })
        .bindPopup(
          `<strong>${poi.title}</strong>${poi.url ? `<br/><a href="${poi.url}" target="_blank" rel="noreferrer">Wikipedia</a>` : ''}`
        )
        .addTo(layer);
    });

    if (route && route.length > 1) {
      L.polyline(route, { color: '#6D28D9', weight: 4, opacity: 0.8 }).addTo(rLayer);
      route.forEach((point, idx) => {
        L.marker(point, { icon: iconRoute })
          .bindPopup(`Parada ${idx + 1}`)
          .addTo(rLayer);
      });
    }
  }, [center, userLocation, pois, businesses, route]);

  React.useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
      <div ref={mapRef} className="h-64 sm:h-80 w-full" />
    </div>
  );
}

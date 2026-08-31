'use client';

import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import { POLAR_LANDMASSES_GEOJSON } from '@/lib/polar-land-geojson';

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || 'lBIA21m3wp6Pjwj3WrDX';

export type MapTilerStyleKey = 'outdoor' | 'satellite' | 'winter' | 'basic' | 'ocean';

export const MAPTILER_STYLES: Record<MapTilerStyleKey, { name: string; url: string }> = {
  outdoor: {
    name: 'Outdoor (Colorful Relief)',
    url: `https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  },
  winter: {
    name: 'Winter Cryosphere',
    url: `https://api.maptiler.com/maps/winter-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  },
  satellite: {
    name: 'Satellite View',
    url: `https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
  },
  basic: {
    name: 'Vector Clean',
    url: `https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  },
  ocean: {
    name: 'Ocean Bathymetry',
    url: `https://api.maptiler.com/maps/ocean/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  },
};

// Custom Leaflet Controller for View Changes
function MapViewController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface PolarMapProps {
  height?: number | string;
  styleKey?: MapTilerStyleKey;
  style?: string;
  config?: any;
  stations?: any[];
  summaries?: any[];
  targetRegion?: 'all' | 'antarctic' | 'arctic' | 'himalaya';
  selectedStationId?: string;
  onSelectStation?: (station: any) => void;
  showOverlays?: boolean;
}

export default function PolarMap({
  height = 580,
  styleKey = 'outdoor',
  style,
  config,
  targetRegion = 'all',
  showOverlays = true,
}: PolarMapProps) {
  let center: [number, number] = [20, 0];
  let zoom = 2;

  if (targetRegion === 'antarctic') {
    center = [-75, 20];
    zoom = 3;
  } else if (targetRegion === 'arctic') {
    center = [78, 15];
    zoom = 3;
  } else if (targetRegion === 'himalaya') {
    center = [32.4, 77.6];
    zoom = 5;
  }

  const effectiveStyleKey = (styleKey || (style === 'satellite' ? 'satellite' : 'outdoor')) as MapTilerStyleKey;
  const activeTileUrl =
    config?.styles?.[style || 'basemap'] ||
    MAPTILER_STYLES[effectiveStyleKey]?.url ||
    MAPTILER_STYLES.outdoor.url;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#d4eaf7] select-none">
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={1.5}
        maxZoom={12}
        worldCopyJump={true}
        scrollWheelZoom={true}
        style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
        className="z-10 rounded-2xl"
      >
        <MapViewController center={center} zoom={zoom} />

        {/* MapTiler Basemap Tile Layer */}
        <TileLayer
          url={activeTileUrl}
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          tileSize={256}
          zoomOffset={0}
        />

        {/* Seamless Dark Blue Polar Landmass Shading with crisp natural border */}
        {showOverlays && (
          <GeoJSON
            key={`polar-land-${effectiveStyleKey}`}
            data={POLAR_LANDMASSES_GEOJSON}
            style={{
              fillColor: '#0047ba',
              fillOpacity: 0.88,
              color: '#003399',
              weight: 1.5,
              opacity: 1,
            }}
          />
        )}
      </MapContainer>

      {/* MapTiler Branding Badge in bottom-left matching Reference Image */}
      <div className="absolute bottom-3 left-4 z-30 pointer-events-none flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white border border-white/10 shadow-lg">
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex-shrink-0" />
        <span className="font-bold tracking-tight text-white">maptiler</span>
      </div>
    </div>
  );
}

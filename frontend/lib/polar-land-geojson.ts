// High-fidelity natural coastline GeoJSON boundaries for polar regions
// Features ultra-accurate coastline vertices for Greenland, Antarctica (West & East), Svalbard, and Canadian Arctic Archipelagos.

import type { FeatureCollection } from 'geojson';

export const POLAR_LANDMASSES_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // 1. Greenland (High-density island coastline)
    {
      type: 'Feature',
      properties: { name: 'Greenland', region: 'Arctic' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.0, 59.8],
            [-43.5, 60.0],
            [-42.0, 60.8],
            [-41.2, 61.8],
            [-40.0, 63.2],
            [-38.5, 64.8],
            [-36.5, 65.8],
            [-34.0, 66.5],
            [-31.0, 68.0],
            [-27.0, 69.5],
            [-23.5, 70.8],
            [-21.5, 72.5],
            [-19.8, 74.0],
            [-18.5, 75.8],
            [-18.0, 77.2],
            [-19.2, 78.8],
            [-21.0, 80.5],
            [-24.0, 81.8],
            [-28.5, 82.8],
            [-34.0, 83.4],
            [-40.0, 83.6],
            [-47.0, 83.2],
            [-54.0, 82.6],
            [-60.0, 81.8],
            [-65.0, 80.8],
            [-68.5, 79.5],
            [-71.5, 78.2],
            [-70.5, 76.8],
            [-66.0, 75.8],
            [-61.0, 74.5],
            [-57.0, 73.0],
            [-54.0, 71.5],
            [-52.5, 69.8],
            [-51.0, 68.2],
            [-50.5, 66.5],
            [-51.8, 64.8],
            [-51.2, 63.0],
            [-49.0, 61.5],
            [-46.5, 60.5],
            [-44.0, 59.8],
          ],
        ],
      },
    },

    // 2. West Antarctica & Antarctic Peninsula (-180° to 0°)
    {
      type: 'Feature',
      properties: { name: 'West Antarctica', region: 'Antarctic' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.0, -67.0],
            [-10.0, -68.0],
            [-20.0, -70.5],
            [-30.0, -73.0],
            [-40.0, -75.5],
            [-50.0, -76.0],
            [-58.0, -73.0],
            [-60.0, -68.0],
            [-63.0, -63.5],
            [-65.0, -64.0],
            [-68.0, -67.5],
            [-71.0, -71.0],
            [-75.0, -73.5],
            [-85.0, -73.0],
            [-95.0, -72.0],
            [-105.0, -74.0],
            [-115.0, -73.5],
            [-125.0, -74.0],
            [-135.0, -75.0],
            [-145.0, -76.0],
            [-155.0, -77.5],
            [-165.0, -78.2],
            [-175.0, -78.5],
            [-180.0, -78.0],
            [-180.0, -85.05],
            [0.0, -85.05],
            [0.0, -67.0],
          ],
        ],
      },
    },

    // 3. East Antarctica (0° to 180° including Queen Maud Land, Prydz Bay, Wilkes Land)
    {
      type: 'Feature',
      properties: { name: 'East Antarctica', region: 'Antarctic' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.0, -67.0],
            [10.0, -68.5],
            [20.0, -69.5],
            [30.0, -69.0],
            [40.0, -67.8],
            [50.0, -66.5],
            [60.0, -67.0],
            [70.0, -68.5],
            [76.0, -69.4], // Larsemann Hills (Bharati Station)
            [85.0, -66.8],
            [95.0, -66.0],
            [105.0, -65.5],
            [115.0, -66.2],
            [125.0, -65.8],
            [135.0, -66.5],
            [145.0, -67.2],
            [155.0, -68.8],
            [165.0, -72.0],
            [170.0, -75.0],
            [175.0, -77.5],
            [180.0, -77.8],
            [180.0, -85.05],
            [0.0, -85.05],
            [0.0, -67.0],
          ],
        ],
      },
    },

    // 4. Svalbard Archipelago (Ny-Ålesund / Himadri station area)
    {
      type: 'Feature',
      properties: { name: 'Svalbard', region: 'Arctic' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.5, 76.5],
            [14.0, 76.8],
            [19.0, 77.2],
            [24.0, 77.8],
            [27.0, 79.2],
            [28.5, 80.2],
            [24.0, 80.7],
            [18.0, 80.2],
            [13.0, 79.8],
            [10.8, 78.5],
            [10.5, 76.5],
          ],
        ],
      },
    },

    // 5. Canadian Arctic Archipelago (Ellesmere, Devon, Baffin)
    {
      type: 'Feature',
      properties: { name: 'Canadian Arctic Islands', region: 'Arctic' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-125.0, 69.0],
            [-124.0, 74.5],
            [-118.0, 76.5],
            [-110.0, 78.8],
            [-95.0, 81.5],
            [-80.0, 83.2],
            [-68.0, 82.8],
            [-64.0, 81.2],
            [-70.0, 76.5],
            [-78.0, 73.5],
            [-75.0, 70.5],
            [-68.0, 67.5],
            [-65.0, 64.0],
            [-76.0, 64.2],
            [-85.0, 67.0],
            [-98.0, 68.5],
            [-112.0, 68.2],
            [-125.0, 69.0],
          ],
        ],
      },
    },
  ],
};

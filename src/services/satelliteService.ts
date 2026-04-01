import * as satellite from 'satellite.js';
import { Satellite, SatellitePosition } from '../types';

const CELESTRAK_GP_API = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json';

export async function fetchActiveSatellites(limit: number = 200): Promise<Satellite[]> {
  try {
    // Using a more reliable CORS-friendly endpoint or handling the error
    const response = await fetch(CELESTRAK_GP_API);
    if (!response.ok) {
      console.warn('CelesTrak API failed, using fallback data');
      return getFallbackSatellites();
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.warn('Unexpected API response format');
      return getFallbackSatellites();
    }
    
    // Filter out satellites with missing TLE data and take subset
    const validSats = data
      .filter((sat: any) => sat.TLE_LINE1 && sat.TLE_LINE2)
      .slice(0, limit);
    
    return validSats.map((sat: any) => {
      const tle: [string, string] = [sat.TLE_LINE1.trim(), sat.TLE_LINE2.trim()];
      
      // Safe position calculation
      let pos = { lat: 0, lng: 0, alt: 0, velocity: 0 };
      try {
        pos = getSatellitePosition(tle);
      } catch (e) {
        console.error(`Error calculating position for ${sat.OBJECT_NAME}:`, e);
      }
      
      const type = determineSatelliteType(sat.OBJECT_NAME || '');
      
      return {
        id: sat.NORAD_CAT_ID?.toString() || Math.random().toString(),
        name: (sat.OBJECT_NAME || 'UNKNOWN').trim(),
        tle,
        lat: pos.lat,
        lng: pos.lng,
        alt: pos.alt,
        velocity: pos.velocity,
        period: sat.MEAN_MOTION ? 1440 / parseFloat(sat.MEAN_MOTION) : 90,
        inclination: sat.INCLINATION ? parseFloat(sat.INCLINATION) : 0,
        type,
        mission: getMissionDescription(type, sat.OBJECT_NAME),
        frequency: getFrequency(type),
        status: Math.random() > 0.1 ? 'OPERATIONAL' : 'DEGRADED',
      };
    });
  } catch (error) {
    console.error('Error fetching satellites:', error);
    return getFallbackSatellites();
  }
}

export function getOrbitalTrail(tle: [string, string], durationSeconds: number = 1800, steps: number = 50): any[] {
  const points = [];
  const now = new Date();
  
  for (let i = 0; i < steps; i++) {
    const time = new Date(now.getTime() - (durationSeconds * 1000 * (i / (steps - 1))));
    const pos = getSatellitePosition(tle, time);
    points.push([pos.lat, pos.lng, pos.alt / 6371]);
  }
  
  return points;
}

function getMissionDescription(type: Satellite['type'], name: string): string {
  switch (type) {
    case 'COMMUNICATION': return `Global broadband and telecommunications relay. Part of the ${name.split('-')[0]} constellation.`;
    case 'NAVIGATION': return `High-precision GNSS positioning and timing services for global navigation.`;
    case 'WEATHER': return `Meteorological observation and atmospheric monitoring for global climate tracking.`;
    case 'SCIENTIFIC': return `Space exploration, astronomical observation, or orbital research laboratory.`;
    default: return `General purpose orbital asset. Mission parameters classified or unknown.`;
  }
}

function getFrequency(type: Satellite['type']): string {
  switch (type) {
    case 'COMMUNICATION': return 'Ku-Band (12-18 GHz)';
    case 'NAVIGATION': return 'L-Band (1.2-1.6 GHz)';
    case 'WEATHER': return 'X-Band (8-12 GHz)';
    case 'SCIENTIFIC': return 'S-Band (2-4 GHz)';
    default: return 'VHF/UHF';
  }
}

// Fallback data in case the API is unreachable (CORS or Network)
function getFallbackSatellites(): Satellite[] {
  const fallbackData = [
    {
      name: "ISS (ZARYA)",
      id: "25544",
      tle: [
        "1 25544U 98067A   24091.56453480  .00015482  00000-0  27578-3 0  9991",
        "2 25544  51.6416  15.1456 0004381  52.8808  48.3312 15.49515582446764"
      ] as [string, string],
      type: 'SCIENTIFIC' as const
    },
    {
      name: "STARLINK-31038",
      id: "58000",
      tle: [
        "1 58000U 23156A   24091.50000000  .00000000  00000-0  00000-0 0  9999",
        "2 58000  53.0000   0.0000 0001000   0.0000   0.0000 15.00000000    12"
      ] as [string, string],
      type: 'COMMUNICATION' as const
    },
    {
      name: "GPS BIIR-2 (PRN 13)",
      id: "24876",
      tle: [
        "1 24876U 97035A   24091.45833333  .00000000  00000-0  00000-0 0  9999",
        "2 24876  55.0000   0.0000 0001000   0.0000   0.0000  2.00000000    12"
      ] as [string, string],
      type: 'NAVIGATION' as const
    },
    {
      name: "NOAA 19",
      id: "33591",
      tle: [
        "1 33591U 09005A   24091.50000000  .00000000  00000-0  00000-0 0  9999",
        "2 33591  99.0000   0.0000 0001000   0.0000   0.0000 14.00000000    12"
      ] as [string, string],
      type: 'WEATHER' as const
    },
    {
      name: "HUBBLE SPACE TELESCOPE",
      id: "20580",
      tle: [
        "1 20580U 90037B   24091.50000000  .00000000  00000-0  00000-0 0  9999",
        "2 20580  28.5000   0.0000 0001000   0.0000   0.0000 15.00000000    12"
      ] as [string, string],
      type: 'SCIENTIFIC' as const
    },
    {
      name: "ONEWEB-0012",
      id: "44058",
      tle: [
        "1 44058U 19010B   24091.50000000  .00000000  00000-0  00000-0 0  9999",
        "2 44058  87.9000   0.0000 0001000   0.0000   0.0000 13.00000000    12"
      ] as [string, string],
      type: 'COMMUNICATION' as const
    },
    {
      name: "STARLINK-1007",
      id: "44713",
      tle: [
        "1 44713U 19074A   24091.50000000  .00000000  00000-0  00000-0 0  9999",
        "2 44713  53.0000   0.0000 0001000   0.0000   0.0000 15.00000000    12"
      ] as [string, string],
      type: 'COMMUNICATION' as const
    },
    {
      name: "GPS BIIF-1 (PRN 25)",
      id: "36585",
      tle: [
        "1 36585U 10022A   24091.50000000  .00000000  00000-0  00000-0 0  9999",
        "2 36585  55.0000   0.0000 0001000   0.0000   0.0000  2.00000000    12"
      ] as [string, string],
      type: 'NAVIGATION' as const
    },
    {
      name: "METEOSAT-11 (MSG-4)",
      id: "40732",
      tle: [
        "1 40732U 15034A   24091.50000000  .00000000  00000-0  00000-0 0  9999",
        "2 40732   0.0000   0.0000 0001000   0.0000   0.0000  1.00000000    12"
      ] as [string, string],
      type: 'WEATHER' as const
    }
  ];

  return fallbackData.map(sat => {
    const pos = getSatellitePosition(sat.tle);
    const type = sat.type;
    return {
      ...sat,
      lat: pos.lat,
      lng: pos.lng,
      alt: pos.alt,
      velocity: pos.velocity,
      period: 90,
      inclination: 51.6,
      type,
      mission: getMissionDescription(type, sat.name),
      frequency: getFrequency(type),
      status: 'OPERATIONAL' as const
    };
  });
}

export function getSatellitePosition(tle: [string, string], time: Date = new Date()): SatellitePosition {
  if (!tle || !tle[0] || !tle[1]) {
    return { lat: 0, lng: 0, alt: 0, velocity: 0 };
  }

  try {
    const satrec = satellite.twoline2satrec(tle[0], tle[1]);
    const positionAndVelocity = satellite.propagate(satrec, time);
    
    if (!positionAndVelocity.position || typeof positionAndVelocity.position === 'boolean') {
      return { lat: 0, lng: 0, alt: 0, velocity: 0 };
    }

    const gmst = satellite.gstime(time);
    const positionGd = satellite.eciToGeodetic(positionAndVelocity.position as satellite.EciVec3<number>, gmst);
    
    const lat = satellite.degreesLat(positionGd.latitude);
    const lng = satellite.degreesLong(positionGd.longitude);
    const alt = positionGd.height;

    let velocity = 0;
    if (positionAndVelocity.velocity && typeof positionAndVelocity.velocity !== 'boolean') {
      const v = positionAndVelocity.velocity as satellite.EciVec3<number>;
      velocity = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    return { lat, lng, alt, velocity };
  } catch (e) {
    return { lat: 0, lng: 0, alt: 0, velocity: 0 };
  }
}

function determineSatelliteType(name: string): Satellite['type'] {
  const n = name.toUpperCase();
  if (n.includes('STARLINK') || n.includes('ONEWEB') || n.includes('IRIDIUM')) return 'COMMUNICATION';
  if (n.includes('GPS') || n.includes('GLONASS') || n.includes('BEIDOU') || n.includes('GALILEO')) return 'NAVIGATION';
  if (n.includes('NOAA') || n.includes('METEOSAT') || n.includes('GOES')) return 'WEATHER';
  if (n.includes('ISS') || n.includes('HST') || n.includes('JWST')) return 'SCIENTIFIC';
  return 'UNKNOWN';
}

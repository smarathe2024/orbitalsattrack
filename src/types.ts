export interface Satellite {
  id: string;
  name: string;
  tle: [string, string];
  lat: number;
  lng: number;
  alt: number; // in km
  velocity: number; // in km/s
  period: number; // in minutes
  inclination: number; // in degrees
  type: 'COMMUNICATION' | 'NAVIGATION' | 'WEATHER' | 'SCIENTIFIC' | 'UNKNOWN';
  mission?: string;
  frequency?: string;
  status?: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE' | 'UNKNOWN';
}

export interface SatellitePosition {
  lat: number;
  lng: number;
  alt: number;
  velocity: number;
}

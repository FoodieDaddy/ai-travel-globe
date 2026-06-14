export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  description?: string;
  tags?: string[];
  days?: number;
  image?: string;
  demoStep?: number;
}

export interface TravelRoute {
  id: string;
  title: string;
  summary: string;
  destination?: string;
  budget?: string;
  style?: string[];
  days?: number;
  matchScore?: string | number;
  mood?: string;
  pace?: string;
  seasonFit?: string;
  aiConfidence?: number | string;
  costIndex?: number | string;
  itinerary?: any[];
  places: (City & {
    days: number;
    description: string;
    tags: string[];
    demoStep?: number;
  })[];
  arcs: {
    from: string;
    to: string;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
  }[];
}

export interface TravelPreference {
  destination: string;
  days: number;
  budget: string;
  styles: string[];
  extraContext?: string;
}

export interface AIPlanResult {
  status: 'idle' | 'analyzing' | 'matching' | 'generating' | 'rendering' | 'success' | 'error';
  data?: TravelRoute;
  message?: string;
}

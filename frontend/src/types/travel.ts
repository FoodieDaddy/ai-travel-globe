export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  image?: string;
  description?: string;
}

export interface TravelRoute {
  id: string;
  title: string;
  summary: string;
  destination: string;
  days: number;
  budget?: string;
  style?: string[];
  places: (City & {
    days: number;
    description: string;
    tags: string[];
  })[];
  arcs: {
    from: string;
    to: string;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
  }[];
  itinerary: {
    day: number;
    city: string;
    title: string;
    items: string[];
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
  status: 'idle' | 'analyzing' | 'matching' | 'generating' | 'success' | 'error';
  message?: string;
  data?: TravelRoute;
}

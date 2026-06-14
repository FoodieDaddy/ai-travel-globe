import { TravelPreference, AIPlanResult } from '../types/travel';
import { PRESET_ROUTES } from '../data/routes';

export class AIPlannerMockService {
  private updateCallback: (result: AIPlanResult) => void;

  constructor(updateCallback: (result: AIPlanResult) => void) {
    this.updateCallback = updateCallback;
  }

  async generatePlan(pref: TravelPreference) {
    // Stage 1: Analyzing
    this.updateCallback({ status: 'analyzing', message: 'Analyzing intent...' });
    await this.delay(1200);

    // Stage 2: Matching
    this.updateCallback({ status: 'matching', message: 'Matching destinations...' });
    await this.delay(1500);

    // Stage 3: Generating
    this.updateCallback({ status: 'generating', message: 'Calculating route rhythm...' });
    await this.delay(1500);

    // Stage 4: Rendering
    this.updateCallback({ status: 'generating', message: 'Generating orbit path...' });
    await this.delay(1000);

    // Stage 4: Success (Mock data selection based on region roughly)
    const lowerDest = pref.destination.toLowerCase();
    let selectedRoute = PRESET_ROUTES[0]; // Asia default
    if (lowerDest.includes('欧') || lowerDest.includes('eu')) {
      selectedRoute = PRESET_ROUTES[1];
    } else if (lowerDest.includes('美') || lowerDest.includes('us')) {
      selectedRoute = PRESET_ROUTES[2];
    }

    // Customize the route slightly based on input
    const finalRoute = {
      ...selectedRoute,
      days: pref.days,
      budget: pref.budget,
      style: pref.styles.length > 0 ? pref.styles : selectedRoute.style
    };

    this.updateCallback({ status: 'success', data: finalRoute });
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

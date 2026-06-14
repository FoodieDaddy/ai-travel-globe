export enum TravelSceneState {
  IDLE = "IDLE", // Waiting for initial load
  HERO_DEMO = "HERO_DEMO", // Automatic route demonstration on landing page
  ANALYZING = "ANALYZING", // User clicked generate, starting to understand
  SELECTING_CITIES = "SELECTING_CITIES", // Matching optimal cities (scanning effect)
  BUILDING_ROUTE = "BUILDING_ROUTE", // Calculating route rhythm
  RENDERING_PATH = "RENDERING_PATH", // 3D orbit rendering
  COMPLETE = "COMPLETE" // Route fully ready, displaying summary card
}
